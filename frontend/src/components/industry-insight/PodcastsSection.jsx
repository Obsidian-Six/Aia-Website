
import React, { useEffect, useState } from "react";
import {
  AudioLines,
  Play,
  CalendarDays,
  Mic2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPublishedConversations } from "../../services/api";

const getAssetUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "";

  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PodcastsSection() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPublishedConversations();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.conversations)
              ? result.conversations
              : [];

        setPodcasts(
          data.filter((item) => item.status === "published")
        );
      } catch (err) {
        console.error("Podcast Fetch Error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load podcasts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? podcasts.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === podcasts.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full overflow-hidden bg-[#F8F8F6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#E25238]">
              <AudioLines size={15} />
              AIA Conversations
            </span>

            <h2 className="text-3xl font-black leading-tight text-[#17202B] sm:text-4xl lg:text-5xl">
              Podcasts & Conversations
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Insights, experiences and perspectives from industry
              experts shaping the future of industrial automation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Mic2 size={18} className="text-[#E25238]" />
            {podcasts.length} Episodes
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading podcasts...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && podcasts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <AudioLines
              size={38}
              className="mx-auto mb-4 text-slate-300"
            />
            <h3 className="text-lg font-bold text-slate-800">
              No podcasts available yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              New AIA conversations will appear here.
            </p>
          </div>
        )}

        {/* Mobile Slider */}
        {!loading && !error && podcasts.length > 0 && (
          <>
            <div className="md:hidden">
              <div className="overflow-hidden">
                <div
                  className="flex touch-pan-y transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(calc(50% - ${activeIndex * 86 + 43}%))`,
                  }}
                >
                  {podcasts.map((item) => (
                    <div
                      key={item._id}
                      className="w-[86%] shrink-0 px-2"
                    >
                      <PodcastCard
                        item={item}
                        getAssetUrl={getAssetUrl}
                        formatDate={formatDate}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Controls */}
              {podcasts.length > 1 && (
                <div className="mt-7 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous podcast"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-[#17202B] transition hover:border-[#E25238] hover:text-[#E25238]"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    {podcasts.map((item, index) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to podcast ${index + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeIndex === index
                            ? "w-7 bg-[#E25238]"
                            : "w-2 bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next podcast"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-[#17202B] transition hover:border-[#E25238] hover:text-[#E25238]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <p className="mt-3 text-center text-xs text-slate-400">
                {activeIndex + 1} / {podcasts.length}
              </p>
            </div>

            {/* Desktop & Tablet Grid */}
            <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((item) => (
                <PodcastCard
                  key={item._id}
                  item={item}
                  getAssetUrl={getAssetUrl}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* Reusable Podcast Card */
function PodcastCard({ item, getAssetUrl, formatDate }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#17202B]">
        {item.thumbnail ? (
          <img
            src={getAssetUrl(item.thumbnail)}
            alt={item.title || "Podcast thumbnail"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#17202B] to-[#344252]">
            <AudioLines
              size={55}
              className="text-white/70"
            />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E25238] text-white shadow-lg">
            <Play size={23} fill="currentColor" />
          </div>
        </div>

        {item.industryVertical && (
          <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#E25238]">
            {item.industryVertical}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <CalendarDays size={14} />
          {formatDate(item.publishedAt)}
        </div>

        <h3 className="text-xl font-bold leading-snug text-[#17202B] transition group-hover:text-[#E25238]">
          {item.title}
        </h3>

        {(item.expertName || item.expertDesignation) && (
          <div className="mt-3">
            {item.expertName && (
              <p className="text-sm font-bold text-slate-800">
                {item.expertName}
              </p>
            )}

            {item.expertDesignation && (
              <p className="mt-1 text-xs text-slate-500">
                {item.expertDesignation}
              </p>
            )}
          </div>
        )}

        {item.shortDescription && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {item.shortDescription}
          </p>
        )}

        {/* Audio Player */}
        {item.audioUrl && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#E25238]">
              <AudioLines size={15} />
              Listen to Conversation
            </div>

            <audio
              controls
              preload="none"
              className="h-10 w-full"
            >
              <source src={getAssetUrl(item.audioUrl)} />
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
      </div>
    </article>
  );
}
