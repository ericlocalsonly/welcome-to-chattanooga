# Architecture & plan

## 1. Application architecture
- **Next.js 15 App Router** (server components by default; client components only for maps, filters, favorites, weather, forms).
- **Data layer** (`src/lib/data.ts`): reads Supabase when configured, else bundled `/data/*.json`. Pages use ISR (`revalidate = 300`); admin saves call `revalidatePath` so changes appear immediately.
- **Maps**: Leaflet + react-leaflet, loaded client-side only. Custom accessible `divIcon` pins (keyboard-focusable, titled). Info card renders in a side panel (not a popup) for accessibility.
- **Weather**: `/api/weather` proxies api.weather.gov (points → forecast, KCHA latest observation, active alerts) with a contact User-Agent and 15-min fetch cache. The browser keeps the last good forecast in localStorage for outages.
- **Admin**: Supabase Auth (email/password). `middleware.ts` guards `/admin`; every write goes through Row Level Security (`is_admin()`), so no service-role key is ever used by the app.
- **Security**: no secrets in client code; anon key is public by design; RLS on all tables; submissions insert-only and always `pending`; storage uploads admin-only; security headers in `next.config.mjs`.

## 2. Pages & navigation
Main nav (desktop top bar, mobile fixed bottom bar): Home · Neighborhoods · Things to Do · Events · Weather. Header: Search, Favorites.

```
/                         Home
/neighborhoods            Neighborhood index
/neighborhoods/[slug]     northshore, downtown, westside, southside, st-elmo
/places/[id]              Shareable listing page
/things-to-do             Hub → kids, outdoors, riverwalk, bridge, events, shop-local; category browse
/kids                     Little Explorers. Big Adventures.
/outdoors                 Get Outside. It's Kind of Our Thing.
/outdoors/riverwalk       Tennessee Riverwalk
/walnut-street-bridge     The Bridge That Connects More Than Two Shores.
/events                   What's Happening in Chattanooga?
/weather                  The Scenic City Forecast.
/shop-local               Take a Little Chattanooga Home. (sponsor)
/search /favorites /suggest-update /about /privacy
/admin/*                  Dashboard, listings, events, trails, neighborhoods, submissions
```

## 3. Design system
Colors: Deep Forest `#244B40`, River Blue `#477D8C`, Warm Cream `#F7F4EC`, Terracotta `#C77B58`, Charcoal `#293330`, White. Type: Fraunces (editorial serif headings), Inter (body), self-hosted via Fontsource. Rounded 24px cards, soft shadows, 44px+ touch targets, terracotta focus rings, reduced-motion respected. Map pin colors are distinct per category and paired with letter glyphs so color is never the only cue.

## 4. Database (Supabase / Postgres)
`admin_users`, `categories`, `neighborhoods` (jsonb content), `places` (multi-category & multi-neighborhood arrays, coordinates, verification status/date/sources/notes, active flag), `trails` (jsonb), `events` (timestamptz; shown in America/New_York), `media_assets`, `submissions`, `content_updates` (automatic audit log via triggers). See `supabase/schema.sql`.

## 5. Implementation phases
- Phase 1 core ✅ · Phase 2 visitor experiences ✅ · Phase 3 live info ✅ (admin needs Supabase connected) · Phase 4 production readiness: SEO ✅, PWA ✅, responsive & automated a11y checks ✅, deployment docs ✅; remaining: finish data verification, link check from an open network, photo rights confirmation, full screen-reader audit.

## QA performed (Nov 15, 2026)
Production build passes type-check. Playwright tests at 390×844 and 1366×900: all routes return 200 (404 page works); 15 Northshore pins render; pin opens info card; favorites save and persist; category filter; walking route overlay; 7-day forecast, °C toggle, outage fallback; kids rainy-day filter; events empty state; search relevance; skip link first in tab order; admin setup screen. Fixed: map layering over the sticky header. Not testable in the sandbox: live NWS responses, OSM tiles, outbound link checks, Supabase admin flows against a real project.
