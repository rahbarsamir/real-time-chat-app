import express from 'express'
const app = express();
import { connectDB } from "./db/connect.js";
import { Server } from "socket.io";
import http from 'http'
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

connectDB();


server.listen( PORT , () => {
 console.log(`Listening on port : ${PORT}`);
});


``


//socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
   console.log("Connected.....");

   socket.on('message',(msg) => {
    socket.broadcast.emit('message', msg)
   })
})