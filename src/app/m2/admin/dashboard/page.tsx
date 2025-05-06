"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Tableau de bord Administrateur</h1>

      <ul className="space-y-4">
        <li>
          <Link href="/m2/admin/send-email" className="text-blue-600 underline">
            📧 Envoyer un e-mail à un parent
          </Link>
        </li>
        <li>
          <Link href="/m2/notifications" className="text-blue-600 underline">
            🔔 Voir les notifications
          </Link>
        </li>
        <li>
          <Link href="/m2/forum" className="text-blue-600 underline">
            💬 Accéder au forum
          </Link>
        </li>
      </ul>
    </div>
  );
}
