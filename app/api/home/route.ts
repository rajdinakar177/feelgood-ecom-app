// app/api/home/route.ts
import { connect } from "@/app/dbConfig/db";
import Banner from "@/app/models/bannerModel";
import Product from "@/app/models/productModel";
import Category from "@/app/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const [banners, featuredProducts, categories] = await Promise.all([
      Banner.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .select("title subtitle image link buttonText")
        .lean(),

      Product.find({ isActive: true, isFeatured: true })
        .limit(8)
        .select("name slug images basePrice salePrice avgRating reviewCount categoryId")
        .populate("categoryId", "name slug")
        .lean(),

      Category.find({ isActive: true, parentId: null })
        .sort({ sortOrder: 1 })
        .select("name slug image")
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: { banners, featuredProducts, categories },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}