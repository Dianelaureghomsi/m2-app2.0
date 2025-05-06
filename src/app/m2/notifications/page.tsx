"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  subject: string;
  createdAt: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState("");
  const [replyMessages, setReplyMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const uid = localStorage.getItem("userId") || "";
    setUserId(uid);

    fetch(`/api/events?userId=${uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      });
  }, []);

  const handleReplyChange = (id: string, message: string) => {
    setReplyMessages((prev) => ({ ...prev, [id]: message }));
  };

  const submitReply = async (notificationId: string) => {
    const message = replyMessages[notificationId];
    if (!message || !userId) return;

    const res = await fetch("/api/events/reply", {
      method: "POST",
      body: JSON.stringify({
        notificationId,
        responderId: userId,
        replyMessage: message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Réponse envoyée !");
      setReplyMessages((prev) => ({ ...prev, [notificationId]: "" }));
    } else {
      alert("Erreur lors de l'envoi.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Mes notifications</h2>
      {notifications.map((notif) => (
        <div key={notif.id} className="border p-4 mb-4 rounded shadow">
          <h3 className="text-xl font-semibold">{notif.title}</h3>
          <p><strong>Sujet :</strong> {notif.subject}</p>
          <p>{notif.message}</p>
          <p className="text-sm text-gray-500">Reçue le {new Date(notif.createdAt).toLocaleString()}</p>

          <textarea
            placeholder="Répondre à cette notification..."
            value={replyMessages[notif.id] || ""}
            onChange={(e) => handleReplyChange(notif.id, e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />

          <button
            onClick={() => submitReply(notif.id)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Envoyer la réponse
          </button>
        </div>
      ))}
    </div>
  );
}
