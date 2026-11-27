"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Navigation, Clock, MapPin } from "lucide-react";
import type { Place } from "@/lib/types";
import { AGE_LABELS, COST_LABELS, SETTING_LABELS } from "@/lib/categories";
import { googleDirections } from "@/lib/utils";
import { FavoriteButton } from "../ui/FavoriteButton";

const FILTERS = [
  { key: "toddlers", label: "Toddlers", test: (p: Place) => p.family!.ages.includes("toddlers") },
  { key: "5-8", label: "Ages 5–8", test: (p: Place) => p.family!.ages.includes("5-8") || p.family!.ages.includes("all") },
  { key: "9-12", label: "Ages 9–12", test: (p: Place) => p.family!.ages.includes("9-12") || p.family!.ages.includes("all") },
  { key: "teens", label: "Teenagers", test: (p: Place) => p.family!.ages.includes("teens") || p.family!.ages.includes("all") },
  { key: "all", label: "All Ages", test: (p: Place) => p.family!.ages.includes("all") },
  { key: "indoor", label: "Indoor", test: (p: Place) => (p.setting ?? p.family!.setting) !== "outdoor" },
  { key: "outdoor", label: "Outdoor", test: (p: Place) => (p.setting ?? p.family!.setting) !== "indoor" },
  { key: "free", label: "Free", test: (p: Place) => p.family!.cost === "free" },
  { key: "rainy", label: "Rainy Day", test: (p: Place) => p.family!.rainy },
] as const;

export function KidsGuide({ places, initial }: { places: Place[]; initial?: string }) {
  const [active, setActive] = useState<Set<string>>(new Set(initial && FILTERS.some((f) => f.key === initial) ? [initial] : []));
  const list = useMemo(() => places.filter((p) => FILTERS.filter((f) => active.has(f.key)).every((f) => f.test(p))), [places, active]);
  const toggle = (k: string) => setActive((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Filter activities (combine as many as you like)</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={active.size === 0 ? "chip-on" : "chip-off"} aria-pressed={active.size === 0} onClick={() => setActive(new Set())}>Everything</button>
          {FILTERS.map((f) => (
            <button key={f.key} type="button" aria-pressed={active.has(f.key)} className={active.has(f.key) ? "chip-on" : "chip-off"} onClick={() => toggle(f.key)}>{f.label}</button>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 text-sm text-charcoal-400" aria-live="polite">{list.length} {list.length === 1 ? "activity" : "activities"}</p>
      {list.length === 0 ? (
        <p className="card mt-4 p-6 text-charcoal-600">Nothing matches every filter you picked. Try removing one.</p>
      ) : (
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const f = p.family!;
            return (
              <li key={p.id} className="card flex flex-col overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image.src.replace(/\.(jpg|png)$/, "-sm.$1")} alt={p.image.alt} loading="lazy" className="h-44 w-full object-cover" />
                ) : (
                  <div aria-hidden className="flex h-24 items-end bg-gradient-to-br from-river-100 to-forest-100 p-4 font-serif text-forest/70">{p.name}</div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-semibold"><Link href={`/places/${p.id}`} className="hover:underline">{p.name}</Link></h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{p.description}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-charcoal-600">
                    <dt className="font-semibold">Ages</dt><dd>{f.ages.map((a) => AGE_LABELS[a]).join(", ")}</dd>
                    <dt className="font-semibold">Visit</dt><dd className="flex items-center gap-1"><Clock aria-hidden className="h-3 w-3" />{f.duration}</dd>
                    <dt className="font-semibold">Cost</dt><dd>{COST_LABELS[f.cost]}</dd>
                    <dt className="font-semibold">Setting</dt><dd>{SETTING_LABELS[p.setting ?? f.setting]}{f.rainy ? " · rainy-day pick" : ""}</dd>
                  </dl>
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-charcoal-400"><MapPin aria-hidden className="mt-0.5 h-3 w-3" />{p.address}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4"><ExternalLink aria-hidden className="h-4 w-4" />Website<span className="sr-only"> for {p.name} (opens in new tab)</span></a>}
                    <a href={googleDirections(p.address, p.name)} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4"><Navigation aria-hidden className="h-4 w-4" />Directions</a>
                    <FavoriteButton k={`place:${p.id}`} name={p.name} compact />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-charcoal-400">Cost categories and visit lengths are rough guides. Always check prices, age rules, and hours on the attraction's website before you go.</p>
    </div>
  );
}
