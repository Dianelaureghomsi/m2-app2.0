import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: any) {
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erreur formidable :", err);
        return resolve(NextResponse.json({ error: "Erreur d'upload" }, { status: 500 }));
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: "dianelaureghomsi@gmail.com",
          pass: "ysgg xjon yxws uewh",
        },
        port: 587,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: "dianelaureghomsi@gmail.com",
        to: fields.email?.toString(),
        subject: fields.subject?.toString(),
        html: `
          <p><strong>De:</strong> ${fields.name}</p>
          <p><strong>Message:</strong></p>
          <p>${fields.message}</p>
        `,
        attachments: files.file
          ? [
              {
                filename: files.file[0].originalFilename,
                path: files.file[0].filepath,
              },
            ]
          : [],
      };

      try {
        await transporter.sendMail(mailOptions);
        resolve(NextResponse.json({ success: true }, { status: 200 }));
      } catch (error) {
        console.error("Erreur mail:", error);
        resolve(NextResponse.json({ error: "Erreur d’envoi" }, { status: 500 }));
      }
    });
  });
}
