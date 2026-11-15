export type CategoryKey =
  | "restaurants"
  | "coffee"
  | "shopping"
  | "attractions"
  | "parks"
  | "arts"
  | "nightlife";

export type AgeGroup = "toddlers" | "5-8" | "9-12" | "teens" | "all";
export type Cost = "free" | "$" | "$$" | "$$$";
export type VerificationStatus = "verified" | "needs_review";

export interface Verification {
  status: VerificationStatus;
  lastVerified: string; // ISO date
  sources: string[];
  notes?: string;
}

export interface ImageRef {
  src: string;
  alt: string;
  credit?: string;
}

export interface FamilyInfo {
  ages: AgeGroup[];
  setting: "indoor" | "outdoor";
  cost: Cost;
  duration: string;
  rainy: boolean;
}

export interface Place {
  id: string;
  name: string;
  categories: CategoryKey[];
  neighborhoods: string[];
  description: string;
  address: string;
  lat: number;
  lng: number;
  coordsApproximate?: boolean;
  website?: string;
  phone?: string;
  hours?: string;
  image?: ImageRef;
  featured?: boolean;
  sponsor?: boolean;
  family?: FamilyInfo;
  verification: Verification;
  active: boolean;
}

export interface WalkingRoute {
  name: string;
  description: string;
  stops: string[];
  path: [number, number][];
}

export interface Neighborhood {
  slug: string;
  name: string;
  vibe: string;
  tagline: string;
  description: string;
  special: string;
  hero: ImageRef;
  center: [number, number];
  zoom: number;
  boundary: [number, number][];
  boundaryNote?: string;
  walkingRoute?: WalkingRoute;
  history?: { year: string; text: string }[];
  sources?: string[];
  featured: string[];
  order: number;
}

export type TrailActivity = "hiking" | "walking" | "biking" | "running" | "paddling";
export type TrailCategory = TrailActivity | "overlooks" | "parks";

export interface Trail {
  id: string;
  name: string;
  activities: TrailActivity[];
  categories: TrailCategory[];
  distanceMiles: number | null;
  distanceNote: string;
  difficulty: "easy" | "moderate" | "challenging";
  duration: string;
  surface: string;
  trailhead: { name: string; address: string; lat: number; lng: number };
  parking: string;
  family: boolean;
  familyNote?: string;
  description: string;
  website?: string;
  image?: ImageRef;
  warnings?: string;
  verification: Verification;
  coordsApproximate?: boolean;
  featured?: boolean;
  active?: boolean;
}

export type EventCategory =
  | "live-music"
  | "festivals"
  | "food-drink"
  | "family"
  | "arts-culture"
  | "sports"
  | "markets"
  | "community"
  | "seasonal";

export interface CityEvent {
  id: string;
  name: string;
  startsAt: string; // ISO with offset
  endsAt?: string;
  venue: string;
  address: string;
  lat?: number;
  lng?: number;
  description: string;
  category: EventCategory;
  url: string;
  sourceUrl: string;
  isFree?: boolean | null;
  status: "published" | "draft" | "archived";
}
