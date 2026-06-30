// app/api/products/[slug]/route.ts
import { connect } from "@/app/dbConfig/db";
import Product from "@/app/models/productModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connect();
    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("categoryId", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products — same category, excluding this one
    const related = await Product.find({
      categoryId: product.categoryId._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select("name slug images basePrice salePrice avgRating reviewCount")
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: { product, related } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}