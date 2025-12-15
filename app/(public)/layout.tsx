import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-x-hidden flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

