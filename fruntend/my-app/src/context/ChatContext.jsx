import { createContext, useContext, useEffect, useMemo, useState, useRef, useCallback } from "react";
import socket from "../socket/socket";
import API from "../api";
import { StayContext } from "./StayContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(StayContext);

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [typingUsers, setTypingUsers] = useState({
    active: false,
    roomId: null,
    users: [],
  });
  const [userStatuses, setUserStatuses] = useState({});

  // Refs to track state inside socket callbacks without re-binding
  const roomsRef = useRef([]);
  const processedIdsRef = useRef(new Set());
  const activeRoomRef = useRef(null);

  useEffect(() => {
    roomsRef.current = rooms;
    activeRoomRef.current = activeRoom;
  }, [rooms]);

  // ✅ Keep activeRoomRef updated to avoid re-running socket effect on room change
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // ✅ stable auth snapshot (supports _id or id)
  const auth = useMemo(
    () => ({
      token: user?.token || null,
      userId: user?._id || user?.id || null,
    }),
    [user?.token, user?._id, user?.id]
  );

  // Fetch rooms function (hoisted for use in socket listener)
  const fetchRooms = useCallback(async () => {
    if (!auth.token) {
      setRooms([]);
      return;
    }

    try {
      const { data } = await API.get("/chat/my-rooms", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("📦 Fetched rooms:", data?.length);
      setRooms(data || []);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  }, [auth.token]);

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Calculate total unread
  useEffect(() => {
    setTotalUnread(rooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0));
  }, [rooms]);

  // 1) Socket connect + listeners
  useEffect(() => {
    if (!auth.token || !auth.userId) {
      if (socket.connected) socket.disconnect();
      return;
    }

    const onConnect = () => {
      // ✅ personal room - join immediately on connect
      if (auth.userId) {
        console.log(`🔌 Socket connected (${socket.id}), joining user room:`, auth.userId);
        socket.emit("joinUserRoom", auth.userId);
        // ✅ Fetch rooms immediately on connect to ensure sync
        fetchRooms();
      }
    };

    const onConnectError = (err) => {
      console.warn("Socket connect_error:", err?.message || err);
    };

    const onDisconnect = (reason) => {
      console.warn("Socket disconnected:", reason);
    };

    const onReceiveMessage = (newMessage) => {
      console.log("📨 ChatContext received message:", newMessage);

      // ✅ Deduplicate messages (since we emit to room AND user)
      if (processedIdsRef.current.has(newMessage._id)) {
        console.log("⚠️ Duplicate message ignored:", newMessage._id);
        return;
      }
      processedIdsRef.current.add(newMessage._id);
      
      // Keep set size manageable
      if (processedIdsRef.current.size > 50) {
        const first = processedIdsRef.current.values().next().value;
        processedIdsRef.current.delete(first);
      }

      // play sound only for other user
      if (
        newMessage?.senderId &&
        String(newMessage.senderId) !== String(auth.userId)
      ) {
        const audio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
        );
        audio.play().catch(() => {});
      }

      const roomId = newMessage.chatRoomId;

      // add message to state
      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMessage],
      }));

      // Check if we know this room
      const isKnownRoom = roomsRef.current.some((r) => String(r._id) === String(roomId));

      if (!isKnownRoom || roomsRef.current.length === 0) {
        // ✅ New room detected (e.g. owner receiving first message), fetch list
        console.log("🆕 New room detected (or empty list), fetching rooms...");
        // Small delay to ensure DB consistency before fetching
        setTimeout(() => fetchRooms(), 500);
      } else {
        // update room list (last message + unread)
        setRooms((prevRooms) => {
          const roomIndex = prevRooms.findIndex((r) => r._id === roomId);
          if (roomIndex === -1) return prevRooms;

          const roomToUpdate = prevRooms[roomIndex];

          const shouldIncreaseUnread =
            activeRoomRef.current?._id !== roomId &&
            String(newMessage.senderId) !== String(auth.userId);

          const updatedRoom = {
            ...roomToUpdate,
            lastMessage: newMessage.text,
            updatedAt: new Date().toISOString(),
            unreadCount: shouldIncreaseUnread
              ? (roomToUpdate.unreadCount || 0) + 1
              : roomToUpdate.unreadCount,
          };

          return [
            updatedRoom,
            ...prevRooms.slice(0, roomIndex),
            ...prevRooms.slice(roomIndex + 1),
          ];
        });
      }
    };

    const onTyping = ({ roomId, user: typingUser }) => {
      if (roomId !== activeRoomRef.current?._id) return;

      setTypingUsers((prev) => {
        const newUsers = prev.users.includes(typingUser)
          ? prev.users
          : [...prev.users, typingUser];
        return { active: true, roomId, users: newUsers };
      });
    };

    const onStopTyping = ({ roomId, user: typingUser }) => {
      if (roomId !== activeRoomRef.current?._id) return;

      setTypingUsers((prev) => {
        const newUsers = prev.users.filter((u) => u !== typingUser);
        return { active: newUsers.length > 0, roomId, users: newUsers };
      });
    };

    const onUserStatusUpdate = ({ userId, isOnline, lastSeen }) => {
      console.log("🔔 User Status Update:", userId, isOnline ? "Online" : "Offline");
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { isOnline, lastSeen },
      }));
    };

    // ✅ Debug: Listen to ANY event to verify connectivity
    socket.onAny((event, ...args) => {
      console.log(`🔌 Socket Event: ${event}`, args);
    });

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessage", onReceiveMessage);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);
    socket.on("userStatusUpdate", onUserStatusUpdate);

    // ✅ Smart Connection: Only reconnect if token changed or not connected
    if (socket.connected && socket.auth?.token === auth.token) {
      console.log("🔌 Socket already connected, syncing state...");
      onConnect(); // Manually trigger join/fetch
    } else {
      if (socket.connected) socket.disconnect();
      socket.auth = { token: auth.token };
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
      socket.off("userStatusUpdate", onUserStatusUpdate);
      socket.offAny();
      // ❌ Removed socket.disconnect() to prevent connection thrashing in React Strict Mode
    };
  }, [auth.token, auth.userId, fetchRooms]); // ✅ Removed activeRoom?._id to prevent reconnect loops


  // 2) When activeRoom changes: join that room + fetch messages
  // ✅ Join all roomIds so you receive messages even if not activeRoom
useEffect(() => {
  if (!auth.token || !auth.userId) return;
  if (!rooms?.length) return;

  const joinAll = () => {
    rooms.forEach((r) => {
      socket.emit("joinChatRoom", r._id);
      console.log("✅ joined chat room:", r._id);
    });
  };

  if (socket.connected) joinAll();
  else socket.once("connect", joinAll);

  return () => socket.off("connect", joinAll);
}, [rooms, auth.token, auth.userId]);


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
        setTypingUsers,
        totalUnread,
        user,
        userStatuses,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
