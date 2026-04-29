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

// GET /api/notebooks/[id] — get a single notebook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notebook = await db.notebook.findUnique({ where: { id } });

    if (!notebook) {
      return NextResponse.json({ error: "Notebook non trouvé" }, { status: 404 });
    }

    // Check visibility for non-admin users
    if (!notebook.visible && !verifyAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return NextResponse.json(notebook);
  } catch (error) {
    console.error("Failed to fetch notebook:", error);
    return NextResponse.json({ error: "Échec du chargement" }, { status: 500 });
  }
}

// PATCH /api/notebooks/[id] — update notebook metadata (admin only)
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
    const { title, description, chapter, visible } = body;

    const notebook = await db.notebook.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(chapter !== undefined && { chapter }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(notebook);
  } catch (error) {
    console.error("Failed to update notebook:", error);
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}

// DELETE /api/notebooks/[id] — delete a notebook (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    // Find notebook to get file path
    const notebook = await db.notebook.findUnique({ where: { id } });
    if (!notebook) {
      return NextResponse.json({ error: "Notebook non trouvé" }, { status: 404 });
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), "uploads", "notebooks", notebook.filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete from database
    await db.notebook.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Notebook supprimé" });
  } catch (error) {
    console.error("Failed to delete notebook:", error);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
