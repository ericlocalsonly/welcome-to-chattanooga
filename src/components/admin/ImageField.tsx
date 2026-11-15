"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

/** Upload a photo to the Supabase "media" bucket (admins only, enforced by storage policies) or paste a URL. */
export function ImageField({ src, alt, credit }: { src?: string; alt?: string; credit?: string }) {
  const [url, setUrl] = useState(src ?? "");
  const [msg, setMsg] = useState("");
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setMsg("Please use an image under 5 MB.");
    setMsg("Uploading…");
    const sb = supabaseBrowser();
    const path = `places/${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) return setMsg(error.message);
    setUrl(sb.storage.from("media").getPublicUrl(path).data.publicUrl);
    setMsg("Uploaded. Remember to save.");
  }
  return (
    <fieldset className="space-y-3">
      <legend className="label">Photo</legend>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-40 w-full max-w-sm rounded-2xl object-cover" />
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="block text-sm" />
      <label className="block"><span className="label">Image URL</span><input name="image_src" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Leave blank for no photo" /></label>
      <label className="block"><span className="label">Alt text (describe the photo)</span><input name="image_alt" className="input" defaultValue={alt} /></label>
      <label className="block"><span className="label">Credit / license</span><input name="image_credit" className="input" defaultValue={credit} placeholder="e.g. Photo by …, used with permission" /></label>
      {url && <button type="button" className="text-sm underline" onClick={() => setUrl("")}>Remove photo</button>}
      {msg && <p className="text-sm text-charcoal-600" aria-live="polite">{msg}</p>}
    </fieldset>
  );
}
