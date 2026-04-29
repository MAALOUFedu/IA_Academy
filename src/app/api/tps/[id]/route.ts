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
    if (action === "update" && !settings.notifyOnUpdate) return;
    if (action === "delete" && !settings.notifyOnDelete) return;

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: { user: settings.smtpUser, pass: settings.smtpPass },
    });

    const labels: Record<string, string> = { update: "TP modifié", delete: "TP supprimé" };
    const actionIcons: Record<string, string> = { update: "[~]", delete: "[-]" };

    await transporter.sendMail({
      from: `"IA Academy" <${settings.smtpUser}>`,
      to: settings.notifyEmail,
      subject: `[IA Academy] ${labels[action]} : ${tpTitle}`,
      text: `${actionIcons[action]} ${labels[action]}\n\nTitre : ${tpTitle}\nID : ${tpId}\nDate : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:20px;border-radius:12px 12px 0 0;text-align:center">
<h1 style="color:white;margin:0;font-size:20px">IA Academy</h1></div>
<div style="background:#1a1a2e;padding:24px;border-radius:0 0 12px 12px;border:1px solid #333">
<p style="font-size:28px;text-align:center;margin-bottom:16px">${actionIcons[action]}</p>
<h2 style="color:#e2e8f0;text-align:center;margin:0 0 20px">${labels[action]}</h2>
<p style="color:#e2e8f0;font-weight:bold">${tpTitle}</p>
<p style="color:#94a3b8;font-size:12px;margin-top:12px">${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p></div></div>`,
    });
  } catch (err) {
    console.error("Notification email failed:", err);
  }
}

// GET /api/tps/[id] — get a single TP by ID (public)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tp = await db.tP.findUnique({
      where: { id },
      include: { notebooks: { where: { visible: true }, orderBy: { createdAt: "desc" } } },
    });
    if (!tp) {
      return NextResponse.json({ error: "TP not found" }, { status: 404 });
    }
    return NextResponse.json(tp);
  } catch (error) {
    console.error("Failed to fetch TP:", error);
    return NextResponse.json({ error: "Failed to fetch TP" }, { status: 500 });
  }
}

// PUT /api/tps/[id] — update a TP (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.tP.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "TP not found" }, { status: 404 });
    }

    const {
      title, description, category, difficulty, duration, color,
      colabUrl, kaggleUrl, datasetName, datasetRows, datasetCols,
      objective, expectedResult, steps, concepts, tags, order,
    } = body;

    const updated = await db.tP.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
        ...(duration !== undefined && { duration }),
        ...(color !== undefined && { color }),
        ...(colabUrl !== undefined && { colabUrl }),
        ...(kaggleUrl !== undefined && { kaggleUrl }),
        ...(datasetName !== undefined && { datasetName }),
        ...(datasetRows !== undefined && { datasetRows }),
        ...(datasetCols !== undefined && { datasetCols }),
        ...(objective !== undefined && { objective }),
        ...(expectedResult !== undefined && { expectedResult }),
        ...(steps !== undefined && {
          steps: typeof steps === "string" ? steps : JSON.stringify(steps),
        }),
        ...(concepts !== undefined && {
          concepts: typeof concepts === "string" ? concepts : JSON.stringify(concepts),
        }),
        ...(tags !== undefined && {
          tags: typeof tags === "string" ? tags : JSON.stringify(tags),
        }),
        ...(order !== undefined && { order }),
      },
    });

    sendNotification("update", updated.title, updated.id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update TP:", error);
    return NextResponse.json({ error: "Failed to update TP" }, { status: 500 });
  }
}

// DELETE /api/tps/[id] — delete a TP (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(_request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const existing = await db.tP.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "TP not found" }, { status: 404 });
    }

    const tpTitle = existing.title;
    await db.tP.delete({ where: { id } });

    sendNotification("delete", tpTitle, id);

    return NextResponse.json({ message: "TP deleted successfully" });
  } catch (error) {
    console.error("Failed to delete TP:", error);
    return NextResponse.json({ error: "Failed to delete TP" }, { status: 500 });
  }
}
