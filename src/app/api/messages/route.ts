import prisma from "@/lib/prisma";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

// Handler pour envoyer un message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    log(body);
    const { content, senderId } = body;

    if (!content || !senderId) {
      return NextResponse.json(
        { error: "Content and senderId are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handler pour récupérer tous les messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: true, // Inclure les informations sur l'expéditeur
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
