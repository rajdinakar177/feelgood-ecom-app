// app/api/upload/sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { adminAuth } from "@/app/lib/middleware/adminAuth";

export async function POST(request: NextRequest) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { folder = "feelgood/misc" } = body;

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_SECRET!
    );

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey:    process.env.CLOUDINARY_KEY,
        folder,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}