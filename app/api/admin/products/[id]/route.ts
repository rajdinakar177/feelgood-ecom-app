// app/api/admin/products/[id]/route.ts
import { connect } from "@/app/dbConfig/db";
import Product from "@/app/models/productModel";
import Order from "@/app/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/middleware/adminAuth";
import { generateSlug } from "@/app/lib/utils/slug";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = adminAuth(request);
    if (auth instanceof NextResponse) return auth;

    try {
        await connect();
        const { id } = await params;
        const product = await Product.findById(id).populate("categoryId", "name slug");
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = adminAuth(request);
    if (auth instanceof NextResponse) return auth;

    try {
        await connect();
        const { id } = await params;
        const body = await request.json();

        // Recalculate total stock from variants if provided
        if (body.variants?.length) {
            body.stock = body.variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);
        }

        // Regenerate slug only if name changed
        if (body.name) {
            const slug = generateSlug(body.name);
            const existing = await Product.findOne({ slug, _id: { $ne: id } });
            body.slug = existing ? `${slug}-${Date.now()}` : slug;
        }

        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = adminAuth(request);
    if (auth instanceof NextResponse) return auth;

    try {
        await connect();
        const { id } = await params;
        // Block delete if product has been ordered
        const orderCount = await Order.countDocuments({ "items.productId": id });
        if (orderCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete — this product appears in ${orderCount} order(s). Deactivate it instead.` },
                { status: 400 }
            );
        }

        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}