"use client";

import { useState, useRef, useEffect } from "react";

export interface ForumMessage {
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
  const [sentFileUrl, setSentFileUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<ForumMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await fetch(`/api/messages`);
      const fetchedHistory = await data.json();
      console.log("fetched history: ", fetchedHistory);
      const currentUser = JSON.parse(
        localStorage.getItem("auth_user") as string
      );
      const forumMessage: ForumMessage[] = fetchedHistory.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        fileName: msg.filePath.split("/")[2],
        fileUrl: msg.filePath,
        sender: msg.sender.fullname,
        createdAt: msg.createdAt,
      }));

      setHistory(forumMessage);
    };

    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    let fileUrl: string | null = null;
    if (file) {
      formData.append("file", file);
    }
    const currentUser = localStorage.getItem("auth_user");
    let newMsg: ForumMessage = {
      id: history.length + 1,
      content: message,
      fileUrl: fileUrl || undefined,
      fileName: file?.name || undefined,
      sender: currentUser as string,
      createdAt: new Date().toISOString(),
    };
    formData.append("field", JSON.stringify(newMsg));
    console.log("Forum message", newMsg);

    const uploadRes = await fetch("/api/forum/upload", {
      method: "POST",
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    fileUrl = uploadJson.url;
    newMsg.sender = JSON.parse(currentUser as string)?.fullname;
    newMsg.fileUrl = uploadJson.url;
    setSentFileUrl(fileUrl);
    setHistory([newMsg, ...history]);
    setMessage("");
    setFile(null);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-600 mb-4">
        Forum de discussion
      </h2>
      <form
        onSubmit={handleSend}
        encType="multipart/form-data"
        className="space-y-4"
      >
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
          <span className="text-sm text-gray-600">
            {file?.name || "Aucun fichier sélectionné"}
          </span>
        </div>

        <input
          type="file"
          name="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Envoyer
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            Historique des messages
          </h3>
          {history.map((msg) => (
            <div key={msg.id} className="border p-3 mb-3 rounded">
              <div className="font-bold text-purple-700">{msg.sender}</div>
              <div>{msg.content}</div>
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  📎 Télécharger : {/*msg.fileName*/}
                </a>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
