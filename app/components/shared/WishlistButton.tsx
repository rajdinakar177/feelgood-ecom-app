// app/components/shared/WishlistButton.tsx
"use client";
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/app/lib/hooks/useWishlist";

interface Props {
  productId: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
}

export default function WishlistButton({ productId, size = "md", variant = "icon" }: Props) {
  const router = useRouter();
  const { items, loaded, fetchWishlist, isWishlisted, toggle } = useWishlist();

  useEffect(() => {
    if (!loaded) fetchWishlist();
  }, [loaded, fetchWishlist]);

  const active = isWishlisted(productId);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
          ${active ? "border-destructive bg-destructive/5 text-destructive" : "border-border hover:border-primary/50"}`}
      >
        <Heart className={sizeClasses[size]} fill={active ? "currentColor" : "none"} />
        {active ? "Wishlisted" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors
        ${active ? "bg-destructive/10 text-destructive" : "bg-background border hover:border-destructive/50 text-muted-foreground hover:text-destructive"}`}
    >
      <Heart className={sizeClasses[size]} fill={active ? "currentColor" : "none"} />
    </button>
  );
}