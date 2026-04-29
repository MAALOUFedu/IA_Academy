import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Helper: verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_PASSWORD || "ia-admin-2025";
  return authHeader === `Bearer ${adminToken}`;
}

// GET /api/chapter-notebooks — list chapter notebooks (optionally filtered by chapterId)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = verifyAdmin(request);
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");

    const where: Record<string, unknown> = isAdmin ? {} : { visible: true };
    if (chapterId) {
      where.chapterId = chapterId;
    }

    const notebooks = await db.courseChapterNotebook.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("Failed to fetch chapter notebooks:", error);
    return NextResponse.json(
      { error: "Échec du chargement des notebooks" },
      { status: 500 }
    );
  }
}

// POST /api/chapter-notebooks — upload a new notebook for a chapter (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = (formData.get("description") as string) || "";
    const chapterId = (formData.get("chapterId") as string) || null;
    const visible = formData.get("visible") === "true";
    const colabUrl = (formData.get("colabUrl") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    const allowedTypes = ["application/x-ipynb+json", "application/json", "text/plain"];
    const fileName = file.name.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !fileName.endsWith(".ipynb") &&
      !fileName.endsWith(".py") &&
      !fileName.endsWith(".json")
    ) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez .ipynb, .py ou .json" },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 50 Mo)" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "uploads", "chapter-notebooks");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const notebookTitle = title || file.name.replace(/\.(ipynb|py|json)$/, "");

    const notebook = await db.courseChapterNotebook.create({
      data: {
        title: notebookTitle,
        description,
        fileName: file.name,
        filePath: uniqueFileName,
        fileSize: file.size,
        visible,
        colabUrl,
        ...(chapterId ? { chapterId } : {}),
      },
    });

    return NextResponse.json(notebook, { status: 201 });
  } catch (error) {
    console.error("Failed to upload chapter notebook:", error);
    return NextResponse.json(
      { error: "Échec du téléchargement du notebook" },
      { status: 500 }
    );
  }
}
