"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: { fullname: string };
  receiver: { fullname: string };
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState(""); // remplacer par la vraie session

  useEffect(() => {
    // À remplacer par l'ID réel de session
    const currentUserId = localStorage.getItem("userId") || "";
    setUserId(currentUserId);

    fetch(`/api/messages?userId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      });
  }, []);

  const sent = messages.filter(msg => msg.sender.fullname && msg.sender.fullname !== msg.receiver.fullname && msg.sender.fullname === "Moi");
  const received = messages.filter(msg => msg.receiver.fullname && msg.receiver.fullname === "Moi");

  return (
    <div>
      <h2>📥 Messages reçus</h2>
      <ul>
        {messages.filter(msg => msg.receiver && msg.receiver.id === userId).map((msg) => (
          <li key={msg.id}>
            <strong>De : </strong>{msg.sender.fullname}<br />
            <em>{new Date(msg.createdAt).toLocaleString()}</em><br />
            {msg.content}
          </li>
        ))}
      </ul>

      <h2 className="mt-6">📤 Messages envoyés</h2>
      <ul>
        {messages.filter(msg => msg.sender && msg.sender.id === userId).map((msg) => (
          <li key={msg.id}>
            <strong>À : </strong>{msg.receiver.fullname}<br />
            <em>{new Date(msg.createdAt).toLocaleString()}</em><br />
            {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
