import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import API from "../../api";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    // background handled by layout
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: '#f0f2f5',
    borderBottom: '1px solid #d1d7db',
    height: '60px',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#dfe5e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '16px',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#111b21',
    lineHeight: '1.2',
  },
  headerSubtitle: {
    fontSize: '13px',
    color: '#667781',
    marginTop: '2px',
  },
  clearButton: {
    color: '#54656f',
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 5%',
  },
};

export default function ChatWindow() {
  const { activeRoom, messages, setMessages, userStatuses } = useChat();
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleClearChat = async () => {
    if (!activeRoom?._id) return;

    const ok = window.confirm("Are you sure you want to delete all messages in this chat?");
    if (!ok) return; // ✅ Cancel now correctly stops here

    try {
      await API.delete(`/chat/${activeRoom._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setMessages((prev) => ({ ...prev, [activeRoom._id]: [] }));
    } catch (err) {
      console.error(err);
      alert("Failed to clear chat");
    }
  };

  // Fetch messages when activeRoom changes
  useEffect(() => {
  if (!activeRoom?._id) return;
  if (!user?.token) return;

  const fetchMessages = async () => {
    try {
      console.log("Fetching messages roomId:", activeRoom._id);

      const res = await API.get(`/chat/${activeRoom._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("Messages response:", res.data);

      setMessages((prev) => ({
        ...prev,
        [activeRoom._id]: Array.isArray(res.data) ? res.data : [],
      }));

      // ✅ mark seen AFTER messages load
      await API.put(
        `/chat/${activeRoom._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.log("Fetch messages error:", err?.response?.status, err?.response?.data || err.message);
    }
  };

  fetchMessages();
}, [activeRoom?._id, user?.token, setMessages]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeRoom]);

  if (!activeRoom) {
    return <div style={{...styles.container, alignItems: 'center', justifyContent: 'center', color: '#667781', background: '#f0f2f5', borderBottom: '6px solid #25d366'}}>Select a chat to start messaging</div>;
  }

  const ownerPic = (() => {
    const pic = activeRoom.ownerId?.profilePic;
    if (!pic) return "https://placehold.co/50x50?text=Owner";
    return pic.startsWith("http") ? pic : `http://localhost:5000${pic}`;
  })();
  const ownerName = activeRoom.ownerId?.name || "Owner";
  
  // Determine the "other" user to show status for
  const isOwner = (user.role || "").toLowerCase() === "owner";
  const otherUser = isOwner ? activeRoom.studentId : activeRoom.ownerId;
  
  // Get real-time status or fall back to initial populated data
  const currentStatus = userStatuses[otherUser?._id] || { 
    isOnline: otherUser?.isOnline, 
    lastSeen: otherUser?.lastSeen 
  };

  const getStatusText = () => {
    if (currentStatus.isOnline) return "Online";
    if (currentStatus.lastSeen) {
      const date = new Date(currentStatus.lastSeen);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `Last seen ${isToday ? 'today' : date.toLocaleDateString()} at ${timeStr}`;
    }
    return "";
  };

  const displayName = isOwner ? (otherUser?.name || "Student") : ownerName;
  const displayContext = isOwner ? `(${activeRoom.stayId?.title || "Stay"})` : "";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          {!isOwner && (
            <div style={styles.headerAvatar}>{ownerName.charAt(0).toUpperCase()}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={styles.headerTitle}>{displayName} {displayContext}</span>
            <span style={styles.headerSubtitle}>{getStatusText()}</span>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          style={styles.clearButton}
        >
          Clear Chat
        </button>
      </div>

      <div style={styles.messageArea}>
        {(messages?.[activeRoom._id] || []).map((msg) => (
          <MessageBubble key={msg._id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <TypingIndicator />
      <ChatInput />
    </div>
  );
}
