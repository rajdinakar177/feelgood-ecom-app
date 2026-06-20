// app/api/categories/route.ts  (public)
import { connect } from "@/app/dbConfig/db";
import Category from "@/app/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const categories = await Category.find({ isActive: true })
    .select("name slug parentId image sortOrder")
    .sort({ sortOrder: 1 })
    .lean();
  return NextResponse.json({ success: true, data: categories });
}