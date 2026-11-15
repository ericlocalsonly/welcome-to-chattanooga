import type { CategoryKey } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

export function MapLegend({ keys }: { keys: CategoryKey[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Map legend</p>
      <ul className="space-y-1.5 text-sm">
        {keys.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: CATEGORIES[k].color }}>{CATEGORIES[k].glyph}</span>
            {CATEGORIES[k].label}
          </li>
        ))}
        <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-6 border-t-2 border-dashed border-forest" />Approximate exploration area</li>
      </ul>
    </div>
  );
}
