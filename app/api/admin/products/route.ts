// app/api/admin/products/route.ts
import { connect } from "@/app/dbConfig/db";
import Product from "@/app/models/productModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";
import { generateSlug } from "@/app/lib/utils/slug";

// GET — paginated product list
export async function GET(request: NextRequest) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const status = searchParams.get("status") ?? "";

    const query: any = {};
    if (search) query.$text = { $search: search };
    if (category) query.categoryId = category;
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create product
export async function POST(request: NextRequest) {
  const auth = adminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const body = await request.json();
    const {
      name, description, categoryId, images, variants,
      basePrice, salePrice, stock, sku, brand,
      tags, isActive, isFeatured, seo,
    } = body;

    if (!name || !categoryId || basePrice === undefined) {
      return NextResponse.json(
        { error: "Name, category and base price are required" },
        { status: 400 }
      );
    }

    // Auto-generate unique slug
    let slug = generateSlug(name);
    const existing = await Product.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Derive total stock from variants if variants exist, else use stock field
    const totalStock = variants?.length
      ? variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0)
      : (stock ?? 0);

    const product = await Product.create({
      name, slug, description, categoryId, images: images ?? [],
      variants: variants ?? [], basePrice, salePrice, stock: totalStock,
      sku, brand, tags: tags ?? [], isActive: isActive ?? true,
      isFeatured: isFeatured ?? false, seo: seo ?? {},
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}