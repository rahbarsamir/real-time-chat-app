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




// create User or login
app.post("/postuser", async (req, res) => {
  const { username, visitorId } = req.body;
  if (!username || !visitorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
try {
    const isExisting = await User.findOne({ username, visitorId });

  if (isExisting) {
    return res.status(201).json(isExisting );
  }
  const isnotAuth=await User.findOne({ username });
  if (isnotAuth) {
    return res.status(401).json({ error: "Bro, why you sneakin’ into someone else’s ID? 😂 Just log in with your own... it’s not that hard." });
  }
  const isVisitorIdExisting = await User.findOne({ visitorId });
  if (isVisitorIdExisting) {
    return res.status(409).json({ error: "Bro, your system’s already registered… don’t act brand new. Just use your username and keep it moving." });
  }

  const newUser = await User.create({ username, visitorId });
  res.status(201).json(newUser);
} catch (error) {
  console.error("Error creating user:", error);
  res.status(500).json({ error: "Failed to create user" });
}
})





app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/search/:username", async (req, res) => {

  try {
    const users = await User.find({ username: new RegExp(req.params.username, "i") });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to search users" });
  }
  
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

// friendlist

app.get('/getFriendlist',async(req,res)=>{
  const { currentUser } = req.query;

   
  if (!currentUser) {
    return res.status(400).json({ error: "Current user is required" });
  }
  try {
      const chatList = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUser }, { receiver: currentUser }]
      }
    },
    {
      $project: {
        user: {
          $cond: [
            { $eq: ["$sender",currentUser] },
            "$receiver",                 
            "$sender"                   
          ]
        }
      }
    },
    { $group: { _id: "$user" } }
  ]);
    res.status(200).json(chatList);
  } catch (error) {
    console.error("Error fetching friend list:", error);
    res.status(500).json({ error: "Failed to fetch friend list" });
  }

})




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

server.listen(3001,"0.0.0.0", () => console.log("Server running on http://localhost:3001"));