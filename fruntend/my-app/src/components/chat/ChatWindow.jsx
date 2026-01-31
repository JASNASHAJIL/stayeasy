import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const { activeRoom, messages } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeRoom]);

  if (!activeRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-semibold">{activeRoom.stayTitle}</div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages[activeRoom._id]?.map((msg) => (
          <MessageBubble key={msg._id} msg={msg} />
        ))}
        <TypingIndicator />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput />
    </div>
  );
}
