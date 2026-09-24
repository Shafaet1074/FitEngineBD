import Navbar from "@/src/components/layout/Homepage/Navbar";
import Footer from "@/src/components/layout/Homepage/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* The pt-16 ensures content isn't hidden behind the fixed Navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
}