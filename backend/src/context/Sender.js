import { createContext, useContext, useState } from "react";

// Create context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // logged-in sender
  const [chatUser, setChatUser] = useState(null);       // receiver

  return (
    <ChatContext.Provider
      value={{ currentUser, setCurrentUser, chatUser, setChatUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easy access
export const useChat = () => useContext(ChatContext);
