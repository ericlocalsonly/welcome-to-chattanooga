import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { JsonEditor } from "@/components/admin/JsonEditor";

const TEMPLATE = { name: "", activities: ["hiking"], categories: ["hiking"], distanceMiles: null, distanceNote: "", difficulty: "easy", duration: "", surface: "", trailhead: { name: "", address: "", lat: 35.0456, lng: -85.3097 }, parking: "", family: true, familyNote: "", description: "", website: "", warnings: "", verification: { status: "needs_review", lastVerified: "", sources: [] } };

export default async function EditTrail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const isNew = id === "new";
  let row: any = { id: "", data: TEMPLATE, active: true };
  if (!isNew) {
    const { data } = await sb.from("trails").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data;
  }
  return (
    <div className="max-w-4xl">
      <h1 className="mb-4 text-3xl font-semibold">{isNew ? "Add a trail" : `Edit: ${row.data.name}`}</h1>
      <JsonEditor table="trails" recordKey={row.id} data={row.data} active={row.active} isNew={isNew} help='Edit distance, difficulty, parking, closures ("warnings"), and verification. Difficulty must be easy, moderate, or challenging.' />
    </div>
  );
}
