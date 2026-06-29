// app/(store)/page.tsx
import HeroBanner from "./_components/HeroBanner";
import FeaturedProducts from "./_components/FeaturedProducts";
import CategoryGrid from "./_components/CategoryGrid";

async function getHomeData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/home`, {
    next: { revalidate: 60 }, // ISR — revalidate every 60 seconds
  });
  if (!res.ok) return { banners: [], featuredProducts: [], categories: [] };
  const { data } = await res.json();
  return data;
}

export default async function HomePage() {
  const { banners, featuredProducts, categories } = await getHomeData();

  return (
    <div>
      <HeroBanner banners={banners} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
    </div>
  );
}