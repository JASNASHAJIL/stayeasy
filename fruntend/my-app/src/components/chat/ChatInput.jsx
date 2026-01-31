import { useState } from "react";
import socket from "../../socket/socket";

export default function ChatInput() {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", { text });
    setText("");
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2"
      />

      <button
        onClick={send}
        className="bg-green-500 text-white px-4 rounded"
      >
        Send
      </button>

      <button
        onClick={() => socket.emit("aiMessage", { text })}
        className="bg-blue-500 text-white px-4 rounded"
      >
        🤖 AI
      </button>
    </div>
  );
}
