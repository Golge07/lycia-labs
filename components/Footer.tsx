import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/iletisim", label: "İletişim" },
];

const social = [
  { name: "Instagram", icon: <FaInstagram /> },
  { name: "LinkedIn", icon: <FaLinkedinIn /> },
  { name: "YouTube", icon: <FaYoutube /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(59,43,43,0.12)] bg-white/80 px-6 py-10 text-sm text-[rgba(59,43,43,0.7)] backdrop-blur md:px-12 lg:px-20 w-full">
      <div className="grid gap-6 md:grid-cols-4 md:items-start">
        <div className="col-span-2 flex items-center gap-3">
          <img src="/1.png" alt="Lycia Labs" className="h-10 w-10 object-contain" />
          <div>
            <p className="heading-font text-lg text-foreground">Lycia Labs</p>
            <p className="text-xs text-[rgba(59,43,43,0.65)]">Akdeniz’den ilham alan temiz bakım.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="heading-font text-sm text-foreground">Navigasyon</p>
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-terracotta">
              {item.label}
            </Link>
          ))}
        </div>
          <div className="flex flex-col gap-3">
            <p className="heading-font text-sm text-foreground">Sosyal</p>
            <div className="flex gap-3">
              {social.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(59,43,43,0.15)] text-terracotta transition hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-xs text-[rgba(59,43,43,0.65)]">Bizi sosyal medyada takip et.</p>
          </div>
      </div>
      <div className="mt-6 border-t border-[rgba(59,43,43,0.12)] pt-4 text-xs text-[rgba(59,43,43,0.6)]">
        © {new Date().getFullYear()} Lycia Labs. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
