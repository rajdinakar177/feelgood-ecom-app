// app/models/categoryModel.ts
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    parentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String, default: "" },
    image:       { type: String, default: "" }, // Cloudinary URL
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;