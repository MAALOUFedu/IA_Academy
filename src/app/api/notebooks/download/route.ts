import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// GET /api/notebooks/download?id=xxx — download a notebook file
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const notebook = await db.notebook.findUnique({ where: { id } });

    if (!notebook) {
      return NextResponse.json({ error: "Notebook non trouvé" }, { status: 404 });
    }

    if (!notebook.visible) {
      // Check admin token for hidden notebooks
      const authHeader = request.headers.get("authorization");
      const adminToken = process.env.ADMIN_PASSWORD || "ia-admin-2025";
      if (authHeader !== `Bearer ${adminToken}`) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
    }

    const filePath = path.join(process.cwd(), "uploads", "notebooks", notebook.filePath);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Fichier introuvable sur le serveur" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    // Determine content type
    let contentType = "application/octet-stream";
    if (notebook.fileName.endsWith(".ipynb")) {
      contentType = "application/x-ipynb+json";
    } else if (notebook.fileName.endsWith(".py")) {
      contentType = "text/x-python";
    } else if (notebook.fileName.endsWith(".json")) {
      contentType = "application/json";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${notebook.fileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to download notebook:", error);
    return NextResponse.json(
      { error: "Échec du téléchargement" },
      { status: 500 }
    );
  }
}
