// app/(pages)/(store)/products/[slug]/_components/VariantSelector.tsx
"use client";

interface Variant {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  attributes: Record<string, string>;
}

interface Props {
  variants: Variant[];
  selected: Variant | null;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({ variants, selected, onSelect }: Props) {
  if (!variants.length) return null;

  // Collect all unique attribute keys (e.g. "color", "size") and their possible values
  const attrKeys = Array.from(new Set(variants.flatMap((v) => Object.keys(v.attributes))));

  const selectedAttrs = selected?.attributes ?? {};

  const handleAttrSelect = (key: string, value: string) => {
    const newAttrs = { ...selectedAttrs, [key]: value };
    // Find a variant matching all currently selected attributes
    const match = variants.find((v) =>
      attrKeys.every((k) => !newAttrs[k] || v.attributes[k] === newAttrs[k])
    );
    if (match) onSelect(match);
  };

  return (
    <div className="space-y-4">
      {attrKeys.map((key) => {
        const values = Array.from(new Set(variants.map((v) => v.attributes[key]).filter(Boolean)));

        return (
          <div key={key}>
            <p className="text-sm font-medium capitalize mb-2">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedAttrs[key] === value;
                // Check if this value combo has any stock at all
                const variantForValue = variants.find((v) => v.attributes[key] === value);
                const outOfStock = variantForValue && variantForValue.stock === 0;

                return (
                  <button
                    key={value}
                    onClick={() => handleAttrSelect(key, value)}
                    disabled={outOfStock}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}
                      ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}