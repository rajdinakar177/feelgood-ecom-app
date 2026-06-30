// app/(pages)/(store)/products/[slug]/_components/StockBadge.tsx
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface Props { stock: number; }

export default function StockBadge({ stock }: Props) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
        <XCircle className="w-4 h-4" /> Out of Stock
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-600">
        <AlertTriangle className="w-4 h-4" /> Only {stock} left — order soon
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
      <CheckCircle2 className="w-4 h-4" /> In Stock
    </span>
  );
}