// app/(admin)/admin/banners/_components/BannerForm.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/app/components/shared/ImageUploader";
import toast from "react-hot-toast";

interface Props {
  open:      boolean;
  onClose:   () => void;
  onSuccess: () => void;
  editData?: any;
}

export default function BannerForm({ open, onClose, onSuccess, editData }: Props) {
  const [form, setForm] = useState({
    title: "", subtitle: "", link: "", buttonText: "Shop Now",
    sortOrder: 0, isActive: true,
    image: "", imagePublicId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title:        editData.title ?? "",
        subtitle:     editData.subtitle ?? "",
        link:         editData.link ?? "",
        buttonText:   editData.buttonText ?? "Shop Now",
        sortOrder:    editData.sortOrder ?? 0,
        isActive:     editData.isActive ?? true,
        image:        editData.image ?? "",
        imagePublicId: editData.imagePublicId ?? "",
      });
    } else {
      setForm({ title: "", subtitle: "", link: "", buttonText: "Shop Now",
        sortOrder: 0, isActive: true, image: "", imagePublicId: "" });
    }
  }, [editData, open]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.image) { toast.error("Title and image are required"); return; }
    try {
      setLoading(true);
      if (editData) {
        await axios.put(`/api/admin/banners/${editData._id}`, form);
        toast.success("Banner updated");
      } else {
        await axios.post("/api/admin/banners", form);
        toast.success("Banner created");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Banner" : "New Banner"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Banner Image *</Label>
            <ImageUploader
              images={form.image ? [{ url: form.image, publicId: form.imagePublicId }] : []}
              onChange={(imgs) => { set("image", imgs[0]?.url ?? ""); set("imagePublicId", imgs[0]?.publicId ?? ""); }}
              folder="feelgood/banners"
              single
            />
          </div>

          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Summer Sale — Up to 50% Off" />
          </div>

          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Limited time offer" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Link URL</Label>
              <Input value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="/products?tag=sale" />
            </div>
            <div className="space-y-1.5">
              <Label>Button Text</Label>
              <Input value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="space-y-1.5 flex-1">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
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
            {loading ? "Saving..." : editData ? "Save Changes" : "Create Banner"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}