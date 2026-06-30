import ProductGrid from "./_components/ProductGrid";
import FilterSidebar from "./_components/FilterSidebar";
import MobileFilterDrawer from "./_components/FilterSidebar/MobileFilterDrawer";
import SortDropdown from "./_components/SortDropdown";
import Pagination from "./_components/Pagination";
import ActiveFilterChips from "./_components/ActiveFilterChips";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

async function getProducts(params: Record<string, string>) {
  const baseUrl = process.env.DOMAIN ?? "http://localhost:3000";
  const qs = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/api/products?${qs}`, { cache: "no-store" });
  if (!res.ok) return { data: [], pagination: { page: 1, pages: 1, total: 0 }, priceRange: { min: 0, max: 10000 } };
  return res.json();
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { data: products, pagination, priceRange } = await getProducts(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
          </p>
        </div>
        <MobileFilterDrawer priceBounds={priceRange} />
      </div>

      <div className="flex gap-8 mt-6">
        <FilterSidebar priceBounds={priceRange} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <ActiveFilterChips />
            <SortDropdown />
          </div>

          <ProductGrid products={products} />
          <Pagination page={pagination.page} pages={pagination.pages} />
        </div>
      </div>
    </div>
  );
}