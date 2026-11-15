import type { MetadataRoute } from "next";
import { getNeighborhoods, getPlaces } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [hoods, places] = await Promise.all([getNeighborhoods(), getPlaces()]);
  const now = new Date();
  const fixed = ["", "/neighborhoods", "/things-to-do", "/kids", "/outdoors", "/outdoors/riverwalk", "/walnut-street-bridge", "/events", "/weather", "/shop-local", "/about", "/privacy"];
  return [
    ...fixed.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now })),
    ...hoods.map((n) => ({ url: `${SITE_URL}/neighborhoods/${n.slug}`, lastModified: now })),
    ...places.map((p) => ({ url: `${SITE_URL}/places/${p.id}`, lastModified: p.verification.lastVerified ? new Date(p.verification.lastVerified) : now })),
  ];
}
