import { useState, useEffect } from "react";
import { Message } from "../generated/prisma";

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, senderId: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
}

export function useSendMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer tous les messages
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/messages");

      if (!response.ok) {
        throw new Error("Erreur dans la récupérations des derniers messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour envoyer un message
  const sendMessage = async (content: string, senderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, senderId }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoie du message");
      }
      const newMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      fetchMessages();
      setLoading(false);
    }
  };
  
  // Fonction pour supprimer un message
  const deleteMessage = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {messages
        throw new Error("Echec de suppression du message");
      }
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      fetchMessages();
      setLoading(false);
    }
  };

  // Charger les messages au montage du composant
  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    fetchMessages,
  };
}
