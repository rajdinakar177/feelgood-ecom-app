// app/(admin)/admin/categories/page.tsx
import CategoryTable from "./_components/CategoryTable";
import CategoryTree from "./_components/CategoryTree";

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product categories and subcategories
          </p>
        </div>
      </div>
      <CategoryTable />
    </div>
  );
}