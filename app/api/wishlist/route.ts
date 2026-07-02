// app/api/wishlist/route.ts
import { connect } from "@/app/dbConfig/db";
import Wishlist from "@/app/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";
import { userAuth } from "@/app/lib/middleware/userAuth";

// GET — fetch full wishlist with product details populated
export async function GET(request: NextRequest) {
  const auth = userAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();

    const wishlist = await Wishlist.findOne({ userId: auth.userId })
      .populate({
        path: "products.productId",
        select: "name slug images basePrice salePrice avgRating reviewCount stock isActive",
      })
      .lean();

    if (!wishlist) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Filter out products that may have been deleted, and flatten the response
    const items = wishlist.products
      .filter((p: any) => p.productId) // guards against deleted products
      .map((p: any) => ({
        ...p.productId,
        addedAt: p.addedAt,
      }));

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — add a product to wishlist
export async function POST(request: NextRequest) {
  const auth = userAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // Upsert: create wishlist doc if it doesn't exist, push product if not already there
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: auth.userId },
      { $addToSet: { products: { productId, addedAt: new Date() } } },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: wishlist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}