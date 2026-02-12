import { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import API from "../../api";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: '10px 16px',
    backgroundColor: '#f0f2f5',
    borderBottom: '1px solid #d1d7db',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  searchWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #f0f2f5',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px', 
    marginLeft: '8px',
  },
  list: {
    overflowY: 'auto',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  roomItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f2f5',
    background: isActive ? '#f0f2f5' : '#ffffff',
    transition: 'background 0.2s',
    ':hover': {
      background: '#f5f6f6',
    }
  }),
  avatar: {
    width: '49px',
    height: '49px',
    borderRadius: '50%',
    marginRight: '15px',
    objectFit: 'cover',
    background: '#dfe5e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#fff',
    flexShrink: 0,
    position: 'relative',
  },
  roomInfo: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '3px',
  },
  roomName: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#111b21',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  lastMessage: {
    fontSize: '14px',
    color: '#667781',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
  },
  unreadBadge: {
    background: '#25d366',
    color: 'white',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '0 4px',
  },
};

export default function ChatList() {
  const { rooms, activeRoom, setActiveRoom, setRooms, userStatuses } = useChat();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [search, setSearch] = useState("");

  const handleRoomClick = (room) => {
    setActiveRoom(room);
    if (room.unreadCount > 0) {
      setRooms(prevRooms => prevRooms.map(r => r._id === room._id ? { ...r, unreadCount: 0 } : r));
    }
  };

  const handleFixData = async () => {
    if (!window.confirm("This will link ALL stays and chats to YOU. Continue?")) return;
    try {
      const { data } = await API.put("/chat/fix-ownership", {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(data.message);
      window.location.reload();
    } catch (err) {
      alert("Fix failed: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredRooms = rooms.filter(room => {
    const name = user.role === "owner" ? room.studentId?.name : room.stayId?.title;
    // ✅ Safe check: ensure name exists before calling toLowerCase
    return (name || "").toLowerCase().includes(search.toLowerCase());
  });

  // ✅ Sort: Online users first, then preserve existing order (usually date)
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    const isOwner = user.role === "owner";
    const userA = isOwner ? a.studentId : a.ownerId;
    const userB = isOwner ? b.studentId : b.ownerId;

    const onlineA = userStatuses[userA?._id]?.isOnline ?? userA?.isOnline ?? false;
    const onlineB = userStatuses[userB?._id]?.isOnline ?? userB?.isOnline ?? false;

    if (onlineA === onlineB) return 0;
    return onlineA ? -1 : 1;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.searchWrapper}>
          <span style={{color: '#54656f'}}>🔍</span>
          <input type="text" placeholder="Search or start new chat" style={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {user.role === "owner" && (
          <button onClick={handleFixData} style={{ marginTop: '10px', padding: '8px', cursor: 'pointer', width: '100%', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}>
            🛠 Fix Database Ownership
          </button>
        )}
      </div>
      <div style={styles.list}>
        {sortedRooms.map(room => {
          const name = user.role === "owner" ? room.studentId?.name || "Student" : room.stayId?.title || "Stay Chat";
          const avatarChar = name.charAt(0).toUpperCase();
          
          // Check online status
          const isOwner = user.role === "owner";
          const otherUser = isOwner ? room.studentId : room.ownerId;
          const isOnline = userStatuses[otherUser?._id]?.isOnline ?? otherUser?.isOnline ?? false;

          return (
            <div key={room._id} onClick={() => handleRoomClick(room)} style={styles.roomItem(activeRoom?._id === room._id)}>
              <div style={styles.avatar}>
                {avatarChar}
                {isOnline && (
                  <div style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    width: '12px', height: '12px', backgroundColor: '#25d366',
                    borderRadius: '50%', border: '2px solid white'
                  }} />
                )}
              </div>
              <div style={styles.roomInfo}>
                <div style={styles.topRow}>
                  <div style={styles.roomName}>{name}</div>
                  {/* Optional: Add timestamp here if available in room object */}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={styles.lastMessage}>{room.lastMessage || 'No messages yet'}</div>
                  {room.unreadCount > 0 && <div style={styles.unreadBadge}>{room.unreadCount}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
