-- =====================================================================
-- Welcome to Chattanooga — Supabase schema
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- Public visitors can only READ published content and INSERT pending
-- submissions. All edits require a signed-in user listed in admin_users.
-- =====================================================================
create extension if not exists pgcrypto;
create schema if not exists private;  -- not exposed through the Data API

-- ---------- Administrative users ----------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'editor' check (role in ('owner','editor')),
  created_at timestamptz not null default now()
);

-- Security definer so policies can consult admin_users without recursion; lives in the private schema.
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- ---------- Shared updated_at trigger ----------
create or replace function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.updated_by := (select auth.uid());
  return new;
end $$;

-- ---------- Business categories ----------
create table if not exists public.categories (
  key   text primary key,
  label text not null,
  color text not null,
  glyph text not null,
  sort  int  not null default 0
);

-- ---------- Media assets ----------
create table if not exists public.media_assets (
  id                     uuid primary key default gen_random_uuid(),
  url                    text not null,
  alt                    text not null,
  credit                 text,
  license                text,
  usage_rights_confirmed boolean not null default false,
  created_at             timestamptz not null default now(),
  created_by             uuid references auth.users(id)
);

-- ---------- Neighborhoods (structured content stored as JSON) ----------
create table if not exists public.neighborhoods (
  slug       text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ---------- Businesses & points of interest ----------
create table if not exists public.places (
  id                  text primary key,
  name                text not null,
  categories          text[] not null default '{}',     -- multiple categories supported
  neighborhoods       text[] not null default '{}',     -- multiple areas supported
  description         text not null default '',
  address             text not null,
  lat                 double precision not null check (lat between 34.8 and 35.4),
  lng                 double precision not null check (lng between -85.6 and -84.9),
  coords_approximate  boolean not null default false,
  website             text check (website is null or website ~ '^https://'),
  phone               text,
  hours               text,
  image               jsonb,                            -- {src, alt, credit}
  image_asset_id      uuid references public.media_assets(id) on delete set null,
  featured            boolean not null default false,
  sponsor             boolean not null default false,
  family              jsonb,                            -- {ages[], setting, cost, duration, rainy}
  verification_status text not null default 'needs_review' check (verification_status in ('verified','needs_review')),
  last_verified       date,
  sources             text[] not null default '{}',
  verification_notes  text,
  active              boolean not null default true,    -- hide closed businesses without deleting
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  updated_by          uuid references auth.users(id)
);
create index if not exists places_neighborhoods_idx on public.places using gin (neighborhoods);
create index if not exists places_categories_idx on public.places using gin (categories);

-- ---------- Outdoor trails & activities ----------
create table if not exists public.trails (
  id         text primary key,
  data       jsonb not null,
  active     boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ---------- Events (times stored as timestamptz; displayed in America/New_York) ----------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  venue       text not null,
  address     text not null,
  lat         double precision,
  lng         double precision,
  description text not null,
  category    text not null check (category in ('live-music','festivals','food-drink','family','arts-culture','sports','markets','community','seasonal')),
  url         text not null check (url ~ '^https?://'),
  source_url  text not null check (source_url ~ '^https?://'),
  is_free     boolean,
  status      text not null default 'draft' check (status in ('draft','published','archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id),
  check (ends_at is null or ends_at >= starts_at)
);
create index if not exists events_starts_idx on public.events (starts_at);

-- ---------- Visitor submissions (corrections & events) ----------
create table if not exists public.submissions (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null check (kind in ('event','correction')),
  listing_id     text,
  payload        jsonb not null,
  contact_name   text,
  contact_email  text,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewer_notes text,
  created_at     timestamptz not null default now(),
  reviewed_at    timestamptz,
  reviewed_by    uuid references auth.users(id)
);

-- ---------- Content update / verification audit log ----------
create table if not exists public.content_updates (
  id         bigserial primary key,
  table_name text not null,
  record_id  text not null,
  action     text not null,
  changed_by uuid,
  changed_at timestamptz not null default now(),
  old_row    jsonb,
  new_row    jsonb
);

create or replace function private.log_content_update() returns trigger
language plpgsql security definer set search_path = '' as $$
declare rid text;
begin
  rid := coalesce((to_jsonb(new)->>'id'), (to_jsonb(new)->>'slug'), (to_jsonb(old)->>'id'), (to_jsonb(old)->>'slug'));
  insert into public.content_updates (table_name, record_id, action, changed_by, old_row, new_row)
  values (tg_table_name, rid, tg_op, (select auth.uid()),
          case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
          case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end);
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['places','events','trails','neighborhoods'] loop
    execute format('drop trigger if exists %1$s_touch on public.%1$s', t);
    execute format('create trigger %1$s_touch before update on public.%1$s for each row execute function private.touch_updated_at()', t);
    execute format('drop trigger if exists %1$s_audit on public.%1$s', t);
    execute format('create trigger %1$s_audit after insert or update or delete on public.%1$s for each row execute function private.log_content_update()', t);
  end loop;
end $$;

-- ---------- Archive past events (optional nightly job via pg_cron) ----------
create or replace function private.archive_past_events() returns void
language sql security definer set search_path = '' as $$
  update public.events set status = 'archived'
  where status = 'published' and coalesce(ends_at, starts_at) < now() - interval '1 day';
$$;
revoke all on function private.archive_past_events() from public;
revoke all on function private.log_content_update() from public;
-- select cron.schedule('archive-past-events', '15 5 * * *', 'select private.archive_past_events()');

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admin_users     enable row level security;
alter table public.categories      enable row level security;
alter table public.media_assets    enable row level security;
alter table public.neighborhoods   enable row level security;
alter table public.places          enable row level security;
alter table public.trails          enable row level security;
alter table public.events          enable row level security;
alter table public.submissions     enable row level security;
alter table public.content_updates enable row level security;

-- Public read
create policy "public read categories"    on public.categories    for select to anon, authenticated using (true);
create policy "public read neighborhoods" on public.neighborhoods for select to anon, authenticated using (true);
create policy "public read places"        on public.places        for select to anon, authenticated using (active or (select private.is_admin()));
create policy "public read trails"        on public.trails        for select to anon, authenticated using (active or (select private.is_admin()));
create policy "public read events"        on public.events        for select to anon, authenticated using (status = 'published' or (select private.is_admin()));
create policy "public read media"         on public.media_assets  for select to anon, authenticated using (true);

-- Admin write
create policy "admin write categories"    on public.categories    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin write neighborhoods" on public.neighborhoods for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin write places"        on public.places        for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin write trails"        on public.trails        for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin write events"        on public.events        for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin write media"         on public.media_assets  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Submissions: anyone may submit (pending only); only admins can read/review
create policy "anyone submit"   on public.submissions for insert to anon, authenticated with check (status = 'pending' and reviewed_by is null and reviewed_at is null and reviewer_notes is null);
create policy "admin read subs" on public.submissions for select to authenticated using ((select private.is_admin()));
create policy "admin review"    on public.submissions for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete"    on public.submissions for delete to authenticated using ((select private.is_admin()));

-- Audit log & admin list: admins only
create policy "admin read log"    on public.content_updates for select to authenticated using ((select private.is_admin()));
create policy "admin read admins" on public.admin_users     for select to authenticated using (user_id = (select auth.uid()) or (select private.is_admin()));

-- =====================================================================
-- Data API grants (RLS above still decides which rows each role can touch)
-- =====================================================================
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.neighborhoods, public.places, public.trails, public.events, public.media_assets to anon, authenticated;
grant insert on public.submissions to anon, authenticated;
grant insert, update, delete on public.categories, public.neighborhoods, public.places, public.trails, public.events, public.media_assets to authenticated;
grant select, update, delete on public.submissions to authenticated;
grant select on public.content_updates, public.admin_users to authenticated;

-- =====================================================================
-- Storage bucket for listing photos (public read, admin upload)
-- =====================================================================
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
-- Public bucket: files are served by public URL, so no anon SELECT policy is needed (that would also allow listing).
create policy "admin read media files"  on storage.objects for select to authenticated using (bucket_id = 'media' and (select private.is_admin()));
create policy "admin upload media"      on storage.objects for insert to authenticated with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admin update media"      on storage.objects for update to authenticated using (bucket_id = 'media' and (select private.is_admin())) with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admin delete media"      on storage.objects for delete to authenticated using (bucket_id = 'media' and (select private.is_admin()));

-- =====================================================================
-- After creating your first user in Authentication → Users, make them an owner:
--   insert into public.admin_users (user_id, email, role)
--   select id, email, 'owner' from auth.users where email = 'eric@localsonlycha.com';
-- =====================================================================

-- =====================================================================
-- Applied as migration "tighten_grants_and_tune_policies" (Nov 15, 2026):
-- least-privilege grants + one SELECT policy per table + FK indexes.
-- =====================================================================
revoke all on public.admin_users, public.categories, public.media_assets, public.neighborhoods, public.places, public.trails, public.events, public.submissions, public.content_updates from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
grant select on public.categories, public.neighborhoods, public.places, public.trails, public.events, public.media_assets to anon, authenticated;
grant insert on public.submissions to anon, authenticated;
grant insert, update, delete on public.categories, public.neighborhoods, public.places, public.trails, public.events, public.media_assets to authenticated;
grant select, update, delete on public.submissions to authenticated;
grant select on public.content_updates, public.admin_users to authenticated;

do $$
declare t text;
begin
  foreach t in array array['categories','neighborhoods','places','trails','events','media_assets'] loop
    execute format('drop policy if exists "admin write %s" on public.%I', case when t='media_assets' then 'media' else t end, t);
    execute format('create policy "admin insert %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "admin update %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "admin delete %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end $$;

create index if not exists events_updated_by_idx        on public.events (updated_by);
create index if not exists media_assets_created_by_idx  on public.media_assets (created_by);
create index if not exists neighborhoods_updated_by_idx on public.neighborhoods (updated_by);
create index if not exists places_image_asset_id_idx    on public.places (image_asset_id);
create index if not exists places_updated_by_idx        on public.places (updated_by);
create index if not exists submissions_reviewed_by_idx  on public.submissions (reviewed_by);
create index if not exists trails_updated_by_idx        on public.trails (updated_by);

-- Setting (indoor / outdoor / both) and rough price per person, for any listing.
alter table public.places add column if not exists setting text check (setting in ('indoor','outdoor','both'));
alter table public.places add column if not exists price text check (price in ('$','$$','$$$'));
