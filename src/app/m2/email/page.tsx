"use client";

import { useState } from "react";

export default function EmailForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    if (file) {
      data.append("file", file);
    }

    const res = await fetch("/api/email", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("Email envoyé avec succès !");
      if (file) {
        const downloadUrl = URL.createObjectURL(file);
        setUploadedFileUrl(downloadUrl); // Lien temporaire pour téléchargement
      }
    } else {
      alert("Erreur lors de l’envoi.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input type="text" name="name" placeholder="Votre nom" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email du parent" onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Sujet" onChange={handleChange} required />
        <textarea name="message" placeholder="Message" onChange={handleChange} required />
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Envoyer l’e-mail</button>
      </form>

      {uploadedFileUrl && (
        <div className="mt-4">
          <p>Fichier prêt à être téléchargé :</p>
          <a href={uploadedFileUrl} download target="_blank" rel="noopener noreferrer">
            Télécharger la pièce jointe
          </a>
        </div>
      )}
    </div>
  );
}
