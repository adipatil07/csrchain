import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export type AuthUser = { userId: string; role: string };

/** Extract and verify Bearer token from request headers */
export function getAuthUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return verifyToken(authHeader.slice(7));
  } catch {
    return null;
  }
}

/** Return 401 JSON response */
export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

/** Return 400 JSON response */
export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

/** Return 404 JSON response */
export function notFound(message = "Not found") {
  return NextResponse.json({ message }, { status: 404 });
}

/** Return 500 JSON response */
export function serverError(e: unknown) {
  console.error(e);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
}

/** Generate proposal ref like PRP-2026-011 */
export function generateProposalRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900) + 100;
  return `PRP-${year}-${rand}`;
}

/** Generate milestone ref like M-091 */
export function generateMilestoneRef(): string {
  const rand = Math.floor(Math.random() * 900) + 100;
  return `M-${rand}`;
}
