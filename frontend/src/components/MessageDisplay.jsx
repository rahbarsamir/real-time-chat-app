import { IoBookSharp } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "../App.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001");

const MessageDisplay = ({ currentUser, chatUser }) => {
  console.log(currentUser, chatUser);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🔹 Load chat history
  useEffect(() => {
    axios
      .get(`http://localhost:3001/messages/${currentUser}/${chatUser}`)
      .then((res) => setMessages(res.data));
  }, [chatUser, currentUser]);

  // 🔹 Listen for new messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === currentUser && msg.receiver === chatUser) ||
        (msg.sender === chatUser && msg.receiver === currentUser)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [chatUser, currentUser]);

  // 🔹 Send message
  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("sendMessage", {
        sender: currentUser,
        receiver: chatUser,
        message: text,
      });
      setText("");
    }
  };

  return (
    <div className="h-full  flex flex-col w-[70%] bg-transparent">
      {/* Card wrapper with stronger shadow + rounded corners */}
      <div className="h-full bg-white rounded-2xl  border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center ">
            <span className="text-2xl font-bold uppercase text-white">{chatUser.charAt(0)}</span>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span>{chatUser}</span>
              <IoBookSharp className="text-xl text-gray-500" />
            </h3>
            <h5 className="text-green-500 text-sm font-medium">
              {chatUser} is active
            </h5>
          </div>

          <div className="flex items-center gap-3 justify-end ml-auto text-gray-600">
            <MdOutlineVideoCall className="text-2xl hover:text-blue-600 transition" />
            <IoCallOutline className="text-2xl hover:text-green-600 transition" />
            <HiOutlineDotsVertical className="text-2xl hover:text-gray-800 transition" />
          </div>
        </div>

        {/* Messages area with inner card feel */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center text-xs text-gray-500">Today</div>

            {/* message from other */}
            {messages.map((m, i) =>
              m.sender !== currentUser ? (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-11 w-11 bg-white rounded-full flex items-center justify-center ">
                    <h3 className="font-semibold uppercase text-sm">
                      {m.sender.charAt(0)}
                    </h3>
                  </div>
                  <div>
                    <div className="inline-block bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                      <p className="text-sm">{m.message}</p>
                    </div>
                    <div className="text-xs flex gap-2 text-gray-400 mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {/* <div>{m.sender}</div> */}
                    </div>
                  </div>
                </div>
              ) :(<div className="flex items-end gap-3 justify-end">
              <div className="text-xs text-gray-400 mr-3">{new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</div>
              <div className="inline-block bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-none ">
                <p className="text-sm">{m.message}</p>
              </div>
              <div className="h-11 w-11 bg-blue-600 rounded-full flex items-center justify-center ">
                <h3 className="font-semibold text-sm uppercase text-white">{m.sender.charAt(0)}</h3>
              </div>
            </div>)
            )}

            {/* message from me */}
           
          </div>
        </div>

        {/* Composer - elevated with shadow */}
        <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-3 ">
          <input
		  onChange={e => setText(e.target.value)}
		  value={text}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
          />
          <button
		  onClick={sendMessage}
		   className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
