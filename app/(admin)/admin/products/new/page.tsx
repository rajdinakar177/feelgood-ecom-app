// app/(admin)/admin/products/new/page.tsx
import ProductForm from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      <ProductForm />
    </div>
  );
}