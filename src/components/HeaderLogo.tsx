"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Sponsor logo in the header's upper-right corner — shown on the home page only. */
export function HeaderLogo() {
  if (usePathname() !== "/") return null;
  return (
    <Link href="/shop-local" className="ml-1 shrink-0" aria-label="Locals Only Gifts and Goods — our sponsor">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/locals-only-logo-transparent.png" alt="Locals Only Gifts and Goods" width={480} height={289} className="h-9 w-auto sm:h-12" />
    </Link>
  );
}
