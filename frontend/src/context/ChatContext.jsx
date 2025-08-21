import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [isnewMsg,setNewMsg]=useState(false)

  return (
    <ChatContext.Provider
      value={{ currentUser, setCurrentUser, chatUser, setChatUser,isnewMsg}}
    >
      {children}
    </ChatContext.Provider>
  );
};
const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
