import express, { urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Message from "./model/messageModel.js";
import { connectDB } from "./db/connect.js";

// Routes
import createUserRoute from "./routes/createUser.route.js";
import getUsernameRoute from "./routes/getusername.route.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the chat API" });
});
app.use("/postuser", createUserRoute);
app.use("/search", getUsernameRoute);

// Messages API
app.post("/messages", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

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



// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    io.emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () =>
  console.log("Server running on http://localhost:3001")
);
