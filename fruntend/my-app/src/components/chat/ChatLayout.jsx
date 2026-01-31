import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="flex h-[90vh] bg-white rounded-lg shadow">
      <div className="w-1/3 border-r">
        <ChatList />
      </div>
      <div className="w-2/3">
        <ChatWindow />
      </div>
    </div>
  );
}
