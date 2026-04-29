import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// Helper: send notification email (fire-and-forget)
async function sendNotification(action: string, tpTitle: string, tpId: string) {
  try {
    const settings = await db.adminSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings?.notifyEmail || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

    // Check if notification is enabled for this action
    if (action === "create" && !settings.notifyOnCreate) return;
    if (action === "update" && !settings.notifyOnUpdate) return;
    if (action === "delete" && !settings.notifyOnDelete) return;

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: { user: settings.smtpUser, pass: settings.smtpPass },
    });

    const actionLabels: Record<string, string> = {
      create: "Nouveau TP ajouté",
      update: "TP modifié",
      delete: "TP supprimé",
    };
    const actionIcons: Record<string, string> = { create: "[+]", update: "[~]", delete: "[-]" };

    await transporter.sendMail({
      from: `"IA Academy" <${settings.smtpUser}>`,
      to: settings.notifyEmail,
      subject: `[IA Academy] ${actionLabels[action]} : ${tpTitle}`,
      text: `${actionIcons[action]} ${actionLabels[action]}\n\nTitre : ${tpTitle}\nID : ${tpId}\nDate : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:20px;border-radius:12px 12px 0 0;text-align:center">
<h1 style="color:white;margin:0;font-size:20px">IA Academy</h1></div>
<div style="background:#1a1a2e;padding:24px;border-radius:0 0 12px 12px;border:1px solid #333">
<p style="font-size:28px;text-align:center;margin-bottom:16px">${actionIcons[action]}</p>
<h2 style="color:#e2e8f0;text-align:center;margin:0 0 20px">${actionLabels[action]}</h2>
<p style="color:#e2e8f0;font-weight:bold">${tpTitle}</p>
<p style="color:#94a3b8;font-size:12px;margin-top:12px">${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p></div></div>`,
    });
  } catch (err) {
    // Fire-and-forget — don't block the main operation
    console.error("Notification email failed:", err);
  }
}

// GET /api/tps — list all TPs (public)
export async function GET() {
  try {
    const tps = await db.tP.findMany({
      orderBy: { order: "asc" },
      include: { notebooks: { where: { visible: true }, orderBy: { createdAt: "desc" } } },
    });
    return NextResponse.json(tps);
  } catch (error) {
    console.error("Failed to fetch TPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch TPs" },
      { status: 500 }
    );
  }
}

// POST /api/tps — create a new TP (admin only)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();

    const {
      title, description, category, difficulty, duration, color,
      colabUrl, kaggleUrl, datasetName, datasetRows, datasetCols,
      objective, expectedResult, steps, concepts, tags, order,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Le titre et la description sont obligatoires" },
        { status: 400 }
      );
    }

    const tp = await db.tP.create({
      data: {
        title: title ?? "",
        description: description ?? "",
        category: category ?? "Classification",
        difficulty: difficulty ?? "Intermediaire",
        duration: duration ?? "30 min",
        color: color ?? "#6366f1",
        colabUrl: colabUrl ?? "",
        kaggleUrl: kaggleUrl ?? "",
        datasetName: datasetName ?? "",
        datasetRows: datasetRows ?? "",
        datasetCols: datasetCols ?? "",
        objective: objective ?? "",
        expectedResult: expectedResult ?? "",
        steps: typeof steps === "string" ? steps : JSON.stringify(steps ?? []),
        concepts: typeof concepts === "string" ? concepts : JSON.stringify(concepts ?? []),
        tags: typeof tags === "string" ? tags : JSON.stringify(tags ?? []),
        order: typeof order === "number" ? order : 0,
      },
    });

    // Send notification (fire-and-forget)
    sendNotification("create", tp.title, tp.id);

    return NextResponse.json(tp, { status: 201 });
  } catch (error) {
    console.error("Failed to create TP:", error);
    return NextResponse.json(
      { error: "Failed to create TP" },
      { status: 500 }
    );
  }
}
