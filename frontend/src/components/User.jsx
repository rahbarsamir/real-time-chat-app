import React, { useState } from 'react'
import "../App.css";
import { useChat } from '../context/ChatContext';
const User = ({username,changeBgColor}) => {
    const [isActive, setIsActive] = useState(true)
    const { setChatUser, chatUser,setCurrentUser } = useChat();
    const [bgcolor,setbgcolor] = useState(getRandomLightColor())
     function getRandomLightColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 20);
    const l = 75 + Math.floor(Math.random() * 15);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return (
    <div
      onClick={() => (setChatUser(username), changeBgColor(true))}
      className="flex cursor-pointer hover:scale-101 mb-5 justify-between items-center gap-2"
    >
      <div className="flex items-center gap-3">
        <div
              style={{backgroundColor:bgcolor}}
              className="relative w-12 h-12 rounded-full bg-blue-00 flex justify-center items-center">
                <h1 className="font-bold text-2xl uppercase self-center">{username.charAt(0)}</h1>
                {isActive && <div className="absolute right-0 bottom-2 bg-green-400 w-3 h-3 border-1 border-white rounded-full"></div>}
              </div>
              <div>
                <h1 className="font-sans font-medium capitalize">{username}</h1>
                <h1 className="font-sans font-small text-sm text-gray-800">last message</h1>
                
              </div>
            </div>
            <div className="opacity-60 hover:opacity-100 cursor-pointer transition-all duration-300 p-2 text-[12px]">
            11:15 AM
            </div>
          </div>
  )
}

export default User