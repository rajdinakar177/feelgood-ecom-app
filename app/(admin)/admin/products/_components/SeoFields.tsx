// app/(admin)/admin/products/_components/SeoFields.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Seo { metaTitle: string; metaDescription: string; }

interface Props {
  seo: Seo;
  productName: string;
  onChange: (seo: Seo) => void;
}

export default function SeoFields({ seo, productName, onChange }: Props) {
  const set = (key: keyof Seo, value: string) => onChange({ ...seo, [key]: value });

  const titleLen = seo.metaTitle.length;
  const descLen  = seo.metaDescription.length;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label>Meta Title</Label>
          <span className={`text-xs ${titleLen > 60 ? "text-destructive" : "text-muted-foreground"}`}>
            {titleLen}/60
          </span>
        </div>
        <Input
          value={seo.metaTitle}
          onChange={(e) => set("metaTitle", e.target.value)}
          placeholder={productName || "Product meta title"}
        />
        <p className="text-xs text-muted-foreground">Leave blank to use product name</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label>Meta Description</Label>
          <span className={`text-xs ${descLen > 160 ? "text-destructive" : "text-muted-foreground"}`}>
            {descLen}/160
          </span>
        </div>
        <Textarea
          value={seo.metaDescription}
          onChange={(e) => set("metaDescription", e.target.value)}
          placeholder="Brief description for search engines"
          rows={3}
        />
      </div>

      {/* Live Google preview */}
      {(seo.metaTitle || productName) && (
        <div className="rounded-md border p-3 space-y-0.5 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Search preview</p>
          <p className="text-sm text-blue-600 font-medium truncate">
            {seo.metaTitle || productName}
          </p>
          <p className="text-xs text-green-700">yourstore.com/products/slug</p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {seo.metaDescription || "No description set."}
          </p>
        </div>
      )}
    </div>
  );
}