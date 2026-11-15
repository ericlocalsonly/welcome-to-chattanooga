"use client";
import { useState } from "react";
import { EVENT_CATEGORIES } from "@/lib/categories";

type Kind = "event" | "correction";

/** Posts to /api/submissions. Nothing is published automatically — every submission is reviewed in /admin. */
export function SubmissionForm({ kind, listingId, contactEmail }: { kind: Kind; listingId?: string; contactEmail?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error" | "unavailable">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website_url")) return; // honeypot
    setState("sending");
    const payload = Object.fromEntries([...fd.entries()].filter(([k]) => !["website_url", "contact_email", "contact_name"].includes(k)));
    try {
      const r = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, payload, contactName: fd.get("contact_name"), contactEmail: fd.get("contact_email") }),
      });
      setState(r.ok ? "ok" : r.status === 503 ? "unavailable" : "error");
      if (r.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }
  if (state === "ok")
    return <div role="status" className="card p-6"><p className="font-serif text-2xl text-forest">Thank you!</p><p className="mt-2 text-charcoal-600">We'll review your {kind === "event" ? "event" : "update"} before anything is published.</p></div>;

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6" noValidate={false}>
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {kind === "event" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="label">Event name *</span><input required name="name" className="input" maxLength={160} /></label>
            <label><span className="label">Date *</span><input required type="date" name="date" className="input" /></label>
            <label><span className="label">Start time *</span><input required type="time" name="start_time" className="input" /></label>
            <label><span className="label">Venue *</span><input required name="venue" className="input" maxLength={160} /></label>
            <label><span className="label">Address *</span><input required name="address" className="input" maxLength={200} /></label>
            <label><span className="label">Category *</span>
              <select required name="category" className="input" defaultValue="">
                <option value="" disabled>Choose one</option>
                {Object.entries(EVENT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label><span className="label">Free or paid?</span>
              <select name="is_free" className="input" defaultValue=""><option value="">Not sure</option><option value="true">Free</option><option value="false">Paid</option></select>
            </label>
            <label className="sm:col-span-2"><span className="label">Official event or ticket link *</span><input required type="url" name="url" className="input" placeholder="https://" /></label>
            <label className="sm:col-span-2"><span className="label">Description *</span><textarea required name="description" rows={4} maxLength={1200} className="input" /></label>
          </div>
        </>
      ) : (
        <>
          <input type="hidden" name="listing_id" value={listingId ?? ""} />
          {listingId && <p className="text-sm text-charcoal-600">Listing: <strong>{listingId}</strong></p>}
          <label className="block"><span className="label">What should we update? *</span>
            <select required name="issue" className="input" defaultValue="">
              <option value="" disabled>Choose one</option>
              <option>Business has closed</option><option>Address or map pin is wrong</option><option>Hours are wrong</option>
              <option>Website or phone is wrong</option><option>Description needs a fix</option><option>Suggest a new place</option><option>Something else</option>
            </select>
          </label>
          <label className="block"><span className="label">Details *</span><textarea required name="details" rows={4} maxLength={1500} className="input" /></label>
          <label className="block"><span className="label">Source link (optional)</span><input type="url" name="source" className="input" placeholder="https://" /></label>
        </>
      )}
      <div className="grid gap-4 border-t border-charcoal/10 pt-4 sm:grid-cols-2">
        <label><span className="label">Your name (optional)</span><input name="contact_name" className="input" autoComplete="name" /></label>
        <label><span className="label">Email (optional, only used to follow up)</span><input type="email" name="contact_email" className="input" autoComplete="email" /></label>
      </div>
      <button className="btn-primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Submit for review"}</button>
      {state === "error" && <p role="alert" className="text-sm text-terracotta-700">Something went wrong. Please try again.</p>}
      {state === "unavailable" && (
        <p role="alert" className="text-sm text-terracotta-700">
          Online submissions aren't switched on yet.{contactEmail ? <> Please email <a className="underline" href={`mailto:${contactEmail}?subject=${encodeURIComponent(kind === "event" ? "Event submission" : "Listing update")}`}>{contactEmail}</a> instead.</> : null}
        </p>
      )}
    </form>
  );
}
