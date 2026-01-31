export default function MessageBubble({ msg }) {
  const isMe = msg.isMe;

  return (
    <div className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs 
        ${isMe ? "bg-green-500 text-white" : "bg-gray-200"}`}>
        {msg.text}
        {isMe && (
          <div className="text-xs mt-1 text-right">
            {msg.status === "seen" ? "👁 Seen" : "✓ Delivered"}
          </div>
        )}
      </div>
    </div>
  );
}
