// import React from "react";
// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import AutomationEcosystem from "../../components/AutomationEcosystem";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";

// export default function EventDetailsPage() {
//   const automationItems = [
//     {
//       id: 1,
//       image: "/Pillars/Technology and Cloud Licensing.png",
//       alt: "Automotive",
//     },
//     {
//       id: 2,
//       image: "/Pillars/Education & Training.png",
//       alt: "Discrete Manufacturing",
//     },
//     {
//       id: 3,
//       image: "/Pillars/Research & Consulting.png",
//       alt: "System Integrators",
//     },
//     {
//       id: 4,
//       image: "/Pillars/Simulation.png",
//       alt: "Electricals & Electricals",
//     },
//     {
//       id: 5,
//       image: "/Pillars/Skill Certification.png",
//       alt: "Machine & Machine Tools",
//     },
//   ];
//   return (
//     <main>
//       <SplitFeatureCard
//         eyebrow=""
//         title="Driving India's Smart Manufacturing Mission"
//         description=""
//         image="/smart-maintenance-management.png"
//         imageAlt="Smart Maintenance Management"
//         imagePosition="right"
//         background="dark"
//       />
//       <EventIntroductionSection
//         event={{
//           date: "Friday, 16th Oct, 2026",
//           title: "AI & Industrial Manufacturing",
//           venue:
//             "At research and innovation park, IIT Delhi campus, Hauz Khas, New Delhi - 110016",
//           time: "From 10 am - 5pm",
//           saveDateLink: "/events/industrial-automation.ics",
//           registrationLink: "/contact-us",
//           locationLink: "https://maps.google.com/?q=IIT+Delhi",
//         }}
//         partners={[
//           {
//             name: "INDXO",
//             logo: "/member-directory-images/indxo.png",
//           },
//           {
//             name: "Yantra247",
//             logo: "/member-directory-images/yantra.png",
//           },
//           {
//             name: "Renata",
//             logo: "/member-directory-images/renata.png",
//           },
//           {
//             name: "JTN",
//             logo: "/member-directory-images/jendamark.png",
//           },
//         ]}
//         supporters={[
//           {
//             name: "ASDC",
//             logo: "/member-directory-images/asdc.png",
//           },
//         ]}
//         contact={{
//           email: "info@aia.org",
//           phone: "",
//           website: "",
//         }}
//       />
//       <EventAgendaSection
//         title="Workshop Agenda"
//         image="/event-agenda-img.png"
//       />
//       {/* <AutomationEcosystem
//               id="pillars"
//               title="Who should attend?"
//               paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//               items={automationItems}
//             /> */}
//       <DynamicContentSection
//         id="who-should-attend"
//         title="Who should attend?"
//         paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//         {...WhatShouldAttendData}
//       />
//     </main>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getEventBySlug } from "../../services/api";

// import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";
// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";

// // Apne existing component ka exact path use karein.
// import DynamicContentSection from "../../components/DynamicContentSection";

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     const fetchEvent = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const data = await getEventBySlug(slug);

//         if (mounted) {
//           setEvent(data);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (mounted) {
//           setError(
//             err.response?.data?.message || "Unable to load event."
//           );
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchEvent();

//     return () => {
//       mounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="text-sm font-semibold text-gray-500">
//           Loading event...
//         </div>
//       </div>
//     );
//   }

//   if (error || !event) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
//         <h1 className="text-2xl font-bold text-[#263247]">
//           Event Not Found
//         </h1>

//         <p className="mt-2 text-sm text-gray-500">
//           {error || "This event may have been removed or is unavailable."}
//         </p>

//         <Link
//           to="/events"
//           className="mt-5 rounded-lg bg-[#E25238] px-5 py-3 text-sm font-semibold text-white"
//         >
//           Back to Events
//         </Link>
//       </div>
//     );
//   }

//   const detail = event.detailPage || {};
//   const hero = detail.hero || {};
//   const introduction = detail.introduction || {};
//   const eventInfo = introduction.eventInfo || {};
//   const agenda = detail.agenda || {};

//   const heroImage = hero.imageUrl || event.imageUrl || "";

//   return (
//     <main className="min-h-screen bg-white">

//       {/* HERO */}
//       {hero.title || hero.description || heroImage ? (
//         <SplitFeatureCard
//           eyebrow={hero.eyebrow || ""}
//           title={hero.title || event.title}
//           description={hero.description || event.description}
//           image={heroImage}
//           imageAlt={hero.imageAlt || event.title}
//           imagePosition={hero.imagePosition || "right"}
//           background={hero.background || "dark"}
//           buttonText=""
//           buttonLink=""
//           name={event.title}
//         />
//       ) : null}

//       {/* INTRODUCTION */}
//       <EventIntroductionSection
//         title={introduction.title || "Introduction"}
//         sections={introduction.sections || []}
//         event={{
//           date: eventInfo.date || event.date || "",
//           title: eventInfo.title || event.title || "",
//           time: eventInfo.time || "",
//           venue: eventInfo.venue || "",
//           saveDateLink: eventInfo.saveDateLink || "",
//           registrationLink: eventInfo.registrationLink || "",
//           locationLink: eventInfo.locationLink || "",
//           website: introduction.contact?.website || "",
//         }}
//         partners={introduction.partners || []}
//         supporters={introduction.supporters || []}
//         contact={{
//           email: introduction.contact?.email || "",
//           phone: introduction.contact?.phone || "",
//           website: introduction.contact?.website || "",
//         }}
//       />

//       {/* AGENDA */}
//       {(agenda.title ||
//         agenda.imageUrl ||
//         agenda.items?.length > 0) && (
//         <EventAgendaSection
//           title={agenda.title || "Event Agenda"}
//           image={agenda.imageUrl || ""}
//           imageAlt={agenda.imageAlt || event.title}
//           agenda={agenda.items || []}
//         />
//       )}

//       {/* DYNAMIC CONTENT */}
//       {Array.isArray(detail.contentSections) &&
//         detail.contentSections.length > 0 && (
//           <DynamicContentSection
//             sections={detail.contentSections}
//           />
//         )}

//     </main>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getEventBySlug } from "../../services/api";

// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";

// function getEventData(response) {
//   return response?.data?.data || response?.data || response;
// }

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getEventBySlug(slug);
//         const eventData = getEventData(response);

//         if (!eventData) {
//           throw new Error("Event not found.");
//         }

