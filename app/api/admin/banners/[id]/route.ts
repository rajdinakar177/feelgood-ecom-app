// app/api/admin/banners/[id]/route.ts
import { connect } from "@/app/dbConfig/db";
import Banner from "@/app/models/bannerModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { id } = await params;
    const body = await request.json();

    const banner = await Banner.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { id } = await params;
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}