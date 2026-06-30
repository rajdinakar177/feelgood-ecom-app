// app/api/products/search-suggest/route.ts
import { connect } from "@/app/dbConfig/db";
import Product from "@/app/models/productModel";
import Category from "@/app/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, data: { products: [], categories: [] } });
    }

    const [products, categories] = await Promise.all([
      Product.find({ isActive: true, $text: { $search: q } })
        .select("name slug images basePrice salePrice")
        .limit(5)
        .lean(),

      Category.find({
        isActive: true,
        name: { $regex: q, $options: "i" },
      })
        .select("name slug")
        .limit(3)
        .lean(),
    ]);

    return NextResponse.json({ success: true, data: { products, categories } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}