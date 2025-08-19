import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";
import Message from "./models/Message.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// 🔹 Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chatApp");

// 🔹 Search Users API
app.get("/search/:username", async (req, res) => {
  const users = await User.find({ username: new RegExp(req.params.username, "i") });
  res.json(users);
});

// 🔹 Fetch Messages between two users
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

// 🔹 Socket.IO Chat Logic
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
