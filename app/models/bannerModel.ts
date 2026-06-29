// app/models/bannerModel.ts
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    subtitle:    { type: String, default: "" },
    image:       { type: String, required: true },   // Cloudinary URL
    imagePublicId: { type: String, default: "" },
    link:        { type: String, default: "" },       // e.g. /products?category=sale
    buttonText:  { type: String, default: "Shop Now" },
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, sortOrder: 1 });

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;