import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import User from "./User";
import { useRef } from "react";
import "../App.css";
const SideBar = () => {

  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isSearchFocus, setIsSerachFocused] = useState(false);
  const searchRef = useRef();
  return (
    <div className="bg-[#FFFFFF] overflow-hidden w-[29%] a h-full rounded-3xl  p-5">
      {/* userData */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-300 flex justify-center items-center">
            <h1 className="font-bold text-2xl uppercase self-center">R</h1>
          </div>
          <div>
            <h1 className="font-sans font-medium capitalize">Rahbar samir</h1>
          </div>
        </div>
        <button
          className="opacity-60 hover:opacity-100  cursor-pointer transition-all duration-300 p-1 rounded-full bg-blue-200"
        >
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              onFocus={()=>setIsSerachFocused(true)}
              onBlur={()=>setIsSerachFocused(false)}
              placeholder="Search Username"
              className="bg-white rounded-full px-3 focus:py-1 z-5 outline-none w-0  transition-all duration-100 focus:w-40"
            />
            <div onClick={() => searchRef.current.focus()} className={`absolute  z-1 top-[50%] left-[50%] transform -translate-x-1/2  -translate-y-1/2 text-gray-500`}>
              {!isSearchFocus && (<FiSearch />)}
            </div>
          </div>
    
        </button>
      </div>

      {/* filterBtn */}

      <div className="w-full flex justify-center items-center mt-10 ">
        <div className="w-[90%] justify-evenly p-2 flex  bg-blue-100 rounded-full">
          <button
          onClick={()=>setIsAllSelected(true)}
            className={`rounded-2xl  px-10 py-1 ${
              isAllSelected ? "bg-white b" : "hover:text-gray-400"
            }`}
          >
            All
          </button>
          <button
          onClick={()=>setIsAllSelected(false)}
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
        <User username={"sam"}  />
        <User username={"anas"} />
      </div>
    </div>
  );
};

export default SideBar;
