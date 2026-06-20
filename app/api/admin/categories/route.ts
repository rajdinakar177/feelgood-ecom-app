// app/api/admin/categories/route.ts
import { connect } from "@/app/dbConfig/db";
import Category from "@/app/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";
import { generateSlug } from "@/app/lib/utils/slug";

// GET — list all categories (flat, with parent populated)
export async function GET(request: NextRequest) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const categories = await Category.find()
      .populate("parentId", "name slug")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create category
export async function POST(request: NextRequest) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const body = await request.json();
    const { name, parentId, description, image, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Auto-generate slug, ensure uniqueness
    let slug = generateSlug(name);
    const existing = await Category.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await Category.create({
      name,
      slug,
      parentId: parentId || null,
      description,
      image,
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}