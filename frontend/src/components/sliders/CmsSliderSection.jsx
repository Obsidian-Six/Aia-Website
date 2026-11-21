// import { useEffect, useState } from "react";
// import ReusableCardSlider from "./ReusableCardSlider";
// // import ReusableCardSlider from "./ReusableCardSlider";

// const API_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// ).replace(/\/$/, "");

// export default function CmsSliderSection({
//   pageKey,
//   sectionKey,
//   className = "py-12 lg:py-16",
// }) {
//   const [section, setSection] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();

//     async function loadContent() {
//       setLoading(true);
//       setError(false);

//       try {
//         const response = await fetch(
//           `${API_URL}/sliders/${encodeURIComponent(
//             pageKey
//           )}/${encodeURIComponent(sectionKey)}`,
//           { signal: controller.signal }
//         );

//         const result = await response.json();

//         if (!response.ok || !result.success) {
//           throw new Error("Unable to load slider content");
//         }

//         setSection(result.data);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("CMS slider:", err);
//           setError(true);
//         }
//       } finally {
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadContent();

//     return () => controller.abort();
//   }, [pageKey, sectionKey]);

//   if (loading) {
//     return (
//       <div className="mx-auto max-w-6xl animate-pulse px-4 py-12">
//         <div className="h-7 w-56 rounded bg-slate-100" />
//         <div className="mt-5 h-64 rounded-lg bg-slate-100" />
//       </div>
//     );
//   }

//   if (error || !section || !section.isActive) {
//     return null;
//   }

//   const slides = [
//     ...(section.intro?.enabled !== false && section.intro?.title
//       ? [
//           {
//             id: "intro",
//             type: "intro",
//             eyebrow: section.intro.eyebrow,
//             title: section.intro.title,
//             color: section.intro.color,
//           },
//         ]
//       : []),
//     ...(section.cards || []).map((card) => ({
//       id: card._id,
//       title: card.title,
//       description: card.description,
//       image: card.imageUrl,
//       imageAlt: card.imageAlt,
//       link: card.link,
//       linkText: card.linkText,
//     })),
//   ];

//   if (!slides.length) return null;

//   return (
//     <section className={className}>
//       {(section.heading || section.subtitle) && (
//         <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">

//         <div className="mx-auto max-w-5xl text-center">
//           {section.heading && (
//             <h2 className="mb-8 text-4xl font-black leading-[1.05] tracking-[-0.035em] text-[#1F2937] sm:mb-6 sm:text-5xl lg:mb-16 lg:text-[54px] font-semibold">
//               {section.heading}
//             </h2>
//           )}

//           {section.subtitle && (
//             <p className="text-sm font-normal leading-[1.7] text-gray-600 sm:text-base sm:leading-[1.7] lg:text-lg lg:leading-[1.75] mb-5">
//               {section.subtitle}
//             </p>
//           )}
//         </div>
//         </div>
//       )}

//       <ReusableCardSlider
//         slides={slides}
//         visibleSlides={section.visibleSlides || 3}
//         introColor={section.intro?.color || "bg-[#E52B18]"}
//         accentColor={section.accentColor || "#E96F62"}
//       />
//     </section>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import ReusableCardSlider from "./ReusableCardSlider";
// import { getEvents } from "../../services/api";

// const API_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// ).replace(/\/$/, "");

// export default function CmsSliderSection({
//   pageKey,
//   sectionKey,
//   className = "py-12 lg:py-16",
//   includeEvents = false,
// }) {
//   const [section, setSection] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();
//     let mounted = true;

//     async function loadContent() {
//       setLoading(true);
//       setError(false);

//       try {
//         // Load existing CMS slider data.
//         const response = await fetch(
//           `${API_URL}/sliders/${encodeURIComponent(
//             pageKey
//           )}/${encodeURIComponent(sectionKey)}`,
//           { signal: controller.signal }
//         );

//         const result = await response.json();

//         if (!response.ok || !result.success) {
//           throw new Error("Unable to load slider content");
//         }

//         if (mounted) {
//           setSection(result.data);
//         }

//         // Reuse the same events API as the /events page.
//         if (includeEvents) {
//           try {
//             const eventData = await getEvents();

//             if (mounted && Array.isArray(eventData)) {
//               const activeEvents = eventData
//                 .filter((event) => event.isActive !== false)
//                 .sort(
//                   (a, b) => (a.order ?? 0) - (b.order ?? 0)
//                 );

