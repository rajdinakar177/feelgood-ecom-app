// app/(store)/_components/Navbar/CartIcon.tsx
"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/lib/hooks/useCart";

export default function CartIcon() {
  const totalItems = useCart((s) => s.totalItems());

  return (
    <Link href="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full
          bg-primary text-primary-foreground text-[10px] font-bold
          flex items-center justify-center px-1">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}