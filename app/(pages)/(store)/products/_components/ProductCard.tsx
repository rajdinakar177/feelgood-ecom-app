// app/(store)/_components/FeaturedProducts/ProductCard.tsx
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  product: {
    _id:         string;
    name:        string;
    slug:        string;
    images:      { url: string }[];
    basePrice:   number;
    salePrice?:  number;
    avgRating:   number;
    reviewCount: number;
  };
}

export default function ProductCard({ product }: Props) {
  const discount = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
        <img
          src={product.images?.[0]?.url ?? "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground
            text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </p>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.avgRating} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            ₹{product.salePrice ?? product.basePrice}
          </span>
          {product.salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{product.basePrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}