import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { setPlaceActive } from "../actions";

export default async function AdminPlaces({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; saved?: string }> }) {
  const { status, q, saved } = await searchParams;
  const { sb } = await requireAdmin();
  let query = sb.from("places").select("id,name,neighborhoods,verification_status,last_verified,active").order("name");
  if (status === "needs_review") query = query.eq("verification_status", "needs_review");
  if (status === "hidden") query = query.eq("active", false);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data, error } = await query;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Listings</h1>
        <Link className="btn-primary" href="/admin/places/new">Add listing</Link>
      </div>
      {saved && <p role="status" className="mt-3 rounded-2xl bg-forest-50 p-3 text-sm">Saved <strong>{saved}</strong>. The public site updates within a few minutes.</p>}
      <form className="mt-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search by name" className="input max-w-xs" />
        <select name="status" defaultValue={status ?? ""} className="input max-w-[220px]"><option value="">All</option><option value="needs_review">Needs verification</option><option value="hidden">Hidden</option></select>
        <button className="btn-ghost">Filter</button>
      </form>
      {error && <p className="mt-4 text-terracotta-700">{error.message}</p>}
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 text-xs uppercase text-charcoal-400"><tr><th className="p-3">Name</th><th className="p-3">Area</th><th className="p-3">Verification</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p.id} className="border-b border-charcoal/5">
                <td className="p-3"><Link className="font-medium text-forest underline" href={`/admin/places/${p.id}`}>{p.name}</Link></td>
                <td className="p-3">{p.neighborhoods?.join(", ") || "—"}</td>
                <td className="p-3">{p.verification_status === "verified" ? "✓ Verified" : "⚠ Needs review"}<span className="block text-xs text-charcoal-400">{p.last_verified ?? ""}</span></td>
                <td className="p-3">{p.active ? "Live" : "Hidden"}</td>
                <td className="p-3">
                  <form action={setPlaceActive}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="active" value={String(!p.active)} /><button className="text-xs underline">{p.active ? "Hide" : "Show"}</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
