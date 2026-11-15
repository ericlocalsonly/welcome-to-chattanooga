"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Compass, CalendarDays, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/neighborhoods", label: "Neighborhoods", icon: Map },
  { href: "/things-to-do", label: "Things to Do", icon: Compass },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/weather", label: "Weather", icon: CloudSun },
];

const THINGS = ["/things-to-do", "/kids", "/outdoors", "/walnut-street-bridge", "/shop-local", "/places"];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/things-to-do") return THINGS.some((p) => path.startsWith(p));
  return path.startsWith(href);
}

export function DesktopNav() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={isActive(path, n.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(path, n.href) ? "bg-forest text-white" : "text-charcoal-600 hover:bg-forest-50 hover:text-forest",
              )}
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BottomNav() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-white/95 backdrop-blur md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="grid grid-cols-5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-forest" : "text-charcoal-400")}>
                <Icon aria-hidden className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span>{label === "Neighborhoods" ? "Areas" : label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
