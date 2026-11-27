import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { rowToPlace } from "@/lib/data";
import { CATEGORIES, CATEGORY_KEYS, AGE_LABELS } from "@/lib/categories";
import type { AgeGroup, Place } from "@/lib/types";
import { PinPicker } from "@/components/admin/PinPicker";
import { ImageField } from "@/components/admin/ImageField";
import { savePlace, deletePlace } from "../../actions";

const HOODS = [["northshore", "Northshore"], ["downtown", "Downtown"], ["southside", "Southside"], ["lookout-mountain", "Lookout Mountain"]];

export default async function EditPlace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, role } = await requireAdmin();
  const isNew = id === "new";
  let p: Place | null = null;
  if (!isNew) {
    const { data } = await sb.from("places").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = rowToPlace(data);
  }
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-semibold">{isNew ? "Add a listing" : `Edit: ${p!.name}`}</h1>
      <form action={savePlace} className="mt-6 space-y-8">
        <input type="hidden" name="_new" value={isNew ? "1" : "0"} />
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <label><span className="label">ID (URL slug)</span><input name="id" required defaultValue={p?.id} readOnly={!isNew} pattern="[a-z0-9-]+" className="input" /></label>
          <label><span className="label">Name</span><input name="name" required defaultValue={p?.name} className="input" /></label>
          <label className="sm:col-span-2"><span className="label">Description</span><textarea name="description" rows={3} defaultValue={p?.description} className="input" /></label>
          <label className="sm:col-span-2"><span className="label">Street address</span><input name="address" required defaultValue={p?.address} className="input" /></label>
          <label><span className="label">Official website (https://)</span><input name="website" type="url" defaultValue={p?.website} className="input" /></label>
          <label><span className="label">Phone</span><input name="phone" defaultValue={p?.phone} className="input" /></label>
          <label><span className="label">Setting</span><select name="setting" defaultValue={p?.setting ?? ""} className="input"><option value="">Not specified</option><option value="indoor">Indoor</option><option value="outdoor">Outdoor</option><option value="both">Both (indoor &amp; outdoor)</option></select></label>
          <label><span className="label">Price (per person)</span><select name="price" defaultValue={p?.price ?? ""} className="input"><option value="">Not specified</option><option value="$">$ — under $20</option><option value="$$">$$ — $20–$40</option><option value="$$$">$$$ — $50–$100</option></select></label>
          <label className="sm:col-span-2"><span className="label">Hours (only if verified)</span><input name="hours" defaultValue={p?.hours} className="input" /></label>
          <fieldset className="sm:col-span-2"><legend className="label">Categories</legend>
            <div className="flex flex-wrap gap-3">{CATEGORY_KEYS.map((k) => <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name="categories" value={k} defaultChecked={p?.categories.includes(k)} className="h-5 w-5 accent-forest" />{CATEGORIES[k].label}</label>)}</div>
          </fieldset>
          <fieldset className="sm:col-span-2"><legend className="label">Neighborhoods</legend>
            <div className="flex flex-wrap gap-3">{HOODS.map(([k, l]) => <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name="neighborhoods" value={k} defaultChecked={p?.neighborhoods.includes(k)} className="h-5 w-5 accent-forest" />{l}</label>)}</div>
          </fieldset>
        </section>
        <section className="card space-y-4 p-6">
          <h2 className="text-xl font-semibold">Map pin</h2>
          <p className="text-sm text-charcoal-600">Click the map or drag the pin to the building's entrance.</p>
          <PinPicker lat={p?.lat ?? 35.0456} lng={p?.lng ?? -85.3097} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="coords_approximate" defaultChecked={p?.coordsApproximate ?? true} className="h-5 w-5 accent-forest" />Pin position is approximate</label>
        </section>
        <section className="card p-6"><ImageField src={p?.image?.src} alt={p?.image?.alt} credit={p?.image?.credit} /></section>
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-xl font-semibold sm:col-span-2">Family info (optional — shows in Things to Do With Kids)</h2>
          <fieldset className="sm:col-span-2"><legend className="label">Ages</legend>
            <div className="flex flex-wrap gap-3">{(Object.keys(AGE_LABELS) as AgeGroup[]).map((a) => <label key={a} className="flex items-center gap-2 text-sm"><input type="checkbox" name="family_ages" value={a} defaultChecked={p?.family?.ages.includes(a)} className="h-5 w-5 accent-forest" />{AGE_LABELS[a]}</label>)}</div>
          </fieldset>
          <p className="text-sm text-charcoal-600 sm:col-span-2">Indoor/outdoor for the kids filters comes from the Setting field at the top.</p>
          <label><span className="label">Cost</span><select name="family_cost" defaultValue={p?.family?.cost ?? "free"} className="input"><option value="free">Free</option><option value="$">$</option><option value="$$">$$</option><option value="$$$">$$$</option></select></label>
          <label><span className="label">Typical visit</span><input name="family_duration" defaultValue={p?.family?.duration} className="input" /></label>
          <label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" name="family_rainy" defaultChecked={p?.family?.rainy} className="h-5 w-5 accent-forest" />Good on rainy days</label>
        </section>
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-xl font-semibold sm:col-span-2">Verification</h2>
          <label><span className="label">Status</span><select name="verification_status" defaultValue={p?.verification.status ?? "needs_review"} className="input"><option value="verified">Verified</option><option value="needs_review">Needs review</option></select></label>
          <label><span className="label">Last verified</span><input type="date" name="last_verified" defaultValue={p?.verification.lastVerified || today} className="input" /></label>
          <label className="sm:col-span-2"><span className="label">Sources (one URL per line)</span><textarea name="sources" rows={3} defaultValue={p?.verification.sources.join("\n")} className="input" /></label>
          <label className="sm:col-span-2"><span className="label">Notes for editors</span><textarea name="verification_notes" rows={2} defaultValue={p?.verification.notes} className="input" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="h-5 w-5 accent-forest" />Show on the public site (uncheck to hide a closed business)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-5 w-5 accent-forest" />Featured</label>
        </section>
        <div className="flex flex-wrap gap-3"><button className="btn-primary">Save listing</button></div>
      </form>
      {!isNew && role === "owner" && (
        <form action={deletePlace} className="mt-10 border-t border-charcoal/10 pt-6">
          <input type="hidden" name="id" value={p!.id} />
          <p className="text-sm text-charcoal-600">Prefer hiding over deleting so the history is kept.</p>
          <button className="mt-2 text-sm font-semibold text-terracotta-700 underline">Permanently delete this listing</button>
        </form>
      )}
    </div>
  );
}
