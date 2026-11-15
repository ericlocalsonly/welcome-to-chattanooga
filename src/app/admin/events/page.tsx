import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminEvents({ searchParams }: { searchParams: Promise<{ past?: string }> }) {
  const { past } = await searchParams;
  const { sb } = await requireAdmin();
  const now = new Date().toISOString();
  let q = sb.from("events").select("id,name,starts_at,venue,status").order("starts_at", { ascending: !past });
  q = past ? q.lt("starts_at", now) : q.gte("starts_at", now);
  const { data } = await q;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Events</h1>
        <div className="flex gap-2"><Link className="btn-ghost" href={past ? "/admin/events" : "/admin/events?past=1"}>{past ? "Upcoming" : "Past / archived"}</Link><Link className="btn-primary" href="/admin/events/new">Add event</Link></div>
      </div>
      <p className="mt-2 text-sm text-charcoal-600">Only <strong>published</strong> events appear publicly, and they disappear automatically after they end.</p>
      <ul className="mt-4 space-y-2">
        {data?.length ? data.map((e) => (
          <li key={e.id} className="card flex flex-wrap items-center justify-between gap-2 p-4">
            <div><Link className="font-semibold text-forest underline" href={`/admin/events/${e.id}`}>{e.name}</Link><p className="text-sm text-charcoal-400">{formatDate(e.starts_at, { dateStyle: "medium", timeStyle: "short" })} · {e.venue}</p></div>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold capitalize">{e.status}</span>
          </li>
        )) : <li className="card p-6 text-charcoal-600">No events here yet.</li>}
      </ul>
    </div>
  );
}
