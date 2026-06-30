"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";

interface Props {
  priceBounds: { min: number; max: number };
}

export default function MobileFilterDrawer({ priceBounds }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="lg:hidden">
        <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-background p-5 overflow-y-auto space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <hr />
            <CategoryFilter />
            <hr />
            <PriceRangeFilter bounds={priceBounds} />
            <hr />
            <RatingFilter />

            <Button onClick={() => setOpen(false)} className="w-full">
              Show Results
            </Button>
          </div>
        </div>
      )}
    </>
  );
}