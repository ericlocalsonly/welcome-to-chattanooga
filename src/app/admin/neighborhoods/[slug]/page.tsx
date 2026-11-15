import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { JsonEditor } from "@/components/admin/JsonEditor";

export default async function EditNeighborhood({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("neighborhoods").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  return (
    <div className="max-w-4xl">
      <h1 className="mb-4 text-3xl font-semibold">Edit: {data.data.name}</h1>
      <JsonEditor table="neighborhoods" recordKey={data.slug} data={data.data} help="Edit the description, the 'special' introduction, the hero photo, featured place IDs, the walking route, and the map outline (lat/lng pairs)." />
    </div>
  );
}
