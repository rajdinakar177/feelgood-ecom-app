// app/api/products/route.ts
import { connect } from "@/app/dbConfig/db";
import Product from "@/app/models/productModel";
import Category from "@/app/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);

    const page       = Number(searchParams.get("page") ?? 1);
    const limit       = Number(searchParams.get("limit") ?? 12);
    const search      = searchParams.get("search") ?? "";
    const categorySlug = searchParams.get("category") ?? "";
    const minPrice    = searchParams.get("minPrice");
    const maxPrice    = searchParams.get("maxPrice");
    const minRating   = searchParams.get("minRating");
    const sort        = searchParams.get("sort") ?? "newest";
    const tag         = searchParams.get("tag") ?? "";

    const query: any = { isActive: true };

    // Category filter — resolve slug to ObjectId, include subcategories
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        const subcategories = await Category.find({ parentId: category._id }).select("_id");
        const categoryIds = [category._id, ...subcategories.map((c) => c._id)];
        query.categoryId = { $in: categoryIds };
      }
    }

    // Search
    if (search) query.$text = { $search: search };

    // Price range — checks basePrice OR salePrice (whichever applies)
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) query.avgRating = { $gte: Number(minRating) };

    // Tag filter (e.g. "sale")
    if (tag === "sale") query.salePrice = { $exists: true, $ne: null };
    else if (tag) query.tags = tag;

    // Sort options
    const sortMap: Record<string, any> = {
      newest:      { createdAt: -1 },
      priceLow:    { basePrice: 1 },
      priceHigh:   { basePrice: -1 },
      rating:      { avgRating: -1 },
      popular:     { reviewCount: -1 },
    };
    const sortQuery = sortMap[sort] ?? sortMap.newest;

    const [products, total, priceRange] = await Promise.all([
      Product.find(query)
        .select("name slug images basePrice salePrice avgRating reviewCount stock categoryId")
        .populate("categoryId", "name slug")
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Product.countDocuments(query),

      // Get min/max price across ALL active products (for the slider bounds)
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, min: { $min: "$basePrice" }, max: { $max: "$basePrice" } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      priceRange: priceRange[0] ?? { min: 0, max: 10000 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}