import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminNeighborhoods() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("neighborhoods").select("slug,data").order("slug");
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold capitalize">neighborhoods</h1></div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {data?.map((r: any) => <li key={r.slug}><Link className="card block p-4 font-medium text-forest underline" href={`/admin/neighborhoods/${r.slug}`}>{r.data?.name ?? r.slug}</Link></li>)}
      </ul>
    </div>
  );
}