//               setEvents(activeEvents);
//             }
//           } catch (eventError) {
//             console.error(
//               "Unable to load home events:",
//               eventError
//             );

//             if (mounted) setEvents([]);
//           }
//         }
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("CMS slider:", err);

//           if (mounted) {
//             setError(true);
//           }
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadContent();

//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, [pageKey, sectionKey, includeEvents]);

//   // Existing CMS cards + automatically fetched events.
//   const slides = useMemo(() => {
//     if (!section) return [];

//     const introSlides =
//       section.intro?.enabled !== false && section.intro?.title
//         ? [
//             {
//               id: "intro",
//               type: "intro",
//               eyebrow: section.intro.eyebrow,
//               title: section.intro.title,
//               color: section.intro.color,
//             },
//           ]
//         : [];

//     // Existing Insights / CMS cards.
//     const cmsCards = (section.cards || []).map((card) => ({
//       id: card._id,
//       type: "content",
//       title: card.title,
//       description: card.description,
//       image: card.imageUrl,
//       imageAlt: card.imageAlt,
//       link: card.link,
//       linkText: card.linkText,
//     }));

//     // Events created from the existing Events CMS.
//     const eventCards = includeEvents
//       ? events.map((event) => ({
//           id: `event-${event._id}`,
//           type: "content",
//           title: event.title || event.heading,
//           description: event.description || event.text,
//           image: event.imageUrl,
//           imageAlt:
//             event.imageAlt ||
//             event.title ||
//             event.heading ||
//             "AIA Event",
//           link: event.slug
//             ? `/events/${event.slug}`
//             : "",
//           linkText: "Event Details",
//         }))
//       : [];

//     return [
//       ...introSlides,
//       ...cmsCards,
//       ...eventCards,
//     ];
//   }, [section, events, includeEvents]);

//   if (loading) {
//     return (
//       <div className="mx-auto max-w-6xl animate-pulse px-4 py-12">
//         <div className="h-7 w-56 rounded bg-slate-100" />
//         <div className="mt-5 h-64 rounded-lg bg-slate-100" />
//       </div>
//     );
//   }

//   if (error || !section || !section.isActive) {
//     return null;
//   }

//   if (!slides.length) return null;

//   return (
//     <section className={className}>
//       {(section.heading || section.subtitle) && (
//         <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
//           <div className="mx-auto max-w-5xl text-center">
//             {section.heading && (
//               <h2 className="mb-8 text-4xl font-black leading-[1.05] tracking-[-0.035em] text-[#1F2937] sm:mb-6 sm:text-5xl lg:mb-16 lg:text-[54px] font-semibold">
//                 {section.heading}
//               </h2>
//             )}

//             {section.subtitle && (
//               <p className="mb-5 text-sm font-normal leading-[1.7] text-gray-600 sm:text-base sm:leading-[1.7] lg:text-lg lg:leading-[1.75]">
//                 {section.subtitle}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <ReusableCardSlider
//         slides={slides}
//         visibleSlides={section.visibleSlides || 3}
//         introColor={section.intro?.color || "bg-[#E52B18]"}
//         accentColor={section.accentColor || "#E96F62"}
//       />
//     </section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import ReusableCardSlider from "./ReusableCardSlider";
import { getArticles, getNews } from "../../services/api";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

function getEntryDescription(item) {
  if (item.description) return item.description;
  if (item.excerpt) return item.excerpt;
  if (item.summary) return item.summary;

  if (Array.isArray(item.paragraphs) && item.paragraphs.length) {
    const firstParagraph = item.paragraphs[0];

    return typeof firstParagraph === "string"
      ? firstParagraph
      : firstParagraph?.text || firstParagraph?.content || "";
  }

  if (Array.isArray(item.contentBlocks) && item.contentBlocks.length) {
    const textBlock = item.contentBlocks.find(
      (block) => block.text || block.content || block.description,
    );

    return (
      textBlock?.text || textBlock?.content || textBlock?.description || ""
    );
  }

  return "";
}

function normalizePublication(item, type) {
  const slug = item.slug;

  return {
    id: `${type}-${item._id || slug}`,
    type: "content",
    entryType: type,
    title: item.title || "",
    description: getEntryDescription(item),
    image: item.imageUrl || item.image || item.detailHeroImage || "",
    imageAlt:
      item.imageAlt ||
      item.title ||
      (type === "article" ? "AIA Article" : "AIA News"),
    link: slug
      ? `/industry-insight/${type === "article" ? "articles" : "news"}/${slug}`
      : "",
    linkText: type === "article" ? "Read Article" : "Read News",
  };
}

