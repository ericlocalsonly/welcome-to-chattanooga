import { saveJsonRecord } from "@/app/admin/actions";

/** Structured-content editor for trails and neighborhoods. Validated as JSON on save. */
export function JsonEditor({ table, recordKey, data, active, isNew, help }: { table: "trails" | "neighborhoods"; recordKey: string; data: unknown; active?: boolean; isNew?: boolean; help: string }) {
  return (
    <form action={saveJsonRecord} className="space-y-4">
      <input type="hidden" name="table" value={table} />
      <label className="block"><span className="label">{table === "trails" ? "Trail ID" : "Slug"}</span><input name="key" required defaultValue={recordKey} readOnly={!isNew} pattern="[a-z0-9-]+" className="input max-w-sm" /></label>
      <p className="text-sm text-charcoal-600">{help}</p>
      <textarea name="data" rows={28} spellCheck={false} defaultValue={JSON.stringify(data, null, 2)} className="input font-mono text-xs" />
      {table === "trails" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={active ?? true} className="h-5 w-5 accent-forest" />Show on the public site</label>}
      <button className="btn-primary">Save</button>
    </form>
  );
}
