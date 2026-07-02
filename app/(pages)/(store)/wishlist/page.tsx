// app/(pages)/(store)/wishlist/page.tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/app/lib/hooks/useWishlist";
import { useCart } from "@/app/lib/hooks/useCart";
import WishlistButton from "@/app/components/shared/WishlistButton";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, loaded, loading, fetchWishlist } = useWishlist();
  const addItem = useCart((s) => s.addItem);

  useEffect(() => { fetchWishlist(); }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url ?? "",
      price: product.salePrice ?? product.basePrice,
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  if (loading && !loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading your wishlist...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          Save items you love so you can find them easily later.
        </p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">My Wishlist</h1>
      <p className="text-sm text-muted-foreground mb-6">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => {
          const discount = product.salePrice
            ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
            : null;

          return (
            <div key={product._id} className="group">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                  <img
                    src={product.images?.[0]?.url ?? "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {discount && (
                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                  <div className="absolute top-2 right-2">
                    <WishlistButton productId={product._id} size="sm" />
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <span className="text-xs font-semibold bg-foreground text-background px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm">₹{product.salePrice ?? product.basePrice}</span>
                  {product.salePrice && (
                    <span className="text-xs text-muted-foreground line-through">₹{product.basePrice}</span>
                  )}
                </div>
              </Link>

              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}