// import React, { useEffect, useState } from "react";

// const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E25238]";
// const action = "rounded-lg border px-3 py-2 text-sm font-semibold text-[#E25238]";
// const emptyCard = () => ({ key: crypto.randomUUID(), name: "", subtitle: "", description: "", imageAlt: "", url: "", imageUrl: "" });

// function ImagePreview({ file, imageUrl }) {
//   const [preview, setPreview] = useState("");
//   useEffect(() => {
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [file]);

//   const url = file ? preview : imageUrl;
//   return url ? <img src={url} alt="" className="mt-2 h-24 rounded-lg object-cover" /> : null;
// }

// function CardFields({ card, update, remove, gallery }) {
//   const [error, setError] = useState("");
//   const fields = [
//     ["name", gallery ? "Name" : "Speaker name"],
//     ["subtitle", gallery ? "Designation" : "Designation / organisation"],
//     ["imageAlt", "Image alt text"],
//     ["url", "Card link (optional)"],
//   ];
//   return (
//     <div className="space-y-3 rounded-xl border bg-white p-4">
//       <div className="grid gap-3 sm:grid-cols-2">
//         {fields.map(([field, label]) => (
//           <label key={field} className="block space-y-1 text-sm font-medium">
//             <span>{label}</span>
//             <input className={inputClass} type={field === "url" ? "url" : "text"}
//               value={card[field] || ""} onChange={(event) => update({ [field]: event.target.value })} />
//           </label>
//         ))}
//       </div>
//       {!gallery && (
//         <label className="block space-y-1 text-sm font-medium">
//           <span>Speaker information</span>
//           <textarea rows={3} className={inputClass} value={card.description || ""}
//             onChange={(event) => update({ description: event.target.value })} />
//         </label>
//       )}
//       <label className="block space-y-1 text-sm font-medium">
//         <span>{gallery ? "Gallery image" : "Speaker photo"}</span>
//         <input className="block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
//           onChange={(event) => {
//             const file = event.target.files[0];
//             event.target.value = "";
//             if (!file) return;
//             if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
//               setError("Choose a JPEG, PNG, WebP, AVIF or GIF of up to 5 MB.");
//               return;
//             }
//             setError("");
//             update({ file });
//           }} />
//       </label>
//       {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
//       <ImagePreview file={card.file} imageUrl={card.imageUrl} />
//       <button type="button" className={action} onClick={remove}>Remove card</button>
//     </div>
//   );
// }

// function CardList({ cards, onChange, gallery = false }) {
//   return (
//     <div className="space-y-3">
//       {cards.map((card) => (
//         <CardFields key={card.key} card={card} gallery={gallery}
//           update={(patch) => onChange(cards.map((item) => item.key === card.key ? { ...item, ...patch } : item))}
//           remove={() => onChange(cards.filter((item) => item.key !== card.key))} />
//       ))}
//       <button type="button" className={action} onClick={() => onChange([...cards, emptyCard()])}>
//         {gallery ? "Add gallery card" : "Add speaker"}
//       </button>
//     </div>
//   );
// }

// export function loadEventSections(sections = {}) {
//   sections = sections || {};
//   const withKey = (item) => ({ ...item, key: item._id || crypto.randomUUID() });
//   return {
//     format: sections.format || "",
//     speakers: (sections.speakers || []).map(withKey),
//     gallery: (sections.gallery || []).map((group) => ({
//       ...withKey(group),
//       cards: (group.cards || []).map(withKey),
//     })),
//   };
// }

// export function appendEventSections(formData, sections) {
//   const saveCard = ({ file, name, subtitle, description, imageAlt, imageUrl, url, imagePublicId }, field) => {
//     if (!name?.trim() || (!file && !imageUrl)) {
//       throw new Error("Each speaker and gallery card needs a name and image.");
//     }
//     if (file) formData.append(field, file);
//     return { name, subtitle, description, imageAlt, imageUrl, url, imagePublicId };
//   };
//   const speakers = sections.speakers.map((card, index) => saveCard(card, `speakerImage_${index}`));
//   const gallery = sections.gallery.map((group, index) => {
//     if (!group.heading.trim() || !group.cards.length) {
//       throw new Error("Each gallery session needs a heading and at least one card.");
//     }
//     return {
//       heading: group.heading,
//       description: group.description,
//       cards: group.cards.map((card, cardIndex) => saveCard(card, `galleryImage_${index}_${cardIndex}`)),
//     };
//   });

