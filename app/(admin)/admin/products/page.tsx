// app/(admin)/admin/products/page.tsx
import ProductTable from "./_components/ProductTable";

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your product catalogue</p>
      </div>
      <ProductTable />
    </div>
  );
}