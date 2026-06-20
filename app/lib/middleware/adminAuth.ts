// app/lib/middleware/adminAuth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function adminAuth(request: NextRequest): { userId: string } | NextResponse {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return { userId: decoded.id };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}