//   formData.append("eventSections", JSON.stringify({ format: sections.format, speakers, gallery }));
// }

// export default function EventSectionEditor({ value, onChange }) {
//   const { format, speakers, gallery } = value;
//   const updateGroup = (key, patch) => onChange({
//     ...value,
//     gallery: gallery.map((group) => group.key === key ? { ...group, ...patch } : group),
//   });

//   return (
//     <section className="space-y-6 rounded-xl border border-gray-200 bg-slate-50 p-5 sm:p-7">
//       {/* <label className="block max-w-sm space-y-1 text-sm font-medium">
//         <span>Completed event layout</span>
//         <select className={inputClass} value={format} onChange={(event) => onChange({ ...value, format: event.target.value })}>
//           <option value="">Use event category</option>
//           <option value="conference">Conference</option>
//           <option value="workshop">Workshop</option>
//           <option value="workshop">Webinars</option>
//           <option value="workshop">Training Program</option>
//           <option value="workshop">Exhibitions</option>
//         </select>
//       </label> */}
//       <div className="space-y-3">
//         <h3 className="text-lg font-bold text-[#1E293B]">Featured Speakers</h3>
//         <CardList cards={speakers} onChange={(cards) => onChange({ ...value, speakers: cards })} />
//       </div>
//       <div className="space-y-3">
//         <h3 className="text-lg font-bold text-[#1E293B]">Event Gallery</h3>
//         <p className="text-sm text-gray-600">Add session groups and their cards. The gallery appears after the event ends.</p>
//         {gallery.map((group) => (
//           <fieldset key={group.key} className="space-y-3 rounded-xl border border-gray-200 p-4">
//             <label className="block space-y-1 text-sm font-medium">
//               <span>Session heading</span>
//               <input className={inputClass} value={group.heading} placeholder="Session 01 – Inaugural Session"
//                 onChange={(event) => updateGroup(group.key, { heading: event.target.value })} />
//             </label>
//             <label className="block space-y-1 text-sm font-medium">
//               <span>Session description (optional)</span>
//               <textarea className={inputClass} value={group.description || ""}
//                 onChange={(event) => updateGroup(group.key, { description: event.target.value })} />
//             </label>
//             <CardList gallery cards={group.cards} onChange={(cards) => updateGroup(group.key, { cards })} />
//             <button type="button" className={action} onClick={() => onChange({
//               ...value, gallery: gallery.filter((item) => item.key !== group.key),
//             })}>Remove session</button>
//           </fieldset>
//         ))}
//         <button type="button" className={action} onClick={() => onChange({
//           ...value, gallery: [...gallery, { key: crypto.randomUUID(), heading: "", description: "", cards: [] }],
//         })}>Add gallery session</button>
//       </div>
//     </section>
//   );
// }


import React, { useEffect, useState } from "react";

const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E25238]";
const action = "rounded-lg border px-3 py-2 text-sm font-semibold text-[#E25238]";
const emptyCard = () => ({ key: crypto.randomUUID(), name: "", subtitle: "", description: "", imageAlt: "", url: "", imageUrl: "" });

function ImagePreview({ file, imageUrl }) {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const url = file ? preview : imageUrl;
  return url ? <img src={url} alt="" className="mt-2 h-24 rounded-lg object-cover" /> : null;
}

function CardFields({ card, update, remove, gallery }) {
  const [error, setError] = useState("");
  const fields = [
    ["name", gallery ? "Name" : "Speaker name"],
    ["subtitle", gallery ? "Designation" : "Designation / organisation"],
    ["imageAlt", "Image alt text"],
    ["url", "Card link (optional)"],
  ];
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([field, label]) => (
          <label key={field} className="block space-y-1 text-sm font-medium">
            <span>{label}</span>
            <input className={inputClass} type={field === "url" ? "url" : "text"}
              value={card[field] || ""} onChange={(event) => update({ [field]: event.target.value })} />
          </label>
        ))}
      </div>
      {!gallery && (
        <label className="block space-y-1 text-sm font-medium">
          <span>Speaker information</span>
          <textarea rows={3} className={inputClass} value={card.description || ""}
            onChange={(event) => update({ description: event.target.value })} />
        </label>
      )}
      <label className="block space-y-1 text-sm font-medium">
        <span>{gallery ? "Gallery image" : "Speaker photo"}</span>
        <input className="block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={(event) => {
            const file = event.target.files[0];
            event.target.value = "";
            if (!file) return;
            if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
              setError("Choose a JPEG, PNG, WebP, AVIF or GIF of up to 5 MB.");
              return;
            }
            setError("");
            update({ file });
          }} />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <ImagePreview file={card.file} imageUrl={card.imageUrl} />
      <button type="button" className={action} onClick={remove}>Remove card</button>
    </div>
  );
}

