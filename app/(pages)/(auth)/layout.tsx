// app/(pages)/(auth)/layout.tsx

import Navbar from "../(store)/_components/Navbar";
import Footer from "../(store)/_components/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-160px)] bg-background">
        {children}
      </main>

      <Footer />
    </>
  );
}