// app/(admin)/admin/categories/_components/CategoryForm.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: any[];
  editData?: any;
}

export default function CategoryForm({ open, onClose, onSuccess, categories, editData }: Props) {
  const [form, setForm] = useState({
    name: "", description: "", parentId: "", sortOrder: 0, isActive: true, image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? "",
        description: editData.description ?? "",
        parentId: editData.parentId?._id ?? "",
        sortOrder: editData.sortOrder ?? 0,
        isActive: editData.isActive ?? true,
        image: editData.image ?? "",
      });
    } else {
      setForm({ name: "", description: "", parentId: "", sortOrder: 0, isActive: true, image: "" });
    }
  }, [editData, open]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    try {
      setLoading(true);
      const payload = { ...form, parentId: form.parentId || null };
      if (editData) {
        await axios.put(`/api/admin/categories/${editData._id}`, payload);
        toast.success("Category updated");
      } else {
        await axios.post("/api/admin/categories", payload);
        toast.success("Category created");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Exclude self from parent options when editing
  const parentOptions = categories.filter((c) => c._id !== editData?._id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Electronics" />
          </div>

          <div className="space-y-1.5">
            <Label>Parent Category</Label>
            <Select value={form.parentId} onValueChange={(v) => set("parentId", v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="None (top-level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (top-level)</SelectItem>
                {parentOptions.map((c) => (
                  <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="Cloudinary URL" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Active</Label>
              <div className="pt-1">
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editData ? "Save Changes" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}