function CardList({ cards, onChange, gallery = false }) {
  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <CardFields key={card.key} card={card} gallery={gallery}
          update={(patch) => onChange(cards.map((item) => item.key === card.key ? { ...item, ...patch } : item))}
          remove={() => onChange(cards.filter((item) => item.key !== card.key))} />
      ))}
      <button type="button" className={action} onClick={() => onChange([...cards, emptyCard()])}>
        {gallery ? "Add gallery card" : "Add speaker"}
      </button>
    </div>
  );
}

export function loadEventSections(sections = {}) {
  sections = sections || {};
  const withKey = (item) => ({ ...item, key: item._id || crypto.randomUUID() });
  return {
    format: sections.format || "",
    speakers: (sections.speakers || []).map(withKey),
    gallery: (sections.gallery || []).map((group) => ({
      ...withKey(group),
      cards: (group.cards || []).map(withKey),
    })),
  };
}

export function appendEventSections(formData, sections) {
  const saveCard = ({ file, name, subtitle, description, imageAlt, imageUrl, url, imagePublicId }, field) => {
    if (!name?.trim() || (!file && !imageUrl)) {
      throw new Error("Each speaker and gallery card needs a name and image.");
    }
    if (file) formData.append(field, file);
    return { name, subtitle, description, imageAlt, imageUrl, url, imagePublicId };
  };
  const speakers = sections.speakers.map((card, index) => saveCard(card, `speakerImage_${index}`));
  const gallery = sections.gallery.map((group, index) => {
    if (!group.heading.trim() || !group.cards.length) {
      throw new Error("Each gallery session needs a heading and at least one card.");
    }
    return {
      heading: group.heading,
      description: group.description,
      cards: group.cards.map((card, cardIndex) => saveCard(card, `galleryImage_${index}_${cardIndex}`)),
    };
  });

  formData.append("eventSections", JSON.stringify({ format: sections.format, speakers, gallery }));
}

export default function EventSectionEditor({ value, onChange }) {
  const { format, speakers, gallery } = value;
  const updateGroup = (key, patch) => onChange({
    ...value,
    gallery: gallery.map((group) => group.key === key ? { ...group, ...patch } : group),
  });

  return (
    <section className="space-y-6 rounded-xl border border-gray-200 bg-slate-50 p-5 sm:p-7">
      {/* <label className="block max-w-sm space-y-1 text-sm font-medium">
        <span>Completed event layout</span>
        <select className={inputClass} value={format} onChange={(event) => onChange({ ...value, format: event.target.value })}>
          <option value="">Use event category</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
        </select>
      </label> */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#1E293B]">Featured Speakers</h3>
        <CardList cards={speakers} onChange={(cards) => onChange({ ...value, speakers: cards })} />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#1E293B]">Event Gallery</h3>
        <p className="text-sm text-gray-600">Add session groups and their cards. The gallery appears after the event ends.</p>
        {gallery.map((group) => (
          <fieldset key={group.key} className="space-y-3 rounded-xl border border-gray-200 p-4">
            <label className="block space-y-1 text-sm font-medium">
              <span>Session heading</span>
              <input className={inputClass} value={group.heading} placeholder="Session 01 – Inaugural Session"
                onChange={(event) => updateGroup(group.key, { heading: event.target.value })} />
            </label>
            <label className="block space-y-1 text-sm font-medium">
              <span>Session description (optional)</span>
              <textarea className={inputClass} value={group.description || ""}
                onChange={(event) => updateGroup(group.key, { description: event.target.value })} />
            </label>
            <CardList gallery cards={group.cards} onChange={(cards) => updateGroup(group.key, { cards })} />
            <button type="button" className={action} onClick={() => onChange({
              ...value, gallery: gallery.filter((item) => item.key !== group.key),
            })}>Remove session</button>
          </fieldset>
        ))}
        <button type="button" className={action} onClick={() => onChange({
          ...value, gallery: [...gallery, { key: crypto.randomUUID(), heading: "", description: "", cards: [] }],
        })}>Add gallery session</button>
      </div>
    </section>
  );
}
