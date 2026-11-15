"use client";
import { useMemo, useState } from "react";
import type { Trail, TrailCategory } from "@/lib/types";
import { TRAIL_CATEGORIES } from "@/lib/categories";
import { TrailCard } from "./TrailCard";

const DISTANCES = [
  { key: "any", label: "Any distance", test: () => true },
  { key: "short", label: "Under 3 mi", test: (t: Trail) => t.distanceMiles != null && t.distanceMiles < 3 },
  { key: "mid", label: "3–7 mi", test: (t: Trail) => t.distanceMiles != null && t.distanceMiles >= 3 && t.distanceMiles <= 7 },
  { key: "long", label: "Over 7 mi", test: (t: Trail) => t.distanceMiles != null && t.distanceMiles > 7 },
];

export function OutdoorGuide({ trails }: { trails: Trail[] }) {
  const [cat, setCat] = useState<TrailCategory | "all">("all");
  const [diff, setDiff] = useState<"all" | Trail["difficulty"]>("all");
  const [dist, setDist] = useState("any");
  const [family, setFamily] = useState(false);
  const list = useMemo(
    () => trails.filter((t) => (cat === "all" || t.categories.includes(cat)) && (diff === "all" || t.difficulty === diff) && DISTANCES.find((d) => d.key === dist)!.test(t) && (!family || t.family)),
    [trails, cat, diff, dist, family],
  );
  return (
    <div>
      <div className="card grid gap-4 p-5 md:grid-cols-4">
        <label><span className="label">Activity</span>
          <select className="input" value={cat} onChange={(e) => setCat(e.target.value as any)}>
            <option value="all">All activities</option>
            {(Object.keys(TRAIL_CATEGORIES) as TrailCategory[]).map((k) => <option key={k} value={k}>{TRAIL_CATEGORIES[k]}</option>)}
          </select>
        </label>
        <label><span className="label">Difficulty</span>
          <select className="input" value={diff} onChange={(e) => setDiff(e.target.value as any)}>
            <option value="all">Any difficulty</option><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="challenging">Challenging</option>
          </select>
        </label>
        <label><span className="label">Distance</span>
          <select className="input" value={dist} onChange={(e) => setDist(e.target.value)}>
            {DISTANCES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </label>
        <label className="flex items-end gap-3 pb-2"><input type="checkbox" className="h-6 w-6 accent-forest" checked={family} onChange={(e) => setFamily(e.target.checked)} /><span className="font-semibold">Family-friendly only</span></label>
      </div>
      <p className="mt-3 text-sm text-charcoal-400" aria-live="polite">{list.length} of {trails.length} shown</p>
      {list.length === 0 ? <p className="card mt-4 p-6">No trails match. Try loosening a filter.</p> : (
        <div className="mt-4 grid gap-5 md:grid-cols-2">{list.map((t) => <TrailCard key={t.id} t={t} />)}</div>
      )}
    </div>
  );
}
