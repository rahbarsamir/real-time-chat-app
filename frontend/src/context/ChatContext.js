import { createContext, useContext, useState } from "react";


const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  return (
    <ChatContext.Provider
      value={{ currentUser, setCurrentUser, chatUser, setChatUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = () => useContext(ChatContext);
