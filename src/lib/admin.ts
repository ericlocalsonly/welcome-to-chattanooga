import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

/** Returns a session-bound client for a verified admin, or redirects. All writes go through RLS (is_admin()). */
export async function requireAdmin() {
  const sb = await supabaseServer();
  if (!sb) redirect("/admin");
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: row } = await sb.from("admin_users").select("role").eq("user_id", data.user.id).maybeSingle();
  if (!row) redirect("/admin/login?e=not-admin");
  return { sb, user: data.user, role: row.role as "owner" | "editor" };
}
