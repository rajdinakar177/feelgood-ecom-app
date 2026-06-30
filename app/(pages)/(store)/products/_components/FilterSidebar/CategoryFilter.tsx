"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

export default function CategoryFilter() {
  const router        = useRouter();
  const pathname       = usePathname();
  const searchParams   = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);

  const activeCategory = searchParams.get("category");

  useEffect(() => {
    axios.get("/api/categories").then(({ data }) => {
      // Only show top-level categories in the sidebar
      setCategories(data.data.filter((c: any) => !c.parentId));
    });
  }, []);

  const selectCategory = (slug: string | null) => {
    const qs = buildQueryString(searchParams, { category: slug });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Category</h3>
      <div className="space-y-1.5">
        <button
          onClick={() => selectCategory(null)}
          className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors
            ${!activeCategory ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => selectCategory(cat.slug)}
            className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors
              ${activeCategory === cat.slug ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}