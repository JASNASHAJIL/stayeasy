import { useChat } from "../../context/ChatContext";

export default function TypingIndicator() {
  const { typingUsers } = useChat();

  if (!typingUsers.active) return null;

  return (
    <div className="text-sm text-gray-400 italic">
      typing...
    </div>
  );
}
