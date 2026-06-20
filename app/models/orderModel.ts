// app/models/orderModel.ts
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId },
    name:      { type: String, required: true },   // snapshot at purchase time
    image:     { type: String, default: "" },      // snapshot
    sku:       { type: String },
    price:     { type: Number, required: true },   // snapshot
    quantity:  { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String,
    country:  String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber:       { type: String, unique: true },
    userId:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:             [orderItemSchema],
    shippingAddress:   shippingAddressSchema,
    paymentMethod:     { type: String, enum: ["razorpay", "stripe", "cod"], required: true },
    paymentStatus:     { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    itemsTotal:        { type: Number, required: true },
    discount:          { type: Number, default: 0 },
    shippingFee:       { type: Number, default: 0 },
    total:             { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "placed",
    },
    couponCode:      { type: String, default: "" },
    trackingNumber:  { type: String, default: "" },
    notes:           { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${date}-${String(count + 1).padStart(4, "0")}`;
  }
});
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ razorpayOrderId: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;