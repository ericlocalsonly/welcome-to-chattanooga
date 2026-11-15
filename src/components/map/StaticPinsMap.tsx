"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Place } from "@/lib/types";
import type { ExtraMarker } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center rounded-3xl bg-cream-200 text-sm text-charcoal-400">Loading map…</div>,
});

/** A simple map for a handful of pins (place pages, bridge, Riverwalk). */
export function StaticPinsMap({
  places = [], markers, center, zoom, route, routeLabel, label, onSelect,
}: {
  places?: Place[];
  markers?: ExtraMarker[];
  center: [number, number];
  zoom: number;
  route?: [number, number][];
  routeLabel?: string;
  label: string;
  onSelect?: (id: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <LeafletMap
      ariaLabel={label}
      center={center}
      zoom={zoom}
      places={places}
      extraMarkers={markers}
      selectedId={sel}
      onSelect={(id) => { setSel(id); onSelect?.(id); }}
      route={route ?? null}
      routeLabel={routeLabel}
    />
  );
}