export default function CmsSliderSection({
  pageKey,
  sectionKey,
  className = "py-12 lg:py-16",
  includePublications = false,
}) {
  const [section, setSection] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadContent() {
      setLoading(true);
      setError(false);

      try {
        // Load existing CMS slider configuration.
        const response = await fetch(
          `${API_URL}/sliders/${encodeURIComponent(
            pageKey,
          )}/${encodeURIComponent(sectionKey)}`,
          { signal: controller.signal },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Unable to load slider content");
        }

        if (mounted) {
          setSection(result.data);
        }

        // Fetch all public Articles and News.
        if (includePublications) {
          const [articlesResult, newsResult] = await Promise.allSettled([
            getArticles(),
            getNews(),
          ]);

          const articles =
            articlesResult.status === "fulfilled" &&
            Array.isArray(articlesResult.value)
              ? articlesResult.value
              : [];

          const news =
            newsResult.status === "fulfilled" && Array.isArray(newsResult.value)
              ? newsResult.value
              : [];

          if (articlesResult.status === "rejected") {
            console.error("Unable to load articles:", articlesResult.reason);
          }

          if (newsResult.status === "rejected") {
            console.error("Unable to load news:", newsResult.reason);
          }

          const allEntries = [
            ...articles.map((item) => normalizePublication(item, "article")),
            ...news.map((item) => normalizePublication(item, "news")),
          ];

          // Newest published entries first.
          allEntries.sort((a, b) => {
            const itemA = [...articles, ...news].find((item) =>
              a.id.endsWith(item._id || item.slug),
            );

            const itemB = [...articles, ...news].find((item) =>
              b.id.endsWith(item._id || item.slug),
            );

            return (
              new Date(itemB?.publishedAt || itemB?.createdAt || 0) -
              new Date(itemA?.publishedAt || itemA?.createdAt || 0)
            );
          });

          if (mounted) {
            setPublications(allEntries);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("CMS slider:", err);

          if (mounted) {
            setError(true);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [pageKey, sectionKey, includePublications]);

  const slides = useMemo(() => {
    if (!section) return [];

    const introSlides =
      section.intro?.enabled !== false && section.intro?.title
        ? [
            {
              id: "intro",
              type: "intro",
              // eyebrow: section.intro.eyebrow,
              eyebrow: pageKey === "home" ? "Insights" : section.intro.eyebrow,
              title: section.intro.title,
              color: section.intro.color,
            },
          ]
        : [];

    // Existing manually added CMS cards.
    const cmsCards = (section.cards || []).map((card) => ({
      id: card._id,
      type: "content",
      title: card.title,
      designation: card.designation,
      description: card.description,
      image: card.imageUrl,
      imageAlt: card.imageAlt,
      link: card.link,
      linkText: card.linkText,
    }));

    // All Articles + News entries.
    return [...introSlides, ...cmsCards, ...publications];
  }, [section, publications]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-12">
        <div className="h-7 w-56 rounded bg-slate-100" />
        <div className="mt-5 h-64 rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (error || !section || !section.isActive) {
    return null;
  }

  if (!slides.length) return null;

  return (
    <section className={className}>
      {(section.heading || section.subtitle) && (
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl text-center">
            {section.heading && (
              <h2 className="mb-8 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#1F2937] sm:mb-6 sm:text-5xl lg:mb-4 lg:text-[54px] font-semibold">
                {section.heading}
              </h2>
            )}

            {/* {section.subtitle && (
              <p className="mb-5 text-sm font-normal leading-[1.7] text-gray-600 sm:text-base sm:leading-[1.7] lg:text-lg lg:leading-[1.75]">
                {section.subtitle}
              </p>
            )} */}
            {section.subtitle && (
              <p className="mb-5 whitespace-pre-line text-sm font-normal leading-[1.5] text-gray-600 sm:text-base sm:leading-[1.5] lg:text-lg lg:leading-[1.5]">
                {section.subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <ReusableCardSlider
        slides={slides}
        visibleSlides={section.visibleSlides || 3}
        introColor={section.intro?.color || "bg-[#E52B18]"}
        accentColor={section.accentColor || "#E96F62"}
      />
    </section>
  );
}
