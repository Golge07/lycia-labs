import Link from "next/link";

const links = [
  { href: "/profil", label: "Genel" },
  { href: "/profil/siparisler", label: "Siparişler" },
  { href: "/profil/adres", label: "Adres" },
];

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background px-6 pb-16 pt-10 text-foreground md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Hesap</p>
            <h1 className="heading-font text-3xl text-foreground">Profil</h1>
            <p className="mt-1 text-sm text-foreground/65">
              {"Profil, sipariş ve adres yönetimi."}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-foreground/20 bg-white/60 px-5 py-2 text-base font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Ana sayfa
          </Link>
        </div>

        <div className="mb-5 lg:hidden">
          <div className="overflow-x-auto rounded-2xl border border-foreground/10 bg-white/70 p-2 shadow-xl">
            <div className="flex gap-2">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full border border-foreground/10 bg-white/80 px-4 py-2 text-sm font-semibold text-foreground/85 transition hover:border-terracotta hover:text-terracotta"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-3xl border border-foreground/10 bg-white/70 p-4 shadow-xl lg:block lg:sticky lg:top-24">
            <p className="heading-font text-sm text-foreground">{"Menü"}</p>
            <nav className="mt-3 space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-transparent px-4 py-3 text-base text-foreground/85 transition hover:border-foreground/10 hover:bg-[rgba(230,215,194,0.35)] hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </main>
  );
}
