import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page mt-6 pb-20">
      <nav aria-label="Admin" className="mb-6 flex flex-wrap items-center gap-2 border-b border-charcoal/10 pb-4 text-sm">
        <span className="mr-2 font-serif text-lg text-forest">Guide admin</span>
        {[["/admin", "Dashboard"], ["/admin/places", "Listings"], ["/admin/events", "Events"], ["/admin/trails", "Trails"], ["/admin/neighborhoods", "Neighborhoods"], ["/admin/submissions", "Submissions"]].map(([h, l]) => (
          <Link key={h} href={h} className="chip-off !min-h-[36px]">{l}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
