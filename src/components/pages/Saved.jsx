import React, { useState, useEffect, useRef, useContext } from "react";
import "../PageCss/Saved.css";
import { AuthContext } from "../../context/AuthContext";

export default function Saved() {
  const { authToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // 🔹 Use environment variable for API URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success && data.chat && Array.isArray(data.chat.messages)) {
        setMessages(data.chat.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (data.success) {
        setInput("");
        fetchChat();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchChat();
    }
  }, [authToken, API_BASE_URL]); // Added API_BASE_URL dependency

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="help-center-container premium-chat">
      <div className="help-header premium-header">
        <h2>🎰 Help Center</h2>
      </div>

      <div className="chat-box premium-chat-box">
        {messages.length === 0 && (
          <div className="no-chat">No chat history. Start a conversation!</div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message premium-message ${
              msg.sender === "user" ? "user-message" : "admin-message"
            }`}
          >
            {msg.text}
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      <div className="input-box premium-input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="premium-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
