import express,{urlencoded} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import User from "./model/userModel.js";
import Message from "./model/MessageModel.js";
import { connectDB } from "./db/connect.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the chat API" });
});
app.post("/postuser", (req, res) => {
  const { username } = req.body;
  const newUser = new User({ username });
  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json({ error: err.message }));
})

app.get("/search/:username", async (req, res) => {
  const users = await User.find({ username: new RegExp(req.params.username, "i") });
  console.log(users)
  res.json(users);
});

app.post("/messages", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    console.log(receiver)
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    // (Optional) also broadcast via socket
    io.emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.get("/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;
  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender }
    ]
  }).sort({ timestamp: 1 });
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    // Send to specific receiver
    io.emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => console.log("Server running on http://localhost:3001"));