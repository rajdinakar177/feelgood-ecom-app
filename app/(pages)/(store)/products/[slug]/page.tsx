// app/(pages)/(store)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductDetailClient from "./ProductDetailClient";
import RelatedProducts from "./_components/RelatedProducts";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) notFound();

  const { product, related } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${product.categoryId.slug}`} className="hover:text-foreground">
          {product.categoryId.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </div>

      <ProductDetailClient product={product} />

      <hr className="my-12" />

      <RelatedProducts products={related} />
    </div>
  );
}