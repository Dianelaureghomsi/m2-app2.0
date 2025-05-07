import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ForumMessage } from "@/src/components/forum/ForumChatRoom";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads", "forum");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = new IncomingForm({ keepExtensions: true, uploadDir });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur upload:", err);
      return res.status(500).json({ error: "Erreur lors de l’upload." });
    }
    const rawField = fields.field;
    const fieldString = Array.isArray(rawField) ? rawField[0] : rawField;
    const parsedField = JSON.parse(fieldString as string);

    const rawFile = files.file;
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    const parsed = parsedField as ForumMessage;
    const savedPath = file?.filepath
      ? `/uploads/forum/${path.basename(file.filepath)}`
      : null;

    console.log(
      "field,>>>>>>>>>>>>>>>>>>>>>>>>>>> ",
      JSON.parse(parsed.sender)
    );
    const sender = JSON.parse(parsed.sender);
    const msg = await prisma.message.create({
      data: {
        content: parsed.content,
        senderId: sender?.id,
        filePath: savedPath as string,
      },
    });
    res.status(200).json({ url: savedPath });
  });
}
