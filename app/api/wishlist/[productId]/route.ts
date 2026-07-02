// app/api/wishlist/[productId]/route.ts
import { connect } from "@/app/dbConfig/db";
import Wishlist from "@/app/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";
import { userAuth } from "@/app/lib/middleware/userAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const auth = userAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connect();
    const { productId } = await params;

    await Wishlist.findOneAndUpdate(
      { userId: auth.userId },
      { $pull: { products: { productId } } }
    );

    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}