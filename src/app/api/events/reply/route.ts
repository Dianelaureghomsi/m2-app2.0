import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { notificationId, responderId, replyMessage } = await req.json();

  if (!notificationId || !responderId || !replyMessage) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  try {
    const reply = await prisma.notificationReply.create({
      data: {
        message: replyMessage,
        notification: {
          connect: { id: notificationId },
        },
        responder: {
          connect: { id: responderId },
        },
      },
    });

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la réponse à la notification :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
