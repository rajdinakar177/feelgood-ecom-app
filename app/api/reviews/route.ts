// app/api/reviews/route.ts
import { connect } from "@/app/dbConfig/db";
import Review from "@/app/models/reviewModel";
import Order from "@/app/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { userAuth } from "@/app/lib/middleware/userAuth";
import mongoose from "mongoose";

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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
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

      Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      breakdown,
    });
  } catch (error: any) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}