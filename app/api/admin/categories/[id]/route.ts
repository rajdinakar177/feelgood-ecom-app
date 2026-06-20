// app/api/admin/categories/[id]/route.ts
import { connect } from "@/app/dbConfig/db";
import Category from "@/app/models/categoryModel";
import Product from "@/app/models/productModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";
import { generateSlug } from "@/app/lib/utils/slug";

// GET one
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const category = await Category.findById(params.id).populate("parentId", "name slug");
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const body = await request.json();
    const { name, parentId, description, image, isActive, sortOrder } = body;

    // Prevent a category being its own parent
    if (parentId && parentId === params.id) {
      return NextResponse.json({ error: "Category cannot be its own parent" }, { status: 400 });
    }

    const updateData: any = { description, image, isActive, sortOrder };
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (parentId !== undefined) updateData.parentId = parentId || null;

    const updated = await Category.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();

    // Block delete if products are assigned to this category
    const productCount = await Product.countDocuments({ categoryId: params.id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${productCount} product(s) use this category` },
        { status: 400 }
      );
    }

    // Block delete if subcategories exist
    const childCount = await Category.countDocuments({ parentId: params.id });
    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${childCount} subcategory(ies) exist under this category` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}