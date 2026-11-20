
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { ArrowLeft, ArrowRight, Download } from "lucide-react";
// import { getEvents } from "../../services/api";

// const categories = [
//   "All Events",
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// const normalizeCategory = (category = "") => {
//   const value = category.trim().toLowerCase();

//   if (["conference", "conferences"].includes(value)) return "Conference";
//   if (["workshop", "workshops"].includes(value)) return "Workshops";
//   if (["webinar", "webinars"].includes(value)) return "Webinars";

//   if (["training program", "training programs"].includes(value)) {
//     return "Training Program";
//   }

//   if (["exhibition", "exhibitions"].includes(value)) {
//     return "Exhibitions";
//   }

//   return category;
// };

// const introContent = {
//   eyebrow: "Events",
//   description:
//     'Most AIA events are free to attend. Drop pricing fields from the card format entirely rather than showing "Free" everywhere. Only surface a price field on the rare occasion one applies.',
// };

// import { Link } from "react-router-dom";

// const EventCard = ({ event }) => {
//   return (
//     <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-md bg-[#F7F8FA] transition-shadow duration-500 hover:shadow-lg">

//       {/* Event Image */}
//       <Link
//         to={`/events/${event.slug}`}
//         className="relative block aspect-[16/9] overflow-hidden bg-slate-200"
//       >
//         {event.imageUrl && (
//           <img
//             src={event.imageUrl}
//             alt={event.title || event.heading || "AIA Event"}
//             loading="lazy"
//             className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//           />
//         )}

//         {event.date && (
//           <span className="absolute bottom-3 right-3 rounded-md bg-[#E87568] px-3 py-2 text-[10px] font-bold text-white">
//             {event.date}
//           </span>
//         )}
//       </Link>

//       {/* Event Content */}
//       <div className="flex flex-1 flex-col p-4 sm:p-5">
//         <span className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#E87568]">
//           {normalizeCategory(event.category)}
//         </span>

//         <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-[#202B3D] sm:text-lg">
//           {event.title || event.heading}
//         </h3>

//         <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-[#354052] sm:text-[13px]">
//           {event.description || event.text}
//         </p>

//        {/* Event Actions */}
// <div className="mt-auto flex flex-wrap items-center gap-4">

//   {/* Event Details */}
//   <Link
//     to={`/events/${event.slug}`}
//     className="w-fit text-xs font-semibold text-[#D94F42] underline underline-offset-2 transition-colors hover:text-[#A92C20]"
//   >
//     Event Details
//   </Link>

//   {/* Download Brochure PDF */}
//   {event.hasBrochure && (
//     <a
//       href={event.brochureDownloadUrl || event.brochureUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       download
//       className="inline-flex items-center gap-1.5 rounded-md bg-[#E87568] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#D94F42]"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <Download className="h-3.5 w-3.5" />
//       Download PDF
//     </a>
//   )}

// </div>
//       </div>
//     </article>
//   );
// };

// export default function EventsSection() {
//   const [events, setEvents] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All Events");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const sliderRef = useRef(null);

//   const ITEMS_PER_PAGE = 2;

//   useEffect(() => {
//     let mounted = true;

//     const fetchEvents = async () => {
//       try {
//         const data = await getEvents();

//         if (mounted && Array.isArray(data)) {
//           setEvents(
//             data
//               .filter((event) => event.isActive !== false)
//               .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
//           );
//         }
//       } catch (error) {
//         console.error("Unable to fetch events:", error);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchEvents();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const filteredEvents = useMemo(() => {
//     if (activeCategory === "All Events") return events;

//     return events.filter(
//       (event) => normalizeCategory(event.category) === activeCategory
//     );
//   }, [events, activeCategory]);

//   const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

//   const changeCategory = (category) => {
//     setActiveCategory(category);
//     setActiveIndex(0);

//     if (sliderRef.current) {
//       sliderRef.current.scrollTo({
//         left: 0,
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleScroll = () => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     const isMobile = window.innerWidth < 768;
//     const pageWidth = slider.clientWidth;

//     if (!pageWidth) return;

//     const index = Math.round(slider.scrollLeft / pageWidth);
//     setActiveIndex(
//       isMobile ? index : Math.min(index, Math.max(totalPages - 1, 0))
//     );
//   };

//   const moveSlider = (direction) => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     const isMobile = window.innerWidth < 768;

//     slider.scrollBy({
//       left: direction * slider.clientWidth,
//       behavior: "smooth",
//     });
//   };

