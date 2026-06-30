import ProductCard from "./ProductCard";

interface Props { products: any[]; }

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}