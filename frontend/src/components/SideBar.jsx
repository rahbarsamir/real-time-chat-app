import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import User from "./User";
import { useChat } from "../context/ChatContext";
import { useRef } from "react";
import "../App.css";
import axios from "axios";
const SERVER_IP = '10.1.4.21';
const SideBar = () => {
  const [show, setShow] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isSearchFocus, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();
  const { currentUser } = useChat();
  const [otherUser, setotherUser] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  useEffect(() => {
    if (currentUser !== null) {
      setShow(true);
      console.log(currentUser);
      axios
        .get(`http://${SERVER_IP}:3001/getFriendlist?currentUser=${currentUser}`)
        .then((res) => {
          console.log(res.data);
          setotherUser(res.data);
        })
        .catch((error) => {
          console.error("Error fetching friend list:", error);
        });
    }
  }, [currentUser]);

  const searchHandle = async (e) => {
    setSearchTerm(e.target.value);
    console.log(e.target.value);
    if (e.target.value.trim() === "") {
      // setIsSearchFocused(false);
      setSearchUsers([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://${SERVER_IP}:3001/search/${e.target.value}`
      );
      // console.log(res.data);
      setSearchUsers(res.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div
      // className="bg-[#FFFFFF]  overflow-hidden w-[29%] a h-full rounded-3xl  p-5"
      className={`bg-[#FFFFFF] relative overflow-hidden w-[29%] a h-full rounded-3xl  p-5 transition-transform transition-opacity duration-1200 ease-in-out
${show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
    >
      {/* userData */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-300 flex justify-center items-center">
            <h1 className="font-bold text-2xl uppercase self-center">
              {currentUser?.charAt(0)}
            </h1>
          </div>
          <div>
            <h1 className="font-sans font-medium capitalize">{currentUser}</h1>
          </div>
        </div>
        <button className="opacity-60 hover:opacity-100  cursor-pointer transition-all duration-300 p-1 rounded-full bg-blue-200">
          <div className="relative">
            <input
              value={searchTerm}
              onChange={searchHandle}
              ref={searchRef}
              type="text"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search Username"
              className="bg-white rounded-full px-3 focus:py-1 z-5 outline-none w-0  transition-all duration-100 focus:w-40"
            />
            <div
              onClick={() => searchRef.current.focus()}
              className={`absolute  z-1 top-[50%] left-[50%] transform -translate-x-1/2  -translate-y-1/2 text-gray-500`}
            >
              {!isSearchFocus && <FiSearch />}
            </div>
          </div>
        </button>
      </div>
      <div>
        <div className="relative z-10 bg-white border border-gray-200 rounded-md shadow-md mt-2 w-full">
          {searchUsers.map((user, index) => (
            <User
              onClick={() => console.log(user.username)}
              key={index}
              username={user.username}
            />
          ))}
        </div>
      </div>

      {/* filterBtn */}

      <div className="w-full flex justify-center items-center mt-10 ">
        <div className="w-[90%] justify-evenly p-2 flex  bg-blue-100 rounded-full">
          <button
            onClick={() => setIsAllSelected(true)}
            className={`rounded-2xl  px-10 py-1 ${
              isAllSelected ? "bg-white b" : "hover:text-gray-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setIsAllSelected(false)}
            className={`rounded-2xl shadow-2xl px-10 py-1 ${
              !isAllSelected ? "bg-white b" : "hover:text-gray-400"
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* usersFiled */}

      <div className="overflow-y-scroll mt-10 h-[75%]">
        {otherUser.map((user, index) => (
          <User key={index} username={user._id} />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
