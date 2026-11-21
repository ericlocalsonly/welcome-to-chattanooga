import Link from "next/link";
import { Search, Heart } from "lucide-react";
import { DesktopNav } from "./NavLinks";
import { HeaderLogo } from "./HeaderLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex flex-col leading-none" aria-label="Welcome to Chattanooga — home">
          <span className="font-serif text-lg font-semibold text-forest sm:text-xl">Welcome to Chattanooga</span>
          <span className="mt-1 hidden text-[11px] uppercase tracking-[0.2em] text-charcoal-400 sm:block">Explore the Scenic City like a local</span>
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-1">
          <Link href="/search" className="flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-forest-50" aria-label="Search the guide">
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <Link href="/favorites" className="flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-forest-50" aria-label="My saved places">
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          <HeaderLogo />
        </div>
      </div>
    </header>
  );
}
