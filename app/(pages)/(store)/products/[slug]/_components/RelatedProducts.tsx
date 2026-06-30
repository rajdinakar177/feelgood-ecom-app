// app/(pages)/(store)/products/[slug]/_components/RelatedProducts.tsx
import ProductCard from "@/app/(pages)/(store)/products/_components/ProductCard";

interface Props { products: any[]; }

export default function RelatedProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}