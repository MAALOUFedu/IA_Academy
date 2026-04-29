import { NextRequest, NextResponse } from "next/server";

/**
 * Admin authentication middleware for API routes.
 * Uses Bearer token (admin password) for simplicity.
 */

export function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");
  const adminPassword = process.env.ADMIN_PASSWORD || "ia-admin-2025";
  return token === adminPassword;
}

/**
 * Returns a 401 response if not admin, null if authorized.
 * Usage: const denied = requireAdmin(request); if (denied) return denied;
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { error: "Non autorisé — connexion admin requise" },
      { status: 401 }
    );
  }
  return null;
}
