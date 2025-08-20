import { IoBookSharp } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import React, { useState } from "react";

const MessageDisplay = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState(null);

  // Dummy existing users (simulate database check)
  const existingUsers = ["sam", "anas", "john"];

  const sendMessage = () => {
    if (!text.trim()) return;

    if (!username) {
      const entered = text.trim().toLowerCase();

      // First push "me" message
      setMessages((prev) => [
        ...prev,
        {
          sender: "me",
          message: entered,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Then push "other" system response
      const systemMsg = existingUsers.includes(entered)
        ? "User already exists"
        : "New user created";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "other", message: systemMsg },
        ]);
      }, 300);

      setUsername(entered);
      setText("");
    } else {
      // Normal chat after username is set
      setMessages((prev) => [
        ...prev,
        {
          sender: "me",
          message: text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setText("");
    }
  };

  return (
    <div className="h-full ml-[15%] flex flex-col w-[70%] bg-transparent">
      <div className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold uppercase text-white">
              {username ? username.charAt(0) : "?"}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span>{username || "Enter Username"}</span>
              <IoBookSharp className="text-xl text-gray-500" />
            </h3>
            <h5 className="text-green-500 text-sm font-medium">
              {username ? `${username} is active` : "Waiting for username..."}
            </h5>
          </div>

          <div className="flex items-center gap-3 justify-end ml-auto text-gray-600">
            <MdOutlineVideoCall className="text-2xl hover:text-blue-600 transition" />
            <IoCallOutline className="text-2xl hover:text-green-600 transition" />
            <HiOutlineDotsVertical className="text-2xl hover:text-gray-800 transition" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center text-xs text-gray-500">Today</div>

            {/* Show messages */}
            {messages.map((m, i) =>
              m.sender === "me" ? (
                <div key={i} className="flex flex-col items-end gap-1">
                  <div className="inline-block bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-none shadow">
                    <p className="text-sm">{m.message}</p>
                  </div>
                  {m.time && (
                    <div className="text-xs text-gray-400">{m.time}</div>
                  )}
                </div>
              ) : (
                <div key={i} className="flex flex-col items-start gap-1">
                  <div className="inline-block bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                    <p className="text-sm">{m.message}</p>
                  </div>
                </div>
              )
            )}

            {/* Show "Enter your username" until it's set */}
            {!username && messages.length === 0 && (
              <div className="inline-block bg-white text-gray-800 px-4 py-3 rounded-2xl border border-gray-200">
                <p className="text-sm">Enter your username</p>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-3">
          <input
            onChange={(e) => setText(e.target.value)}
            value={text}
            type="text"
            placeholder={username ? "Type a message..." : "Enter username..."}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
