"use client";
import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButton({ title, path, text, compact = false, className }: { title: string; path: string; text?: string; compact?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function onShare() {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled share sheet */
    }
  }
  return (
    <button type="button" onClick={onShare} aria-label={`Share ${title}`} className={cn(compact ? "flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest ring-1 ring-forest/20 hover:bg-forest-50" : "btn-ghost", className)}>
      {copied ? <Check aria-hidden className="h-4 w-4" /> : <Share2 aria-hidden className="h-4 w-4" />}
      {!compact && <span>{copied ? "Link copied" : "Share"}</span>}
      <span className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</span>
    </button>
  );
}
