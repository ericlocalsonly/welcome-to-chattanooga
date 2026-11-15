"use client";
import { Heart } from "lucide-react";
import { useFavorites, type FavKey } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({ k, name, compact = false, className }: { k: FavKey; name: string; compact?: boolean; className?: string }) {
  const { has, toggle } = useFavorites();
  const on = has(k);
  return (
    <button
      type="button"
      onClick={() => toggle(k)}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
      className={cn(
        compact ? "flex h-11 w-11 items-center justify-center rounded-full" : "btn",
        on ? "bg-terracotta text-white hover:bg-terracotta-700" : "bg-white text-forest ring-1 ring-forest/20 hover:bg-forest-50",
        className,
      )}
    >
      <Heart aria-hidden className={cn("h-4 w-4", on && "fill-current")} />
      {!compact && <span>{on ? "Saved" : "Save"}</span>}
    </button>
  );
}
