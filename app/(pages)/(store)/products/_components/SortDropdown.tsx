"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

const options = [
  { value: "newest",    label: "Newest" },
  { value: "priceLow",  label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "rating",    label: "Highest Rated" },
  { value: "popular",   label: "Most Popular" },
];

export default function SortDropdown() {
  const router       = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const current       = searchParams.get("sort") ?? "newest";

  const handleChange = (value: string) => {
    const qs = buildQueryString(searchParams, { sort: value });
    router.push(`${pathname}?${qs}`);
  };

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-44 h-9 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}