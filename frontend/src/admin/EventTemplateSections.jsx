// import React, { useEffect, useState } from "react";
// import { eventEndTime, eventTemplate } from "./eventStage";

// function webUrl(value) {
//   try {
//     const url = new URL(value);
//     return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
//   } catch {
//     return undefined;
//   }
// }

// function photoUrl(value, width) {
//   const src = webUrl(value);
//   if (!src) return undefined;
//   const url = new URL(src);
//   const segments = url.pathname.split("/image/upload/");
//   if (url.hostname === "res.cloudinary.com" && segments.length === 2) {
//     url.pathname = `${segments[0]}/image/upload/f_auto,q_auto,c_limit,w_${width}/${segments[1]}`;
//     return url.href;
//   }
//   return src;
// }

// function EventCard({ card, speaker }) {
//   const href = webUrl(card.url);
//   const src = photoUrl(card.imageUrl, speaker ? 640 : 1200);
//   const Tag = href ? "a" : "article";
//   return (
//     <Tag
//       href={href}
//       target={href ? "_blank" : undefined}
//       rel={href ? "noopener noreferrer" : undefined}
//       className={`group block min-w-0 overflow-hidden rounded-lg ${href ? "hover:text-[#C9452E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E25238]" : ""}`}
//     >
//       {src && (
//         <img
//           src={src}
//           srcSet={`${photoUrl(card.imageUrl, 320)} 320w, ${photoUrl(card.imageUrl, 640)} 640w${speaker ? "" : `, ${src} 1200w`}`}
//           sizes={
//             speaker
//               ? "(min-width: 1024px) 270px, 50vw"
//               : "(min-width: 1024px) 570px, (min-width: 640px) 50vw, 100vw"
//           }
//           alt={card.imageAlt || ""}
//           loading="lazy"
//           decoding="async"
//           className={`w-full rounded-lg bg-slate-100 object-cover ${speaker ? "aspect-[4/3] object-top" : "aspect-video"}`}
//         />
//       )}
//       <h4
//         className={`mt-3 break-words text-sm font-bold ${href ? "underline underline-offset-2" : ""}`}
//       >
//         {card.name}
//       </h4>
//       {card.subtitle && (
//         <p
//           className={`mt-1 break-words text-xs text-slate-600 ${href ? "underline underline-offset-2 group-hover:text-[#C9452E]" : ""}`}
//         >
//           {card.subtitle}
//         </p>
//       )}
//       {speaker && card.description && (
//         <p className="mt-2 whitespace-pre-line break-words text-sm text-slate-600">
//           {card.description}
//         </p>
//       )}
//     </Tag>
//   );
// }

// export function useEventTemplate(event) {
//   const [now, setNow] = useState(Date.now);
//   const end = eventEndTime(event);
//   useEffect(() => {
//     if (!Number.isFinite(end) || now >= end) return;
//     const refresh = () => setNow(Date.now());
//     const timer = window.setTimeout(
//       refresh,
//       Math.max(0, Math.min(end - Date.now(), 2147483647)),
//     );
//     document.addEventListener("visibilitychange", refresh);
//     return () => {
//       window.clearTimeout(timer);
//       document.removeEventListener("visibilitychange", refresh);
//     };
//   }, [end, now]);
//   return eventTemplate(event, Math.max(now, Date.now()));
// }

// export default function EventTemplateSections({
//   event,
//   template: selectedTemplate,
// }) {
//   const automaticTemplate = useEventTemplate(event);
//   const template = selectedTemplate || automaticTemplate;
//   const { speakers = [], gallery = [] } = event?.eventSections || {};
//   const workshop = template === "completed-workshop";

//   return (
//     <>
//       {speakers.length > 0 && (
//         <section
//           className="w-full bg-white px-5 py-9 sm:px-8 sm:py-11 lg:px-12 lg:py-12 "
//           aria-labelledby="featured-speakers"
//         >
//           <div className="mx-auto max-w-6xl">
//             <h2 id="featured-speakers" className="text-2xl font-bold">
//               Featured Speakers
//             </h2>
//             <div
//               className="mb-6 mt-2 h-1 w-12 rounded-full bg-[#E25238]"
//               aria-hidden="true"
//             />
//             <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
//               {speakers.map((card, index) => (
//                 <EventCard key={card._id || index} card={card} speaker />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//       {template !== "upcoming" && gallery.length > 0 && (
//         <section
//           className="w-full bg-white px-5 py-9 sm:px-8 sm:py-11 lg:px-12 lg:py-12 "
//           aria-labelledby="event-gallery"
//         >
//           <div className="mx-auto max-w-6xl">
//             <h2 id="event-gallery" className="text-center text-2xl font-bold">
//               Event Gallery
//             </h2>
//             <div className="mt-8 space-y-10">
//               {gallery.map((group, index) => (
//                 <div key={group._id || index}>
//                   <h3 className="text-center text-base font-bold tracking-wide flex item-center w-full justify-center uppercase">
//                     <span className="mb-1 block font-semibold uppercase text-[#E25238]">
//                       Session {String(index + 1).padStart(2, "0")} : &nbsp;
//                     </span>
//                     {group.heading}
//                   </h3>
//                   {group.description && (
//                     <p className="mx-auto mt-2 max-w-2xl whitespace-pre-line text-center text-sm text-slate-600">
//                       {group.description}
//                     </p>
//                   )}
//                   <div
//                     className={`mt-5 grid gap-6 sm:grid-cols-2 ${workshop ? "" : "lg:grid-cols-3"}`}
//                   >
//                     {group.cards.map((card, cardIndex) => (
//                       <EventCard key={card._id || cardIndex} card={card} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import { eventEndTime, eventTemplate } from "../../../backend/utils/eventStage";

function webUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function photoUrl(value, width) {
  const src = webUrl(value);
  if (!src) return undefined;
  const url = new URL(src);
  const segments = url.pathname.split("/image/upload/");
  if (url.hostname === "res.cloudinary.com" && segments.length === 2) {
    url.pathname = `${segments[0]}/image/upload/f_auto,q_auto,c_limit,w_${width}/${segments[1]}`;
    return url.href;
  }
  return src;
}

function EventCard({ card, speaker }) {
  const href = webUrl(card.url);
  const src = photoUrl(card.imageUrl, speaker ? 640 : 1200);
  const Tag = href ? "a" : "article";
  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className={`group block min-w-0 overflow-hidden rounded-lg ${href ? "hover:text-[#C9452E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E25238]" : ""}`}
    >
      {src && (
        <img
          src={src}
          srcSet={`${photoUrl(card.imageUrl, 320)} 320w, ${photoUrl(card.imageUrl, 640)} 640w${speaker ? "" : `, ${src} 1200w`}`}
          sizes={
            speaker
              ? "(min-width: 1024px) 270px, 50vw"
              : "(min-width: 1024px) 570px, (min-width: 640px) 50vw, 100vw"
          }
          alt={card.imageAlt || ""}
          loading="lazy"
          decoding="async"
          className={`w-full rounded-lg bg-slate-100 object-cover ${speaker ? "aspect-[4/3] object-top" : "aspect-video"}`}
        />
      )}
      <h4
        className={`mt-3 break-words text-sm font-bold ${href ? "underline underline-offset-2" : ""}`}
      >
        {card.name}
      </h4>
      {card.subtitle && (
        <p
          className={`mt-1 break-words text-sm text-slate-600 ${href ? "underline underline-offset-2 group-hover:text-[#C9452E]" : ""}`}
        >
          {card.subtitle}
        </p>
      )}
      {speaker && card.description && (
        <p className="mt-2 whitespace-pre-line break-words text-sm text-slate-600">
          {card.description}
        </p>
      )}
    </Tag>
  );
}

export function useEventTemplate(event) {
  const [now, setNow] = useState(Date.now);
  const end = eventEndTime(event);
  useEffect(() => {
    if (!Number.isFinite(end) || now >= end) return;
    const refresh = () => setNow(Date.now());
    const timer = window.setTimeout(
      refresh,
      Math.max(0, Math.min(end - Date.now(), 2147483647)),
    );
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [end, now]);
  return eventTemplate(event, Math.max(now, Date.now()));
}

export default function EventTemplateSections({
  event,
  template: selectedTemplate,
}) {
  const automaticTemplate = useEventTemplate(event);
  const template = selectedTemplate || automaticTemplate;
  const { speakers = [], gallery = [] } = event?.eventSections || {};
  const workshop = template === "completed-workshop";

  return (
    <>
      {speakers.length > 0 && (
        <section
          className="bg-white px-5 py-10 text-[#1E293B] sm:px-8"
          aria-labelledby="featured-speakers"
        >
          <div className="mx-auto max-w-6xl">
            <h2 id="featured-speakers" className="text-2xl font-bold">
              Featured Speakers
            </h2>
            <div
              className="mb-6 mt-2 h-1 w-12 rounded-full bg-[#E25238]"
              aria-hidden="true"
            />
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {speakers.map((card, index) => (
                <EventCard key={card._id || index} card={card} speaker />
              ))}
            </div>
          </div>
        </section>
      )}
      {template !== "upcoming" && gallery.length > 0 && (
        <section
          className="bg-[#FDF6F3] px-5 py-10 text-[#1E293B] sm:px-8"
          aria-labelledby="event-gallery"
        >
          <div className="mx-auto max-w-6xl">
            <h2 id="event-gallery" className="text-center text-2xl font-bold">
              Event Gallery
            </h2>
            <div className="mt-6 space-y-10">
              {gallery.map((group, index) => (
                <div key={group._id || index}>
                  <h3 className="mb-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center uppercase md:text-base">
                    <span className="block font-semibold uppercase text-[#E25238]">
                      Session {String(index + 1).padStart(2, "0")} : &nbsp;
                    </span>
                    {group.heading.replace(/^session\s+\d+\s*[:–—-]\s*/i, "")}
                  </h3>
                  {group.description && (
                    <p className="mx-auto mt-2 max-w-2xl whitespace-pre-line text-center text-sm text-slate-600">
                      {group.description}
                    </p>
                  )}
                  <div
                    className={`mt-5 grid gap-6 sm:grid-cols-2 ${workshop ? "" : "lg:grid-cols-3"}`}
                  >
                    {group.cards.map((card, cardIndex) => (
                      <EventCard key={card._id || cardIndex} card={card} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
