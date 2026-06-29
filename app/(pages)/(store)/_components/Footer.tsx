// app/(store)/_components/Footer.tsx
import Link from "next/link";

const links = {
  Shop:    [{ label: "All Products", href: "/products" }, { label: "Sale", href: "/products?tag=sale" }],
  Account: [{ label: "Login", href: "/login" }, { label: "Sign Up", href: "/signup" }, { label: "My Orders", href: "/orders" }],
  Help:    [{ label: "Contact Us", href: "/contact" }, { label: "Shipping Policy", href: "/shipping" }, { label: "Returns", href: "/returns" }],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-bold mb-3">Feelgood</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quality products, delivered fast. Feel good about every purchase.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <p className="font-semibold text-sm mb-3">{heading}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Feelgood. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}