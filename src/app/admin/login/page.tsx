"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [err, setErr] = useState(params.get("e") === "not-admin" ? "This account isn't on the admin list. Ask an owner to add you." : "");
  const [busy, setBusy] = useState(false);
  if (!supabaseConfigured) return <p className="card p-6">Supabase isn't configured yet. See the setup steps on the <a className="underline" href="/admin">admin dashboard</a>.</p>;
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
    setBusy(false);
    if (error) return setErr(error.message);
    router.replace("/admin");
    router.refresh();
  }
  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Admin sign in</h1>
      <label className="block"><span className="label">Email</span><input name="email" type="email" required autoComplete="username" className="input" /></label>
      <label className="block"><span className="label">Password</span><input name="password" type="password" required autoComplete="current-password" className="input" /></label>
      {err && <p role="alert" className="text-sm text-terracotta-700">{err}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
