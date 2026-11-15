import { CalendarDays, MapPin, ExternalLink, Navigation } from "lucide-react";
import type { CityEvent } from "@/lib/types";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { formatDate, googleDirections } from "@/lib/utils";
import { FavoriteButton } from "../ui/FavoriteButton";
import { ShareButton } from "../ui/ShareButton";

export function EventCard({ e }: { e: CityEvent }) {
  return (
    <article id={e.id} className="card scroll-mt-24 p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full bg-river-50 px-2.5 py-1 text-river-700">{EVENT_CATEGORIES[e.category]}</span>
        {e.isFree === true && <span className="rounded-full bg-forest-50 px-2.5 py-1 text-forest">Free</span>}
        {e.isFree === false && <span className="rounded-full bg-terracotta-50 px-2.5 py-1 text-terracotta-700">Paid</span>}
      </div>
      <h3 className="mt-2 text-xl font-semibold">{e.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-charcoal-600">
        <CalendarDays aria-hidden className="h-4 w-4 text-river" />
        <time dateTime={e.startsAt}>{formatDate(e.startsAt, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
      </p>
      <p className="mt-1 flex items-start gap-2 text-sm text-charcoal-600"><MapPin aria-hidden className="mt-0.5 h-4 w-4 text-river" />{e.venue} · {e.address}</p>
      <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{e.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className="btn-primary" href={e.url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden className="h-4 w-4" /> Event details<span className="sr-only"> (opens in new tab)</span></a>
        <a className="btn-ghost" href={googleDirections(e.address, e.venue)} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden className="h-4 w-4" /> Directions</a>
        <FavoriteButton k={`event:${e.id}`} name={e.name} compact />
        <ShareButton title={e.name} path={`/events#${e.id}`} compact />
      </div>
    </article>
  );
}
