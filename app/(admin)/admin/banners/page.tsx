// app/(admin)/admin/banners/page.tsx
import BannerTable from "./_components/BannerTable";

export default function BannersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage hero banners displayed on the storefront home page
        </p>
      </div>
      <BannerTable />
    </div>
  );
}