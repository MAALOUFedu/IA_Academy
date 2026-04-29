import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/auth — verify admin credentials (email + password)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "imadmaalouf02@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "ia-admin-2025";

    if (!email || !password) {
      return NextResponse.json(
        { error: "L'email et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === adminEmail.toLowerCase() && password === adminPassword) {
      return NextResponse.json({
        success: true,
        token: adminPassword,
        message: "Authentification réussie",
      });
    }

    if (normalizedEmail !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Email non autorisé" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin auth failed:", error);
    return NextResponse.json(
      { error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}
