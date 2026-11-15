import { ExternalLink, Navigation, AlertTriangle, ParkingCircle, Users } from "lucide-react";
import type { Trail } from "@/lib/types";
import { TRAIL_CATEGORIES } from "@/lib/categories";
import { googleDirections } from "@/lib/utils";
import { FavoriteButton } from "../ui/FavoriteButton";
import { ShareButton } from "../ui/ShareButton";

const DIFF = { easy: "bg-forest-50 text-forest", moderate: "bg-terracotta-50 text-terracotta-700", challenging: "bg-charcoal text-white" };

export function TrailCard({ t }: { t: Trail }) {
  return (
    <article id={t.id} className="card scroll-mt-24 overflow-hidden">
      {t.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image.src.replace(/\.jpg$/, "-sm.jpg")} alt={t.image.alt} loading="lazy" className="h-44 w-full object-cover" />
      )}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          <span className={`rounded-full px-2.5 py-1 capitalize ${DIFF[t.difficulty]}`}>{t.difficulty}</span>
          {t.activities.map((a) => <span key={a} className="rounded-full bg-cream px-2.5 py-1 text-charcoal-600">{TRAIL_CATEGORIES[a]}</span>)}
        </div>
        <h3 className="mt-2 text-xl font-semibold">{t.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{t.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Distance</dt><dd>{t.distanceMiles != null ? `${t.distanceMiles} mi` : "Varies"}<span className="block text-xs text-charcoal-400">{t.distanceNote}</span></dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Time</dt><dd>{t.duration}</dd><dt className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Surface</dt><dd>{t.surface}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Trailhead</dt><dd>{t.trailhead.name}<span className="block text-xs text-charcoal-400">{t.trailhead.address}</span></dd></div>
          <div><dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-charcoal-400"><ParkingCircle aria-hidden className="h-3 w-3" />Parking</dt><dd className="text-xs">{t.parking}</dd></div>
          <div className="sm:col-span-2"><dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-charcoal-400"><Users aria-hidden className="h-3 w-3" />Families</dt><dd className="text-xs">{t.family ? "Family-friendly. " : "Better for experienced adults. "}{t.familyNote}</dd></div>
        </dl>
        {t.warnings && <p className="mt-4 flex gap-2 rounded-2xl bg-terracotta-50 p-3 text-xs text-charcoal"><AlertTriangle aria-hidden className="h-4 w-4 shrink-0 text-terracotta-700" />{t.warnings}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {t.website && <a href={t.website} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4"><ExternalLink aria-hidden className="h-4 w-4" />Official info<span className="sr-only"> for {t.name} (opens in new tab)</span></a>}
          <a href={googleDirections(t.trailhead.address, t.trailhead.name)} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4"><Navigation aria-hidden className="h-4 w-4" />Directions</a>
          <FavoriteButton k={`trail:${t.id}`} name={t.name} compact />
          <ShareButton title={t.name} path={`/outdoors#${t.id}`} compact />
        </div>
        {t.verification.status !== "verified" && <p className="mt-3 text-xs text-charcoal-400">Some details are still being confirmed. Check the official source before you go.</p>}
      </div>
    </article>
  );
}
