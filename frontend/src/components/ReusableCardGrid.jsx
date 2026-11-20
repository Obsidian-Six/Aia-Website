// import React, { useState } from "react";
// import FeatureCard from "./ui/FeatureCard";

// export default function ReusableCardGrid({
//   title,
//   cards = [],
//   columns = 3,
//   sectionId,
//   backgroundImage = "/grid-bg.png",
//   showBackground = true,
//   readMoreText = "Read More",
//   onCardClick,
//   link
// }) {
//   const [selectedCard, setSelectedCard] = useState(
//     cards[0]?.id || cards[0]?._id || null
//   );

//   const handleCardClick = (card) => {
//     const id = card.id || card._id;

//     setSelectedCard(id);

//     if (onCardClick) {
//       onCardClick(card);
//     }
//   };

//   const getGridColumns = () => {
//     switch (columns) {
//       case 2:
//         return "md:grid-cols-2";

//       case 4:
//         return "sm:grid-cols-2 lg:grid-cols-4";

//       case 3:
//       default:
//         return "sm:grid-cols-2 lg:grid-cols-3";
//     }
//   };

//   if (!cards.length) {
//     return null;
//   }

//   return (
//     <section
//       id={sectionId}
//       className="
//         relative
//         w-full
//         overflow-hidden
//         bg-white
//         py-16

//         sm:py-20

//         lg:py-24
//       "
//     >
//       {/* ============================================
//           BACKGROUND GRID
//       ============================================= */}

//       {showBackground && backgroundImage && (
//         <div
//           className="
//             pointer-events-none
//             absolute
//             inset-0
//             bg-repeat
//             opacity-40
//             [background-size:360px_360px]
//           "
//           style={{
//             backgroundImage: `url(${backgroundImage})`,
//           }}
//           aria-hidden="true"
//         />
//       )}

//       {/* ============================================
//           CONTENT
//       ============================================= */}

//       <div
//         className="
//           relative
//           z-10
//           mx-auto
//           w-full
//           max-w-7xl
//           px-5

//           sm:px-8

//           lg:px-12
//         "
//       >
//         {/* ==========================================
//             TITLE
//         =========================================== */}

//         {title && (
//           <h2
//             className="
//               mb-10
//               text-center
//               font-semibold
//               text-4xl
//               font-black
//               leading-tight
//               tracking-tight
//               text-[#1F2937]

//               sm:mb-12
//               sm:text-5xl

//               lg:mb-16
//               lg:text-[54px]
//             "
//           >
//             {title}
//           </h2>
//         )}

//         {/* ==========================================
//             CARDS
//         =========================================== */}

//         <div
//           className={`
//             mx-auto
//             grid
//             w-full
//             max-w-6xl
//             grid-cols-1
//             items-stretch
//             gap-5

//             sm:gap-6

//             lg:gap-8

//             ${getGridColumns()}
//           `}
//         >
//           {cards.map((card) => {
//             const cardId = card.id || card._id;
//             const isSelected = selectedCard === cardId;

//             return (
//                 <FeatureCard
//                 key={card._id}
//                 title={card.title}
//                 description={card.description}
//                 image={card.image}
//                 imageAlt={card.imageAlt || card.title}
//                 link={card.link}
//               />
//               // <article
//               //   key={cardId}
//               //   onClick={() => handleCardClick(card)}
//               //   className={`
//               //     group
//               //     relative
//               //     flex
//               //     min-w-0
//               //     cursor-pointer
//               //     flex-col
//               //     overflow-hidden
//               //     rounded-2xl
//               //     border
//               //     border-red-100/70
//               //     bg-white
//               //     shadow-sm

//               //     transition-all
//               //     duration-500
//               //     ease-out

//               //     hover:-translate-y-2
//               //     hover:shadow-2xl

//               //     ${
//               //       isSelected
//               //         ? "ring-2 ring-[#E37263]/50 shadow-xl"
//               //         : ""
//               //     }
//               //   `}
//               // >

//               //   {/* ==================================
//               //       IMAGE
//               //   =================================== */}

