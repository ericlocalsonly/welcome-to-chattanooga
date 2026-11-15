import type { ImageRef } from "@/lib/types";

export function PageHero({ image, eyebrow, title, subtitle, children, tall = false }: { image: ImageRef; eyebrow?: string; title: string; subtitle?: string; children?: React.ReactNode; tall?: boolean }) {
  return (
    <section className={`relative isolate overflow-hidden ${tall ? "min-h-[86vh]" : "min-h-[46vh]"} flex items-end`}>
      <picture>
        <source media="(max-width: 800px)" srcSet={image.src.replace(/\.jpg$/, "-sm.jpg")} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
      </picture>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/90 via-forest-900/45 to-forest-900/5" />
      <div className="container-page fade-in pb-12 pt-28 text-white">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/90">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold leading-[1.05] !text-white sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-cream/95 sm:text-xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, id }: { eyebrow?: string; title: string; intro?: string; id?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-lg leading-relaxed text-charcoal-600">{intro}</p>}
    </div>
  );
}
