import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads", "forum");

export async function POST(req: NextRequest) {
  const form = new IncomingForm({ keepExtensions: true, uploadDir });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error("Upload error:", err);
        resolve(NextResponse.json({ error: "Erreur lors de l’upload." }, { status: 500 }));
        return;
      }

      const file = files.file as any;
      const savedPath = file?.filepath ? `/uploads/forum/${path.basename(file.filepath)}` : null;

      resolve(NextResponse.json({ url: savedPath }, { status: 200 }));
    });
  });
}
