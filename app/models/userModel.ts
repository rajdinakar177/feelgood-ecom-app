// app/models/userModel.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password:    { type: String, required: true, select: false },
    profileImage:{ type: String, default: "" },
    role:        { type: String, enum: ["user", "admin"], default: "user" },
    isVerified:  { type: Boolean, default: false },
    isBlocked:   { type: Boolean, default: false },

    forgotPasswordToken:   String,
    forgotPasswordTokenExpiry: Date,
    verifyToken:           String,
    verifyTokenExpiry:     Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;