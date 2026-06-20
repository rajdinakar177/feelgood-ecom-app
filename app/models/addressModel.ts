// app/models/addressModel.ts
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName:  { type: String, required: true, trim: true },
    phone:     { type: String, required: true },
    line1:     { type: String, required: true },
    line2:     { type: String, default: "" },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    pincode:   { type: String, required: true },
    country:   { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ userId: 1 });

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;