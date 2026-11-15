import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";

const MAX = 6000;

/** Visitor-submitted events and corrections. Stored as "pending"; never published without admin approval. */
export async function POST(req: Request) {
  const sb = supabasePublic();
  if (!sb) return NextResponse.json({ error: "Submissions are not configured." }, { status: 503 });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const kind = body?.kind;
  if (kind !== "event" && kind !== "correction") return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  const payload = body.payload && typeof body.payload === "object" ? body.payload : {};
  if (JSON.stringify(payload).length > MAX) return NextResponse.json({ error: "Too large" }, { status: 413 });
  const email = typeof body.contactEmail === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.contactEmail) ? body.contactEmail.slice(0, 200) : null;
  const { error } = await sb.from("submissions").insert({
    kind,
    payload,
    listing_id: typeof payload.listing_id === "string" ? payload.listing_id.slice(0, 120) : null,
    contact_name: typeof body.contactName === "string" ? body.contactName.slice(0, 120) : null,
    contact_email: email,
    status: "pending",
  });
  if (error) {
    console.error("[submissions]", error.message);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
