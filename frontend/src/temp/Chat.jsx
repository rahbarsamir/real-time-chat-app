import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001");

function Chat({ currentUser, chatUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🔹 Load chat history
  useEffect(() => {
    axios.get(`http://localhost:3001/messages/${currentUser}/${chatUser}`)
      .then(res => setMessages(res.data));
  }, [chatUser, currentUser]);

  // 🔹 Listen for new messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === currentUser && msg.receiver === chatUser) ||
        (msg.sender === chatUser && msg.receiver === currentUser)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [chatUser, currentUser]);

  // 🔹 Send message
  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("sendMessage", { sender: currentUser, receiver: chatUser, message: text });
      setText("");
    }
  };

  return (
    <div className="chat-box">
      <h3>Chat with {chatUser}</h3>
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i} className={m.sender === currentUser ? "sent" : "received"}>
            <b>{m.sender}:</b> {m.message}
          </p>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
