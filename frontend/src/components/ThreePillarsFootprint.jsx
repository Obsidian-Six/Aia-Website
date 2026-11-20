
import React, { useEffect, useState } from "react";
import { Download, Loader2, X, ArrowRight } from "lucide-react";
import { getPillarFootprints } from "../services/api";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/$/, "");

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const fallbackPillars = [
  {
    _id: "knowledge",
    title: "Knowledge Infrastructure",
    description:
      "Building a strong knowledge ecosystem through research, learning, innovation and industry-oriented education.",
    imageUrl: "",
    isHighlighted: false,
    hasBrochure: false,
  },
  {
    _id: "physical",
    title: "Physical Infrastructure",
    description:
      "Developing world-class physical infrastructure to support institutional growth, collaboration and industry development.",
    imageUrl: "",
    isHighlighted: true,
    hasBrochure: false,
  },
  {
    _id: "management",
    title: "Management Infrastructure",
    description:
      "Strengthening management systems, governance and strategic partnerships to create a sustainable ecosystem.",
    imageUrl: "",
    isHighlighted: false,
    hasBrochure: false,
  },
];

export default function ThreePillarsFootprint() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPillar, setSelectedPillar] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [formError, setFormError] = useState("");

  // ------------------------------------------
  // FETCH PILLAR FOOTPRINTS FROM CMS
  // ------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchPillars = async () => {
      try {
        const response = await getPillarFootprints();

        if (!isMounted) return;

        const activePillars = (response || []).filter(
          (item) => item.isActive !== false
        );

        setPillars(
          activePillars.length > 0 ? activePillars : fallbackPillars
        );
      } catch (error) {
        console.error("Error fetching pillar footprints:", error);

        if (isMounted) {
          setPillars(fallbackPillars);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPillars();

    return () => {
      isMounted = false;
    };
  }, []);

  // ------------------------------------------
  // OPEN BROCHURE ENQUIRY POPUP
  // ------------------------------------------
  const openEnquiry = (pillar) => {
    setSelectedPillar(pillar);
    setFormData(initialForm);
    setFormError("");
    setShowEnquiry(true);
  };

  const closeEnquiry = () => {
    if (submitting) return;

    setShowEnquiry(false);
    setSelectedPillar(null);
    setFormData(initialForm);
    setFormError("");
  };

  // ------------------------------------------
  // FORM INPUT HANDLER
  // ------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------
  // DOWNLOAD PDF
  //
  // Backend endpoint contract:
  // GET /pillar-footprints/:id/brochure/download
  //
  // Valid cookie  -> PDF response
  // Missing cookie -> 401 response
  // ------------------------------------------
  const downloadBrochure = async (pillar) => {
    if (!pillar?._id || !pillar?.hasBrochure) return;

    setDownloadingId(pillar._id);
    setFormError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/pillar-footprints/${pillar._id}/brochure/download`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        openEnquiry(pillar);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to download brochure. Please try again.");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download =
        pillar.brochureFileName || `${pillar.title}-Brochure.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Brochure download error:", error);
      setFormError(
        error.message || "Something went wrong while downloading."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // ------------------------------------------
  // SUBMIT BROCHURE ENQUIRY
  //
  // Backend endpoint contract:
  // POST /brochure-enquiries
  //
  // Backend should:
  // 1. Save enquiry in FormSubmission CMS.
  // 2. Set common HttpOnly download-access cookie.
  // 3. Return success after cookie is set.
  // ------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPillar?._id) return;

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
            resourceType: "pillar-footprint",
            resourceId: selectedPillar._id,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      const pillarToDownload = selectedPillar;

      setShowEnquiry(false);
      setSelectedPillar(null);
      setFormData(initialForm);

      // Download the exact brochure requested after successful enquiry.
      await downloadBrochure(pillarToDownload);
    } catch (error) {
      console.error("Brochure enquiry error:", error);
      setFormError(
        error.message || "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl text-center">

        {/* SECTION HEADING */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.22em] text-[#E52B18] sm:text-sm">
            Our Foundation
          </span>

          <h2 className="text-3xl font-semibold leading-tight text-[#17202B] sm:text-4xl lg:text-5xl">
            Three Pillars of{" "}
            <span className="text-[#E52B18]">AIA</span>
          </h2>

          <p className="mb-5 text-sm font-normal leading-[1.7] text-gray-600 sm:text-base sm:leading-[1.7] lg:text-lg lg:leading-[1.75]">
           The future of manufacturing depends on skilled professionals, advanced infrastructure and effective industry-academia collaboration. <br /> AIA's three pillars focus on strengthening knowledge, developing practical capabilities and establishing robust management systems to advance industrial automation education and skill development across India.
          </p>
        </div>
    </div>
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* PILLAR CARDS */}
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#E52B18]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {pillars.map((pillar, index) => {
              const isHighlighted = pillar.isHighlighted;
              const hasBrochure = Boolean(pillar.hasBrochure);

              return (
                <article
                  key={pillar._id || index}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-md border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isHighlighted
                      ? "border-[#E52B18]"
                      : "border-gray-200"
                  }`}
                >
                  {/* CARD IMAGE */}
                  <div className="relative h-[230px] overflow-hidden bg-gray-100 sm:h-[260px]">
                    {pillar.imageUrl ? (
                      <img
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#17202B]">
                        <span className="text-6xl font-bold text-white/20">
                          0{index + 1}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span className="absolute bottom-5 left-5 text-sm font-semibold tracking-[0.2em] text-white">
                      PILLAR 0{index + 1}
                    </span>

                    {isHighlighted && (
                      <span className="absolute right-4 top-4 rounded-sm bg-[#E52B18] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* CARD CONTENT */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-xl font-semibold leading-snug text-[#17202B] sm:text-xl">
                      {pillar.title}
                    </h3>

                    <p className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                      {pillar.description}
                    </p>

                    {/* BROCHURE BUTTON */}
                    {hasBrochure && (
                      <div className="mt-7 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => downloadBrochure(pillar)}
                          disabled={downloadingId === pillar._id}
                          className="group/button inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#E52B18] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#C92313] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {downloadingId === pillar._id ? (
                            <>
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              View Brochure
                              <Download
                                size={17}
                                className="transition-transform duration-300 group-hover/button:translate-y-0.5"
                              />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {/* ------------------------------------------ */}
      {/* SEPARATE BROCHURE ENQUIRY POPUP */}
      {/* GeneralPopupEnquiry is not modified. */}
      {/* ------------------------------------------ */}
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
            aria-labelledby="brochure-popup-title"
            className="relative my-auto w-full max-w-[520px] rounded-md bg-white p-6 shadow-2xl sm:p-9"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={closeEnquiry}
              disabled={submitting}
              aria-label="Close popup"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
            >
              <X size={21} />
            </button>

            {/* POPUP HEADING */}
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E52B18]">
              Brochure Access
            </span>

            <h3
              id="brochure-popup-title"
              className="mt-3 pr-7 text-2xl font-bold text-[#17202B] sm:text-3xl"
            >
              Get Your Brochure
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Please share your details to access the brochure
              {selectedPillar?.title
                ? ` for ${selectedPillar.title}.`
                : "."}
            </p>

            {/* ENQUIRY FORM */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="brochure-name"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Name <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="brochure-name"
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
                  htmlFor="brochure-phone"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Phone Number <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="brochure-phone"
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
                  htmlFor="brochure-email"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Email Address <span className="text-[#E52B18]">*</span>
                </label>

                <input
                  id="brochure-email"
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
                  htmlFor="brochure-message"
                  className="mb-2 block text-sm font-semibold text-[#17202B]"
                >
                  Message <span className="text-[#E52B18]">*</span>
                </label>

                <textarea
                  id="brochure-message"
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
                Your details will be used to process your brochure
                request.
              </p>
            </form>
          </div>
        </div>
      )}
      </div>

      
    </section>
  );
}
