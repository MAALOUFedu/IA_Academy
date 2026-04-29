import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/settings — retrieve admin notification settings
export async function GET() {
  try {
    let settings = await db.adminSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await db.adminSettings.create({
        data: { id: "default" },
      });
    }

    const { smtpPass: _, ...safeSettings } = settings;
    return NextResponse.json({
      ...safeSettings,
      smtpPass: settings.smtpPass ? "••••••••" : "",
      hasSmtpPass: !!settings.smtpPass,
    });
  } catch (error) {
    console.error("Failed to fetch admin settings:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des paramètres" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings — update admin notification settings
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const adminPassword = process.env.ADMIN_PASSWORD || "ia-admin-2025";
    if (token !== adminPassword) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      notifyEmail, smtpHost, smtpPort, smtpUser, smtpPass,
      notifyOnCreate, notifyOnUpdate, notifyOnDelete,
    } = body;

    const existing = await db.adminSettings.findUnique({ where: { id: "default" } });
    const finalSmtpPass = smtpPass === "••••••••" ? (existing?.smtpPass ?? "") : (smtpPass ?? "");

    const settings = await db.adminSettings.upsert({
      where: { id: "default" },
      update: {
        ...(notifyEmail !== undefined && { notifyEmail }),
        ...(smtpHost !== undefined && { smtpHost }),
        ...(smtpPort !== undefined && { smtpPort: Number(smtpPort) || 587 }),
        ...(smtpUser !== undefined && { smtpUser }),
        ...(smtpPass !== undefined && { smtpPass: finalSmtpPass }),
        ...(notifyOnCreate !== undefined && { notifyOnCreate }),
        ...(notifyOnUpdate !== undefined && { notifyOnUpdate }),
        ...(notifyOnDelete !== undefined && { notifyOnDelete }),
      },
      create: {
        id: "default",
        notifyEmail: notifyEmail ?? "",
        smtpHost: smtpHost ?? "",
        smtpPort: Number(smtpPort) || 587,
        smtpUser: smtpUser ?? "",
        smtpPass: finalSmtpPass,
        notifyOnCreate: notifyOnCreate ?? true,
        notifyOnUpdate: notifyOnUpdate ?? true,
        notifyOnDelete: notifyOnDelete ?? true,
      },
    });

    const { smtpPass: _, ...safeSettings } = settings;
    return NextResponse.json({
      ...safeSettings,
      smtpPass: "••••••••",
      hasSmtpPass: !!settings.smtpPass,
      message: "Paramètres enregistrés avec succès",
    });
  } catch (error) {
    console.error("Failed to update admin settings:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}
