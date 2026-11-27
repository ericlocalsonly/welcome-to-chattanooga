"use client";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polygon, Polyline, Tooltip, useMap } from "react-leaflet";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

export interface ExtraMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  glyph: string;
}

export interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  boundary?: [number, number][];
  boundaryLabel?: string;
  places: Place[];
  extraMarkers?: ExtraMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  route?: [number, number][] | null;
  routeLabel?: string;
  userLocation?: [number, number] | null;
  ariaLabel: string;
}

function pinIcon(color: string, glyph: string, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="wtc-pin${selected ? " is-selected" : ""}" style="background:${color}"><span>${glyph}</span></div>`,
    iconSize: selected ? [38, 38] : [30, 30],
    iconAnchor: selected ? [19, 38] : [15, 30],
  });
}
const meIcon = L.divIcon({ className: "", html: '<div class="wtc-me"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

/** On load, frame the neighborhood outline plus every pin, so nothing is cut off on any screen size. */
function FitBoundary({ boundary, points }: { boundary?: [number, number][]; points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!boundary || boundary.length < 3) return;
    map.fitBounds(L.latLngBounds([...boundary, ...points]), { padding: [24, 24] });
    // Only on first render for this outline — filtering pins later shouldn't move the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundary, map]);
  return null;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 16), { duration: 0.6 });
  }, [target, map]);
  return null;
}

export default function LeafletMap(p: LeafletMapProps) {
  const sel = p.places.find((x) => x.id === p.selectedId) ?? p.extraMarkers?.find((x) => x.id === p.selectedId);
  const target = useMemo<[number, number] | null>(() => (sel ? [sel.lat, sel.lng] : null), [sel]);
  return (
    <MapContainer
      center={p.center}
      zoom={p.zoom}
      scrollWheelZoom={false}
      zoomSnap={0.25}
      className="h-full w-full rounded-3xl"
      attributionControl
      aria-label={p.ariaLabel}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {p.boundary && (
        <Polygon positions={p.boundary} pathOptions={{ color: "#1E7B6E", weight: 2, dashArray: "6 6", fillColor: "#477D8C", fillOpacity: 0.08 }}>
          {p.boundaryLabel && <Tooltip sticky>{p.boundaryLabel}</Tooltip>}
        </Polygon>
      )}
      {p.route && (
        <Polyline positions={p.route} pathOptions={{ color: "#C77B58", weight: 5, opacity: 0.9, dashArray: "2 10", lineCap: "round" }}>
          {p.routeLabel && <Tooltip sticky>{p.routeLabel} (approximate)</Tooltip>}
        </Polyline>
      )}
      {p.places.map((pl) => {
        const c = CATEGORIES[pl.categories[0]];
        const selected = pl.id === p.selectedId;
        return (
          <Marker
            key={pl.id}
            position={[pl.lat, pl.lng]}
            icon={pinIcon(c.color, c.glyph, selected)}
            title={pl.name}
            alt={`${pl.name} — ${c.label}`}
            keyboard
            zIndexOffset={selected ? 1000 : 0}
            eventHandlers={{ click: () => p.onSelect?.(pl.id) }}
          />
        );
      })}
      {p.extraMarkers?.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon(m.color, m.glyph, m.id === p.selectedId)} title={m.name} alt={m.name} keyboard eventHandlers={{ click: () => p.onSelect?.(m.id) }} />
      ))}
      {p.userLocation && <Marker position={p.userLocation} icon={meIcon} title="Your location" alt="Your location" keyboard={false} />}
      <FitBoundary boundary={p.boundary} points={p.places.map((x) => [x.lat, x.lng] as [number, number])} />
      <FlyTo target={target} />
    </MapContainer>
  );
}
