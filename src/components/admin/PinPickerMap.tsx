"use client";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const icon = L.divIcon({ className: "", html: '<div class="wtc-pin is-selected" style="background:#C77B58"><span>●</span></div>', iconSize: [38, 38], iconAnchor: [19, 38] });

function ClickToMove({ onChange }: { onChange: (p: [number, number]) => void }) {
  useMapEvents({ click: (e) => onChange([+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)]) });
  return null;
}

export default function PinPickerMap({ pos, onChange }: { pos: [number, number]; onChange: (p: [number, number]) => void }) {
  return (
    <MapContainer center={pos} zoom={16} className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} icon={icon} draggable eventHandlers={{ dragend: (e) => { const ll = (e.target as L.Marker).getLatLng(); onChange([+ll.lat.toFixed(6), +ll.lng.toFixed(6)]); } }} />
      <ClickToMove onChange={onChange} />
    </MapContainer>
  );
}
