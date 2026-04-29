import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper: verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_PASSWORD || "ia-admin-2025";
  return authHeader === `Bearer ${adminToken}`;
}

// GET /api/chapters/[id] — get a single chapter
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapter = await db.courseChapter.findUnique({
      where: { id },
      include: {
        notebooks: {
          where: { visible: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!chapter) {
      return NextResponse.json({ error: "Chapitre non trouvé" }, { status: 404 });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Failed to fetch chapter:", error);
    return NextResponse.json({ error: "Échec du chargement" }, { status: 500 });
  }
}

// PUT /api/chapters/[id] — update a chapter (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.courseChapter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Chapitre non trouvé" }, { status: 404 });
    }

    const { title, description, type, content, order, sectionId } = body;

    const updated = await db.courseChapter.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(content !== undefined && { content }),
        ...(order !== undefined && { order }),
        ...(sectionId !== undefined && { sectionId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update chapter:", error);
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}

// DELETE /api/chapters/[id] — delete a chapter (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await db.courseChapter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Chapitre non trouvé" }, { status: 404 });
    }

    await db.courseChapter.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Chapitre supprimé" });
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
