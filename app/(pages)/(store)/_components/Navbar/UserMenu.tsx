// app/(store)/_components/Navbar/UserMenu.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Package, Heart } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // TODO: replace with your auth context/store
  const isLoggedIn = false;

  const handleLogout = async () => {
    await axios.get("/api/logout");
    router.push("/login");
    router.refresh();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-1">
        <Link href="/login"
          className="text-sm font-medium px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
          Login
        </Link>
        <Link href="/signup"
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-muted transition-colors"
      >
        <User className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-background shadow-lg z-20 p-1">
            <Link href="/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}>
              <User className="w-4 h-4" /> My Profile
            </Link>
            <Link href="/orders"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}>
              <Package className="w-4 h-4" /> My Orders
            </Link>
            <Link href="/wishlist"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}>
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted w-full text-destructive"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}