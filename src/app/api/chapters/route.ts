import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper: verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_PASSWORD || "ia-admin-2025";
  return authHeader === `Bearer ${adminToken}`;
}

// GET /api/chapters — list all course chapters (public)
export async function GET() {
  try {
    const chapters = await db.courseChapter.findMany({
      orderBy: { order: "asc" },
      include: {
        notebooks: {
          where: { visible: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return NextResponse.json(
      { error: "Échec du chargement des chapitres" },
      { status: 500 }
    );
  }
}

// POST /api/chapters — create a new chapter (admin only)
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, type, content, order, sectionId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est obligatoire" },
        { status: 400 }
      );
    }

    const chapter = await db.courseChapter.create({
      data: {
        title: title ?? "",
        description: description ?? "",
        type: type ?? "chapter",
        content: content ?? "",
        order: typeof order === "number" ? order : 0,
        sectionId: sectionId ?? "",
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Failed to create chapter:", error);
    return NextResponse.json(
      { error: "Échec de la création du chapitre" },
      { status: 500 }
    );
  }
}
