// app/(store)/_components/CategoryGrid.tsx
import Link from "next/link";

interface Props { categories: any[]; }

export default function CategoryGrid({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border
              hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
              {cat.image
                ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-muted" />
              }
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}