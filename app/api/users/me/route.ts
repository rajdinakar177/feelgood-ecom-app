import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connect } from "@/app/dbConfig/db";

interface TokenData {
  id: string;
  email: string;
  username: string;
}

export async function GET(request: NextRequest) {
  try {
    await connect();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET not defined");
    }

    const decoded = jwt.verify(token, secret) as TokenData;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error("ME API error:", error.message);

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}