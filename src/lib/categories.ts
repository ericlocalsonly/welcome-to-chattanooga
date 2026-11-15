import type { CategoryKey, EventCategory, TrailCategory, AgeGroup, Cost } from "./types";

/** Map pin categories. Colors chosen for contrast against OSM tiles and white text (WCAG AA for icon glyphs). */
export const CATEGORIES: Record<CategoryKey, { label: string; color: string; glyph: string }> = {
  restaurants: { label: "Restaurants", color: "#B3532F", glyph: "R" },
  coffee: { label: "Coffee & Bakeries", color: "#7A4E2D", glyph: "C" },
  shopping: { label: "Shopping", color: "#8E3B6E", glyph: "S" },
  attractions: { label: "Attractions", color: "#1F5F8B", glyph: "A" },
  parks: { label: "Parks & Outdoor Spaces", color: "#2E6B3A", glyph: "P" },
  arts: { label: "Arts & Culture", color: "#5B3F8C", glyph: "Ar" },
  nightlife: { label: "Entertainment & Nightlife", color: "#293330", glyph: "N" },
};
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  "live-music": "Live Music",
  festivals: "Festivals",
  "food-drink": "Food & Drink",
  family: "Family Events",
  "arts-culture": "Arts & Culture",
  sports: "Sports",
  markets: "Markets & Shopping",
  community: "Community Events",
  seasonal: "Seasonal Celebrations",
};

export const TRAIL_CATEGORIES: Record<TrailCategory, string> = {
  hiking: "Hiking",
  walking: "Walking",
  biking: "Biking",
  running: "Running",
  paddling: "Kayaking & Paddleboarding",
  overlooks: "Scenic Overlooks",
  parks: "Parks & Green Spaces",
};

export const AGE_LABELS: Record<AgeGroup, string> = {
  toddlers: "Toddlers",
  "5-8": "Ages 5–8",
  "9-12": "Ages 9–12",
  teens: "Teenagers",
  all: "All Ages",
};

export const COST_LABELS: Record<Cost, string> = {
  free: "Free",
  $: "$ · Budget",
  $$: "$$ · Moderate",
  $$$: "$$$ · Splurge",
};
