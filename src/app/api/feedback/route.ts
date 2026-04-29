import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Create reusable transporter (lazy initialization)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "ml-academy@noreply.com";

  if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: parseInt(smtpPort || "587") === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    transporter.verify().catch((err) => {
      console.error("SMTP verification failed:", err);
      transporter = null;
    });
  }

  return transporter;
}

// GET /api/feedback — list all feedback (admin only, requires token)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_PASSWORD || "ml-admin-2024";

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const feedbacks = await db.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}

// POST /api/feedback — create feedback + send email notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Le nom doit contenir entre 2 et 100 caractères" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validate subject length
    if (subject.trim().length < 3 || subject.trim().length > 200) {
      return NextResponse.json(
        { error: "Le sujet doit contenir entre 3 et 200 caractères" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 5000) {
      return NextResponse.json(
        { error: "Le message doit contenir entre 10 et 5000 caractères" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    // Save to database
    const feedback = await db.feedback.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      },
    });

    // Attempt to send email notification
    const mailTransporter = getTransporter();
    const recipientEmail = process.env.CONTACT_EMAIL || "imadmaalouf02@gmail.com";

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || "IA Academy <noreply@ml-academy.com>",
          to: recipientEmail,
          replyTo: sanitizedEmail,
          subject: `[IA Academy] ${sanitizedSubject}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a1a; color: #e5e7eb; border-radius: 12px;">
              <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">IA Academy</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Nouveau message de contact</p>
              </div>
              <div style="padding: 24px; background: #111827; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #9ca3af; width: 120px;">Nom</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; font-weight: 600;">${sanitizedName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #9ca3af;">Email</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937;"><a href="mailto:${sanitizedEmail}" style="color: #6366f1;">${sanitizedEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #9ca3af;">Sujet</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; font-weight: 600;">${sanitizedSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #9ca3af; vertical-align: top;">Message</td>
                    <td style="padding: 12px 0;"><p style="line-height: 1.6; white-space: pre-wrap;">${sanitizedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p></td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; text-align: center; color: #6b7280; font-size: 12px;">
                  <p>Message envoyé le ${new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  <p style="margin-top: 4px;">IA Academy — Plateforme de Machine Learning</p>
                </div>
              </div>
            </div>
          `,
        });

        // Send auto-reply to the user
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || "IA Academy <noreply@ml-academy.com>",
          to: sanitizedEmail,
          subject: `[IA Academy] Accusé de réception — ${sanitizedSubject}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a1a; color: #e5e7eb; border-radius: 12px;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Message reçu !</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">IA Academy</p>
              </div>
              <div style="padding: 24px; background: #111827; border-radius: 0 0 12px 12px;">
                <p>Bonjour <strong>${sanitizedName}</strong>,</p>
                <p style="margin-top: 16px; line-height: 1.6;">Nous avons bien reçu votre message concernant <strong>"${sanitizedSubject}"</strong>. Merci de nous avoir contacté !</p>
                <p style="margin-top: 16px; line-height: 1.6;">Nous vous répondrons dans les plus brefs délais. En attendant, n'hésitez pas à consulter nos cours et travaux pratiques.</p>
                <div style="margin-top: 24px; padding: 16px; background: #1f2937; border-radius: 8px; border-left: 3px solid #6366f1;">
                  <p style="margin: 0; font-size: 14px; color: #9ca3af;">Votre message :</p>
                  <p style="margin: 8px 0 0 0; font-style: italic; color: #d1d5db;">"${sanitizedMessage.substring(0, 200)}${sanitizedMessage.length > 200 ? '...' : ''}"</p>
                </div>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; text-align: center; color: #6b7280; font-size: 12px;">
                  <p>Cordialement,<br><strong style="color: #6366f1;">L'équipe IA Academy</strong></p>
                  <p style="margin-top: 4px;">${new Date().toLocaleString('fr-FR', { dateStyle: 'full' })}</p>
                </div>
              </div>
            </div>
          `,
        });

        return NextResponse.json({
          ...feedback,
          emailSent: true,
          message: "Message envoyé avec succès. Un accusé de réception a été envoyé à votre adresse email.",
        }, { status: 201 });
      } catch (mailError) {
        console.error("Failed to send email:", mailError);
        // Save succeeded but email failed — still return success
        return NextResponse.json({
          ...feedback,
          emailSent: false,
          message: "Message enregistré. L'envoi de l'email a échoué, mais votre message a été sauvegardé.",
        }, { status: 201 });
      }
    }

    // No SMTP configured — save to DB only
    return NextResponse.json({
      ...feedback,
      emailSent: false,
      message: "Message enregistré avec succès dans notre base de données.",
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create feedback:", error);
    return NextResponse.json(
      { error: "Échec de l'envoi du message" },
      { status: 500 }
    );
  }
}

// PATCH /api/feedback — mark feedback as read/unread (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_PASSWORD || "ml-admin-2024";

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const feedback = await db.feedback.update({
      where: { id },
      data: { read: read !== undefined ? read : true },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Failed to update feedback:", error);
    return NextResponse.json(
      { error: "Échec de la mise à jour" },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback — delete a feedback entry (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_PASSWORD || "ml-admin-2024";

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await db.feedback.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    return NextResponse.json(
      { error: "Échec de la suppression" },
      { status: 500 }
    );
  }
}