//         if (isMounted) {
//           setEvent(eventData);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Unable to load event details."
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (slug) {
//       fetchEvent();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />
//           <p className="mt-4 text-sm text-gray-500">
//             Loading event details...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !event) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="max-w-md text-center">
//           <h1 className="text-2xl font-bold text-[#263247]">
//             Event not found
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             {error || "This event may have been removed or is unavailable."}
//           </p>

//           <Link
//             to="/events"
//             className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   const detailPage = event.detailPage || {};
//   const hero = detailPage.hero || {};
//   const introduction = detailPage.introduction || {};
//   const agenda = detailPage.agenda || {};

//   const heroImage =
//     hero.imageUrl ||
//     hero.image ||
//     event.imageUrl ||
//     "";

//   const introductionSections =
//     introduction.sections || [];

//   const eventInfo = introduction.eventInfo || {};

// const eventVenue =
//   eventInfo.venue || eventInfo.location || "";

// const eventDate = eventInfo.date || event.date || "";

// const eventTime = eventInfo.time || "";

// const registrationLink = eventInfo.registrationLink || "";

// const locationLink =
//   eventInfo.locationLink ||
//   (eventVenue
//     ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventVenue)}`
//     : "");

//   const agendaItems = agenda.items || [];

//   const contentSections = detailPage.contentSections || [];

//   return (
//     <main className="min-h-screen overflow-hidden bg-white">
//       {/* HERO SECTION */}
//       <section
//         className={`relative overflow-hidden ${
//           hero.background === "light"
//             ? "bg-[#FFF9F7] text-[#263247]"
//             : "bg-[#172033] text-white"
//         }`}
//       >
//         <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">
//           <div className="relative z-10">
//             {hero.eyebrow && (
//               <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
//                 {hero.eyebrow}
//               </p>
//             )}

//             <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//               {hero.title || event.title}
//             </h1>

//             {hero.subtitle && (
//               <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
//                 {hero.subtitle}
//               </h2>
//             )}

//             {(hero.description || event.description) && (
//               <p
//                 className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
//                   hero.background === "light"
//                     ? "text-[#596579]"
//                     : "text-white/70"
//                 }`}
//               >
//                 {hero.description || event.description}
//               </p>
//             )}

//             {event.date && (
//               <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
//                 {event.date}
//               </p>
//             )}
//           </div>

//           {heroImage && (
//             <div className="relative">
//               <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />
//               <img
//                 src={heroImage}
//                 alt={hero.imageAlt || hero.title || event.title}
//                 fetchPriority="high"
//                 decoding="async"
//                 className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
//               />
//             </div>
//           )}
//         </div>
//       </section>

//       {/* INTRODUCTION */}
//       {(introduction.title ||
//         introduction.description ||
//         introduction.blocks?.length ||
//         introductionSections.length ||
//         eventInfo.date ||
//         introduction.partners?.length ||
//         introduction.supporters?.length) && (
//         <EventIntroductionSection
//           eyebrow={introduction.eyebrow}
//   title={introduction.title || "Introduction"}
//   description={introduction.description}
//   blocks={introduction.blocks || []}
//   sections={introductionSections}
//   event={{
//   date: eventInfo.date || event.date || "",
//   title: eventInfo.title || event.title || "",
//   time: eventInfo.time || "",
//   venue: eventInfo.venue || "",
//   startDateTime: eventInfo.startDateTime || "",
//   endDateTime: eventInfo.endDateTime || "",
//   registrationLink: eventInfo.registrationLink || "",
//   locationLink: eventInfo.locationLink || "",
//   description: introduction.description || event.description || "",
// }}
//   partners={introduction.partners || []}
//   supporters={introduction.supporters || []}
//   contact={introduction.contact || {}}
//         />
//       )}

//       {/* AGENDA */}
//       {(agenda.title ||
//         agenda.description ||
//         agendaItems.length ||
//         agenda.imageUrl ||
//         agenda.image) && (
//         <EventAgendaSection
//           eyebrow={agenda.eyebrow}
//           title={agenda.title || "Event Agenda"}
//           description={agenda.description}
//           image={agenda.imageUrl || agenda.image || ""}
//           imageAlt={agenda.imageAlt || "Event agenda"}
//           agenda={agendaItems}
//         />
//       )}

//       <DynamicContentSection
//   id="who-should-attend"
//   title="Who should attend?"
//   paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//   {...WhatShouldAttendData}
// />

//       {/* EVENT FOOTER CTA */}
//       {event.eventLink && (
//         <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
//           <div className="mx-auto max-w-3xl">
//             <h2 className="text-2xl font-bold sm:text-3xl">
//               Be a part of this event
//             </h2>

//             <p className="mt-3 text-sm leading-7 text-white/65">
//               Explore the event and connect with the AIA community.
//             </p>

//             <a
//               href={event.eventLink}
//               target={
//                 event.eventLink.startsWith("http")
//                   ? "_blank"
//                   : undefined
//               }
//               rel={
//                 event.eventLink.startsWith("http")
//                   ? "noreferrer"
//                   : undefined
//               }
//               className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
//             >
//               Learn More
//             </a>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getEventBySlug } from "../../services/api";

// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";

// function getEventData(response) {
//   return response?.data?.data || response?.data || response;
// }

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getEventBySlug(slug);
//         const eventData = getEventData(response);

//         if (!eventData) {
//           throw new Error("Event not found.");
//         }

//         if (isMounted) {
//           setEvent(eventData);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Unable to load event details."
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (slug) {
//       fetchEvent();
//     } else {
//       setLoading(false);
//       setError("Event slug is missing.");
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />
//           <p className="mt-4 text-sm text-gray-500">
//             Loading event details...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !event) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="max-w-md text-center">
//           <h1 className="text-2xl font-bold text-[#263247]">
//             Event not found
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             {error || "This event may have been removed or is unavailable."}
//           </p>

//           <Link
//             to="/events"
//             className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   const detailPage = event.detailPage || {};
//   const hero = detailPage.hero || {};
//   const introduction = detailPage.introduction || {};
//   const agenda = detailPage.agenda || {};

//   // HERO IMAGE
//   const heroImage =
//     hero.imageUrl ||
//     hero.image ||
//     event.imageUrl ||
//     "";

//   // INTRODUCTION DATA
//   const introductionSections = introduction.sections || [];
//   const introductionBlocks = introduction.blocks || [];

//   // EVENT INFORMATION FROM CMS
//   const eventInfo = introduction.eventInfo || {};

//   const eventDate =
//     eventInfo.date ||
//     event.date ||
//     "";

//   const eventTitle =
//     eventInfo.title ||
//     event.title ||
//     "";

//   const eventTime =
//     eventInfo.time ||
//     "";

//   const eventVenue =
//     eventInfo.venue ||
//     eventInfo.location ||
//     "";

//   const registrationLink =
//     eventInfo.registrationLink ||
//     "";

//   const locationLink =
//     eventInfo.locationLink ||
//     (eventVenue
//       ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           eventVenue
//         )}`
//       : "");

//   const startDateTime =
//     eventInfo.startDateTime ||
//     "";

//   const endDateTime =
//     eventInfo.endDateTime ||
//     "";

//   const contact = introduction.contact || {};
//   const partners = introduction.partners || [];
//   const supporters = introduction.supporters || [];

//   // AGENDA DATA
//   const agendaItems = agenda.items || [];

//   // ADDITIONAL CONTENT SECTIONS
//   const contentSections = detailPage.contentSections || [];

//   // SHOW INTRODUCTION WHEN ANY INTRODUCTION OR EVENT DATA EXISTS
//   const hasIntroductionContent =
//     introduction.title ||
//     introduction.eyebrow ||
//     introduction.description ||
//     introductionBlocks.length > 0 ||
//     introductionSections.length > 0 ||
//     eventDate ||
//     eventTitle ||
//     eventTime ||
//     eventVenue ||
//     registrationLink ||
//     locationLink ||
//     startDateTime ||
//     endDateTime ||
//     partners.length > 0 ||
//     supporters.length > 0 ||
//     contact.email ||
//     contact.phone ||
//     contact.website;

//   return (
//     <main className="min-h-screen overflow-hidden bg-white">
//       {/* HERO SECTION */}
//       <section
//         className={`relative overflow-hidden ${
//           hero.background === "light"
//             ? "bg-[#FFF9F7] text-[#263247]"
//             : "bg-[#172033] text-white"
//         }`}
//       >
//         <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">
//           <div className="relative z-10">
//             {hero.eyebrow && (
//               <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
//                 {hero.eyebrow}
//               </p>
//             )}

//             <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//               {hero.title || event.title}
//             </h1>

//             {hero.subtitle && (
//               <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
//                 {hero.subtitle}
//               </h2>
//             )}

//             {(hero.description || event.description) && (
//               <p
//                 className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
//                   hero.background === "light"
//                     ? "text-[#596579]"
//                     : "text-white/70"
//                 }`}
//               >
//                 {hero.description || event.description}
//               </p>
//             )}

//             {event.date && (
//               <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
//                 {event.date}
//               </p>
//             )}
//           </div>

//           {heroImage && (
//             <div className="relative">
//               <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />

//               <img
//                 src={heroImage}
//                 alt={hero.imageAlt || hero.title || event.title}
//                 fetchPriority="high"
//                 decoding="async"
//                 className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
//               />
//             </div>
//           )}
//         </div>
//       </section>

//       {/* INTRODUCTION + EVENT INFORMATION + PARTNERS + SUPPORTERS */}
//       {hasIntroductionContent && (
//         <EventIntroductionSection
//           eyebrow={introduction.eyebrow}
//           title={introduction.title || "Introduction"}
//           description={introduction.description}
//           blocks={introductionBlocks}
//           sections={introductionSections}
//           event={{
//             date: eventDate,
//             title: eventTitle,
//             time: eventTime,
//             venue: eventVenue,
//             startDateTime,
//             endDateTime,
//             registrationLink,
//             locationLink,
//             description:
//               introduction.description ||
//               event.description ||
//               "",
//           }}
//           partners={partners}
//           supporters={supporters}
//           contact={contact}
//         />
//       )}

//       {/* EVENT AGENDA */}
//       {(agenda.title ||
//         agenda.description ||
//         agendaItems.length ||
//         agenda.imageUrl ||
//         agenda.image) && (
//         <EventAgendaSection
//           eyebrow={agenda.eyebrow}
//           title={agenda.title || "Event Agenda"}
//           description={agenda.description}
//           image={agenda.imageUrl || agenda.image || ""}
//           imageAlt={agenda.imageAlt || "Event agenda"}
//           agenda={agendaItems}
//         />
//       )}

//       {/* WHO SHOULD ATTEND */}
//       <DynamicContentSection
//         id="who-should-attend"
//         title="Who should attend?"
//         paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//         {...WhatShouldAttendData}
//       />

//       {/* ADDITIONAL CMS CONTENT SECTIONS */}
//       {contentSections.map((section, index) => (
//         <DynamicContentSection
//           key={section._id || section.id || index}
//           {...section}
//         />
//       ))}

//       {/* EVENT FOOTER CTA */}
//       {event.eventLink && (
//         <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
//           <div className="mx-auto max-w-3xl">
//             <h2 className="text-2xl font-bold sm:text-3xl">
//               Be a part of this event
//             </h2>

//             <p className="mt-3 text-sm leading-7 text-white/65">
//               Explore the event and connect with the AIA community.
//             </p>

//             <a
//               href={event.eventLink}
//               target={
//                 event.eventLink.startsWith("http")
//                   ? "_blank"
//                   : undefined
//               }
//               rel={
//                 event.eventLink.startsWith("http")
//                   ? "noopener noreferrer"
//                   : undefined
//               }
//               className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
//             >
//               Learn More
//             </a>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Volume2,
//   Play,
//   Pause,
//   Square,
//   Headphones,
// } from "lucide-react";

// import { getEventBySlug } from "../../services/api";

// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";

// function getEventData(response) {
//   return response?.data?.data || response?.data || response;
// }

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Voice Reader States
//   const [voices, setVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState("");
//   const [speed, setSpeed] = useState(1);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const contentRef = useRef(null);

//   const speechSupported =
//     typeof window !== "undefined" &&
//     "speechSynthesis" in window;

//   // FETCH EVENT
//   useEffect(() => {
//     let isMounted = true;

//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getEventBySlug(slug);
//         const eventData = getEventData(response);

//         if (!eventData) {
//           throw new Error("Event not found.");
//         }

//         if (isMounted) {
//           setEvent(eventData);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Unable to load event details."
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (slug) {
//       fetchEvent();
//     } else {
//       setLoading(false);
//       setError("Event slug is missing.");
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [slug]);

//   // LOAD AVAILABLE BROWSER VOICES
//   useEffect(() => {
//     if (!speechSupported) return;

//     const loadVoices = () => {
//       const availableVoices =
//         window.speechSynthesis.getVoices();

//       setVoices(availableVoices);

//       if (availableVoices.length > 0 && !selectedVoice) {
//         const preferredVoice =
//           availableVoices.find(
//             (voice) =>
//               voice.lang.toLowerCase() === "en-in"
//           ) ||
//           availableVoices.find(
//             (voice) =>
//               voice.lang.toLowerCase().startsWith("en")
//           ) ||
//           availableVoices[0];

//         setSelectedVoice(preferredVoice.voiceURI);
//       }
//     };

//     loadVoices();

//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, [speechSupported, selectedVoice]);

//   // STOP SPEECH WHEN EVENT CHANGES OR COMPONENT UNMOUNTS
//   useEffect(() => {
//     return () => {
//       if (speechSupported) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [slug, speechSupported]);

//   // PLAY EVENT CONTENT
//   const handlePlay = () => {
//     if (!speechSupported || !contentRef.current) return;

//     // Resume if speech is paused
//     if (isPaused) {
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//       return;
//     }

//     // Stop previous speech
//     window.speechSynthesis.cancel();

//     const textToRead =
//       contentRef.current.innerText
//         .replace(/\s+/g, " ")
//         .trim();

//     if (!textToRead) return;

//     const utterance = new SpeechSynthesisUtterance(
//       textToRead
//     );

//     const voice = voices.find(
//       (item) => item.voiceURI === selectedVoice
//     );

//     if (voice) {
//       utterance.voice = voice;
//       utterance.lang = voice.lang;
//     } else {
//       utterance.lang = "en-IN";
//     }

//     utterance.rate = speed;
//     utterance.pitch = 1;
//     utterance.volume = 1;

//     utterance.onstart = () => {
//       setIsSpeaking(true);
//       setIsPaused(false);
//     };

//     utterance.onend = () => {
//       setIsSpeaking(false);
//       setIsPaused(false);
//     };

//     utterance.onerror = (event) => {
//       if (event.error !== "canceled" && event.error !== "interrupted") {
//         console.error("Voice Reader error:", event.error);
//       }

//       setIsSpeaking(false);
//       setIsPaused(false);
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   // PAUSE SPEECH
//   const handlePause = () => {
//     if (!speechSupported) return;

//     window.speechSynthesis.pause();
//     setIsPaused(true);
//   };

//   // STOP SPEECH
//   const handleStop = () => {
//     if (!speechSupported) return;

//     window.speechSynthesis.cancel();
//     setIsSpeaking(false);
//     setIsPaused(false);
//   };

//   // LOADING STATE
//   if (loading) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />
//           <p className="mt-4 text-sm text-gray-500">
//             Loading event details...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   // ERROR STATE
//   if (error || !event) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="max-w-md text-center">
//           <h1 className="text-2xl font-bold text-[#263247]">
//             Event not found
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             {error || "This event may have been removed or is unavailable."}
//           </p>

//           <Link
//             to="/events"
//             className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   const detailPage = event.detailPage || {};
//   const hero = detailPage.hero || {};
//   const introduction = detailPage.introduction || {};
//   const agenda = detailPage.agenda || {};

//   // HERO IMAGE
//   const heroImage =
//     hero.imageUrl ||
//     hero.image ||
//     event.imageUrl ||
//     "";

//   // INTRODUCTION DATA
//   const introductionSections = introduction.sections || [];
//   const introductionBlocks = introduction.blocks || [];

//   // EVENT INFORMATION FROM CMS
//   const eventInfo = introduction.eventInfo || {};

//   const eventDate =
//     eventInfo.date ||
//     event.date ||
//     "";

//   const eventTitle =
//     eventInfo.title ||
//     event.title ||
//     "";

//   const eventTime =
//     eventInfo.time ||
//     "";

//   const eventVenue =
//     eventInfo.venue ||
//     eventInfo.location ||
//     "";

//   const registrationLink =
//     eventInfo.registrationLink ||
//     "";

//   const locationLink =
//     eventInfo.locationLink ||
//     (eventVenue
//       ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           eventVenue
//         )}`
//       : "");

//   const startDateTime =
//     eventInfo.startDateTime ||
//     "";

//   const endDateTime =
//     eventInfo.endDateTime ||
//     "";

//   const contact = introduction.contact || {};
//   const partners = introduction.partners || [];
//   const supporters = introduction.supporters || [];

//   // AGENDA DATA
//   const agendaItems = agenda.items || [];

//   // ADDITIONAL CONTENT SECTIONS
//   const contentSections = detailPage.contentSections || [];

//   // SHOW INTRODUCTION WHEN CONTENT EXISTS
//   const hasIntroductionContent =
//     introduction.title ||
//     introduction.eyebrow ||
//     introduction.description ||
//     introductionBlocks.length > 0 ||
//     introductionSections.length > 0 ||
//     eventDate ||
//     eventTitle ||
//     eventTime ||
//     eventVenue ||
//     registrationLink ||
//     locationLink ||
//     startDateTime ||
//     endDateTime ||
//     partners.length > 0 ||
//     supporters.length > 0 ||
//     contact.email ||
//     contact.phone ||
//     contact.website;

//   return (
//     <main className="min-h-screen bg-white">

//       {/* EVENT CONTENT TO BE READ */}
//       <div ref={contentRef}>

//         {/* HERO SECTION */}
//         <section
//           className={`relative overflow-hidden ${
//             hero.background === "light"
//               ? "bg-[#FFF9F7] text-[#263247]"
//               : "bg-[#172033] text-white"
//           }`}
//         >
//           <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">

//             <div className="relative z-10">
//               {hero.eyebrow && (
//                 <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
//                   {hero.eyebrow}
//                 </p>
//               )}

//               <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                 {hero.title || event.title}
//               </h1>

//               {hero.subtitle && (
//                 <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
//                   {hero.subtitle}
//                 </h2>
//               )}

//               {(hero.description || event.description) && (
//                 <p
//                   className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
//                     hero.background === "light"
//                       ? "text-[#596579]"
//                       : "text-white/70"
//                   }`}
//                 >
//                   {hero.description || event.description}
//                 </p>
//               )}

//               {event.date && (
//                 <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
//                   {event.date}
//                 </p>
//               )}
//             </div>

//             {heroImage && (
//               <div className="relative">
//                 <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />

//                 <img
//                   src={heroImage}
//                   alt={hero.imageAlt || hero.title || event.title}
//                   fetchpriority="high"
//                   decoding="async"
//                   className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
//                 />
//               </div>
//             )}
//           </div>
//         </section>

//          {/* VOICE READER */}
//       {speechSupported && (
//         <section className="sticky w-full top-[16%] z-[10] border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-8">
//           <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//             {/* READER TITLE */}
//             <div className="flex items-center gap-3 hidden md:block">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0EC] text-[#E25238]">
//                 <Headphones size={20} />
//               </div>

//               <div className="hidden md:block">
//                 <p className="text-sm font-bold text-[#263247]">
//                   Listen to this event
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   {isSpeaking
//                     ? isPaused
//                       ? "Audio paused"
//                       : "Reading event details..."
//                     : "Listen instead of reading"}
//                 </p>
//               </div>
//             </div>

//             {/* READER CONTROLS */}
//             <div className="flex flex-wrap items-center gap-2">

//               {/* PLAY / RESUME */}
//               <button
//                 type="button"
//                 onClick={handlePlay}
//                 className="inline-flex items-center gap-2 rounded-lg bg-[#E25238] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//                 aria-label={isPaused ? "Resume reading" : "Play event audio"}
//               >
//                 {isPaused ? (
//                   <Play size={16} fill="currentColor" />
//                 ) : (
//                   <Play size={16} fill="currentColor" />
//                 )}

//                 {isPaused
//                   ? "Resume"
//                   : isSpeaking
//                     ? "Restart"
//                     : "Listen"}
//               </button>

//               {/* PAUSE */}
//               {isSpeaking && !isPaused && (
//                 <button
//                   type="button"
//                   onClick={handlePause}
//                   className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#263247] transition hover:bg-gray-100"
//                   aria-label="Pause audio"
//                 >
//                   <Pause size={16} />
//                   <span className="hidden sm:inline">Pause</span>
//                 </button>
//               )}

//               {/* STOP */}
//               {isSpeaking && (
//                 <button
//                   type="button"
//                   onClick={handleStop}
//                   className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#263247] transition hover:bg-gray-100"
//                   aria-label="Stop audio"
//                 >
//                   <Square size={15} />
//                   <span className="hidden sm:inline">Stop</span>
//                 </button>
//               )}

//               {/* VOICE SELECTION */}
//               {voices.length > 0 && (
//                 <select
//                   value={selectedVoice}
//                   onChange={(e) => {
//                     setSelectedVoice(e.target.value);
//                   }}
//                   disabled={isSpeaking && !isPaused}
//                   aria-label="Select voice"
//                   className="max-w-[145px] rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-xs text-[#263247] outline-none focus:border-[#E25238] sm:max-w-[180px] hidden md:block"
//                 >
//                   {voices.map((voice) => (
//                     <option
//                       key={voice.voiceURI}
//                       value={voice.voiceURI}
//                     >
//                       {voice.name} ({voice.lang})
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {/* SPEED CONTROL */}
//               <select
//                 value={speed}
//                 onChange={(e) => setSpeed(Number(e.target.value))}
//                 disabled={isSpeaking && !isPaused}
//                 aria-label="Reading speed"
//                 className="rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-xs font-semibold text-[#263247] outline-none focus:border-[#E25238] hidden md:block"
//               >
//                 <option value={0.75}>0.75x</option>
//                 <option value={1}>1x</option>
//                 <option value={1.25}>1.25x</option>
//                 <option value={1.5}>1.5x</option>
//               </select>
//             </div>
//           </div>
//         </section>
//       )}

//         {/* INTRODUCTION + EVENT INFORMATION + PARTNERS + SUPPORTERS */}
//         {hasIntroductionContent && (
//           <EventIntroductionSection
//             eyebrow={introduction.eyebrow}
//             title={introduction.title || "Introduction"}
//             description={introduction.description}
//             blocks={introductionBlocks}
//             sections={introductionSections}
//             event={{
//               date: eventDate,
//               title: eventTitle,
//               time: eventTime,
//               venue: eventVenue,
//               startDateTime,
//               endDateTime,
//               registrationLink,
//               locationLink,
//               description:
//                 introduction.description ||
//                 event.description ||
//                 "",
//             }}
//             partners={partners}
//             supporters={supporters}
//             contact={contact}
//           />
//         )}

//         {/* EVENT AGENDA */}
//         {(agenda.title ||
//           agenda.description ||
//           agendaItems.length ||
//           agenda.imageUrl ||
//           agenda.image) && (
//           <EventAgendaSection
//             eyebrow={agenda.eyebrow}
//             title={agenda.title || "Event Agenda"}
//             description={agenda.description}
//             image={agenda.imageUrl || agenda.image || ""}
//             imageAlt={agenda.imageAlt || "Event agenda"}
//             agenda={agendaItems}
//           />
//         )}

//         {/* WHO SHOULD ATTEND */}
//         <DynamicContentSection
//           id="who-should-attend"
//           title="Who should attend?"
//           paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//           {...WhatShouldAttendData}
//         />

//         {/* ADDITIONAL CMS CONTENT SECTIONS */}
//         {contentSections.map((section, index) => (
//           <DynamicContentSection
//             key={section._id || section.id || index}
//             {...section}
//           />
//         ))}

//         {/* EVENT FOOTER CTA */}
//         {event.eventLink && (
//           <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
//             <div className="mx-auto max-w-3xl">
//               <h2 className="text-2xl font-bold sm:text-3xl">
//                 Be a part of this event
//               </h2>

//               <p className="mt-3 text-sm leading-7 text-white/65">
//                 Explore the event and connect with the AIA community.
//               </p>

//               <a
//                 href={event.eventLink}
//                 target={
//                   event.eventLink.startsWith("http")
//                     ? "_blank"
//                     : undefined
//                 }
//                 rel={
//                   event.eventLink.startsWith("http")
//                     ? "noopener noreferrer"
//                     : undefined
//                 }
//                 className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
//               >
//                 Learn More
//               </a>
//             </div>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getEventBySlug } from "../../services/api";

// import TextToSpeech from "../../components/common/TextToSpeech";

// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";
// import EventTemplateSections from "../../admin/EventTemplateSections";

// function getEventData(response) {
//   return response?.data?.data || response?.data || response;
// }

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const contentRef = useRef(null);

//   // ==========================================
//   // FETCH EVENT
//   // ==========================================

//   useEffect(() => {
//     let isMounted = true;

//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getEventBySlug(slug);
//         const eventData = getEventData(response);

//         if (!eventData) {
//           throw new Error("Event not found.");
//         }

//         if (isMounted) {
//           setEvent(eventData);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Unable to load event details.",
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (slug) {
//       fetchEvent();
//     } else {
//       setLoading(false);
//       setError("Event slug is missing.");
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [slug]);

//   // ==========================================
//   // LOADING STATE
//   // ==========================================

//   if (loading) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />

//           <p className="mt-4 text-sm text-gray-500">Loading event details...</p>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // ERROR STATE
//   // ==========================================

//   if (error || !event) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="max-w-md text-center">
//           <h1 className="text-2xl font-bold text-[#263247]">Event not found</h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             {error || "This event may have been removed or is unavailable."}
//           </p>

//           <Link
//             to="/events"
//             className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // EVENT DETAIL DATA
//   // ==========================================

//   const detailPage = event.detailPage || {};

//   const hero = detailPage.hero || {};
//   const introduction = detailPage.introduction || {};
//   const agenda = detailPage.agenda || {};

//   // HERO IMAGE

//   const heroImage = hero.imageUrl || hero.image || event.imageUrl || "";

//   // INTRODUCTION DATA

//   const introductionSections = introduction.sections || [];
//   const introductionBlocks = introduction.blocks || [];

//   // EVENT INFORMATION FROM CMS

//   const eventInfo = introduction.eventInfo || {};

//   const eventDate = eventInfo.date || event.date || "";

//   const eventTitle = eventInfo.title || event.title || "";

//   const eventTime = eventInfo.time || "";

//   const eventVenue = eventInfo.venue || eventInfo.location || "";

//   const registrationLink = eventInfo.registrationLink || "";

//   const locationLink =
//     eventInfo.locationLink ||
//     (eventVenue
//       ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           eventVenue,
//         )}`
//       : "");

//   const startDateTime = eventInfo.startDateTime || "";

//   const endDateTime = eventInfo.endDateTime || "";

//   const contact = introduction.contact || {};

//   const partners = introduction.partners || [];
//   const supporters = introduction.supporters || [];

//   // AGENDA DATA

//   const agendaItems = agenda.items || [];

//   // ADDITIONAL CONTENT SECTIONS

//   const contentSections = detailPage.contentSections || [];

//   // ==========================================
//   // CHECK INTRODUCTION CONTENT
//   // ==========================================

//   const hasIntroductionContent =
//     introduction.title ||
//     introduction.eyebrow ||
//     introduction.description ||
//     introductionBlocks.length > 0 ||
//     introductionSections.length > 0 ||
//     eventDate ||
//     eventTitle ||
//     eventTime ||
//     eventVenue ||
//     registrationLink ||
//     locationLink ||
//     startDateTime ||
//     endDateTime ||
//     partners.length > 0 ||
//     supporters.length > 0 ||
//     contact.email ||
//     contact.phone ||
//     contact.website;

//   // ==========================================
//   // EVENT DETAILS PAGE
//   // ==========================================

//   return (
//     <main className="min-h-screen bg-white">
//       <div ref={contentRef}>
//         {/* ======================================
//             HERO SECTION
//         ====================================== */}

//         <section
//           className={`relative overflow-hidden ${
//             hero.background === "light"
//               ? "bg-[#FFF9F7] text-[#263247]"
//               : "bg-[#172033] text-white"
//           }`}
//         >
//           <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">
//             {/* HERO CONTENT */}

//             <div className="relative z-10">
//               {hero.eyebrow && (
//                 <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
//                   {hero.eyebrow}
//                 </p>
//               )}

//               <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                 {hero.title || event.title}
//               </h1>

//               {hero.subtitle && (
//                 <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
//                   {hero.subtitle}
//                 </h2>
//               )}

//               {(hero.description || event.description) && (
//                 <p
//                   className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
//                     hero.background === "light"
//                       ? "text-[#596579]"
//                       : "text-white/70"
//                   }`}
//                 >
//                   {hero.description || event.description}
//                 </p>
//               )}

//               {event.date && (
//                 <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
//                   {event.date}
//                 </p>
//               )}
//             </div>

//             {/* HERO IMAGE */}

//             {heroImage && (
//               <div className="relative">
//                 <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />

//                 <img
//                   src={heroImage}
//                   alt={hero.imageAlt || hero.title || event.title}
//                   fetchPriority="high"
//                   decoding="async"
//                   className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
//                 />
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ======================================
//             REUSABLE TEXT TO SPEECH
//         ====================================== */}

//         <TextToSpeech contentRef={contentRef} title="Listen to this event" />

//         {/* ======================================
//             INTRODUCTION SECTION
//         ====================================== */}

//         {hasIntroductionContent && (
//           <EventIntroductionSection
//             eyebrow={introduction.eyebrow}
//             title={introduction.title || "Introduction"}
//             description={introduction.description}
//             blocks={introductionBlocks}
//             sections={introductionSections}
//             event={{
//               date: eventDate,
//               title: eventTitle,
//               time: eventTime,
//               venue: eventVenue,
//               startDateTime,
//               endDateTime,
//               registrationLink,
//               locationLink,
//               description: introduction.description || event.description || "",
//             }}
//             partners={partners}
//             supporters={supporters}
//             contact={contact}
//           />
//         )}

//         {/* ======================================
//             EVENT AGENDA
//         ====================================== */}

//         {(agenda.title ||
//           agenda.description ||
//           agendaItems.length ||
//           agenda.imageUrl ||
//           agenda.image) && (
//           <EventAgendaSection
//             eyebrow={agenda.eyebrow}
//             title={agenda.title || "Event Agenda"}
//             description={agenda.description}
//             image={agenda.imageUrl || agenda.image || ""}
//             imageAlt={agenda.imageAlt || "Event agenda"}
//             agenda={agendaItems}
//           />
//         )}

//         {/* // Existing page JSX, after Agenda */}
//         <EventTemplateSections event={event} />

//         {/* ======================================
//             WHO SHOULD ATTEND
//         ====================================== */}

//         <DynamicContentSection
//           id="who-should-attend"
//           title="Who should attend?"
//           paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//           {...WhatShouldAttendData}
//         />

//         {/* ======================================
//             ADDITIONAL CMS CONTENT SECTIONS
//         ====================================== */}

//         {contentSections.map((section, index) => (
//           <DynamicContentSection
//             key={section._id || section.id || index}
//             {...section}
//           />
//         ))}

//         {/* ======================================
//             EVENT FOOTER CTA
//         ====================================== */}

//         {event.eventLink && (
//           <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
//             <div className="mx-auto max-w-3xl">
//               <h2 className="text-2xl font-bold sm:text-3xl">
//                 Be a part of this event
//               </h2>

//               <p className="mt-3 text-sm leading-7 text-white/65">
//                 Explore the event and connect with the AIA community.
//               </p>

//               <a
//                 href={event.eventLink}
//                 target={
//                   event.eventLink.startsWith("http") ? "_blank" : undefined
//                 }
//                 rel={
//                   event.eventLink.startsWith("http")
//                     ? "noopener noreferrer"
//                     : undefined
//                 }
//                 className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
//               >
//                 Learn More
//               </a>
//             </div>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }



// import React, { useEffect, useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getEventBySlug } from "../../services/api";

// import TextToSpeech from "../../components/common/TextToSpeech";

// import EventIntroductionSection from "../../components/event/EventIntroductionSection";
// import EventAgendaSection from "../../components/event/EventAgendaSection";
// import DynamicContentSection from "../../components/DynamicContentSection";
// import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";
// import EventTemplateSections, { useEventTemplate } from "../../admin/EventTemplateSections";
// import EventDownloadSections, { eventDownloadUrl } from "../../components/event/EventDownloadSections";

// function getEventData(response) {
//   return response?.data?.data || response?.data || response;
// }

// export default function EventDetailsPage() {
//   const { slug } = useParams();

//   const enquiryDialog = useRef(null);
// const pendingDownload = useRef(null);
// const checkingDownload = useRef(false);
// const [downloadError, setDownloadError] = useState("");
// const [enquiryError, setEnquiryError] = useState("");
// const [submittingEnquiry, setSubmittingEnquiry] = useState(false);


//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const contentRef = useRef(null);
//   const template = useEventTemplate(event);
//   const isUpcoming = template === "upcoming";

//   const handlePrint = () => {
//   window.print();
// };


// useEffect(() => {
//   pendingDownload.current = null;
//   enquiryDialog.current?.close();
//   setDownloadError("");
//   setEnquiryError("");
// }, [slug]);
//   // ==========================================
//   // FETCH EVENT
//   // ==========================================

//   useEffect(() => {
//     let isMounted = true;

//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getEventBySlug(slug);
//         const eventData = getEventData(response);

//         if (!eventData) {
//           throw new Error("Event not found.");
//         }

//         if (isMounted) {
//           setEvent(eventData);
//         }
//       } catch (err) {
//         console.error("Event detail fetch error:", err);

//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Unable to load event details.",
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (slug) {
//       fetchEvent();
//     } else {
//       setLoading(false);
//       setError("Event slug is missing.");
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [slug]);

//   // ==========================================
//   // LOADING STATE
//   // ==========================================

//   if (loading) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />

//           <p className="mt-4 text-sm text-gray-500">Loading event details...</p>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // ERROR STATE
//   // ==========================================

//   if (error || !event) {
//     return (
//       <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
//         <div className="max-w-md text-center">
//           <h1 className="text-2xl font-bold text-[#263247]">Event not found</h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             {error || "This event may have been removed or is unavailable."}
//           </p>

//           <Link
//             to="/events"
//             className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // EVENT DETAIL DATA
//   // ==========================================

//   const detailPage = event.detailPage || {};

//   const hero = detailPage.hero || {};
//   const introduction = detailPage.introduction || {};
//   const agenda = detailPage.agenda || {};

//   // HERO IMAGE

//   const heroImage = hero.imageUrl || hero.image || event.imageUrl || "";

//   // INTRODUCTION DATA

//   const introductionSections = introduction.sections || [];
//   const introductionBlocks = introduction.blocks || [];

//   // EVENT INFORMATION FROM CMS

//   const eventInfo = introduction.eventInfo || {};

//   const eventDate = eventInfo.date || event.date || "";

//   const eventTitle = eventInfo.title || event.title || "";

//   const eventTime = eventInfo.time || "";

//   const eventVenue = eventInfo.venue || eventInfo.location || "";

//   const registrationLink = isUpcoming ? eventInfo.registrationLink || "" : "";

//   const locationLink =
//     eventInfo.locationLink ||
//     (eventVenue
//       ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           eventVenue,
//         )}`
//       : "");

//   const startDateTime = eventInfo.startDateTime || "";

//   const endDateTime = eventInfo.endDateTime || "";

//   const contact = introduction.contact || {};

//   const partners = introduction.partners || [];
//   const supporters = introduction.supporters || [];

//   // AGENDA DATA

//   const originalAgenda = agenda.items || [];
//   const agendaItems = isUpcoming ? originalAgenda : originalAgenda.filter((item) => {
//     const link = item.link?.trim();
//     if (link && [eventInfo.registrationLink, eventInfo.saveDateLink].some((value) => value?.trim() === link)) {
//       return false;
//     }
//     return !/\b(register(?: now| here)?|registration(?: link)?|save (?:the )?date)\b/i.test(item.title || "");
//   });

//   // ADDITIONAL CONTENT SECTIONS

//   const contentSections = detailPage.contentSections || [];

//   // ==========================================
//   // CHECK INTRODUCTION CONTENT
//   // ==========================================

//   const hasIntroductionContent =
//     introduction.title ||
//     introduction.eyebrow ||
//     introduction.description ||
//     introductionBlocks.length > 0 ||
//     introductionSections.length > 0 ||
//     eventDate ||
//     eventTitle ||
//     eventTime ||
//     eventVenue ||
//     registrationLink ||
//     locationLink ||
//     startDateTime ||
//     endDateTime ||
//     partners.length > 0 ||
//     supporters.length > 0 ||
//     contact.email ||
//     contact.phone ||
//     contact.website;

//   // ==========================================
//   // EVENT DETAILS PAGE
//   // ==========================================

// const checkDownloadAccess = async () => {
//   const response = await fetch(`${enquiryApi}/events/downloads/access`, {
//     credentials: "include",
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error("Could not check download access. Please try again.");
//   }

//   return (await response.json()).hasAccess === true;
// };

// const runDownload = (action) => {
//   if (action === "zip") {
//     window.location.assign(eventDownloadUrl(event._id, "all-pdfs"));
//     return;
//   }

//   return handlePrint();
// };

// const requestDownload = async (action) => {
//   if (checkingDownload.current || enquiryDialog.current?.open) return;

//   checkingDownload.current = true;
//   setDownloadError("");

//   try {
//     if (await checkDownloadAccess()) {
//       await runDownload(action);
//       return;
//     }

//     pendingDownload.current = action;
//     setEnquiryError("");
//     enquiryDialog.current.showModal();
//   } catch (error) {
//     pendingDownload.current = null;
//     setDownloadError(error.message);
//   } finally {
//     checkingDownload.current = false;
//   }
// };

// const submitDownloadEnquiry = async (submitEvent) => {
//   submitEvent.preventDefault();

//   const action = pendingDownload.current;
//   if (submittingEnquiry || !action) return;

//   const form = submitEvent.currentTarget;
//   const details = Object.fromEntries(new FormData(form));

//   setSubmittingEnquiry(true);
//   setEnquiryError("");

//   try {
//     if (!(await checkDownloadAccess())) {
//       const response = await fetch(`${enquiryApi}/brochure-enquiries`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...details,
//           resourceType: "event-download",
//           resourceId: event._id,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.accessGranted) {
//         throw new Error(result.message || "Unable to submit the enquiry.");
//       }

//       if (!(await checkDownloadAccess())) {
//         throw new Error(
//           "Your enquiry was saved, but the browser did not accept the access cookie.",
//         );
//       }
//     }

//     if (pendingDownload.current !== action) return;

//     pendingDownload.current = null;
//     form.reset();
//     enquiryDialog.current.close();

//     try {
//       await runDownload(action);
//     } catch (error) {
//       setDownloadError(error.message);
//     }
//   } catch (error) {
//     setEnquiryError(error.message);
//   } finally {
//     setSubmittingEnquiry(false);
//   }
// };

//   return (
//     <main className="min-h-screen bg-white print:min-h-0">

//       {isUpcoming && (
//     <section className="hidden print:block print:p-8 print:text-black">
//       <h1 className="mb-6 text-2xl font-bold">
//         {eventTitle || event.title}
//       </h1>

//       {heroImage && (
//   <img
//     src={heroImage}
//     alt={hero.imageAlt || eventTitle || event.title}
//     className="mb-4 h-auto max-h-48 w-full object-contain object-left"
//   />
// )}

// {(introduction.description || hero.description || event.description) && (
//   <p className="mb-6 text-sm leading-relaxed">
//     {(introduction.description || hero.description || event.description)
//       .trim()
//       .split(/\s+/)
//       .slice(0, 60)
//       .join(" ")}
//   </p>
// )}

// <div className="mt-6 flex flex-wrap gap-3 text-sm">
//   {registrationLink && (
//     <a
//       href={registrationLink}
//       className="rounded-lg border border-[#E25238] px-4 py-2 font-semibold text-[#C9452E]"
//     >
//       Register Now
//     </a>
//   )}

//   {eventInfo.saveDateLink && (
//     <a
//       href={eventInfo.saveDateLink}
//       className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
//     >
//       Save The Date
//     </a>
//   )}

//   {locationLink && (
//     <a
//       href={locationLink}
//       className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
//     >
//       Directions
//     </a>
//   )}
// </div>

//       <dl className="mt-6 space-y-3 text-sm">
//         <div>
//           <dt className="inline font-semibold">Date: </dt>
//           <dd className="inline">{eventDate || "To be announced"}</dd>
//         </div>
//         <div>
//           <dt className="inline font-semibold">Time: </dt>
//           <dd className="inline">{eventTime || "To be announced"}</dd>
//         </div>
//         <div>
//           <dt className="inline font-semibold">Venue: </dt>
//           <dd className="inline">{eventVenue || "To be announced"}</dd>
//         </div>
//       </dl>
//     </section>
//   )}
//       <div ref={contentRef} className={isUpcoming ? "print:hidden" : undefined}>
//         {/* ======================================
//             HERO SECTION
//         ====================================== */}

//         <section
//           className={`relative overflow-hidden ${
//             hero.background === "light"
//               ? "bg-[#FFF9F7] text-[#263247]"
//               : "bg-[#172033] text-white"
//           }`}
//         >
//           <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">
//             {/* HERO CONTENT */}

//             <div className="relative z-10">
//               {hero.eyebrow && (
//                 <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
//                   {hero.eyebrow}
//                 </p>
//               )}

//               <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                 {hero.title || event.title}
//               </h1>

//               {hero.subtitle && (
//                 <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
//                   {hero.subtitle}
//                 </h2>
//               )}

//               {(hero.description || event.description) && (
//                 <p
//                   className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
//                     hero.background === "light"
//                       ? "text-[#596579]"
//                       : "text-white/70"
//                   }`}
//                 >
//                   {hero.description || event.description}
//                 </p>
//               )}

//               {event.date && (
//                 <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
//                   {event.date}
//                 </p>
//               )}
//             </div>

//             {/* HERO IMAGE */}

//             {heroImage && (
//               <div className="relative">
//                 <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />

//                 <img
//                   src={heroImage}
//                   alt={hero.imageAlt || hero.title || event.title}
//                   fetchPriority="high"
//                   decoding="async"
//                   className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
//                 />
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ======================================
//             REUSABLE TEXT TO SPEECH
//         ====================================== */}

//         <TextToSpeech contentRef={contentRef} title="Listen to this event" />

//         {/* ======================================
//             INTRODUCTION SECTION
//         ====================================== */}

//         {hasIntroductionContent && (
//           <EventIntroductionSection
//             eyebrow={introduction.eyebrow}
//             title={introduction.title || "Introduction"}
//             description={introduction.description}
//             blocks={introductionBlocks}
//             sections={introductionSections}
//             showEventInformation={isUpcoming}
// onPrintInformation={isUpcoming ? handlePrint : undefined}
//             event={{
//               date: eventDate,
//               title: eventTitle,
//               time: eventTime,
//               venue: eventVenue,
//               startDateTime,
//               endDateTime,
//               registrationLink,
//               locationLink,
//               description: introduction.description || event.description || "",
//             }}
//             partners={partners}
//             supporters={supporters}
//             contact={contact}
//           />
//         )}

//         {/* ======================================
//             EVENT AGENDA
//         ====================================== */}

//         {(agenda.title ||
//           agenda.description ||
//           agendaItems.length ||
//           agenda.imageUrl ||
//           agenda.image) && (
//           <EventAgendaSection
//             eyebrow={agenda.eyebrow}
//             title={agenda.title || "Event Agenda"}
//             description={agenda.description}
//             image={agenda.imageUrl || agenda.image || ""}
//             imageAlt={agenda.imageAlt || "Event agenda"}
//             agenda={agendaItems}
//           />
//         )}

//         {/* // Existing page JSX, after Agenda */}
//         <EventTemplateSections event={event} template={template} />
//        <EventDownloadSections
//   key={event._id}
//   event={event}
//   isUpcoming={isUpcoming}
//   onPrintDetails={handlePrint}
// />

//         {/* ======================================
//             WHO SHOULD ATTEND
//         ====================================== */}

//         {isUpcoming && <DynamicContentSection
//           id="who-should-attend"
//           title="Who should attend?"
//           paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
//           {...WhatShouldAttendData}
//         />}

//         {/* ======================================
//             ADDITIONAL CMS CONTENT SECTIONS
//         ====================================== */}

//         {contentSections.map((section, index) => (
//           <DynamicContentSection
//             key={section._id || section.id || index}
//             {...section}
//           />
//         ))}

//         {/* ======================================
//             EVENT FOOTER CTA
//         ====================================== */}

//         {isUpcoming && event.eventLink && (
//           <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
//             <div className="mx-auto max-w-3xl">
//               <h2 className="text-2xl font-bold sm:text-3xl">
//                 Be a part of this event
//               </h2>

//               <p className="mt-3 text-sm leading-7 text-white/65">
//                 Explore the event and connect with the AIA community.
//               </p>

//               <a
//                 href={event.eventLink}
//                 target={
//                   event.eventLink.startsWith("http") ? "_blank" : undefined
//                 }
//                 rel={
//                   event.eventLink.startsWith("http")
//                     ? "noopener noreferrer"
//                     : undefined
//                 }
//                 className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
//               >
//                 Learn More
//               </a>
//             </div>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useParams, Link } from "react-router-dom";

import { getEventBySlug } from "../../services/api";

import TextToSpeech from "../../components/common/TextToSpeech";

import EventIntroductionSection from "../../components/event/EventIntroductionSection";
import EventAgendaSection from "../../components/event/EventAgendaSection";
import DynamicContentSection from "../../components/DynamicContentSection";
import WhatShouldAttendData from "../../data/eventdata/WhatShouldAttendData";
import EventTemplateSections, { useEventTemplate } from "../../admin/EventTemplateSections";
import EventDownloadSections, { eventDownloadUrl } from "../../components/event/EventDownloadSections";

const enquiryApi = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

function getEventData(response) {
  return response?.data?.data || response?.data || response;
}

export default function EventDetailsPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const contentRef = useRef(null);
  const enquiryDialog = useRef(null);
  const pendingDownload = useRef(null);
  const checkingDownload = useRef(false);
  const [downloadError, setDownloadError] = useState("");
  const [enquiryError, setEnquiryError] = useState("");
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  useEffect(() => {
    pendingDownload.current = null;
    enquiryDialog.current?.close();
    setDownloadError("");
    setEnquiryError("");
  }, [slug]);
  const template = useEventTemplate(event);
  const isUpcoming = template === "upcoming";

  // ==========================================
  // FETCH EVENT
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEventBySlug(slug);
        const eventData = getEventData(response);

        if (!eventData) {
          throw new Error("Event not found.");
        }

        if (isMounted) {
          setEvent(eventData);
        }
      } catch (err) {
        console.error("Event detail fetch error:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load event details.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchEvent();
    } else {
      setLoading(false);
      setError("Event slug is missing.");
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE5DF] border-t-[#E25238]" />

          <p className="mt-4 text-sm text-gray-500">Loading event details...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#263247]">Event not found</h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error || "This event may have been removed or is unavailable."}
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex rounded-xl bg-[#E25238] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // EVENT DETAIL DATA
  // ==========================================

  const detailPage = event.detailPage || {};

  const hero = detailPage.hero || {};
  const introduction = detailPage.introduction || {};
  const agenda = detailPage.agenda || {};

  // HERO IMAGE

  const heroImage = hero.imageUrl || hero.image || event.imageUrl || "";

  // INTRODUCTION DATA

  const introductionSections = introduction.sections || [];
  const introductionBlocks = introduction.blocks || [];

  // EVENT INFORMATION FROM CMS

  const eventInfo = introduction.eventInfo || {};

  const eventDate = eventInfo.date || event.date || "";

  const eventTitle = eventInfo.title || event.title || "";

  const eventTime = eventInfo.time || "";

  const eventVenue = eventInfo.venue || eventInfo.location || "";

  const registrationLink = isUpcoming ? eventInfo.registrationLink || "" : "";

  const locationLink =
    eventInfo.locationLink ||
    (eventVenue
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          eventVenue,
        )}`
      : "");

  const startDateTime = eventInfo.startDateTime || "";

  const endDateTime = eventInfo.endDateTime || "";

  const contact = introduction.contact || {};

  const partners = introduction.partners || [];
  const supporters = introduction.supporters || [];

  // AGENDA DATA

  const originalAgenda = agenda.items || [];
  const agendaItems = isUpcoming ? originalAgenda : originalAgenda.filter((item) => {
    const link = item.link?.trim();
    if (link && [eventInfo.registrationLink, eventInfo.saveDateLink].some((value) => value?.trim() === link)) {
      return false;
    }
    return !/\b(register(?: now| here)?|registration(?: link)?|save (?:the )?date)\b/i.test(item.title || "");
  });

  // ADDITIONAL CONTENT SECTIONS

  const contentSections = detailPage.contentSections || [];

  // ==========================================
  // CHECK INTRODUCTION CONTENT
  // ==========================================

  const hasIntroductionContent =
    introduction.title ||
    introduction.eyebrow ||
    introduction.description ||
    introductionBlocks.length > 0 ||
    introductionSections.length > 0 ||
    eventDate ||
    eventTitle ||
    eventTime ||
    eventVenue ||
    registrationLink ||
    locationLink ||
    startDateTime ||
    endDateTime ||
    partners.length > 0 ||
    supporters.length > 0 ||
    contact.email ||
    contact.phone ||
    contact.website;

  const printTitle = hero.title || eventTitle;
  const printableTime = eventTime || [startDateTime, endDateTime].filter(Boolean).map((value) => {
    const hasZone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
    const date = new Date(hasZone ? value : `${value}+05:30`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit",
    }).format(date) + " IST";
  }).join(" – ");
  const handlePrint = async () => {
    if (!isUpcoming) {
      const images = [...(contentRef.current?.querySelectorAll("img") || [])];
      images.forEach((image) => { image.loading = "eager"; });

      let timeout;
      try {
        await Promise.race([
          Promise.allSettled([document.fonts?.ready, ...images.map((image) => image.decode())]),
          new Promise((resolve) => { timeout = window.setTimeout(resolve, 5000); }),
        ]);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    const previousTitle = document.title;
    const slug = event.slug || "event";
    document.title = isUpcoming ? `${slug}-information` : `${slug}-details`;

    const hidden = [];
    let element = contentRef.current?.closest("main");
    while (element && element !== document.body) {
      const parent = element.parentElement;
      if (!parent) break;
      for (const sibling of parent.children) {
        if (sibling === element || sibling.classList.contains("print:hidden")) continue;
        sibling.classList.add("print:hidden");
        hidden.push(sibling);
      }
      element = parent;
    }

    const restore = () => {
      hidden.forEach((element) => element.classList.remove("print:hidden"));
      document.title = previousTitle;
    };
    window.addEventListener("afterprint", restore, { once: true });
    try {
      window.print();
    } catch (error) {
      window.removeEventListener("afterprint", restore);
      restore();
      throw error;
    }
  };

  const checkDownloadAccess = async () => {
    const response = await fetch(`${enquiryApi}/events/downloads/access`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Could not check download access. Please try again.");
    return (await response.json()).hasAccess === true;
  };

  const runDownload = async (action) => {
    if (action === "zip") {
      window.location.assign(eventDownloadUrl(event._id, "all-pdfs"));
      return;
    }
    return handlePrint();
  };

  const requestDownload = async (action) => {
    if (checkingDownload.current || enquiryDialog.current?.open) return;
    checkingDownload.current = true;
    setDownloadError("");
    try {
      if (await checkDownloadAccess()) {
        await runDownload(action);
      } else {
        pendingDownload.current = action;
        setEnquiryError("");
        enquiryDialog.current.showModal();
      }
    } catch (error) {
      pendingDownload.current = null;
      setDownloadError(error.message);
    } finally {
      checkingDownload.current = false;
    }
  };

  const submitDownloadEnquiry = async (submitEvent) => {
    submitEvent.preventDefault();
    if (submittingEnquiry || !pendingDownload.current) return;
    const action = pendingDownload.current;
    const form = submitEvent.currentTarget;
    const details = Object.fromEntries(new FormData(form));
    setSubmittingEnquiry(true);
    setEnquiryError("");

    try {
      // Retrying after a successful submit reuses the existing cookie.
      if (!(await checkDownloadAccess())) {
        const response = await fetch(`${enquiryApi}/brochure-enquiries`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...details,
            resourceType: "event-download",
            resourceId: event._id,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.accessGranted) {
          throw new Error(result.message || "Unable to submit the enquiry.");
        }

        if (!(await checkDownloadAccess())) {
          throw new Error("Your enquiry was saved, but the browser did not accept the access cookie.");
        }
      }

      if (pendingDownload.current !== action) return;
      pendingDownload.current = null;
      form.reset();
      enquiryDialog.current.close();
      try {
        await runDownload(action);
      } catch (error) {
        setDownloadError(error.message);
      }
    } catch (error) {
      setEnquiryError(error.message);
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  // ==========================================
  // EVENT DETAILS PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-white print:min-h-0" data-event-print={isUpcoming ? "information" : "details"}>
      <dialog
        ref={enquiryDialog}
        aria-labelledby="event-brochure-popup-title"
        className="fixed m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-[520px] overflow-y-auto rounded-md bg-white p-6 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm print:hidden sm:p-9"
        data-event-print-hide
        onCancel={(dialogEvent) => { if (submittingEnquiry) dialogEvent.preventDefault(); }}
        onClick={(dialogEvent) => {
          if (dialogEvent.target === dialogEvent.currentTarget && !submittingEnquiry) enquiryDialog.current.close();
        }}
        onClose={() => { pendingDownload.current = null; }}
      >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => enquiryDialog.current?.close()}
              disabled={submittingEnquiry}
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
              Access Event Downloads
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Please share your details to access downloads
              {event.title
                ? ` for ${event.title}.`
                : "."}
            </p>

            {/* Enquiry Form */}
            <form onSubmit={submitDownloadEnquiry} className="mt-7 space-y-4">
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
                  placeholder="Enter your message"
                  rows={3}
                  required
                  className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              {enquiryError && (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                  {enquiryError}
                </p>
              )}

              <button
                type="submit"
                disabled={submittingEnquiry}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E52B18] px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C92313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingEnquiry ? (
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
                Your details will be used to process your download enquiry.
              </p>
            </form>
      </dialog>
      {isUpcoming && (
        <section className="hidden print:block print:p-8 print:text-black">
          <p>AIA Event Information</p>
          <h1 className="mb-4 text-2xl font-bold">{printTitle}</h1>
          {heroImage && <img src={heroImage} alt={hero.imageAlt || printTitle} className="mb-4 max-h-48 w-full object-contain object-left" />}
          {(introduction.description || hero.description || event.description) && (
            <p className="mb-4 text-sm">{(introduction.description || hero.description || event.description).trim().split(/\s+/).slice(0, 60).join(" ")}</p>
          )}
          <dl>
            <dt>Date</dt><dd>{eventDate || startDateTime?.slice(0, 10) || "To be announced"}</dd>
            <dt>Time</dt><dd>{printableTime || "To be announced"}</dd>
            <dt>Venue</dt><dd>{eventVenue || "To be announced"}</dd>
          </dl>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            {registrationLink && <a className="underline" href={registrationLink}>Register Now</a>}
            {eventInfo.saveDateLink && <a className="underline" href={eventInfo.saveDateLink}>Save The Date</a>}
            {locationLink && <a className="underline" href={locationLink}>Directions</a>}
          </div>
        </section>
      )}
      <div ref={contentRef} className={isUpcoming ? "print:hidden" : "print:[&_aside]:static print:[&_img]:object-contain print:[&_img]:max-h-[115mm]"}>
        {/* ======================================
            HERO SECTION
        ====================================== */}

        <section
          className={`relative overflow-hidden ${
            hero.background === "light"
              ? "bg-[#FFF9F7] text-[#263247]"
              : "bg-[#172033] text-white"
          }`}
        >
          <div className="mx-auto grid min-h-[480px] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12">
            {/* HERO CONTENT */}

            <div className="relative z-10">
              {hero.eyebrow && (
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E87565]">
                  {hero.eyebrow}
                </p>
              )}

              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {hero.title || event.title}
              </h1>

              {hero.subtitle && (
                <h2 className="mt-5 text-lg font-semibold leading-relaxed text-[#E87565] sm:text-xl">
                  {hero.subtitle}
                </h2>
              )}

              {(hero.description || event.description) && (
                <p
                  className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
                    hero.background === "light"
                      ? "text-[#596579]"
                      : "text-white/70"
                  }`}
                >
                  {hero.description || event.description}
                </p>
              )}

              {event.date && (
                <p className="mt-7 inline-flex rounded-full bg-[#E87565] px-5 py-2.5 text-xs font-bold text-white">
                  {event.date}
                </p>
              )}

            </div>

            {/* HERO IMAGE */}

            {heroImage && (
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-[#E87565]/15 blur-2xl" />

                <img
                  src={heroImage}
                  alt={hero.imageAlt || hero.title || event.title}
                  fetchpriority="high"
                  decoding="async"
                  className="relative max-h-[580px] min-h-[280px] w-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            REUSABLE TEXT TO SPEECH
        ====================================== */}

        <div data-event-print-hide className="print:hidden"><TextToSpeech contentRef={contentRef} title="Listen to this event" /></div>

        {/* ======================================
            INTRODUCTION SECTION
        ====================================== */}

        {hasIntroductionContent && (
          <EventIntroductionSection
            eyebrow={introduction.eyebrow}
            title={introduction.title || "Introduction"}
            description={introduction.description}
            blocks={introductionBlocks}
            sections={introductionSections}
            showEventInformation={isUpcoming}
            onPrintInformation={isUpcoming ? () => requestDownload("information") : undefined}
            event={{
              date: eventDate,
              title: eventTitle,
              time: eventTime,
              venue: eventVenue,
              startDateTime,
              endDateTime,
              registrationLink,
              locationLink,
              description: introduction.description || event.description || "",
            }}
            partners={partners}
            supporters={supporters}
            contact={contact}
          />
        )}

        {/* ======================================
            EVENT AGENDA
        ====================================== */}

        {(agenda.title ||
          agenda.description ||
          agendaItems.length ||
          agenda.imageUrl ||
          agenda.image) && (
          <EventAgendaSection
            eyebrow={agenda.eyebrow}
            title={agenda.title || "Event Agenda"}
            description={agenda.description}
            image={agenda.imageUrl || agenda.image || ""}
            imageAlt={agenda.imageAlt || "Event agenda"}
            agenda={agendaItems}
          />
        )}

        {/* // Existing page JSX, after Agenda */}
        <EventTemplateSections event={event} template={template} />
        {downloadError && <p role="alert" data-event-print-hide className="px-5 py-3 text-sm text-red-700 print:hidden">{downloadError}</p>}
        <EventDownloadSections
          key={event._id}
          event={event}
          isUpcoming={isUpcoming}
          onPrintDetails={() => requestDownload("report")}
          onDownloadAllPdfs={() => requestDownload("zip")}
        />

        {/* ======================================
            WHO SHOULD ATTEND
        ====================================== */}

        {isUpcoming && <DynamicContentSection
          id="who-should-attend"
          title="Who should attend?"
          paragraph="Participants from the following Industry segments will find this workshop extremely relevant."
          {...WhatShouldAttendData}
        />}

        {/* ======================================
            ADDITIONAL CMS CONTENT SECTIONS
        ====================================== */}

        {contentSections.map((section, index) => (
          <DynamicContentSection
            key={section._id || section.id || index}
            {...section}
          />
        ))}

        {/* ======================================
            EVENT FOOTER CTA
        ====================================== */}

        {isUpcoming && event.eventLink && (
          <section className="bg-[#172033] px-5 py-12 text-center text-white sm:px-8 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Be a part of this event
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/65">
                Explore the event and connect with the AIA community.
              </p>

              <a
                href={event.eventLink}
                target={
                  event.eventLink.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  event.eventLink.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mt-7 inline-flex rounded-xl bg-[#E87565] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d85f50]"
              >
                Learn More
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
