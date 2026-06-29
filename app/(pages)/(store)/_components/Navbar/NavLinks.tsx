// app/(store)/_components/Navbar/NavLinks.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home",     href: "/" },
  { label: "Shop",     href: "/products" },
  { label: "Sale",     href: "/products?tag=sale" },
];

interface Props { mobile?: boolean; onClose?: () => void; }

export default function NavLinks({ mobile, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={`
            ${mobile ? "block px-3 py-2 rounded-md text-base" : "px-3 py-2 rounded-md text-sm"}
            font-medium transition-colors hover:bg-muted
            ${pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}
          `}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}