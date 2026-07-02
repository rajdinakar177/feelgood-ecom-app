// app/(pages)/(store)/products/[slug]/_components/AddToCartBar.tsx
"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/lib/hooks/useCart";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import WishlistButton from "@/app/components/shared/WishlistButton";

interface Props {
  product:   any;
  variant:   any | null;
  maxStock:  number;
}

export default function AddToCartBar({ product, variant, maxStock }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const price = variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.basePrice;
  const disabled = maxStock === 0;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      variantId: variant?._id,
      name: variant ? `${product.name} (${variant.name})` : product.name,
      image: product.images?.[0]?.url ?? "",
      price,
      quantity: qty,
      sku: variant?.sku ?? product.sku,
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={disabled}
            className="p-2 hover:bg-muted disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
            disabled={disabled || qty >= maxStock}
            className="p-2 hover:bg-muted disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          disabled={disabled}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
        </Button>
        <Button
          className="flex-1"
          disabled={disabled}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
     <WishlistButton productId={product._id} size="md" />

      </div>
    </div>
  );
}