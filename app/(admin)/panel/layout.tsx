import Link from "next/link";
const panelLinks = [
  { href: "/panel", label: "Dashboard" },
  { href: "/panel/siparisler", label: "Siparişler" },
  { href: "/panel/musteriler", label: "Müşteri Hesapları" },
  { href: "/panel/urunler", label: "Ürün Yönetimi" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-foreground/10 bg-white/70 backdrop-blur lg:block">
          <div className="sticky top-0 h-screen px-5 py-6">
            <div className="mb-6">
              <p className="heading-font text-lg text-foreground">Yönetim</p>
              <p className="text-sm text-foreground/65">Lycia Labs Panel</p>
            </div>

            <nav className="space-y-1">
              {panelLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-transparent px-4 py-3 text-base text-foreground/85 transition hover:border-foreground/10 hover:bg-[rgba(230,215,194,0.35)] hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/85 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
              <div>
                <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Yönetim Paneli</p>
                <p className="text-sm text-foreground/65">Özet veriler ve temel yönetim ekranları</p>
              </div>

              <div className="flex items-center gap-2">
                <details className="relative lg:hidden">
                  <summary className="list-none cursor-pointer rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta">
                    Menü
                  </summary>
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-foreground/10 bg-white/95 p-2 shadow-xl">
                    {panelLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground/85 transition hover:bg-[rgba(230,215,194,0.35)] hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
                <Link
                  href="/panel"
                  className="rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                >
                  Siteye dön
                </Link>
              </div>
            </div>
          </header>

          <main className="px-6 py-6 lg:px-10 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
