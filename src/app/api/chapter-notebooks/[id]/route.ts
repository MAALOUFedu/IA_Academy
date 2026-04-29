import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Helper: verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_PASSWORD || "ia-admin-2025";
  return authHeader === `Bearer ${adminToken}`;
}

// PATCH /api/chapter-notebooks/[id] — update notebook metadata (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, visible, colabUrl, chapterId } = body;

    const notebook = await db.courseChapterNotebook.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(visible !== undefined && { visible }),
        ...(colabUrl !== undefined && { colabUrl }),
        ...(chapterId !== undefined && { chapterId }),
      },
    });

    return NextResponse.json(notebook);
  } catch (error) {
    console.error("Failed to update chapter notebook:", error);
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}

// DELETE /api/chapter-notebooks/[id] — delete a notebook (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const notebook = await db.courseChapterNotebook.findUnique({ where: { id } });
    if (!notebook) {
      return NextResponse.json({ error: "Notebook non trouvé" }, { status: 404 });
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), "uploads", "chapter-notebooks", notebook.filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    await db.courseChapterNotebook.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Notebook supprimé" });
  } catch (error) {
    console.error("Failed to delete chapter notebook:", error);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
