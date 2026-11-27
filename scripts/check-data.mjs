// Validates the seed data. Add --links to also check that every website/source URL responds.
import { readFileSync } from "node:fs";
const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const places = load("places.json"), hoods = load("neighborhoods.json"), trails = load("trails.json"), events = load("events.json");
const CATS = ["restaurants", "coffee", "shopping", "attractions", "parks", "arts", "nightlife", "sports"];
const slugs = new Set(hoods.map((h) => h.slug));
const errs = [], warns = [];
const ids = new Set();
for (const p of places) {
  if (ids.has(p.id)) errs.push(`duplicate id ${p.id}`); ids.add(p.id);
  for (const k of ["name", "description", "address"]) if (!p[k]) errs.push(`${p.id}: missing ${k}`);
  if (!(p.lat > 34.8 && p.lat < 35.4 && p.lng > -85.6 && p.lng < -84.9)) errs.push(`${p.id}: coordinates outside the Chattanooga area`);
  p.categories.forEach((c) => CATS.includes(c) || errs.push(`${p.id}: bad category ${c}`));
  if (p.setting && !["indoor", "outdoor", "both"].includes(p.setting)) errs.push(`${p.id}: bad setting ${p.setting}`);
  if (p.family && !["indoor", "outdoor", "both"].includes(p.family.setting)) errs.push(`${p.id}: bad family setting ${p.family.setting}`);
  if (p.price && !["$", "$$", "$$$"].includes(p.price)) errs.push(`${p.id}: bad price ${p.price}`);
  p.neighborhoods.forEach((n) => slugs.has(n) || errs.push(`${p.id}: unknown neighborhood ${n}`));
  if (p.website && !p.website.startsWith("https://")) errs.push(`${p.id}: website must be https`);
  if (p.verification?.status !== "verified") warns.push(`${p.id}: needs review — ${p.verification?.notes ?? "no notes"}`);
}
for (const h of hoods) h.featured.forEach((f) => ids.has(f) || errs.push(`${h.slug}: featured place ${f} not found`));
for (const h of hoods) h.walkingRoute?.stops.forEach((f) => ids.has(f) || errs.push(`${h.slug}: route stop ${f} not found`));
for (const t of trails) if (t.verification?.status !== "verified") warns.push(`trail ${t.id}: needs review — ${t.verification?.notes ?? ""}`);
if (events.length) for (const e of events) if (!e.sourceUrl) errs.push(`event ${e.id}: missing sourceUrl`);

console.log(`${places.length} places · ${hoods.length} neighborhoods · ${trails.length} trails · ${events.length} events`);
for (const h of hoods) console.log(`  ${h.name}: ${places.filter((p) => p.neighborhoods.includes(h.slug)).length} places`);
if (warns.length) console.log(`\n${warns.length} listing(s) flagged for review:\n  ` + warns.join("\n  "));

if (process.argv.includes("--links")) {
  const urls = new Set([...places.flatMap((p) => [p.website, ...(p.verification?.sources ?? [])]), ...trails.flatMap((t) => [t.website, ...(t.verification?.sources ?? [])])].filter(Boolean));
  console.log(`\nChecking ${urls.size} links…`);
  for (const u of urls) {
    try {
      const r = await fetch(u, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 link-check" }, signal: AbortSignal.timeout(15000) });
      if (!r.ok) errs.push(`link ${r.status}: ${u}`);
    } catch (e) { errs.push(`link failed: ${u} (${e.cause?.code ?? e.message})`); }
  }
}
if (errs.length) { console.error(`\n${errs.length} error(s):\n  ` + errs.join("\n  ")); process.exit(1); }
console.log("\n✓ Data checks passed");
