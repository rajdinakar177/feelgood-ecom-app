// app/models/productModel.ts
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },  // e.g. "Red / XL"
    sku:        { type: String },
    price:      { type: Number, required: true },
    salePrice:  { type: Number },
    stock:      { type: Number, default: 0 },
    attributes: { type: Map, of: String },         // { color: "red", size: "XL" }
    images:     [{ url: String, publicId: String }],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    categoryId:  { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images:      [{ url: String, publicId: String }],
    variants:    [variantSchema],
    basePrice:   { type: Number, required: true },
    salePrice:   { type: Number },
    stock:       { type: Number, default: 0 },
    sku:         { type: String, unique: true, sparse: true },
    brand:       { type: String, default: "" },
    tags:        [String],
    avgRating:   { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    seo: {
      metaTitle:       { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ avgRating: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index(
  { name: "text", description: "text", brand: "text", tags: "text" },
  { name: "product_search" }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;