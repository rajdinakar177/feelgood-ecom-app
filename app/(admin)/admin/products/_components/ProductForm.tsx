// app/(admin)/admin/products/_components/ProductForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/app/components/shared/ImageUploader";

import VariantManager from "./VariantManager";
import SeoFields from "./SeoFields";

const TABS = ["Basic", "Variants", "SEO"] as const;
type Tab = typeof TABS[number];

const defaultForm = {
  name: "", description: "", categoryId: "", brand: "", sku: "",
  basePrice: "", salePrice: "", stock: "", tags: "",
  isActive: true, isFeatured: false,
  images: [] as { url: string; publicId: string }[],
  variants: [] as any[],
  seo: { metaTitle: "", metaDescription: "" },
};

interface Props { editData?: any; }

export default function ProductForm({ editData }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Basic");
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load categories
  useEffect(() => {
    axios.get("/api/admin/categories").then(({ data }) => setCategories(data.data));
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? "",
        description: editData.description ?? "",
        categoryId: editData.categoryId?._id ?? "",
        brand: editData.brand ?? "",
        sku: editData.sku ?? "",
        basePrice: editData.basePrice ?? "",
        salePrice: editData.salePrice ?? "",
        stock: editData.stock ?? "",
        tags: editData.tags?.join(", ") ?? "",
        isActive: editData.isActive ?? true,
        isFeatured: editData.isFeatured ?? false,
        images: editData.images ?? [],
        variants: editData.variants ?? [],
        seo: editData.seo ?? { metaTitle: "", metaDescription: "" },
      });
    }
  }, [editData]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (status: "active" | "draft") => {
    if (!form.name.trim() || !form.categoryId || !form.basePrice) {
      toast.error("Name, category and base price are required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        isActive: status === "active",
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      };

      if (editData) {
        await axios.put(`/api/admin/products/${editData._id}`, payload);
        toast.success("Product updated");
      } else {
        await axios.post("/api/admin/products", payload);
        toast.success("Product created");
      }
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab navigation */}
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Basic tab */}
      {tab === "Basic" && (
        <div className="space-y-6">
          {/* Images */}
          <div className="space-y-1.5">
            <Label>Product Images</Label>
<ImageUploader
  images={form.images}
  onChange={(imgs) => set("images", imgs)}
  folder="feelgood/products"
  maxImages={6}
/>          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Classic White Tee" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
            </div>

            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Nike" />
            </div>

            <div className="space-y-1.5">
              <Label>Base Price (₹) *</Label>
              <Input type="number" value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} placeholder="999" />
            </div>

            <div className="space-y-1.5">
              <Label>Sale Price (₹)</Label>
              <Input type="number" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="Optional" />
            </div>

            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                disabled={form.variants.length > 0}
              />
              {form.variants.length > 0 && (
                <p className="text-xs text-muted-foreground">Calculated from variants</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. FG-001" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Tags</Label>
              <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Comma separated: summer, sale, new" />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} id="isActive" />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} id="isFeatured" />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>
        </div>
      )}

      {/* Variants tab */}
      {tab === "Variants" && (
        <VariantManager variants={form.variants} onChange={(v) => set("variants", v)} />
      )}

      {/* SEO tab */}
      {tab === "SEO" && (
        <SeoFields
          seo={form.seo}
          productName={form.name}
          onChange={(seo) => set("seo", seo)}
        />
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
          Save as Draft
        </Button>
        <Button onClick={() => handleSubmit("active")} disabled={loading}>
          {loading ? "Saving..." : editData ? "Update Product" : "Publish Product"}
        </Button>
      </div>
    </div>
  );
}