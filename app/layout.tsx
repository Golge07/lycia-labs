import type { Metadata } from "next";
import { Montserrat, Tenor_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import AuthProvider from "@/components/AuthProvider";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      "http://localhost:3000",
  ),
  title: "Lycia Labs | Doğal Bakım",
  description: "Akdeniz’den ilham alan temiz bakım ürünleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${primaryFont.variable} ${secondaryFont.variable} antialiased h-screen w-screen overflow-x-hidden`}>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
