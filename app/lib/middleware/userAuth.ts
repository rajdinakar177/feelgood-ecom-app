// app/lib/middleware/userAuth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function userAuth(request: NextRequest): { userId: string; role: string } | NextResponse {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    return { userId: decoded.id, role: decoded.role };
  } catch {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
}