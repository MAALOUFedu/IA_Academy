import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// POST /api/admin/notify — send email notification
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const adminPassword = process.env.ADMIN_PASSWORD || "ml-admin-2024";
    if (token !== adminPassword) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { action, tpTitle, tpId } = body;

    // Validate action type
    if (!["create", "update", "delete"].includes(action)) {
      return NextResponse.json(
        { error: "Action invalide. Utilisez create, update ou delete." },
        { status: 400 }
      );
    }

    // Fetch settings
    const settings = await db.adminSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings?.notifyEmail) {
      return NextResponse.json({
        success: false,
        message: "Aucune adresse email configurée pour les notifications.",
      });
    }

    // Check if notification is enabled for this action type
    if (action === "create" && !settings.notifyOnCreate) {
      return NextResponse.json({ success: true, message: "Notification désactivée pour la création." });
    }
    if (action === "update" && !settings.notifyOnUpdate) {
      return NextResponse.json({ success: true, message: "Notification désactivée pour la modification." });
    }
    if (action === "delete" && !settings.notifyOnDelete) {
      return NextResponse.json({ success: true, message: "Notification désactivée pour la suppression." });
    }

    // Check SMTP configuration
    if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
      return NextResponse.json({
        success: false,
        message: "Configuration SMTP incomplète. Vérifiez les paramètres email.",
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    const actionLabels: Record<string, string> = {
      create: "Nouveau TP ajouté",
      update: "TP modifié",
      delete: "TP supprimé",
    };

    const actionIcons: Record<string, string> = {
      create: "[+]",
      update: "[~]",
      delete: "[-]",
    };

    // Send email
    await transporter.sendMail({
      from: `"IA Academy" <${settings.smtpUser}>`,
      to: settings.notifyEmail,
      subject: `[IA Academy] ${actionLabels[action]} : ${tpTitle}`,
      text: [
        `${actionIcons[action]} ${actionLabels[action]}`,
        "",
        `Titre : ${tpTitle}`,
        `ID : ${tpId}`,
        `Date : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
        "",
        "---",
        "Ceci est une notification automatique de la plateforme IA Academy.",
        "Formation IA Machine Learning — 2025/2026",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">IA Academy</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Formation IA Machine Learning</p>
          </div>
          <div style="background: #1a1a2e; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #333;">
            <p style="font-size: 28px; text-align: center; margin-bottom: 16px;">${actionIcons[action]}</p>
            <h2 style="color: #e2e8f0; text-align: center; margin: 0 0 20px;">${actionLabels[action]}</h2>
            <div style="background: #0f0f23; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 12px;">TITRE DU TP</p>
              <p style="color: #e2e8f0; margin: 0; font-size: 16px; font-weight: bold;">${tpTitle}</p>
            </div>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="color: #94a3b8; padding: 8px 0;">ID</td>
                <td style="color: #e2e8f0; padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${tpId}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; padding: 8px 0;">Date</td>
                <td style="color: #e2e8f0; padding: 8px 0; text-align: right;">${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</td>
              </tr>
            </table>
          </div>
          <p style="color: #64748b; text-align: center; font-size: 12px; margin-top: 20px;">
            Notification automatique — IA Academy 2025/2026
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Notification envoyée à ${settings.notifyEmail}`,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi de la notification. Vérifiez vos paramètres SMTP.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/notify/test — send a test email
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const adminPassword = process.env.ADMIN_PASSWORD || "ml-admin-2024";
    if (token !== adminPassword) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { notifyEmail, smtpHost, smtpPort, smtpUser, smtpPass } = body;

    if (!notifyEmail || !smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Tous les champs SMTP sont requis pour le test." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"IA Academy" <${smtpUser}>`,
      to: notifyEmail,
      subject: "[IA Academy] Email de test",
      text: "Ceci est un email de test depuis la plateforme IA Academy. Si vous recevez cet email, la configuration SMTP est correcte.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Email de test</h1>
          </div>
          <div style="background: #1a1a2e; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #333; text-align: center;">
            <p style="color: #e2e8f0; font-size: 16px;">La configuration SMTP est <strong style="color: #10b981;">correcte</strong> !</p>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 12px;">Vous recevrez maintenant les notifications de modification des TPs à cette adresse.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${notifyEmail}`,
    });
  } catch (error) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Échec de l'envoi du test. Vérifiez vos paramètres SMTP.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
