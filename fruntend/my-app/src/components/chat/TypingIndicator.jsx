import { useChat } from "../../context/ChatContext";

export default function TypingIndicator() {
  const { typingUsers, activeRoom } = useChat();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!typingUsers?.active || typingUsers.roomId !== activeRoom?._id) return null;

  // Filter out the current user from the typing list
  const otherTypingUsers = typingUsers.users.filter(u => u !== user.name);

  if (otherTypingUsers.length === 0) return null;

  const usersText = otherTypingUsers.length > 2
    ? "Several people are typing"
    : otherTypingUsers.join(" and ") + (otherTypingUsers.length === 1 ? " is" : " are");

  return (
    <div style={{
      fontStyle: 'italic',
      color: '#718096',
      fontSize: '13px',
      padding: '0 20px 5px 20px',
      height: '20px'
    }}>
      {usersText} typing...
    </div>
  );
}
