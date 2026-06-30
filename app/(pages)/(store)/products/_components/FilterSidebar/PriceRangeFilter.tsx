"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

interface Props {
  bounds: { min: number; max: number }; // from API response
}

export default function PriceRangeFilter({ bounds }: Props) {
  const router       = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

  const [min, setMin] = useState(searchParams.get("minPrice") ?? "");
  const [max, setMax] = useState(searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    setMin(searchParams.get("minPrice") ?? "");
    setMax(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  const apply = () => {
    const qs = buildQueryString(searchParams, {
      minPrice: min || null,
      maxPrice: max || null,
    });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const quickRanges = [
    { label: "Under ₹500",     min: "0",    max: "500" },
    { label: "₹500 – ₹1000",   min: "500",  max: "1000" },
    { label: "₹1000 – ₹2500",  min: "1000", max: "2500" },
    { label: "Above ₹2500",    min: "2500", max: "" },
  ];

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Price Range</h3>

      <div className="flex items-center gap-2 mb-3">
        <Input
          type="number"
          placeholder={`₹${bounds.min}`}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="h-8 text-sm"
        />
        <span className="text-muted-foreground text-sm">–</span>
        <Input
          type="number"
          placeholder={`₹${bounds.max}`}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <Button size="sm" variant="outline" onClick={apply} className="w-full mb-3">
        Apply
      </Button>

      <div className="space-y-1">
        {quickRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => {
              setMin(range.min); setMax(range.max);
              const qs = buildQueryString(searchParams, {
                minPrice: range.min || null,
                maxPrice: range.max || null,
              });
              router.push(`${pathname}${qs ? `?${qs}` : ""}`);
            }}
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground px-1 py-1 transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}