"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

interface Props {
  page:  number;
  pages: number;
}

export default function Pagination({ page, pages }: Props) {
  const router       = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

  if (pages <= 1) return null;

  const goTo = (p: number) => {
    const qs = buildQueryString(searchParams, { page: String(p) });
    router.push(`${pathname}?${qs}`);
  };

  // Build page numbers with ellipsis for large sets
  const pageNumbers = (): (number | "...")[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", pages];
    if (page >= pages - 3) return [1, "...", pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, "...", page - 1, page, page + 1, "...", pages];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-md border disabled:opacity-40 hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-muted-foreground text-sm">…</span>
        ) : (
          <button
            key={i}
            onClick={() => goTo(p)}
            className={`w-9 h-9 rounded-md text-sm font-medium transition-colors
              ${p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-md border disabled:opacity-40 hover:bg-muted transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}