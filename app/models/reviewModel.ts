// app/models/reviewModel.ts
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId:          { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId:            { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    rating:             { type: Number, required: true, min: 1, max: 5 },
    title:              { type: String, trim: true, default: "" },
    body:               { type: String, default: "" },
    images:             [{ url: String, publicId: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

reviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Product = mongoose.model("Product");

  const stats = await Review.aggregate([
    { $match: { productId: this.productId, isApproved: true } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.productId, {
      avgRating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;