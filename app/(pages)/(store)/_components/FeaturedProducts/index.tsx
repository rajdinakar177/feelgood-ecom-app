// app/(store)/_components/FeaturedProducts/index.tsx
import ProductCard from "./ProductCard";

interface Props { products: any[]; }

export default function FeaturedProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground text-sm mt-1">Hand-picked just for you</p>
        </div>
        <a href="/products" className="text-sm font-medium text-primary hover:underline">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}