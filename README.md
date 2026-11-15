# Welcome to Chattanooga

**Explore the Scenic City Like a Local.** A mobile-first, installable (PWA) city guide to Chattanooga, Tennessee — proudly sponsored by [Locals Only Gifts and Goods](https://www.localsonlygiftsandgoods.com).

Built with Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS, Leaflet + OpenStreetMap, the National Weather Service API, and Supabase (Postgres, Auth, Storage).

## What works today

| Area | Status |
|---|---|
| Homepage, hero, 7 feature cards, weather widget, "This Week" preview | ✅ |
| 5 neighborhood pages with interactive maps (filters, search, pin info cards, Use My Location, directions, walking routes, legend, list alternative) | ✅ |
| 54 researched listings with sources + last-checked dates (22 still flagged for review — see `npm run check:data`) | ✅ / ⚠ |
| Things to Do With Kids (9 filters, family-day itinerary) | ✅ |
| Outdoor Chattanooga (12 trails, filters) and Tennessee Riverwalk page (access points only, no invented route) | ✅ |
| Walnut Street Bridge page (history, timeline, "Walk the Bridge" map) | ✅ |
| Events calendar (Today / Weekend / Week / Month / All, categories, auto-hides past events, visitor submissions) | ✅ — starts **empty**; no sample events are shown |
| 7-day NWS weather, alerts, °F/°C, "Great day for…", offline fallback to last forecast | ✅ (tested with mocked data; live NWS not reachable from the build sandbox) |
| Sponsor page, footer acknowledgment, no search boost for the sponsor | ✅ |
| Global search, favorites (on-device), share buttons | ✅ |
| PWA manifest + service worker, sitemap, robots, JSON-LD, Open Graph | ✅ |
| Admin dashboard: listings (edit, drag map pin, upload photo, hide/show, verification), events, trails & neighborhoods (JSON editor), submissions review, audit log | ✅ code complete — **needs a Supabase project to run** |

Without Supabase the public site runs from the verified seed files in `/data`; the admin shows setup steps.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional for local dev
npm run dev                  # http://localhost:3000
npm run check:data           # validate listings; add -- --links to test every URL
```

## Go live (what's needed)

1. **Hosting** — a [Vercel](https://vercel.com) account (free tier works). Import this GitHub repo; framework = Next.js.
2. **Supabase** — create a project at [supabase.com](https://supabase.com), then:
   - SQL editor → run `supabase/schema.sql`.
   - Copy the **Project URL** and **anon key** into Vercel env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - On your own computer: `NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npm run seed:supabase` (the service role key is **never** put in client code or committed).
   - Authentication → Users → add your user, then run the `insert into admin_users …` line at the bottom of `schema.sql`.
   - Optional: enable `pg_cron` and schedule `archive_past_events()` (commented in schema).
3. **Other env vars** — `NEXT_PUBLIC_SITE_URL` (your domain), `NWS_CONTACT_EMAIL` (sent to the Weather Service as required), `CONTACT_EMAIL` (fallback for submissions), optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for cookie-free analytics.
4. **Domain** — point your domain at Vercel.
5. **Before launch** — work through the review list from `npm run check:data`, run `npm run check:data -- --links`, and confirm photo usage rights.

## Notes & known limitations

- **Map tiles** use the public OpenStreetMap tile server, which is fine for modest traffic. For heavy traffic, switch the tile URL in `src/components/map/LeafletMap.tsx` to a provider (e.g. MapTiler, Stadia, Mapbox) and add its key.
- **Pin positions** for many listings are approximate (flagged in data and shown to visitors); Directions always use the street address. Admins can drag pins to exact positions.
- **Neighboring storefronts** (e.g. 26/26A/30 Frazier Ave) overlap at default zoom; zoom in or use the list. Marker clustering is a possible follow-up.
- **Events**: no licensed public event API for Chattanooga was identified, so this uses an admin-managed calendar (no scraping).
- **Trails & neighborhoods** are edited as structured JSON in admin — functional, but a form-based editor would be friendlier.
- **TypeScript is pinned to 5.x**: Next 15 cannot read path aliases with TypeScript 7.

See `docs/ARCHITECTURE.md` for architecture, page map, design system, data model, and QA results.
