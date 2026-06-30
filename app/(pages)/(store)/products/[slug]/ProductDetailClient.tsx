// app/(pages)/(store)/products/[slug]/ProductDetailClient.tsx
"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import Gallery from "./_components/Gallery";
import VariantSelector from "./_components/VariantSelector";
import StockBadge from "./_components/StockBadge";
import AddToCartBar from "./_components/AddToCartBar";
import ReviewsSection from "./_components/ReviewsSection";

interface Props { product: any; }

export default function ProductDetailClient({ product }: Props) {
  const [variant, setVariant] = useState<any | null>(
    product.variants?.length ? product.variants[0] : null
  );

  const price     = variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.basePrice;
  const basePrice = variant?.price ?? product.basePrice;
  const discount  = price < basePrice ? Math.round(((basePrice - price) / basePrice) * 100) : null;
  const stock     = variant ? variant.stock : product.stock;

  // Images: variant images override product images if present
  const images = variant?.images?.length ? variant.images : product.images;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <Gallery images={images} productName={product.name} />

        <div className="space-y-5">
          <div>
            {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{product.name}</h1>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.avgRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">₹{price}</span>
            {discount && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{basePrice}</span>
                <span className="text-sm font-semibold text-green-600">{discount}% off</span>
              </>
            )}
          </div>

          <StockBadge stock={stock} />

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {product.variants?.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selected={variant}
              onSelect={setVariant}
            />
          )}

          <hr />

          <AddToCartBar product={product} variant={variant} maxStock={stock} />

          {product.sku && (
            <p className="text-xs text-muted-foreground">SKU: {variant?.sku ?? product.sku}</p>
          )}
        </div>
      </div>

      <hr className="my-12" />

      <ReviewsSection
        productId={product._id}
        avgRating={product.avgRating}
        reviewCount={product.reviewCount}
      />
    </>
  );
}