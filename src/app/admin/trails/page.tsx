import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminTrails() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("trails").select("id,data").order("id");
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold capitalize">trails</h1><Link className="btn-primary" href="/admin/trails/new">Add trail</Link></div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {data?.map((r: any) => <li key={r.id}><Link className="card block p-4 font-medium text-forest underline" href={`/admin/trails/${r.id}`}>{r.data?.name ?? r.id}</Link></li>)}
      </ul>
    </div>
  );
}
