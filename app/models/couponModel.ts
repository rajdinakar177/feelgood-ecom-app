// app/models/couponModel.ts
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:          { type: String, enum: ["percentage", "flat"], required: true },
    value:         { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount:   { type: Number },               // cap for percentage type
    usageLimit:    { type: Number, default: 1 },
    usedCount:     { type: Number, default: 0 },
    isActive:      { type: Boolean, default: true },
    expiresAt:     { type: Date },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;