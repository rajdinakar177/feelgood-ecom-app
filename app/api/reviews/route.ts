// app/api/reviews/route.ts
import { connect } from "@/app/dbConfig/db";
import Review from "@/app/models/reviewModel";
import Order from "@/app/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { userAuth } from "@/app/lib/middleware/userAuth";

// GET — list reviews for a product (public)
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const page      = Number(searchParams.get("page") ?? 1);
    const limit     = Number(searchParams.get("limit") ?? 5);
    const ratingFilter = searchParams.get("rating");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const query: any = { productId, isApproved: true };
    if (ratingFilter) query.rating = Number(ratingFilter);

    const [reviews, total, breakdown] = await Promise.all([
      Review.find(query)
        .populate("userId", "firstName lastName profileImage")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Review.countDocuments(query),

      // Rating breakdown: how many 5★, 4★, 3★ etc.
      Review.aggregate([
        { $match: { productId: new (require("mongoose").Types.ObjectId)(productId), isApproved: true } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      breakdown, // [{ _id: 5, count: 12 }, { _id: 4, count: 3 }, ...]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — submit a review (logged-in users only)
export async function POST(request: NextRequest) {
  const auth = userAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const body = await request.json();
    const { productId, rating, title, body: reviewBody, images } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product and rating are required" }, { status: 400 });
    }

    // Check if already reviewed (compound unique index also enforces this at DB level)
    const existing = await Review.findOne({ productId, userId: auth.userId });
    if (existing) {
      return NextResponse.json({ error: "You've already reviewed this product" }, { status: 400 });
    }

    // Check verified purchase — did this user order this product, and was it delivered?
    const order = await Order.findOne({
      userId: auth.userId,
      "items.productId": productId,
      status: { $in: ["delivered", "shipped"] },
    });

    const review = await Review.create({
      productId,
      userId: auth.userId,
      orderId: order?._id,
      rating,
      title,
      body: reviewBody,
      images: images ?? [],
      isVerifiedPurchase: !!order,
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "You've already reviewed this product" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}