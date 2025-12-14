import type { Metadata } from "next";
import { Tenor_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const primaryFont = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-primary",
});

const secondaryFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-secondary",
});
export const metadata: Metadata = {
  title: "Lycia Labs | Doğal Bakım",
  description:
    "Lycia Labs için modern, kurumsal ve e-ticaret odaklı web deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${primaryFont.variable} ${secondaryFont.variable} antialiased h-screen w-screen overflow-hidden`}>
        <div className="w-full h-full overflow-y-auto">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
