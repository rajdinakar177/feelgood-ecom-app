// app/(store)/_components/Navbar/index.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import CartIcon from "./CartIcon";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
            Feelgood
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
          <div className="hidden md:flex flex-1 max-w-sm">
  <SearchBar />
</div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="md:hidden p-2 rounded-full hover:bg-muted">
              <Search className="w-5 h-5" />
            </Link>
            <CartIcon />
            <UserMenu />
            <button
              className="md:hidden p-2 rounded-full hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1">
          <NavLinks mobile onClose={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
}