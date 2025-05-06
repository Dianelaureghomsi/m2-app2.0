"use client";

import { useRef, useState } from "react";

export default function AdminSendEmail() {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    name: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("subject", formData.subject);
    data.append("email", formData.email);
    data.append("name", formData.name);
    data.append("message", formData.message);
    if (file) {
      data.append("file", file);
    }

    const res = await fetch("/api/email", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("E-mail envoyé !");
    } else {
      alert("Erreur lors de l'envoi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-md mx-auto space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-purple-600">Envoyer un email</h2>

      <label className="block">
        Objet du mail
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      <label className="block">
        Email du destinataire
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      <label className="block">
        Nom du parent
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      <label className="block">
        Votre message
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleFileClick}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
        >
          Joindre un fichier
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
  );
}
