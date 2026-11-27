import Link from "next/link";
import { ExternalLink, Navigation, Phone, Clock, MapPin, Info, Armchair, Tag } from "lucide-react";
import type { Place } from "@/lib/types";
import { CATEGORIES, PRICE_LABELS, SETTING_LABELS } from "@/lib/categories";
import { appleDirections, formatDate, googleDirections, hostOf, telHref } from "@/lib/utils";
import { FavoriteButton } from "./ui/FavoriteButton";
import { ShareButton } from "./ui/ShareButton";

/** The polished info card shown when a visitor selects a pin or opens a listing. Works in server and client trees. */
export function PlaceDetails({ place, headingLevel = 3, onClose }: { place: Place; headingLevel?: 2 | 3; onClose?: () => void }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="card overflow-hidden" aria-labelledby={`pd-${place.id}`}>
      {place.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={place.image.src.replace(/\.jpg$/, "-sm.jpg")} alt={place.image.alt} className={place.sponsor ? "h-40 w-full bg-white object-contain p-4" : "h-44 w-full object-cover"} loading="lazy" />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {place.categories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-charcoal-600">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: CATEGORIES[c].color }} />
                  {CATEGORIES[c].label}
                </span>
              ))}
            </div>
            <H id={`pd-${place.id}`} className="text-2xl font-semibold">{place.name}</H>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-charcoal-400 hover:bg-cream" aria-label="Close details">✕</button>
          )}
        </div>
        <p className="mt-3 leading-relaxed text-charcoal-600">{place.description}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2"><dt className="sr-only">Address</dt><MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-river" /><dd>{place.address}</dd></div>
          {place.hours && <div className="flex gap-2"><dt className="sr-only">Hours</dt><Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-river" /><dd>{place.hours}</dd></div>}
          {place.setting && <div className="flex gap-2"><dt className="sr-only">Setting</dt><Armchair aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-river" /><dd>{SETTING_LABELS[place.setting]}</dd></div>}
          {place.price && <div className="flex gap-2"><dt className="sr-only">Price</dt><Tag aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-river" /><dd>{PRICE_LABELS[place.price]} <span className="text-charcoal-400">(estimate)</span></dd></div>}
          {place.phone && <div className="flex gap-2"><dt className="sr-only">Phone</dt><Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-river" /><dd><a className="underline" href={telHref(place.phone)}>{place.phone}</a></dd></div>}
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink aria-hidden className="h-4 w-4" /> Visit website<span className="sr-only"> for {place.name} ({hostOf(place.website)}, opens in new tab)</span>
            </a>
          )}
          <a href={googleDirections(place.address, place.name)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Navigation aria-hidden className="h-4 w-4" /> Directions<span className="sr-only"> to {place.name} in Google Maps (opens in new tab)</span>
          </a>
          <FavoriteButton k={`place:${place.id}`} name={place.name} />
          <ShareButton title={place.name} path={`/places/${place.id}`} compact />
        </div>
        <p className="mt-3 text-xs text-charcoal-400">
          <a className="underline" href={appleDirections(place.address, place.name)} target="_blank" rel="noopener noreferrer">Open in Apple Maps</a>
          {" · "}
          <Link className="underline" href={`/suggest-update?listing=${encodeURIComponent(place.id)}`}>Suggest an update</Link>
        </p>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-charcoal-400">
          <Info aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {place.verification.lastVerified ? `Details last checked ${formatDate(place.verification.lastVerified + "T12:00:00Z")}. ` : ""}
            {place.hours ? "" : "Hours vary — check before you go. "}
            {place.coordsApproximate ? "Map pin position is approximate; directions use the street address." : ""}
          </span>
        </p>
      </div>
    </article>
  );
}
