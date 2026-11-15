// Upserts the verified seed data in /data into Supabase.
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:supabase
// The service role key bypasses RLS — run this only from your own machine, never in the browser.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));

const categories = [
  ["restaurants", "Restaurants", "#B3532F", "R"], ["coffee", "Coffee & Bakeries", "#7A4E2D", "C"], ["shopping", "Shopping", "#8E3B6E", "S"],
  ["attractions", "Attractions", "#1F5F8B", "A"], ["parks", "Parks & Outdoor Spaces", "#2E6B3A", "P"], ["arts", "Arts & Culture", "#5B3F8C", "Ar"],
  ["nightlife", "Entertainment & Nightlife", "#293330", "N"],
].map(([key, label, color, glyph], sort) => ({ key, label, color, glyph, sort }));

const places = load("places.json").map((p) => ({
  id: p.id, name: p.name, categories: p.categories, neighborhoods: p.neighborhoods, description: p.description, address: p.address,
  lat: p.lat, lng: p.lng, coords_approximate: !!p.coordsApproximate, website: p.website ?? null, phone: p.phone ?? null, hours: p.hours ?? null,
  image: p.image ?? null, featured: !!p.featured, sponsor: !!p.sponsor, family: p.family ?? null,
  verification_status: p.verification.status, last_verified: p.verification.lastVerified || null, sources: p.verification.sources ?? [],
  verification_notes: p.verification.notes ?? null, active: p.active !== false,
}));
const neighborhoods = load("neighborhoods.json").map((n) => ({ slug: n.slug, data: n }));
const trails = load("trails.json").map((t) => ({ id: t.id, data: t, active: t.active !== false }));

for (const [table, rows, onConflict] of [["categories", categories, "key"], ["places", places, "id"], ["neighborhoods", neighborhoods, "slug"], ["trails", trails, "id"]]) {
  const { error } = await sb.from(table).upsert(rows, { onConflict });
  if (error) { console.error(table, error.message); process.exit(1); }
  console.log(`✓ ${table}: ${rows.length}`);
}
console.log("Done. Events start empty — add verified events in /admin/events.");
