import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const styles = {
  appContainer: {
    display: "flex",
    height: "calc(100vh - 80px)",
    backgroundColor: "#d1d7db", // WhatsApp Web background gray
    overflow: "hidden",
    position: "relative",
  },
  sidebar: {
    width: "30%",
    minWidth: "320px",
    maxWidth: "450px",
    borderRight: "1px solid #d1d7db",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    zIndex: 2,
  },
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#efeae2", // WhatsApp chat background color
    backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Subtle pattern
    backgroundRepeat: "repeat",
    zIndex: 1,
  }
};

export default function ChatLayout() {
  const { stayId } = useParams();
  const { rooms, setActiveRoom } = useChat();

  // set active room
  useEffect(() => {
    if (!Array.isArray(rooms) || rooms.length === 0) return;

    const targetRoom = stayId
      ? rooms.find((r) => String(r.stayId?._id || r.stayId) === String(stayId))
      : rooms[0];

    if (targetRoom) setActiveRoom(targetRoom);
  }, [stayId, rooms, setActiveRoom]);

  return (
    <div style={styles.appContainer}>
      <div style={styles.sidebar}>
        <ChatList />
      </div>
      <div style={styles.chatWindow}>
        <ChatWindow />
      </div>
    </div>
  );
}