//               //   {card.image && (
//               //     <div
//               //       className="
//               //         relative
//               //         h-[210px]
//               //         w-full
//               //         overflow-hidden
//               //         bg-slate-100

//               //         sm:h-[220px]

//               //         lg:h-[230px]
//               //       "
//               //     >
//               //       <img
//               //         src={card.image}
//               //         alt={card.title || "Card image"}
//               //         loading="lazy"
//               //         decoding="async"
//               //         draggable="false"
//               //         className="
//               //           block
//               //           h-full
//               //           w-full
//               //           object-cover

//               //           transition-transform
//               //           duration-700
//               //           ease-out

//               //           group-hover:scale-[1.04]
//               //         "
//               //       />
//               //     </div>
//               //   )}

//               //   {/* ==================================
//               //       CONTENT
//               //   =================================== */}

//               //   <div
//               //     className="
//               //       flex
//               //       flex-1
//               //       flex-col
//               //       p-5

//               //       sm:p-6
//               //     "
//               //   >
//               //     {/* Title */}

//               //     <h3
//               //       className="
//               //         font-sans
//               //         text-lg
//               //         font-extrabold
//               //         leading-snug
//               //         text-[#1F2937]

//               //         sm:text-xl
//               //       "
//               //     >
//               //       {card.title}

//               //       {card.subtitle && (
//               //         <>
//               //           {" "}
//               //           {card.subtitle}
//               //         </>
//               //       )}
//               //     </h3>

//               //     {/* Description */}

//               //     {card.description && (
//               //       <p
//               //         className="
//               //           mt-3
//               //           text-xs
//               //           leading-relaxed
//               //           text-black/70

//               //           sm:text-sm
//               //         "
//               //       >
//               //         {card.description}
//               //       </p>
//               //     )}

//               //     {/* Read More */}

//               //     {card.readMore !== false && (
//               //       <div className="mt-auto pt-6">
//               //         <button
//               //           type="button"
//               //           onClick={(event) => {
//               //             event.stopPropagation();
//               //             handleCardClick(card);
//               //           }}
//               //           className="
//               //             w-fit
//               //             text-[10px]
//               //             font-medium
//               //             text-[#E37263]
//               //             underline
//               //             underline-offset-2

//               //             transition-opacity
//               //             duration-300

//               //             hover:opacity-60

//               //             sm:text-[11px]
//               //           "
//               //         >
//               //           {card.readMoreText || readMoreText}
//               //         </button>
//               //       </div>
//               //     )}
//               //   </div>

//               //   {/* ==================================
//               //       ACTIVE BOTTOM LINE
//               //   =================================== */}

//               //   <div
//               //     className={`
//               //       absolute
//               //       bottom-0
//               //       left-6
//               //       right-6
//               //       h-1.5
//               //       rounded-full
//               //       bg-[#E37263]

//               //       transition-all
//               //       duration-500

//               //       ${
//               //         isSelected
//               //           ? "translate-y-0 opacity-100"
//               //           : "translate-y-2 opacity-0"
//               //       }
//               //     `}
//               //   />
//               // </article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";

// ==========================================
// TALENT PROGRAM DETAILS
// ==========================================

