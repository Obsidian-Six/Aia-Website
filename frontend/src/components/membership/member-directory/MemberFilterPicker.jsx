import React, { useEffect, useId, useRef, useState } from "react";

export const filterLabels = {
  manufacturingSectors: "Manufacturing Sector",
  technologyStreams: "Technology Stream",
  serviceStreams: "Service Stream",
};

export default function MemberFilterPicker({ label, options = [], values = [], limit = Infinity, onChange }) {
  const [search, setSearch] = useState("");
  const id = useId();
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      const picker = pickerRef.current;
      if (picker?.open && !picker.contains(event.target)) picker.open = false;
    };

    document.addEventListener("pointerdown", closeOutside, true);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside, true);
      document.removeEventListener("focusin", closeOutside);
    };
  }, []);

  const closePicker = () => {
    pickerRef.current.open = false;
    triggerRef.current.focus();
  };

  const toggleOption = (optionId) => {
    const checked = values.includes(optionId);
    const next = checked
      ? values.filter((value) => value !== optionId)
      : limit === 1 ? [optionId] : [...values, optionId];

    onChange(next);
    if (!checked && next.length >= limit) closePicker();
  };
  const visible = options.filter((item) =>
    (item.isActive || values.includes(item.id)) &&
    item.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-w-0">
      <span id={id} className="mb-2 block text-sm font-semibold text-[#202A3A]">{label}</span>
      <details
        ref={pickerRef}
        className="relative"
        onToggle={(event) => { if (!event.currentTarget.open) setSearch(""); }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !event.currentTarget.open) return;
          event.preventDefault();
          event.stopPropagation();
          closePicker();
        }}
      >
        <summary ref={triggerRef} aria-describedby={id} className="cursor-pointer truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          {values.length === 1 ? options.find((item) => item.id === values[0])?.label || "1 selected"
            : values.length ? `${values.length} selected`
              : limit === 3 ? "Select up to 3 technologies" : `Select ${label.toLowerCase()}`}
        </summary>
        <div className="z-20 mt-1 rounded-lg border bg-white p-3 shadow-lg sm:absolute sm:min-w-64">
          <input
            type="search"
            aria-label={`Search ${label} options`}
            placeholder="Find an option"
            value={search}
            onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-2 w-full rounded border px-2 py-1.5 text-sm"
          />
          <div className="max-h-56 space-y-1 overflow-y-auto">
            {visible.map((item) => {
              const checked = values.includes(item.id);
              return (
                <label key={item.id} className="flex items-start gap-2 rounded px-1 py-1.5 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#C9452E]"
                    checked={checked}
                    disabled={!checked && (!item.isActive || (limit !== 1 && values.length >= limit))}
                    onChange={() => toggleOption(item.id)}
                  />
                  {item.label}{!item.isActive && " (inactive)"}
                </label>
              );
            })}
            {visible.length === 0 && <p className="px-1 py-2 text-sm text-slate-500">No matching options</p>}
          </div>
        </div>
      </details>
    </div>
  );
}
