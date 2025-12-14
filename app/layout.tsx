import type { Metadata } from "next";
import { Montserrat, Tenor_Sans } from "next/font/google";
import "./globals.css";

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
  description: "Akdeniz’den ilham alan temiz bakım ürünleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${primaryFont.variable} ${secondaryFont.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
