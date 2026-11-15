import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { reviewSubmission } from "../actions";

export default async function AdminSubmissions({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "pending" } = await searchParams;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("submissions").select("*").eq("status", status).order("created_at", { ascending: false }).limit(100);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Visitor submissions</h1>
      <nav className="mt-3 flex gap-2">{["pending", "approved", "rejected"].map((s) => <Link key={s} href={`/admin/submissions?status=${s}`} className={s === status ? "chip-on" : "chip-off"}>{s}</Link>)}</nav>
      <ul className="mt-6 space-y-4">
        {data?.length ? data.map((s) => (
          <li key={s.id} className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">{s.kind === "event" ? "Event submission" : "Listing correction"} · {formatDate(s.created_at, { dateStyle: "medium", timeStyle: "short" })}</p>
            {s.listing_id && <p className="mt-1 text-sm">Listing: <Link className="underline" href={`/admin/places/${s.listing_id}`}>{s.listing_id}</Link></p>}
            <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-[160px_1fr]">
              {Object.entries(s.payload ?? {}).filter(([k]) => k !== "listing_id").map(([k, v]) => (<><dt key={`${k}-k`} className="font-semibold capitalize text-charcoal-600">{k.replace(/_/g, " ")}</dt><dd key={`${k}-v`} className="break-words">{String(v)}</dd></>))}
              {(s.contact_name || s.contact_email) && <><dt className="font-semibold text-charcoal-600">Contact</dt><dd>{s.contact_name} {s.contact_email && <a className="underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a>}</dd></>}
            </dl>
            {status === "pending" && (
              <form action={reviewSubmission} className="mt-4 flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={s.id} />
                <label className="min-w-[240px] flex-1"><span className="label">Notes (optional)</span><input name="notes" className="input" /></label>
                {s.kind === "event" && <button name="decision" value="draft-event" className="btn-primary">Create draft event</button>}
                <button name="decision" value="approve" className="btn-ghost">Mark handled</button>
                <button name="decision" value="reject" className="btn-ghost">Reject</button>
              </form>
            )}
          </li>
        )) : <li className="card p-6 text-charcoal-600">Nothing here.</li>}
      </ul>
    </div>
  );
}
