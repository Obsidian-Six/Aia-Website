// import React from "react";

// const input = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm";
// const action = "rounded-lg border px-3 py-2 text-sm font-semibold text-[#E25238]";
// const kinds = {
//   highlights: "Event Highlights",
//   takeaways: "Key Takeaways",
//   resources: "Presentations & Resources",
//   videos: "Video Recordings",
// };

// export function loadEventContent(content) {
//   const loaded = Object.fromEntries(
//     Object.keys(kinds).map((key) => [
//       key,
//       (content?.[key] || []).map((item) => ({
//         ...item,
//         key: item._id || crypto.randomUUID(),
//       })),
//     ]),
//   );

//   return { ...loaded, originalResources: loaded.resources };
// }

// export function appendEventContent(formData, content) {
//   const payload = {};

//   for (const key of Object.keys(kinds)) {
//     if (key === "resources" && content.resources === content.originalResources) {
//       continue;
//     }

//     payload[key] = content[key].map(
//       ({ file, title, description, type, url, _id }, index) => {
//         if (!title?.trim()) {
//           throw new Error(`${kinds[key]} requires a title for each entry.`);
//         }

//         if (file && key === "resources" && type !== "link") {
//           formData.append(`eventResource_${index}`, file);
//         }

//         return {
//           title,
//           description,
//           type,
//           url,
//           _id: _id == null ? undefined : String(_id),
//         };
//       },
//     );
//   }

//   formData.append("eventContent", JSON.stringify(payload));
// }

// export default function EventContentEditor({ value, onChange }) {
//   return (
//     <section className="space-y-6 rounded-xl border bg-slate-50 p-5">
//       {Object.entries(kinds).map(([key, label]) => {
//         const update = (entries) => onChange({ ...value, [key]: entries });
//         return (
//           <fieldset key={key} className="space-y-3">
//             <legend className="text-lg font-bold text-[#263247]">
//               {key === "highlights" ? "Pre-event" : "Post-event"} — {label}
//             </legend>
//             {key === "resources" ? (
//             <>
//               <label className="block space-y-1 text-sm font-medium">
//                 <span>Add PDFs from your computer</span>
//                 <input
//                   className="block w-full text-sm"
//                   type="file"
//                   accept=".pdf,application/pdf"
//                   multiple
//                   onChange={(event) => {
//                     const files = Array.from(event.target.files);
//                     if (!files.length) return;
//                     update([...value.resources, ...files.map((file) => ({
//                       key: crypto.randomUUID(),
//                       title: file.name.replace(/\.pdf$/i, "").trim() || file.name,
//                       description: "",
//                       type: "pdf",
//                       file,
//                     }))]);
//                     event.target.value = "";
//                   }}
//                 />
//               </label>
//                 {value.resources.filter((item) => item.type === "pdf").map((item) => (
//                   <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3">
//                     <span className="min-w-0 break-all text-sm">{item.file?.name || item.fileName || item.title}</span>
//                     <button type="button" className={action} onClick={() => update(value.resources.filter((entry) => entry.key !== item.key))}>
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </>
//             ) : (
//               <>
//             {value[key].map((item) => {
//               const patch = (changes) => update(value[key].map((entry) => entry.key === item.key ? { ...entry, ...changes } : entry));
//               return (
//                 <div key={item.key} className="space-y-3 rounded-xl border bg-white p-4">
//                   <label className="block text-sm">Title
//                     <input className={input} value={item.title || ""} onChange={(e) => patch({ title: e.target.value })} />
//                   </label>
//                   <label className="block text-sm">Description (optional)
//                     <textarea className={input} rows={2} value={item.description || ""} onChange={(e) => patch({ description: e.target.value })} />
//                   </label>
//                   {key === "videos" && (
//                     <label className="block text-sm">YouTube URL
//                       <input className={input} type="url" value={item.url || ""} onChange={(e) => patch({ url: e.target.value })} />
//                     </label>
//                   )}
//                   <button type="button" className={action} onClick={() => update(value[key].filter((entry) => entry.key !== item.key))}>Remove entry</button>
//                 </div>
//               );
//             })}
//             <button type="button" className={action} onClick={() => update([...value[key], {
//               key: crypto.randomUUID(), title: "", description: "",
//             }])}>Add {key === "highlights" ? "highlight" : key === "takeaways" ? "takeaway" : "recording"}</button>
//               </>
//             )}
//           </fieldset>
//         );
//       })}
//     </section>
//   );
// }


