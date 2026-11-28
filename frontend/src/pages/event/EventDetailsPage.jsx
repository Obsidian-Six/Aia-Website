

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
                  Mobile Number <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="event-brochure-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your mobile number"
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