const talentProgramDetails = {
  "campus events": {
    label: "Campus Engagement",
    subtitle: "Bringing automation careers closer to students",
    intro:
      "Campus Events brings AIA's talent development initiatives directly to educational institutions. These activities help students understand automation careers and connect academic learning with real industry opportunities.",

    sections: [
      {
        heading: "Career Sensitisation Sessions",
        description:
          "Introduce students to what automation careers actually look like, the skills the industry needs and the importance of systems-level thinking.",
      },
      {
        heading: "Internship Opportunities",
        description:
          "Provide a platform where AIA member companies can offer internship placements and connect with students interested in automation.",
      },
      {
        heading: "Talent Connect Outreach",
        description:
          "Connect students attending campus activities with AIA's wider talent development initiatives and the Find Talent programme.",
      },
    ],

    note: "Campus Events is a newly developing initiative. The first events and participating institutions will be announced as details are confirmed. Events will also be discoverable through AIA's main events calendar.",
  },

  "campus connect": {
    label: "Competency Development",
    subtitle: "Learning automation systems, not just individual products",

    intro:
      "AIA was the first to bring brand-agnostic automation learning to Indian campuses, establishing four Competency Development Centers designed to teach how automation systems are built, rather than how to operate one company's product line.",

    sections: [
      {
        heading: "Why Brand-Agnostic Learning Matters",
        description:
          "Company-sponsored labs have expanded across engineering institutions. While they provide proficiency in specific products, the industry also needs graduates who can design and deliver complete, working automation systems.",
      },
      {
        heading: "A Different Kind of Graduate",
        description:
          "Systems-level, vendor-neutral training develops an understanding of how different automation technologies work together. This is particularly important when integrating automation into a real factory environment.",
      },
      {
        heading: "Four Competency Development Centers",
        description:
          "AIA established four Competency Development Centers to bring this learning model to Indian campuses. These centres are designed to develop practical understanding of automation systems rather than proficiency in a single vendor's products.",
      },
      {
        heading: "Institutional Partnerships",
        description:
          "Educational institutions interested in bringing brand-agnostic automation learning to their campuses can explore partnership opportunities with AIA.",
      },
    ],

    note: "Campus Connect is a key part of AIA's long-term talent pipeline, connecting students and institutions with the skills required by the automation industry.",
  },

  "certifications & skilling programs": {
    label: "Professional Development",
    subtitle: "Building practical skills for the future of automation",

    intro:
      "AIA's Certifications & Skilling Programs aim to strengthen the capabilities of professionals working in automation and manufacturing. The initiative brings together a new flagship course and existing IAFSM learning opportunities.",

    sections: [
      {
        heading: "New Flagship Course",
        description:
          "A new course is being introduced to address the gap between product-specific equipment knowledge and the ability to understand, design and integrate complete automation systems.",
        bullets: [
          "Course details and curriculum will be announced.",
          "Eligibility and target participants will be confirmed.",
          "Enrolment information will be shared once available.",
        ],
      },
      {
        heading: "IAFSM Courses",
        description:
          "Existing IAFSM courses will also be accessible through this section, creating a single entry point for AIA's skilling and professional development opportunities.",
      },
      {
        heading: "Future Learning Pathways",
        description:
          "As the programme catalogue grows, structured learning pathways can be developed around specific professional roles.",
        bullets: [
          "Automation Technician",
          "Controls Engineer",
          "Maintenance and Reliability Professional",
        ],
      },
      {
        heading: "Supporting Manufacturing Capability",
        description:
          "These programmes aim to help professionals and manufacturing teams strengthen their skills and address capability gaps as automation requirements evolve.",
      },
    ],

    note: "The programme launches with one new course alongside existing IAFSM offerings. Further course details and learning pathways will be added as they are confirmed.",
  },

  "find talent": {
    label: "Talent Connect",
    subtitle: "Connecting AIA-trained talent with industry opportunities",

    intro:
      "AIA's Find Talent initiative helps member companies connect with skilled candidates trained through Campus Connect, IAFSM and AIA certification programmes.",

    sections: [
      {
        heading: "Looking to Hire?",
        description:
          "Member companies can submit a hiring request and tell AIA what kind of talent they are looking for.",
        bullets: [
          "Share your hiring requirements with AIA.",
          "Specify the skills, roles and candidate profiles you need.",
          "AIA will help connect your requirements with its training ecosystem.",
        ],
      },
      {
        heading: "Where Does the Talent Come From?",
        description:
          "Candidates come from AIA's brand-agnostic training model, which focuses on understanding automation systems rather than learning only one company's product.",
        bullets: [
          "Campus Connect programme completers.",
          "IAFSM-trained candidates.",
          "Candidates from AIA certification and skilling programmes.",
        ],
      },
      {
        heading: "Priority Access for AIA Members",
        description:
          "Find Talent is a stated membership benefit. AIA members receive first access to candidates before the pool is opened more broadly.",
      },
    ],

    note: "The candidate pool is being developed. Campus Connect and IAFSM will progressively track programme completers, contact permissions and programme or institution details.",
  },

  iafsm: {
    label: "Foundation for Smart Manufacturing",
    subtitle: "An integrated learning facility co-founded by AIA and IIT Delhi",

    intro:
      "Co-founded by AIA with IIT Delhi, the Foundation for Smart Manufacturing (IAFSM) is an integrated learning facility focused on discrete and hybrid manufacturing.",

    sections: [
      {
        heading: "What IAFSM Covers",
        description:
          "The facility supports learning and capability development across important manufacturing sectors.",
        bullets: [
          "Automotive",
          "Machine tools",
          "Consumer durables",
          "Food processing",
        ],
      },
      {
        heading: "Who Can Benefit?",
        description:
          "IAFSM's learning ecosystem is relevant to different groups across the manufacturing and automation industry.",
        bullets: [
          "Working professionals",
          "Students",
          "AIA member companies",
          "People looking to strengthen manufacturing capabilities",
        ],
      },
      {
        heading: "Training and Collaboration",
        description:
          "IAFSM provides a platform for manufacturing-focused learning, training and industry engagement.",
      },
    ],

    note: "For information about available training formats, facility capabilities, enrolment and institutional partnerships, contact AIA.",
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const normalizeTitle = (title = "") =>
  title.toLowerCase().replace(/\s+/g, " ").trim();

const getProgramDetails = (card) => {
  if (card.modalContent) {
    return card.modalContent;
  }

  const title = normalizeTitle(card.title);

  if (title.includes("campus events")) {
    return talentProgramDetails["campus events"];
  }

  if (title.includes("campus connect")) {
    return talentProgramDetails["campus connect"];
  }

  if (title.includes("certifications") || title.includes("skilling programs")) {
    return talentProgramDetails["certifications & skilling programs"];
  }

  if (title.includes("find talent")) {
    return talentProgramDetails["find talent"];
  }

  if (title.includes("iafsm")) {
    return talentProgramDetails["iafsm"];
  }

  return {
    label: "AIA Programme",
    subtitle: card.title,
    intro: card.description || "",
    sections: [],
    note: "Contact AIA for more information about this programme.",
  };
};

// ==========================================
// COMPONENT
// ==========================================

export default function ReusableCardGrid({
  title,
  cards = [],
  columns = 3,
  sectionId,
  backgroundImage = "/grid-bg.png",
  showBackground = true,
  readMoreText = "Read More",
  onCardClick,
  link,
}) {
  const [selectedCard, setSelectedCard] = useState(
    cards[0]?.id || cards[0]?._id || null,
  );

  const [activeCard, setActiveCard] = useState(null);

  // ==========================================
  // MODAL BODY SCROLL + ESCAPE
  // ==========================================

  useEffect(() => {
    if (!activeCard) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveCard(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeCard]);

  // ==========================================
  // CARD CLICK
  // ==========================================

  const handleCardClick = (card) => {
    const id = card.id || card._id;

    setSelectedCard(id);
    setActiveCard(card);

    if (onCardClick) {
      onCardClick(card);
    }
  };

  // ==========================================
  // GRID COLUMNS
  // ==========================================

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return "md:grid-cols-2";

      case 4:
        return "sm:grid-cols-2 lg:grid-cols-4";

      case 3:
      default:
        return "sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (!cards.length) {
    return null;
  }

  const details = activeCard ? getProgramDetails(activeCard) : null;

  return (
    <>
      <section
        id={sectionId}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        {/* BACKGROUND GRID */}

        {showBackground && backgroundImage && (
          <div
            className="pointer-events-none absolute inset-0 bg-repeat opacity-40 [background-size:360px_360px]"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
            aria-hidden="true"
          />
        )}

        {/* CONTENT */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* TITLE */}

          {title && (
            <div className="mb-10 text-center sm:mb-12 lg:mb-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E37263]">
                AIA | Talent Connect
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#1F2937] sm:text-4xl md:text-[42px]">
                {title}
              </h2>
            </div>
          )}

          {/* CARDS */}

          <div
            className={`
              mx-auto grid w-full max-w-6xl
              grid-cols-1 items-stretch gap-5
              sm:gap-6 lg:gap-8
              ${getGridColumns()}
            `}
          >
            {cards.map((card, index) => {
              const cardId = card.id || card._id || index;
              const isSelected = selectedCard === cardId;

              return (
                <article
                  key={cardId}
                  className={`
                    group relative flex min-w-0
                    flex-col overflow-hidden rounded-sm
                    border border-red-100 bg-white
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    ${isSelected ? "shadow-md" : "shadow-sm"}
                  `}
                >
                  {/* IMAGE */}

                  {card.image && (
                    <div className="relative h-[210px] w-full overflow-hidden bg-slate-100 sm:h-[220px] lg:h-[230px]">
                      <img
                        src={card.image}
                        alt={card.imageAlt || card.title || "AIA programme"}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                        className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* CARD CONTENT */}

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-base font-semibold leading-snug text-[#1F2937] sm:text-lg">
                      {card.title}
                    </h3>

                    {card.description && (
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-black/70 sm:text-sm">
                        {card.description}
                      </p>
                    )}

                    {/* READ MORE */}

                    {card.readMore !== false && (
                      <div className="mt-auto pt-6">
                        <button
                          type="button"
                          onClick={() => handleCardClick(card)}
                          className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#E37263] transition-all duration-300 hover:gap-3 hover:text-[#C84E40]"
                        >
                          {card.readMoreText || readMoreText}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ACCENT */}

                  {/* BOTTOM ACCENT - ONLY ON HOVER */}

                  <div
                    className="
    absolute
    bottom-0
    left-6
    right-6
    h-0.5
    rounded-full
    bg-[#E37263]
    translate-y-2
    opacity-0
    transition-all
    duration-300
    group-hover:translate-y-0
    group-hover:opacity-100
  "
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          AIA PROGRAMME DETAIL POPUP
      ========================================== */}

      {activeCard && details && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071321]/75 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveCard(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="talent-modal-title"
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[88vh]"
          >
            {/* MODAL HEADER */}

            <div className="relative shrink-0 overflow-hidden bg-[#172536] px-5 py-7 text-white sm:px-9 sm:py-9">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />

              <div className="absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[25px] border-white/5" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F18A7C] sm:text-xs">
                    AIA / {details.label}
                  </p>

                  <h2
                    id="talent-modal-title"
                    className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
                  >
                    {activeCard.title}
                  </h2>

                  {details.subtitle && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                      {details.subtitle}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCard(null)}
                  aria-label="Close programme details"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-[#172536]"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="relative z-10 mt-6 h-1 w-16 rounded-full bg-[#E37263]" />
            </div>

            {/* MODAL BODY */}

            <div className="overflow-y-auto px-5 py-6 sm:px-9 sm:py-8">
              {/* OVERVIEW */}

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#E37263]">
                  Overview
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                  {details.intro}
                </p>
              </div>

              {/* CONTENT SECTIONS */}

              {details.sections?.length > 0 && (
                <div className="space-y-7">
                  {details.sections.map((section, index) => (
                    <div key={index} className="border-t border-gray-100 pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0ED] text-sm font-bold text-[#E37263]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-[#172536] sm:text-lg">
                            {section.heading}
                          </h3>

                          {section.description && (
                            <p className="mt-2 text-sm leading-7 text-gray-600">
                              {section.description}
                            </p>
                          )}

                          {section.bullets && (
                            <ul className="mt-3 space-y-2.5">
                              {section.bullets.map((bullet, bulletIndex) => (
                                <li
                                  key={bulletIndex}
                                  className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E37263]" />

                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* IMPORTANT INFORMATION */}

              {details.note && (
                <div className="mt-8 rounded-lg border-l-4 border-[#E37263] bg-[#FFF5F3] p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C85D50]">
                    Important Information
                  </p>

                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    {details.note}
                  </p>
                </div>
              )}

              {/* MODAL FOOTER */}

              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">
                  Automation Industry Association (AIA)
                </p>

                <button
                  type="button"
                  onClick={() => setActiveCard(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E37263] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CF5D50]"
                >
                  Close Details
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
