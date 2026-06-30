"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

const labels: Record<string, (v: string) => string> = {
  category:  (v) => `Category: ${v}`,
  minPrice:  (v) => `Min ₹${v}`,
  maxPrice:  (v) => `Max ₹${v}`,
  minRating: (v) => `${v}★ & up`,
  search:    (v) => `"${v}"`,
};

export default function ActiveFilterChips() {
  const router      = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const activeFilters = Array.from(searchParams.entries())
    .filter(([key]) => key in labels);

  if (!activeFilters.length) return null;

  const removeFilter = (key: string) => {
    const qs = buildQueryString(searchParams, { [key]: null });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="flex items-center gap-1.5 text-xs bg-secondary px-3 py-1.5 rounded-full"
        >
          {labels[key](value)}
          <button onClick={() => removeFilter(key)}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}