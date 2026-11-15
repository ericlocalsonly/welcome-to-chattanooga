import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { saveEvent, deleteEvent } from "../../actions";

/** ISO instant -> value for <input type="datetime-local"> in Chattanooga time. */
function toLocal(iso?: string | null) {
  if (!iso) return "";
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const isNew = id === "new";
  let e: any = null;
  if (!isNew) {
    const { data } = await sb.from("events").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    e = data;
  }
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">{isNew ? "Add an event" : `Edit: ${e.name}`}</h1>
      <form action={saveEvent} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        {!isNew && <input type="hidden" name="id" value={e.id} />}
        <label className="sm:col-span-2"><span className="label">Event name</span><input name="name" required defaultValue={e?.name} className="input" /></label>
        <label><span className="label">Starts (Chattanooga time)</span><input type="datetime-local" name="starts_at" required defaultValue={toLocal(e?.starts_at)} className="input" /></label>
        <label><span className="label">Ends (optional)</span><input type="datetime-local" name="ends_at" defaultValue={toLocal(e?.ends_at)} className="input" /></label>
        <label><span className="label">Venue</span><input name="venue" required defaultValue={e?.venue} className="input" /></label>
        <label><span className="label">Address</span><input name="address" required defaultValue={e?.address} className="input" /></label>
        <label><span className="label">Category</span><select name="category" required defaultValue={e?.category ?? ""} className="input"><option value="" disabled>Choose</option>{Object.entries(EVENT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label><span className="label">Free or paid</span><select name="is_free" defaultValue={e?.is_free == null ? "" : String(e.is_free)} className="input"><option value="">Not verified</option><option value="true">Free</option><option value="false">Paid</option></select></label>
        <label className="sm:col-span-2"><span className="label">Event website / tickets</span><input type="url" name="url" required defaultValue={e?.url} className="input" /></label>
        <label className="sm:col-span-2"><span className="label">Source used to verify (URL)</span><input type="url" name="source_url" required defaultValue={e?.source_url} className="input" /></label>
        <label className="sm:col-span-2"><span className="label">Description</span><textarea name="description" required rows={4} defaultValue={e?.description} className="input" /></label>
        <label><span className="label">Status</span><select name="status" defaultValue={e?.status ?? "draft"} className="input"><option value="draft">Draft (hidden)</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <div className="flex items-end"><button className="btn-primary">Save event</button></div>
      </form>
      {!isNew && <form action={deleteEvent} className="mt-6"><input type="hidden" name="id" value={e.id} /><button className="text-sm font-semibold text-terracotta-700 underline">Delete event</button></form>}
    </div>
  );
}
