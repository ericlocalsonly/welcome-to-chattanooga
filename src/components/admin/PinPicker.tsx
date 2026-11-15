"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./PinPickerMap"), { ssr: false, loading: () => <div className="h-72 rounded-2xl bg-cream-200" /> });

/** Drag the pin (or type coordinates) to change a listing's map location. */
export function PinPicker({ lat, lng }: { lat: number; lng: number }) {
  const [pos, setPos] = useState<[number, number]>([lat, lng]);
  return (
    <div>
      <div className="h-72 overflow-hidden rounded-2xl"><Inner pos={pos} onChange={setPos} /></div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label><span className="label">Latitude</span><input name="lat" type="number" step="0.000001" required className="input" value={pos[0]} onChange={(e) => setPos([Number(e.target.value), pos[1]])} /></label>
        <label><span className="label">Longitude</span><input name="lng" type="number" step="0.000001" required className="input" value={pos[1]} onChange={(e) => setPos([pos[0], Number(e.target.value)])} /></label>
      </div>
    </div>
  );
}
