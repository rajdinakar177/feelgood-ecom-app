// app/(admin)/admin/products/_components/VariantManager.tsx
"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Variant {
  _id?: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number | "";
  stock: number;
  attributes: Record<string, string>; // { color: "red", size: "XL" }
}

const emptyVariant = (): Variant => ({
  name: "", sku: "", price: 0, salePrice: "", stock: 0, attributes: {},
});

interface Props {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export default function VariantManager({ variants, onChange }: Props) {
  const [attrKey, setAttrKey] = useState(""); // e.g. "color"

  const add = () => onChange([...variants, emptyVariant()]);

  const remove = (i: number) => onChange(variants.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  const updateAttr = (i: number, key: string, value: string) => {
    const updated = [...variants];
    updated[i] = {
      ...updated[i],
      attributes: { ...updated[i].attributes, [key]: value },
    };
    onChange(updated);
  };

  // Collect all unique attribute keys across all variants
  const allAttrKeys = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.attributes)))
  );

  return (
    <div className="space-y-4">
      {/* Attribute key builder */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1.5">
          <Label>Add Attribute (e.g. color, size)</Label>
          <Input
            value={attrKey}
            onChange={(e) => setAttrKey(e.target.value.toLowerCase())}
            placeholder="color"
            onKeyDown={(e) => {
              if (e.key === "Enter" && attrKey.trim()) {
                // Add this key to all existing variants
                const updated = variants.map((v) => ({
                  ...v,
                  attributes: { ...v.attributes, [attrKey.trim()]: "" },
                }));
                onChange(updated);
                setAttrKey("");
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!attrKey.trim()) return;
            const updated = variants.map((v) => ({
              ...v,
              attributes: { ...v.attributes, [attrKey.trim()]: "" },
            }));
            onChange(updated);
            setAttrKey("");
          }}
        >
          Add
        </Button>
      </div>

      {/* Variant rows */}
      {variants.map((variant, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Variant {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => remove(i)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Variant Name</Label>
              <Input
                value={variant.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="e.g. Red / XL"
              />
            </div>
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input
                value={variant.sku}
                onChange={(e) => update(i, "sku", e.target.value)}
                placeholder="e.g. FG-RED-XL"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={variant.price}
                onChange={(e) => update(i, "price", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sale Price (₹)</Label>
              <Input
                type="number"
                value={variant.salePrice}
                onChange={(e) => update(i, "salePrice", e.target.value ? Number(e.target.value) : "")}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input
                type="number"
                value={variant.stock}
                onChange={(e) => update(i, "stock", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Dynamic attribute inputs */}
          {allAttrKeys.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              {allAttrKeys.map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={variant.attributes[key] ?? ""}
                    onChange={(e) => updateAttr(i, key, e.target.value)}
                    placeholder={`e.g. ${key === "color" ? "Red" : key === "size" ? "XL" : key}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Variant
      </Button>
    </div>
  );
}