import React from "react";

const input = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm";
const action = "rounded-lg border px-3 py-2 text-sm font-semibold text-[#E25238]";
const kinds = {
  highlights: "Event Highlights",
  takeaways: "Key Takeaways",
  resources: "Presentations & Resources",
  videos: "Video Recordings",
};

export function loadEventContent(content) {
  const loaded = Object.fromEntries(Object.keys(kinds).map((key) => [
    key, (content?.[key] || []).map((item) => ({ ...item, key: item._id || crypto.randomUUID() })),
  ]));
  return { ...loaded, originalResources: loaded.resources };
}

export function appendEventContent(formData, content) {
  const payload = {};
  for (const key of ["highlights", "takeaways", "videos"]) {
    payload[key] = content[key].map(({ title, description, url }) => {
      if (!title?.trim()) throw new Error(`${kinds[key]} requires a title for each entry.`);
      return { title, description, url };
    });
  }

  const selectedKeys = new Set(content.resources.map((item) => item.key));
  const removed = (content.originalResources || []).filter((item) => !selectedKeys.has(item.key));
  const selected = content.resources.filter((item) => item.file);
  if (selected.length || removed.length) {
    payload.removedResourceIds = removed
      .filter((item) => item._id != null)
      .map((item) => String(item._id));
    const legacy = removed.filter((item) => item._id == null);
    if (legacy.length) {
      payload.removedLegacyPdfs = legacy.map(({ publicId, fileName, title }) => ({
        publicId, fileName, title,
      }));
    }
    payload.resources = selected.map(({ file, title }, index) => {
      formData.append(`eventResource_${index}`, file);
      return { title, type: "pdf" };
    });
  }

  formData.append("eventContent", JSON.stringify(payload));
}

export default function EventContentEditor({ value, onChange }) {
  return (
    <section className="space-y-6 rounded-xl border bg-slate-50 p-5">
      {Object.entries(kinds).map(([key, label]) => {
        const update = (entries) => onChange({ ...value, [key]: entries });
        return (
          <fieldset key={key} className="space-y-3">
            <legend className="text-lg font-bold text-[#263247]">
              {key === "highlights" ? "Pre-event" : "Post-event"} — {label}
            </legend>
            {key === "resources" ? (
            <>
              <label className="block space-y-1 text-sm font-medium">
                <span>Add PDFs from your computer</span>
                <input
                  className="block w-full text-sm"
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    if (!files.length) return;
                    update([...value.resources, ...files.map((file) => ({
                      key: crypto.randomUUID(),
                      title: file.name.replace(/\.pdf$/i, "").trim() || file.name,
                      description: "",
                      type: "pdf",
                      file,
                    }))]);
                    event.target.value = "";
                  }}
                />
              </label>
                {value.resources.filter((item) => item.type === "pdf").map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3">
                    <span className="min-w-0 break-all text-sm">{item.file?.name || item.fileName || item.title}</span>
                    <button type="button" className={action} onClick={() => update(value.resources.filter((entry) => entry.key !== item.key))}>
                      Remove
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
            {value[key].map((item) => {
              const patch = (changes) => update(value[key].map((entry) => entry.key === item.key ? { ...entry, ...changes } : entry));
              return (
                <div key={item.key} className="space-y-3 rounded-xl border bg-white p-4">
                  <label className="block text-sm">Title
                    <input className={input} value={item.title || ""} onChange={(e) => patch({ title: e.target.value })} />
                  </label>
                  <label className="block text-sm">Description (optional)
                    <textarea className={input} rows={2} value={item.description || ""} onChange={(e) => patch({ description: e.target.value })} />
                  </label>
                  {key === "videos" && (
                    <label className="block text-sm">YouTube URL
                      <input className={input} type="url" value={item.url || ""} onChange={(e) => patch({ url: e.target.value })} />
                    </label>
                  )}
                  <button type="button" className={action} onClick={() => update(value[key].filter((entry) => entry.key !== item.key))}>Remove entry</button>
                </div>
              );
            })}
            <button type="button" className={action} onClick={() => update([...value[key], {
              key: crypto.randomUUID(), title: "", description: "",
            }])}>Add {key === "highlights" ? "highlight" : key === "takeaways" ? "takeaway" : "recording"}</button>
              </>
            )}
          </fieldset>
        );
      })}
    </section>
  );
}
