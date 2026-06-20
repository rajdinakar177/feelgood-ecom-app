import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type AdminCheckResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/**
 * Verifies the request's JWT cookie and confirms the user has role "admin".
 * Use at the top of any API route handler that should be admin-only.
 *
 * Usage:
 *   const check = requireAdmin(req);
 *   if (!check.ok) return check.response;
 */
export function requireAdmin(request: NextRequest): AdminCheckResult {

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      ),
    };
  }

  try {

    const decoded = jwt.verify(token, secret) as { role?: string };

    if (decoded.role !== "admin") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    return { ok: true };

  } catch (error) {

    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      ),
    };

  }

}