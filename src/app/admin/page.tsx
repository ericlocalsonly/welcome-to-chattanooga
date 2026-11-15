import Link from "next/link";
import { supabaseConfigured } from "@/lib/supabase/config";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "./actions";

export default async function AdminHome() {
  if (!supabaseConfigured) return <Setup />;
  const { sb, user, role } = await requireAdmin();
  const now = new Date().toISOString();
  const [places, review, hidden, pending, upcoming] = await Promise.all([
    sb.from("places").select("id", { count: "exact", head: true }),
    sb.from("places").select("id", { count: "exact", head: true }).eq("verification_status", "needs_review"),
    sb.from("places").select("id", { count: "exact", head: true }).eq("active", false),
    sb.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("events").select("id", { count: "exact", head: true }).eq("status", "published").gte("starts_at", now),
  ]);
  const tiles = [
    ["Listings", places.count, "/admin/places"],
    ["Need verification", review.count, "/admin/places?status=needs_review"],
    ["Hidden (closed)", hidden.count, "/admin/places?status=hidden"],
    ["Pending submissions", pending.count, "/admin/submissions"],
    ["Upcoming events", upcoming.count, "/admin/events"],
  ] as const;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <form action={signOut}><span className="mr-3 text-sm text-charcoal-400">{user.email} · {role}</span><button className="btn-ghost !min-h-[36px]">Sign out</button></form>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map(([l, n, h]) => (
          <li key={l}><Link href={h} className="card block p-5 hover:shadow-lg"><p className="text-sm text-charcoal-400">{l}</p><p className="font-serif text-4xl text-forest">{n ?? 0}</p></Link></li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn-primary" href="/admin/places/new">Add a listing</Link>
        <Link className="btn-ghost" href="/admin/events/new">Add an event</Link>
      </div>
    </div>
  );
}

function Setup() {
  return (
    <div className="card prose-guide max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-semibold">Connect the admin dashboard</h1>
      <p>The public guide is running from the verified seed files in <code>/data</code>. To edit content from this dashboard, connect a Supabase project:</p>
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-charcoal-600">
        <li>Create a free project at supabase.com.</li>
        <li>In the SQL editor, run <code>supabase/schema.sql</code> from this repository.</li>
        <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your hosting environment variables.</li>
        <li>From your computer, run <code>npm run seed:supabase</code> with <code>SUPABASE_SERVICE_ROLE_KEY</code> set to load the listings.</li>
        <li>Create your user under Authentication → Users, then add it to <code>admin_users</code> (the SQL is at the bottom of schema.sql).</li>
      </ol>
      <p>Full instructions are in the README.</p>
    </div>
  );
}
