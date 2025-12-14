"use client";
import Link from "next/link";
import Cart from "./Cart";
import ProfileButton from "./ProfileButton";
import { useAppSelector } from "@/lib/store";
import { useEffect, useState } from "react";



export default function Header() {
  const user = useAppSelector(state => state.user).user;
  const [navLinks, setNavLinks] = useState<{ href: string, label: string }[]>([])
  // const navLinks = [
  //   { href: "/", label: "Anasayfa" },
  //   { href: "/hakkimizda", label: "Hakkımızda" },
  //   { href: "/magaza", label: "Mağaza" },
  //   { href: "/iletisim", label: "İletişim" },
  //   { href: "/panel", label: "Panel" },
  // ];

  useEffect(() => {
    if (user && user.role == "OWNER") {
      setNavLinks([
        { href: "/", label: "Anasayfa" },
        { href: "/hakkimizda", label: "Hakkımızda" },
        { href: "/magaza", label: "Mağaza" },
        { href: "/iletisim", label: "İletişim" },
        { href: "/panel", label: "Panel" },
      ])
    } else {
      setNavLinks([
        { href: "/", label: "Anasayfa" },
        { href: "/hakkimizda", label: "Hakkımızda" },
        { href: "/magaza", label: "Mağaza" },
        { href: "/iletisim", label: "İletişim" },
      ])
    }

  }, [user])

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(59,43,43,0.12)] bg-background/90 px-6 py-4 backdrop-blur md:px-12 lg:px-20">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo_no_bg.png" alt="Lycia Labs" className="h-14 w-14 rounded-xl object-contain shadow-sm" />
          <div>
            <p className="heading-font text-xl text-terracotta">Lycia Labs</p>
            <p className="text-base text-[rgba(59,43,43,0.7)]">Doğal bakım ve iyileştirici dokunuş</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-base font-medium text-[rgba(59,43,43,0.85)] md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-terracotta">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ProfileButton />
          <Cart />
        </div>
      </nav>
    </header>
  );
}
