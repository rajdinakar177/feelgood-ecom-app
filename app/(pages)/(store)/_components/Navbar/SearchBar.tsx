// app/(store)/_components/Navbar/SearchBar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { useRecentSearches } from "@/app/lib/hooks/useRecentSearches";

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery]   = useState("");
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({
    products: [], categories: [],
  });

  const { recent, addSearch, removeSearch, clearAll } = useRecentSearches();
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults({ products: [], categories: [] });
      return;
    }
    setLoading(true);
    axios.get(`/api/products/search-suggest?q=${encodeURIComponent(debouncedQuery)}`)
      .then(({ data }) => setResults(data.data))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const submitSearch = (term: string) => {
    if (!term.trim()) return;
    addSearch(term.trim());
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitSearch(query);
    if (e.key === "Escape") setOpen(false);
  };

  const showRecent = query.trim().length === 0 && recent.length > 0;
  const showResults = query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full rounded-full border px-9 py-2 text-sm bg-background
            focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (showRecent || showResults) && (
        <div className="absolute top-full mt-2 w-full rounded-xl border bg-background shadow-lg z-50 overflow-hidden">

          {/* Recent searches — shown when input is empty */}
          {showRecent && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
                  Clear all
                </button>
              </div>
              <div className="space-y-0.5">
                {recent.map((term) => (
                  <div
                    key={term}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted group cursor-pointer"
                    onClick={() => submitSearch(term)}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {term}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live results — shown while typing */}
          {showResults && (
            <div>
              {loading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : results.products.length === 0 && results.categories.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No results for "{query}"
                </div>
              ) : (
                <div className="divide-y">
                  {/* Matching categories */}
                  {results.categories.length > 0 && (
                    <div className="p-2">
                      {results.categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => { addSearch(query); setOpen(false); setQuery(""); }}
                          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted text-sm"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>in <strong>{cat.name}</strong></span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Matching products */}
                  {results.products.length > 0 && (
                    <div className="p-2">
                      {results.products.map((p) => (
                        <Link
                          key={p._id}
                          href={`/products/${p.slug}`}
                          onClick={() => { addSearch(query); setOpen(false); setQuery(""); }}
                          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted"
                        >
                          <img
                            src={p.images?.[0]?.url ?? "/placeholder.jpg"}
                            alt={p.name}
                            className="w-10 h-10 rounded-md object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{p.salePrice ?? p.basePrice}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* View all results */}
                  <button
                    onClick={() => submitSearch(query)}
                    className="w-full p-3 text-sm font-medium text-primary hover:bg-muted text-center"
                  >
                    View all results for "{query}" →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}