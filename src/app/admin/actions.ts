"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};
const bool = (f: FormData, k: string) => f.get(k) === "on";
const list = (f: FormData, k: string) => f.getAll(k).map(String).filter(Boolean);
const lines = (f: FormData, k: string) => (str(f, k) ?? "").split(/\n+/).map((s) => s.trim()).filter(Boolean);

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb?.auth.signOut();
  redirect("/admin/login");
}

export async function savePlace(fd: FormData) {
  const { sb } = await requireAdmin();
  const isNew = fd.get("_new") === "1";
  const id = (str(fd, "id") ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!id) throw new Error("ID is required");
  const website = str(fd, "website");
  if (website && !website.startsWith("https://")) throw new Error("Website must start with https://");
  const ages = list(fd, "family_ages");
  const row = {
    id,
    name: str(fd, "name"),
    categories: list(fd, "categories"),
    neighborhoods: list(fd, "neighborhoods"),
    description: str(fd, "description") ?? "",
    address: str(fd, "address"),
    lat: Number(fd.get("lat")),
    lng: Number(fd.get("lng")),
    coords_approximate: bool(fd, "coords_approximate"),
    website,
    phone: str(fd, "phone"),
    hours: str(fd, "hours"),
    image: str(fd, "image_src") ? { src: str(fd, "image_src"), alt: str(fd, "image_alt") ?? "", credit: str(fd, "image_credit") ?? undefined } : null,
    featured: bool(fd, "featured"),
    family: ages.length
      ? { ages, setting: str(fd, "family_setting") ?? "outdoor", cost: str(fd, "family_cost") ?? "free", duration: str(fd, "family_duration") ?? "", rainy: bool(fd, "family_rainy") }
      : null,
    verification_status: str(fd, "verification_status") ?? "needs_review",
    last_verified: str(fd, "last_verified"),
    sources: lines(fd, "sources"),
    verification_notes: str(fd, "verification_notes"),
    active: bool(fd, "active"),
  };
  if (!row.name || !row.address || Number.isNaN(row.lat) || Number.isNaN(row.lng)) throw new Error("Name, address, and coordinates are required");
  const { error } = isNew ? await sb.from("places").insert(row) : await sb.from("places").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect(`/admin/places?saved=${encodeURIComponent(id)}`);
}

export async function setPlaceActive(fd: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("places").update({ active: fd.get("active") === "true" }).eq("id", String(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePublic();
  revalidatePath("/admin/places");
}

export async function deletePlace(fd: FormData) {
  const { sb, role } = await requireAdmin();
  if (role !== "owner") throw new Error("Only owners can permanently delete. Hide the listing instead.");
  const { error } = await sb.from("places").delete().eq("id", String(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin/places");
}

/** datetime-local values are entered in Chattanooga time; convert to an ISO instant with the right offset. */
function easternToIso(local: string | null) {
  if (!local) return null;
  const [d, t] = local.split("T");
  const guess = new Date(`${d}T${t}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" }).formatToParts(guess);
  const off = parts.find((p) => p.type === "timeZoneName")?.value.replace("GMT", "") || "-5";
  const [h, m = "0"] = off.split(":");
  const sign = off.startsWith("-") ? "-" : "+";
  const hh = String(Math.abs(Number(h))).padStart(2, "0");
  return `${d}T${t}:00${sign}${hh}:${m.padStart(2, "0")}`;
}

export async function saveEvent(fd: FormData) {
  const { sb } = await requireAdmin();
  const id = str(fd, "id");
  const row = {
    name: str(fd, "name"),
    starts_at: easternToIso(str(fd, "starts_at")),
    ends_at: easternToIso(str(fd, "ends_at")),
    venue: str(fd, "venue"),
    address: str(fd, "address"),
    description: str(fd, "description"),
    category: str(fd, "category"),
    url: str(fd, "url"),
    source_url: str(fd, "source_url"),
    is_free: fd.get("is_free") === "" ? null : fd.get("is_free") === "true",
    status: str(fd, "status") ?? "draft",
  };
  const { error } = id ? await sb.from("events").update(row).eq("id", id) : await sb.from("events").insert(row);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin/events");
}

export async function deleteEvent(fd: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("events").delete().eq("id", String(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin/events");
}

export async function saveJsonRecord(fd: FormData) {
  const { sb } = await requireAdmin();
  const table = String(fd.get("table"));
  if (table !== "trails" && table !== "neighborhoods") throw new Error("Unsupported table");
  let data: any;
  try {
    data = JSON.parse(String(fd.get("data")));
  } catch {
    throw new Error("The content is not valid JSON");
  }
  if (!data?.name) throw new Error("A name is required");
  const key = table === "trails" ? { id: String(fd.get("key")) } : { slug: String(fd.get("key")) };
  const row: Record<string, unknown> = table === "trails" ? { ...key, data, active: bool(fd, "active") } : { ...key, data };
  const { error } = await sb.from(table).upsert(row);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect(`/admin/${table}`);
}

export async function reviewSubmission(fd: FormData) {
  const { sb, user } = await requireAdmin();
  const id = String(fd.get("id"));
  const decision = String(fd.get("decision"));
  const { data: sub } = await sb.from("submissions").select("*").eq("id", id).single();
  if (!sub) throw new Error("Submission not found");
  if (decision === "draft-event" && sub.kind === "event") {
    const p = sub.payload as Record<string, string>;
    const { data: ev, error } = await sb
      .from("events")
      .insert({
        name: p.name, starts_at: easternToIso(`${p.date}T${p.start_time}`), venue: p.venue, address: p.address, description: p.description,
        category: p.category, url: p.url, source_url: p.url, is_free: p.is_free === "" ? null : p.is_free === "true", status: "draft",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await sb.from("submissions").update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user.id }).eq("id", id);
    redirect(`/admin/events/${ev.id}`);
  }
  await sb.from("submissions").update({ status: decision === "approve" ? "approved" : "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user.id, reviewer_notes: str(fd, "notes") }).eq("id", id);
  revalidatePath("/admin/submissions");
}
