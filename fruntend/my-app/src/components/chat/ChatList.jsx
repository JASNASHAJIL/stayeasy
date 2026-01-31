import { useChat } from "../../context/ChatContext";

export default function ChatList() {
  const { rooms, setActiveRoom } = useChat();

  return (
    <div className="overflow-y-auto h-full">
      {rooms.map(room => (
        <div
          key={room._id}
          onClick={() => setActiveRoom(room)}
          className="p-4 cursor-pointer hover:bg-gray-100 border-b"
        >
          <div className="font-semibold">{room.stayTitle}</div>
          <div className="text-sm text-gray-500 truncate">
            {room.lastMessage}
          </div>

          {room.unreadCount > 0 && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              {room.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
