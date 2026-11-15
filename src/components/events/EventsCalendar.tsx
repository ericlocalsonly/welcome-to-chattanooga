"use client";
import { useMemo, useState } from "react";
import type { CityEvent, EventCategory } from "@/lib/types";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { TZ, cn } from "@/lib/utils";
import { EventCard } from "./EventCard";

type View = "today" | "weekend" | "week" | "month" | "all";
const VIEWS: { key: View; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "weekend", label: "This Weekend" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "Full Calendar" },
];

/** Calendar date (YYYY-MM-DD) in Chattanooga's time zone. */
function ymd(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
function addDays(s: string, n: number) {
  const d = new Date(`${s}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function dow(s: string) {
  return new Date(`${s}T12:00:00Z`).getUTCDay();
}

function range(view: View, today: string): [string, string] {
  if (view === "today") return [today, today];
  if (view === "week") return [today, addDays(today, 6)];
  if (view === "month") return [today, `${today.slice(0, 8)}31`];
  if (view === "weekend") {
    const d = dow(today); // 0 Sun … 6 Sat
    if (d === 0) return [today, today];
    if (d === 6) return [today, addDays(today, 1)];
    const fri = addDays(today, 5 - d);
    return [fri, addDays(fri, 2)];
  }
  return ["0000-00-00", "9999-12-31"];
}

export function EventsCalendar({ events, initialCategory }: { events: CityEvent[]; initialCategory?: string }) {
  const [view, setView] = useState<View>("all");
  const [cat, setCat] = useState<EventCategory | "all">(initialCategory && initialCategory in EVENT_CATEGORIES ? (initialCategory as EventCategory) : "all");
  const today = ymd(new Date());
  const [from, to] = range(view, today);
  const list = useMemo(
    () => events.filter((e) => {
      const start = ymd(new Date(e.startsAt));
      const end = ymd(new Date(e.endsAt ?? e.startsAt));
      return end >= from && start <= to && (cat === "all" || e.category === cat);
    }),
    [events, from, to, cat],
  );
  const grouped = useMemo(() => {
    const m = new Map<string, CityEvent[]>();
    for (const e of list) {
      const k = ymd(new Date(e.startsAt));
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m.entries()];
  }, [list]);

  return (
    <div>
      <div role="tablist" aria-label="Calendar view" className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button key={v.key} role="tab" aria-selected={view === v.key} className={view === v.key ? "chip-on" : "chip-off"} onClick={() => setView(v.key)}>{v.label}</button>
        ))}
      </div>
      <label className="mt-4 block max-w-xs"><span className="label">Category</span>
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value as any)}>
          <option value="all">All categories</option>
          {(Object.keys(EVENT_CATEGORIES) as EventCategory[]).map((k) => <option key={k} value={k}>{EVENT_CATEGORIES[k]}</option>)}
        </select>
      </label>
      <div className="mt-6" aria-live="polite">
        {grouped.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-serif text-2xl text-forest">No verified events {view === "all" ? "on the calendar yet" : "for this time frame"}.</p>
            <p className="mx-auto mt-2 max-w-xl text-charcoal-600">We publish an event only after confirming it with the organizer or an official source, so you'll never find made-up listings here. In the meantime, check the official calendars below, or submit an event you're hosting.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([day, evs]) => (
              <section key={day} aria-label={day}>
                <h3 className={cn("mb-3 text-lg font-semibold", day === today && "text-terracotta-700")}>
                  {new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" }).format(new Date(`${day}T12:00:00Z`))}
                  {day === today ? " · Today" : ""}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">{evs.map((e) => <EventCard key={e.id} e={e} />)}</div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
