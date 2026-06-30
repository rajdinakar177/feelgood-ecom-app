// app/(store)/layout.tsx
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}