import { useState, useEffect, useRef } from "react";
import socket from "../../socket/socket";
import { useChat } from "../../context/ChatContext";
import API from "../../api";

const styles = {
  container: {
    padding: '10px 16px',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minHeight: '62px',
  },
  input: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '8px',
    border: 'none',
    background: '#ffffff',
    outline: 'none',
    fontSize: '15px',
    maxHeight: '100px',
  },
  sendButton: {
    background: 'transparent',
    color: '#54656f',
    border: 'none',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '24px',
  },
  aiButton: {
    background: 'transparent',
    color: '#54656f',
    border: 'none',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '24px',
  },
  attachButton: {
    background: 'transparent',
    color: '#54656f',
    border: 'none',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '24px',
  },
};

export default function ChatInput() {
  const [text, setText] = useState("");
  const { activeRoom, user } = useChat();
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  const handleTyping = () => {
    if (!socket.connected || !activeRoom) return;
    socket.emit("typing", { roomId: activeRoom._id, user: user.name });

    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId: activeRoom._id, user: user.name });
    }, 2000); // Consider user stopped typing after 2s of inactivity
    setTypingTimeout(newTimeout);
  };

  const send = () => {
    if (!text.trim() || !activeRoom) return;

    // Emit message with room ID
    socket.emit("sendMessage", {
      roomId: activeRoom._id,
      text,
    });

    // Clear typing timeout and emit stopTyping on send
    if (typingTimeout) clearTimeout(typingTimeout);
    socket.emit("stopTyping", { roomId: activeRoom._id, user: user.name });

    setText("");
  };

  const imageInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeRoom) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Upload image to server
      const { data } = await API.post("/chat/upload-image", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // 2. Emit message with the returned image URL
      if (data.imageUrl) {
        socket.emit("sendMessage", {
          roomId: activeRoom._id,
          imageUrl: data.imageUrl,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to send image.");
    } finally {
      // Reset file input
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={imageInputRef}
        onChange={handleImageUpload}
      />
      <button
        onClick={() => imageInputRef.current?.click()}
        style={styles.attachButton}
        title="Attach Image"
      >
        📎
      </button>
      <button
        onClick={() => socket.emit("aiMessage", { text })}
        style={styles.aiButton}
        title="Ask AI"
      >
        🤖
      </button>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
        style={styles.input}
        onKeyPress={(e) => e.key === 'Enter' && send()}
      />

      <button
        onClick={send}
        style={styles.sendButton}
      >
        ➤
      </button>
    </div>
  );
}
