import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    const userId = user?._id;

    try {
      const res = await axios.post("http://127.0.0.1:5000/chatbot", {
 
        userId,
        message: input,
      });

      const botReply = res.data.reply || "Sorry, I couldn't understand.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to AI." },
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-lg border p-3 flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <button onClick={() => setOpen(false)} className="text-gray-600">✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mt-3 mb-3 p-2 space-y-2 max-h-80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-100 text-indigo-700 self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 border rounded-lg p-2 text-sm"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-indigo-600 text-white px-3 rounded-lg"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
