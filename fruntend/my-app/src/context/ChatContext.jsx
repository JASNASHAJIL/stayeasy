import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  return (
    <ChatContext.Provider
      value={{
        rooms,
        setRooms,
        activeRoom,
        setActiveRoom,
        messages,
        setMessages,
        typingUsers,
        setTypingUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
