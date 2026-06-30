"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";

interface Props {
  priceBounds: { min: number; max: number };
}

export default function FilterSidebar({ priceBounds }: Props) {
  const router      = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const hasFilters = ["category", "minPrice", "maxPrice", "minRating", "tag"]
    .some((key) => searchParams.has(key));

  const clearAll = () => router.push(pathname);

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-6 pr-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Filters</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">
            Clear all
          </Button>
        )}
      </div>

      <hr />
      <CategoryFilter />
      <hr />
      <PriceRangeFilter bounds={priceBounds} />
      <hr />
      <RatingFilter />
    </aside>
  );
}