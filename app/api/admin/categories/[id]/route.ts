// app/api/admin/categories/[id]/route.ts
import { connect } from "@/app/dbConfig/db";
import Category from "@/app/models/categoryModel";
import Product from "@/app/models/productModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";
import { generateSlug } from "@/app/lib/utils/slug";
import { promises } from "dns";

// GET one
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { id } = await params;
    const category = await Category.findById(id).populate("parentId", "name slug");
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { id } = await params;

    const body = await request.json();
    const { name, parentId, description, image, isActive, sortOrder } = body;

    // Prevent a category being its own parent
    if (parentId && parentId === id) {
      return NextResponse.json({ error: "Category cannot be its own parent" }, { status: 400 });
    }

    const updateData: any = { description, image, isActive, sortOrder };
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (parentId !== undefined) updateData.parentId = parentId || null;

    const updated = await Category.findByIdAndUpdate(id, updateData, { returnDocument: 'after'});
    if (!updated) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();

    const { id } = await params;

    const productCount = await Product.countDocuments({
      categoryId: id,
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${productCount} product(s) use this category` },
        { status: 400 }
      );
    }

    const childCount = await Category.countDocuments({
      parentId: id,
    });

    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${childCount} subcategory(ies) exist under this category` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}