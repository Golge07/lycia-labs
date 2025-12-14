const faqItems = [
  {
    question: "Ürünler vegan mı?",
    answer: "Evet, tüm formüllerimiz hayvansal içerik ve hayvan testi içermez.",
  },
  {
    question: "Kargo süresi nedir?",
    answer: "Türkiye içi siparişler 2-4 iş günü içinde kargoya teslim edilir.",
  },
  {
    question: "İade politikası nasıl işler?",
    answer: "30 gün içinde açılmamış ve kullanılmamış ürünleri iade kabul ediyoruz.",
  },
];

export default function FAQ() {
  return (
    <section className="rounded-3xl border border-[rgba(59,43,43,0.1)] bg-white/70 p-6 shadow-xl">
      <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">SSS</p>
      <div className="mt-3 space-y-3">
        {faqItems.map((item, idx) => (
          <div key={item.question} className="overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/90 shadow-sm">
            <input id={`faq-${idx}`} type="radio" name="faq-group" className="peer hidden" defaultChecked={idx === 0} />
            <label
              htmlFor={`faq-${idx}`}
              className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-foreground transition hover:text-terracotta"
            >
              {item.question}
              <span className="text-terracotta transition peer-checked:rotate-90">›</span>
            </label>
            <div className="max-h-0 duration-400 transition-[max-height] overflow-hidden px-4 pb-0 text-sm text-[rgba(59,43,43,0.7)] ease-in-out peer-checked:max-h-64 peer-checked:pb-3">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