//   const pageNumber = (number) => String(number).padStart(2, "0");

//   const displayedCurrent = filteredEvents.length
//     ? activeIndex + 1
//     : 0;

//   const displayedTotal =
//     typeof window !== "undefined" && window.innerWidth >= 768
//       ? totalPages
//       : filteredEvents.length;

//   return (
//     <section
//       id="events-section"
//       className="w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
//     >
//       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

//         {/* Category Filters */}
//         <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
//           {categories.map((category) => (
//             <button
//               key={category}
//               type="button"
//               onClick={() => changeCategory(category)}
//               className={`shrink-0 rounded-md border border-dashed px-3 py-2 text-[11px] font-semibold transition-all duration-300 sm:text-xs ${
//                 activeCategory === category
//                   ? "border-[#E87568] bg-[#E87568] text-white"
//                   : "border-[#E87568]/50 bg-white text-[#263244] hover:bg-[#FFF2EF]"
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Main Layout */}
//         <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:gap-5">

//           {/* Intro Card */}
//           <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-md bg-gradient-to-br from-[#D52B13] via-[#E33C27] to-[#F0786D] p-5 text-white sm:min-h-[300px] sm:p-6">
//             <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

//             <div className="relative z-10">
//               <span className="mb-3 block text-[11px] font-medium">
//                 {introContent.eyebrow}
//               </span>

//               <p className="relative z-10 max-w-[300px] text-[23px] font-medium leading-[1.18] tracking-[-0.025em] sm:text-[26px] md:text-[20px] lg:text-[24px] xl:text-[24px]">
//                 {introContent.description}
//               </p>
//             </div>
//           </div>

//           {/* Events Slider */}
//           <div className="min-w-0 md:col-span-2">
//             {loading ? (
//               <div className="flex min-h-[260px] items-center justify-center rounded-md bg-slate-50 text-sm text-slate-500">
//                 Loading events...
//               </div>
//             ) : filteredEvents.length > 0 ? (
//               <div
//                 ref={sliderRef}
//                 onScroll={handleScroll}
//                 className="flex w-full snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth scrollbar-hide md:gap-5"
//                 style={{
//                   scrollBehavior: "smooth",
//                   WebkitOverflowScrolling: "touch",
//                 }}
//               >
//                 {filteredEvents.map((event) => (
//                   <div
//                     key={event._id}
//                     className="w-full shrink-0 snap-start md:w-[calc((100%-1.25rem)/2)]"
//                   >
//                     <EventCard event={event} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex min-h-[260px] items-center justify-center rounded-md bg-[#F7F8FA] px-5 text-center">
//                 <p className="text-sm text-slate-500">
//                   No events available in this category.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Slider Controls */}
//         {!loading && filteredEvents.length > 0 && (
//           <div className="mt-5 flex items-center justify-between">
//             <div className="flex items-center gap-1 text-sm text-[#263244]">
//               <span className="font-bold">
//                 {pageNumber(displayedCurrent)}
//               </span>

//               <span className="text-slate-400">/</span>

//               <span className="text-slate-500">
//                 {pageNumber(displayedTotal)}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => moveSlider(-1)}
//                 disabled={activeIndex === 0}
//                 aria-label="Previous events"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E87568]/50 text-[#E87568] transition-all hover:bg-[#FFF2EF] disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => moveSlider(1)}
//                 disabled={
//                   activeIndex >=
//                   (typeof window !== "undefined" &&
//                   window.innerWidth >= 768
//                     ? totalPages - 1
//                     : filteredEvents.length - 1)
//                 }
//                 aria-label="Next events"
//                 className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E87568] text-white transition-all hover:bg-[#D94F42] disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/api";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/$/, "");

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const categories = [
  "All Events",
  "Conference",
  "Workshops",
  "Webinars",
  "Training Program",
  "Exhibitions",
];

const normalizeCategory = (category = "") => {
  const value = category.trim().toLowerCase();

  if (["conference", "conferences"].includes(value)) return "Conference";
  if (["workshop", "workshops"].includes(value)) return "Workshops";
  if (["webinar", "webinars"].includes(value)) return "Webinars";

  if (["training program", "training programs"].includes(value)) {
    return "Training Program";
  }

  if (["exhibition", "exhibitions"].includes(value)) {
    return "Exhibitions";
  }

  return category;
};

