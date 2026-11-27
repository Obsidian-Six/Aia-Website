import React, { useEffect, useRef, useState } from "react";
import { getFeaturedHighlights, saveFeaturedHighlight, deleteFeaturedHighlight } from "../services/api";

const empty = { name: "", headline: "", description: "", bannerAlt: "", linkUrl: "", lane: "left", order: 0, isActive: true };
const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const button = "rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-60";

export default function ManageFeaturedCompanyHighlights() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getFeaturedHighlights({ admin: true, signal: controller.signal })
      .then(setItems).catch((err) => { if (!controller.signal.aborted) setError(err.response?.data?.message || err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const edit = (item) => {
    setEditing(item);
    setForm(Object.fromEntries(Object.entries(empty).map(([key, value]) => [key, item?.[key] ?? value])));
    setFile(null);
    setPreview("");
    if (fileInput.current) fileInput.current.value = "";
    setError("");
  };
  const patch = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Banner must be 5 MB or smaller.");
      return;
    }
    const body = new FormData();
    for (const [key, value] of Object.entries(form)) body.append(key, String(value));
    if (file) body.append("banner", file);
    setBusy(true);
    try {
      const { item } = await saveFeaturedHighlight(editing?._id, body);
      setItems((current) => [...current.filter(({ _id }) => _id !== item._id), item]);
      edit(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await deleteFeaturedHighlight(deleting._id);
      setItems((current) => current.filter(({ _id }) => _id !== deleting._id));
      if (editing?._id === deleting._id) edit(null);
      setDeleting(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  const image = file ? preview : editing?.bannerUrl;
  const sorted = [...items].sort((a, b) => a.order - b.order || a._id.localeCompare(b._id));

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-5 text-[#172033]">
      <h1 className="text-2xl font-bold">Featured Highlights</h1>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <form onSubmit={submit} className="rounded-xl border bg-white p-5">
        <fieldset disabled={busy} className="space-y-4">
          <legend className="mb-3 text-lg font-semibold">{editing ? "Edit highlight" : "Add highlight"}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["name", "Company name", 100], ["headline", "Headline", 160],
              ["bannerAlt", "Banner alt text", 180], ["linkUrl", "Know More URL"],
            ].map(([key, label, maxLength]) => (
              <label key={key} className="text-sm font-medium">
                {label}
                <input className={input} type={key === "linkUrl" ? "url" : "text"} required={key === "name"}
                  maxLength={maxLength} value={form[key]} onChange={(event) => patch(key, event.target.value)} />
              </label>
            ))}
            <label className="text-sm font-medium">
              Slider
              <select className={input} value={form.lane} onChange={(event) => patch("lane", event.target.value)}>
                <option value="left">Left slider</option>
                <option value="right">Right slider</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Display order
              <input type="number" min="0" step="1" className={input} value={form.order}
                onChange={(event) => patch("order", event.target.value)} />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Description
            <textarea rows={3} maxLength={500} className={input} value={form.description}
              onChange={(event) => patch("description", event.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Banner image (up to 5 MB)
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" required={!editing}
              className="mt-2 block w-full text-sm" onChange={(event) => setFile(event.target.files[0] || null)} />
          </label>
          {image && <img src={image} alt="" className="aspect-[16/10] w-full max-w-xs rounded-lg object-cover" />}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(event) => patch("isActive", event.target.checked)} />
            Show on website
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg bg-[#C9452E] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" type="submit">Save highlight</button>
            {editing && <button type="button" className={button} onClick={() => edit(null)}>Cancel edit</button>}
          </div>
        </fieldset>
      </form>

      {loading && <p role="status">Loading highlights…</p>}
      {!loading && !items.length && <p>No highlights added yet.</p>}
      <ul className="space-y-3">
        {sorted.map((item) => (
          <li key={item._id} className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
            <img src={item.bannerUrl} alt="" loading="lazy" className="h-14 w-20 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold">{item.name}</p>
              <p className="text-sm text-slate-600">{item.lane === "left" ? "Left slider" : "Right slider"} · {item.isActive ? "Visible" : "Hidden"}</p>
            </div>
            <button type="button" className={button} disabled={busy} onClick={() => edit(item)}>Edit</button>
            <button type="button" className={button} disabled={busy} onClick={() => setDeleting(item)}>Delete</button>
          </li>
        ))}
      </ul>
      {deleting && (
        <div className="space-y-3 rounded-lg border border-red-200 p-4">
          <p>Delete <strong>{deleting.name}</strong> and its banner?</p>
          <button type="button" className={button} disabled={busy} onClick={remove}>Confirm delete</button>
          <button type="button" className={`ml-2 ${button}`} disabled={busy} onClick={() => setDeleting(null)}>Cancel</button>
        </div>
      )}
    </section>
  );
}
