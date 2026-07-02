// app/(pages)/(store)/_components/Navbar/WishlistIcon.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/app/lib/hooks/useWishlist";

export default function WishlistIcon() {
  const { items, loaded, fetchWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loaded) fetchWishlist();
  }, [loaded, fetchWishlist]);

  return (
    <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-muted transition-colors">
      <Heart className="w-5 h-5" />
      {mounted && items.length > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full
          bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
          {items.length > 99 ? "99+" : items.length}
        </span>
      )}
    </Link>
  );
}