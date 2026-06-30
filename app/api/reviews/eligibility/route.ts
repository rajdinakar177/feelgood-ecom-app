// app/api/reviews/eligibility/route.ts
import { connect } from "@/app/dbConfig/db";
import Review from "@/app/models/reviewModel";
import Order from "@/app/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { userAuth } from "@/app/lib/middleware/userAuth";

export async function GET(request: NextRequest) {
  const auth = userAuth(request);
  if (auth instanceof NextResponse) {
    // Not logged in — they can still see the page, just can't review
    return NextResponse.json({ success: true, data: { canReview: false, alreadyReviewed: false, isLoggedIn: false } });
  }

  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const [existing, order] = await Promise.all([
      Review.findOne({ productId, userId: auth.userId }),
      Order.findOne({
        userId: auth.userId,
        "items.productId": productId,
        status: { $in: ["delivered", "shipped"] },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        isLoggedIn: true,
        alreadyReviewed: !!existing,
        canReview: !existing,
        isVerifiedPurchase: !!order,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}