const introContent = {
  eyebrow: "Events",
  description:
    `Explore AIA's upcoming and past events, including conferences, workshops, webinars, training programmes and industry exhibitions. Stay informed about opportunities to learn, exchange knowledge, connect with industry professionals and engage with the wider automation ecosystem.`,
};

// =====================================================
// EVENT CARD
// =====================================================

const EventCard = ({ event, onDownload, downloadingId }) => {
  const isDownloading = downloadingId === event._id;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-md bg-[#F7F8FA] transition-shadow duration-500 hover:shadow-lg">
      {/* Event Image */}
      <Link
        to={`/events/${event.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-slate-200"
      >
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title || event.heading || "AIA Event"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {event.date && (
          <span className="absolute bottom-3 right-3 rounded-md bg-[#E87568] px-3 py-2 text-[10px] font-bold text-white">
            {event.date}
          </span>
        )}
      </Link>

      {/* Event Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#E87568]">
          {normalizeCategory(event.category)}
        </span>

        <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-[#202B3D] sm:text-lg">
          {event.title || event.heading}
        </h3>

        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-[#354052] sm:text-[13px]">
          {event.description || event.text}
        </p>

        {/* Event Actions */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          {/* Event Details */}
          <Link
            to={`/events/${event.slug}`}
            className="w-fit text-xs font-semibold text-[#D94F42] underline underline-offset-2 transition-colors hover:text-[#A92C20]"
          >
            Event Details
          </Link>

          {/* Protected Brochure Download */}
          {event.hasBrochure && (
            <button
              type="button"
              onClick={() => onDownload(event)}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#E87568] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#D94F42] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

// =====================================================
// EVENTS SECTION
// =====================================================

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Shared brochure enquiry popup state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [formError, setFormError] = useState("");

  const sliderRef = useRef(null);

  const ITEMS_PER_PAGE = 2;

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        if (mounted && Array.isArray(data)) {
          setEvents(
            data
              .filter((event) => event.isActive !== false)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          );
        }
      } catch (error) {
        console.error("Unable to fetch events:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // OPEN / CLOSE ENQUIRY POPUP
  // =====================================================

  const openEnquiry = (event) => {
    setSelectedEvent(event);
    setFormData(initialForm);
    setFormError("");
    setShowEnquiry(true);
  };

  const closeEnquiry = () => {
    if (submitting) return;

    setShowEnquiry(false);
    setSelectedEvent(null);
    setFormData(initialForm);
    setFormError("");
  };

  // =====================================================
  // FORM INPUT HANDLER
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DOWNLOAD EVENT BROCHURE
  //
  // GET /events/:id/brochure/download
  //
  // Valid cookie   -> PDF response
  // Missing cookie -> 401 / 403, open enquiry popup
  // =====================================================

  const downloadEventBrochure = async (event) => {
    if (!event?._id || !event?.hasBrochure) return;

    setDownloadingId(event._id);
    setFormError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${event._id}/brochure/download`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        openEnquiry(event);
        return;
      }

      if (!response.ok) {
        let message = "Unable to download event brochure. Please try again.";

        try {
          const result = await response.json();
          if (result.message) message = result.message;
        } catch {
          // Keep default error message.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download =
        event.brochureFileName ||
        `${event.title || "AIA-Event"}-Brochure.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Event brochure download error:", error);
      setFormError(
        error.message || "Something went wrong while downloading."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // =====================================================
  // SUBMIT BROCHURE ENQUIRY
  //
  // POST /brochure-enquiries
  //
  // Saves enquiry in CMS and sets shared access cookie.
  // After successful submission, requested PDF downloads.
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent?._id) return;

    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setFormError("Please fill in all the fields.");
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.email.trim()
    );

    if (!emailValid) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/brochure-enquiries`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            formType: "brochure-enquiry",
            resourceType: "event",
            resourceId: selectedEvent._id,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      const eventToDownload = selectedEvent;

      setShowEnquiry(false);
      setSelectedEvent(null);
      setFormData(initialForm);

      // Download the requested Event PDF after cookie is set.
      await downloadEventBrochure(eventToDownload);
    } catch (error) {
      console.error("Event brochure enquiry error:", error);
      setFormError(
        error.message || "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FILTER EVENTS
  // =====================================================

  const filteredEvents = useMemo(() => {
    if (activeCategory === "All Events") return events;

    return events.filter(
      (event) => normalizeCategory(event.category) === activeCategory
    );
  }, [events, activeCategory]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const changeCategory = (category) => {
    setActiveCategory(category);
    setActiveIndex(0);

    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const isMobile = window.innerWidth < 768;
    const pageWidth = slider.clientWidth;

    if (!pageWidth) return;

    const index = Math.round(slider.scrollLeft / pageWidth);

    setActiveIndex(
      isMobile ? index : Math.min(index, Math.max(totalPages - 1, 0))
    );
  };

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction * slider.clientWidth,
      behavior: "smooth",
    });
  };

  const pageNumber = (number) => String(number).padStart(2, "0");

  const displayedCurrent = filteredEvents.length
    ? activeIndex + 1
    : 0;

  const displayedTotal =
    typeof window !== "undefined" && window.innerWidth >= 768
      ? totalPages
      : filteredEvents.length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      id="events-section"
      className="w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Category Filters */}
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => changeCategory(category)}
              className={`shrink-0 rounded-md border border-dashed px-3 py-2 text-[11px] font-semibold transition-all duration-300 sm:text-xs ${
                activeCategory === category
                  ? "border-[#E87568] bg-[#E87568] text-white"
                  : "border-[#E87568]/50 bg-white text-[#263244] hover:bg-[#FFF2EF]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:gap-5">
          {/* Intro Card */}
          <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-md bg-gradient-to-br from-[#D52B13] via-[#E33C27] to-[#F0786D] p-5 text-white sm:min-h-[300px] sm:p-6">
            <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative z-10">
              <span className="mb-3 block text-[16px] font-medium">
                {introContent.eyebrow}
              </span>

          <p className="relative z-10 max-w-[500px] text-[18px] font-medium leading-[1.18] tracking-[-0.025em] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px]">
                {introContent.description}
              </p>
            </div>
          </div>

          {/* Events Slider */}
          <div className="min-w-0 md:col-span-2">
            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-md bg-slate-50 text-sm text-slate-500">
                Loading events...
              </div>
            ) : filteredEvents.length > 0 ? (
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex w-full snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth scrollbar-hide md:gap-5"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="w-full shrink-0 snap-start md:w-[calc((100%-1.25rem)/2)]"
                  >
                    <EventCard
                      event={event}
                      onDownload={downloadEventBrochure}
                      downloadingId={downloadingId}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] items-center justify-center rounded-md bg-[#F7F8FA] px-5 text-center">
                <p className="text-sm text-slate-500">
                  No events available in this category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Slider Controls */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-[#263244]">
              <span className="font-bold">
                {pageNumber(displayedCurrent)}
              </span>

              <span className="text-slate-400">/</span>

              <span className="text-slate-500">
                {pageNumber(displayedTotal)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveSlider(-1)}
                disabled={activeIndex === 0}
                aria-label="Previous events"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E87568]/50 text-[#E87568] transition-all hover:bg-[#FFF2EF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => moveSlider(1)}
                disabled={
                  activeIndex >=
                  (typeof window !== "undefined" &&
                  window.innerWidth >= 768
                    ? totalPages - 1
                    : filteredEvents.length - 1)
                }
                aria-label="Next events"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E87568] text-white transition-all hover:bg-[#D94F42] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          SHARED BROCHURE ENQUIRY POPUP
      ===================================================== */}

      {showEnquiry && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEnquiry();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-brochure-popup-title"
            className="relative my-auto w-full max-w-[520px] rounded-md bg-white p-6 shadow-2xl sm:p-9"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeEnquiry}
              disabled={submitting}
              aria-label="Close popup"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
            >
              <X size={21} />
            </button>

            {/* Popup Heading */}
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E52B18]">
              Brochure Access
            </span>

            <h3
              id="event-brochure-popup-title"
              className="mt-3 pr-7 text-2xl font-bold text-[#17202B] sm:text-3xl"
            >
              Get Your Brochure
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Please share your details to access the brochure
              {selectedEvent?.title
                ? ` for ${selectedEvent.title}.`
                : "."}
            </p>

            {/* Enquiry Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="event-brochure-name"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Name <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="event-brochure-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label
                  htmlFor="event-brochure-phone"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Phone Number <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="event-brochure-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label
                  htmlFor="event-brochure-email"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Email Address <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="event-brochure-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label
                  htmlFor="event-brochure-message"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Message <span className="text-[#E52B18]">*</span>
                </label>

                <textarea
                  id="event-brochure-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={3}
                  required
                  className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              {formError && (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E52B18] px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C92313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit & Download
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your details will be used to process your brochure request.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
