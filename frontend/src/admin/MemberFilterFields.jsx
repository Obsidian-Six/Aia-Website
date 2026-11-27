import React, { useEffect, useState } from "react";
import { getMemberFilterOptions, saveMemberFilterOptions } from "../services/api";
import MemberFilterPicker, { filterLabels } from "../components/membership/member-directory/MemberFilterPicker";

export default function MemberFilterFields({ form, updateField }) {
  const [options, setOptions] = useState(null);
  const [draft, setDraft] = useState(null);
  const [group, setGroup] = useState("manufacturingSectors");
  const [adding, setAdding] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getMemberFilterOptions({ admin: true, signal: controller.signal }).then(setOptions).catch((error) => {
      if (!controller.signal.aborted) setError(error.response?.data?.message || "Could not load directory options.");
    });
    return () => controller.abort();
  }, []);

  const updateOptions = (items) => setDraft({ ...draft, groups: { ...draft.groups, [group]: items } });

  async function save() {
    setSaving(true);
    setError("");
    try {
      const updated = await saveMemberFilterOptions(draft);
      setOptions(updated);
      setDraft(null);
      setAdding("");
    } catch (error) {
      setError(error.response?.data?.message || "Could not save directory options.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
      <h2 className="text-lg font-bold text-[#202A3A]">Directory Filters</h2>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {options && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(filterLabels).map(([key, label]) => (
              <MemberFilterPicker key={key} label={label} options={options.groups[key]} values={form[key] || []}
                onChange={(values) => updateField(key, values)} />
            ))}
          </div>
          <button type="button" className="text-sm font-semibold text-[#C9452E] underline" onClick={() => setDraft(options)}>
            Manage Filter Options
          </button>
        </>
      )}
      <label className="block text-sm font-semibold">
        Directory Keywords
        <input className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 font-normal"
          value={form.directoryKeywords} placeholder="e.g. robotics, machine vision"
          onChange={(event) => updateField("directoryKeywords", event.target.value)} />
      </label>
      {draft && (
        <fieldset disabled={saving} className="space-y-3 rounded-lg border bg-slate-50 p-4">
          <legend className="text-sm font-semibold">Manage Filter Options</legend>
          <label className="block text-sm">
            Option group
            <select value={group} onChange={(event) => setGroup(event.target.value)} className="ml-3 rounded border p-2">
              {Object.entries(filterLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {draft.groups[group].map((item) => {
              const patch = (value) => updateOptions(draft.groups[group].map((entry) => entry.id === item.id ? { ...entry, ...value } : entry));
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <input aria-label="Option label" className="min-w-0 flex-1 rounded border px-3 py-2 text-sm"
                    value={item.label} onChange={(event) => patch({ label: event.target.value })} />
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" checked={item.isActive} onChange={(event) => patch({ isActive: event.target.checked })} />
                    Active
                  </label>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <input aria-label="New option" className="rounded border px-3 py-2 text-sm" value={adding}
              onChange={(event) => setAdding(event.target.value)} placeholder="New option" />
            <button type="button" className="rounded border px-3 py-2 text-sm" disabled={!adding.trim()} onClick={() => {
              updateOptions([...draft.groups[group], { id: crypto.randomUUID(), label: adding.trim(), isActive: true }]);
              setAdding("");
            }}>Add Option</button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={save} className="rounded bg-[#C9452E] px-4 py-2 text-sm font-semibold text-white">
              {saving ? "Saving…" : "Save Options"}
            </button>
            <button type="button" onClick={() => { setDraft(null); setAdding(""); }} className="rounded border px-4 py-2 text-sm">Cancel</button>
          </div>
        </fieldset>
      )}
    </section>
  );
}
