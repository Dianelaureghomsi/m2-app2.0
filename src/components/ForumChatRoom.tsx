"use client";

import { useState, useRef, useEffect } from "react";

interface ForumMessage {
  id: number;
  content: string;
  fileUrl?: string;
  fileName?: string;
  sender: string;
  createdAt: string;
}

export function ForumChatRoom() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<ForumMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sender = typeof window !== "undefined" ? localStorage.getItem("fullname") || "Utilisateur" : "Utilisateur";

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/forum/messages");
      const data = await res.json();
      setHistory(data.messages || []);
    }
    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message && !file) {
      alert("Veuillez entrer un message ou choisir un fichier.");
      return;
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/forum/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      fileUrl = uploadJson.url;
      fileName = file.name;
    }

    const newMsg: ForumMessage = {
      id: Date.now(),
      content: message,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      sender: sender,
      createdAt: new Date().toISOString(),
    };

    await fetch("/api/forum/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    setHistory([...history, newMsg]);
    setMessage("");
    setFile(null);
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4 border rounded p-4 max-h-[70vh] overflow-y-auto bg-white shadow">
        {history.map((msg) => (
          <div key={msg.id} className="border-b pb-2">
            <div className="text-base text-gray-800">{msg.content}</div>
            {msg.fileUrl && (
              <a
                href={msg.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm block"
              >
                📎 Télécharger : {msg.fileName}
              </a>
            )}
            <div className="text-sm text-gray-500 italic mt-1">— {msg.sender}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} encType="multipart/form-data" className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tapez votre message ici..."
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleFileClick}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Choisir un fichier
          </button>
          <span className="text-sm text-gray-600">{file?.name || "Aucun fichier sélectionné"}</span>
        </div>

        <input
          type="file"
          name="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
}
