import { IoBookSharp } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import React, { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import "../App.css";
import io from "socket.io-client";
import axios from "axios";
import { useChat } from "../context/ChatContext";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
const SERVER_IP='10.1.4.21'
const socket = io(`http://${SERVER_IP}:3001`);

const FirstComp = () => {
  const [firstShow,setFirstShow]=useState(false)
  const [show, setShow] = useState(false);
  const messageContainer = useRef(null);
  const BotchatRef  = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { currentUser, setCurrentUser, chatUser, setChatUser,isnewMsg,setNewMsg } = useChat();
  const [visitorId, setVisitorId] = useState(null);

  useEffect(()=>{
    setTimeout(() => {
      setFirstShow(true);

    }, 1000);
  },[])

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setVisitorId(result.visitorId);
    };
    loadFingerprint();
  }, []);
  useEffect(() => {
    if (currentUser !== null) {
      setShow(true);
    }
  }, [currentUser]);
  useEffect(() => {
    console.log("chatUser changed:", chatUser);
  }, [chatUser]);
  const [Botmessages, setBotMessages] = useState([
    {
      sender: "other",
      message: "Alright genius, drop your username here 👇",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [Bottext, setBotText] = useState("");
  const [username, setUsername] = useState(null);

    useEffect(() => {
    axios
      .get(`http://${SERVER_IP}:3001/messages/${currentUser}/${chatUser}`)
      .then((res) => setMessages(res.data));
  }, [chatUser, currentUser]);

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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!Bottext.trim()) return;
    if (!username) {
      const entered = Bottext.trim();

      setBotMessages((prev) => [
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
      if (Bottext.split(" ").length > 1) {
        setBotMessages((prev) => [
          ...prev,
          {
            sender: "other",
            message: "bro username matlab single word....... dont overthink",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setBotText("");
        return;
      }
      try {
        const res = await axios.post(`http://${SERVER_IP}:3001/postuser`, {
          username: entered,
          visitorId, //////////////////////////////////////////// change this
        });
        // Login
        if (res.status == 201) {
          console.log("User created successfully:", res.data.username);
          setCurrentUser(res.data.username); //todo
        }
        console.log(res);
        setUsername(entered);
      } catch (error) {
        console.error("Error creating user:", error.response.data.error);
        setBotMessages((prev) => [
          ...prev,
          {
            sender: "other",
            message: error.response.data.error,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }

      setBotText("");
    } else {
      setBotMessages((prev) => [
        ...prev,
        {
          sender: "me",
          message: Bottext,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setBotText("");
    }
  };
    useEffect(() => {
      if(messageContainer.current){
        messageContainer.current.scrollTop = messageContainer?.current?.scrollHeight;

      }
     if(BotchatRef.current){
       BotchatRef.current.scrollTop = BotchatRef.current.scrollHeight;
     }
    }, [messages,Botmessages]);

  const sendMessageSender = (e) => {
    e.preventDefault();
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
    <div
      className={`h-full b  flex flex-col w-[70%] rounded-2xl bg-transparent transition-transform transition-opacity duration-700 ease-out
${show ? "translate-x-0 " : "translate-x-[-20%] "}`}
    >
      <div className="h-full  bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold uppercase text-white">T</span>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span>{chatUser?chatUser:"Talksy"}</span>
              <IoBookSharp className="text-xl text-gray-500" />
            </h3>
            <h5 className="text-green-500 text-sm font-medium">
              {chatUser?chatUser:"Talksy"} is active
            </h5>
          </div>

          <div className="flex items-center gap-3 justify-end ml-auto text-gray-600">
            <MdOutlineVideoCall className="text-2xl hover:text-blue-600 transition" />
            <IoCallOutline className="text-2xl hover:text-green-600 transition" />
            <HiOutlineDotsVertical className="text-2xl hover:text-gray-800 transition" />
          </div>
        </div>

        {/* Messages */}
        {!show && !chatUser && (
          <div
          ref={BotchatRef}
           className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center text-xs text-gray-500">Today</div>

              {/* Show messages */}
              {Botmessages.map((m, i) =>
                m.sender === "me" ? (
                  <div
                  
                   key={i} className="flex  items-end gap-3 justify-end ">
                    <div className="text-xs text-gray-400 mr-3">
                      {m.time && (
                        <div className="text-xs text-gray-400">{m.time}</div>
                      )}
                    </div>
                    <div className="inline-block bg-blue-100 b max-w-[70%] text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                      <p className="text-sm ">{m.message}</p>
                    </div>
                    <div className="h-11 w-11 bg-blue-600 b rounded-full flex items-center justify-center ">
                      <h3 className="font-semibold text-sm uppercase text-white">
                        {m.sender.charAt(0)}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div key={i} className={`flex items-start gap-3 transition-transform transition-opacity duration-700 ease-out
${firstShow ? "translate-x-0 opacity-100" : "translate-x-[-20%] opacity-0"}`}>
                    <div className="h-11 w-11 bg-green-100 b rounded-full flex items-center justify-center ">
                      <h3 className="font-semibold uppercase text-sm">T</h3>
                    </div>
                    <div className="max-w-[60%]">
                      <div className="inline-block b  bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                        <p className="text-sm">{m.message}</p>
                      </div>
                      <div className="text-xs flex gap-2 text-gray-400 mt-1">
                        {m.time && (
                          <div className="text-xs text-gray-400">{m.time}</div>
                        )}
                        {/* <div>{m.sender}</div> */}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {show && chatUser == null && (
          <div className="flex-1 overflow-y-auto p-6 justify-center items-center bg-gray-50">
            <div className="flex justify-center items-center h-full">
              <div className="bg-gradient-to-br from-indigo-200 via-purple-900 to-pink-300 rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto animate-fade-in">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-5xl font-extrabold text-white drop-shadow-lg">
                    🎉
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
                  Welcome,{" "}
                  <span className="text-yellow-300">{currentUser}</span>!
                </h1>
                <p className="text-lg text-white/90 mb-4 text-center">
                  You have successfully joined{" "}
                  <span className="font-semibold">Talksy</span>.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <IoBookSharp className="text-2xl text-white" />
                  <span className="text-white font-medium">
                    Start chatting now 🚀
                  </span>
                </div>
              </div>
              {/* <h1 >wellcome {currentUser}</h1> */}
            </div>
          </div>
        )}
        {chatUser && (
          <div
            ref={messageContainer}
            className="flex-1 overflow-y-auto p-6 bg-gray-50"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center text-xs text-gray-500">Today</div>

              {/* message from other */}
              {messages.map((m, i) =>
                m.sender !== currentUser ? (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-11 w-11 bg-green-100 b rounded-full flex items-center justify-center ">
                      <h3 className="font-semibold uppercase text-sm">
                        {m.sender.charAt(0)}
                      </h3>
                    </div>
                    <div>
                      <div className="inline-block b bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow">
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
                ) : (
                  <div className="flex items-end gap-3 justify-end">
                    <div className="text-xs text-gray-400 mr-3">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="inline-block bg-blue-100 b text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                      <p className="text-sm">{m.message}</p>
                    </div>
                    <div className="h-11 w-11 bg-blue-600 b rounded-full flex items-center justify-center ">
                      <h3 className="font-semibold text-sm uppercase text-white">
                        {m.sender.charAt(0)}
                      </h3>
                    </div>
                  </div>
                )
              )}

              {/* message from me */}
            </div>
          </div>
        )}

        {/* Input */}
        {!show && (
          <form className="p-3 border-b border-gray-200 bg-white flex items-center gap-3 ">
            <input
              onChange={(e) => setBotText(e.target.value)}
              value={Bottext}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 "
            />
            <button
              type="submit"
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 "
            >
              <IoMdSend className="text-lg" />
            </button>
          </form>
        )}
        {chatUser && (
          <form className="p-3 border-b border-gray-200 bg-white flex items-center gap-3 ">
            <input
              required
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 "
            />
            <button
              type="submit"
              onClick={sendMessageSender}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 "
            >
              <IoMdSend className="text-lg" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FirstComp;
