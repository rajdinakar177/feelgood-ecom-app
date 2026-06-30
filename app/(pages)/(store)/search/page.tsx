// app/(store)/search/page.tsx
import ProductGrid from "../products/_components/ProductGrid";
import FilterSidebar from "../products/_components/FilterSidebar";
import MobileFilterDrawer from "../products/_components/FilterSidebar/MobileFilterDrawer";
import SortDropdown from "../products/_components/SortDropdown";
import Pagination from "../products/_components/Pagination";
import ActiveFilterChips from "../products/_components/ActiveFilterChips";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

async function getResults(params: Record<string, string>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const qs = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/api/products?${qs}`, { cache: "no-store" });
  if (!res.ok) return { data: [], pagination: { page: 1, pages: 1, total: 0 }, priceRange: { min: 0, max: 10000 } };
  return res.json();
}

export default async function SearchPage({ searchParams }: Props) {
 const params = await searchParams;
  const query = params.q ?? "";

  // Map "q" to the "search" param the API expects
  const apiParams: Record<string, string> = { ...params, search: query };
  delete apiParams.q;

  const { data: products, pagination, priceRange } = await getResults(apiParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">
            {query ? `Results for "${query}"` : "Search"}
          </h1>
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

          {!query ? (
            <div className="text-center py-20 text-muted-foreground">
              Start typing in the search bar above to find products.
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination page={pagination.page} pages={pagination.pages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}