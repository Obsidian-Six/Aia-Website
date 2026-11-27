import React from "react";
import { Download, FileText, Play, Sparkles } from "lucide-react";

const api = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

const button =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#F5C8C1] bg-white px-4 py-2 text-sm font-semibold text-[#C9452E] hover:bg-[#FFF1EE]";

const printPage = () => window.print();

export function eventDownloadUrl(eventId, document) {
  return `${api}/events/${encodeURIComponent(eventId)}/downloads/${encodeURIComponent(document)}`;
}

function Section({ title, children }) {
  return (
    <section className="mx-auto max-w-[1250px] px-5 py-8 text-[#263247] sm:px-8">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div
        className="mb-5 mt-2 h-1 w-10 rounded-full bg-[#E25238]"
        aria-hidden="true"
      />
      {children}
    </section>
  );
}

function SummaryCards({ title, entries }) {
  if (!entries.length) return null;

  return (
    <Section title={title}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {entries.map(({ _id, title: cardTitle, description }, index) => (
          <article
            key={_id || index}
            className="rounded-xl bg-slate-50 p-4 text-center"
          >
            <Sparkles
              className="mx-auto mb-2 text-[#E25238]"
              size={24}
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold">{cardTitle}</h3>
            {description && (
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {description}
              </p>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

export default function EventDownloadSections({
  event,
  isUpcoming,
  onPrintDetails = printPage,
}) {
  if (!event) return null;

  const {
    highlights = [],
    takeaways = [],
    resources = [],
    videos = [],
  } = event.eventContent || {};

  if (isUpcoming) {
    return <SummaryCards title="Event Highlights" entries={highlights} />;
  }

  const hasPdfs = resources.some((item) => item.type === "pdf");

  function getYouTubeVideoId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www|m)\./, "");
    const [route, pathId] = url.pathname.split("/").filter(Boolean);

    let id = null;

    if (host === "youtu.be") {
      id = route;
    } else if (host === "youtube.com") {
      if (route === "watch") {
        id = url.searchParams.get("v");
      } else if (["shorts", "live", "embed"].includes(route)) {
        id = pathId;
      }
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? id : null;
  } catch {
    return null;
  }
}

function VideoRecordingCard({ video }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const videoId = getYouTubeVideoId(video.url);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {videoId && (
        <div className="relative aspect-video bg-[#172033]">
          {showPlayer ? (
            <iframe
              title={video.title || "YouTube video"}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowPlayer(true)}
              aria-label={`Play ${video.title || "video"}`}
              className="group absolute inset-0 grid w-full place-items-center overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            >
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="relative grid h-11 w-16 place-items-center rounded-xl bg-red-600 text-white shadow-lg transition-colors group-hover:bg-red-700">
                <Play size={22} fill="currentColor" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold leading-snug text-[#263247]">
          {video.title}
        </h3>

        {video.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {video.description}
          </p>
        )}

        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-[#C9452E] hover:underline"
        >
          Watch on YouTube
        </a>
      </div>
    </article>
  );
}

  return (
    <>
      <SummaryCards title="Key Takeaways" entries={takeaways} />

      {videos.length > 0 && (
       <Section title="Video Recordings">
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {videos.map((video) => {
      const videoId = getYouTubeVideoId(video.url);

      return (
        <article key={video._id || video.url}>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E25238]"
          >
            <div className="relative aspect-video overflow-hidden bg-[#172033]">
              {videoId && (
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid place-items-center bg-black/15"
              >
                <span className="grid h-11 w-16 place-items-center rounded-xl bg-[#FF0033] text-white shadow-lg transition-transform group-hover:scale-110">
                  <Play size={22} fill="currentColor" />
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#263247] group-hover:text-[#C9452E]">
                {video.title}
              </h3>

              {video.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {video.description}
                </p>
              )}

              <span className="mt-3 inline-block text-sm font-semibold text-[#C9452E]">
                {videoId ? "Watch on YouTube" : "Open on YouTube"}
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </div>
          </a>
        </article>
      );
    })}
  </div>
</Section>
      )}
        <div className="print:hidden">
      <Section title="Event Resources">
        <div className="grid gap-3 sm:grid-cols-2" data-tts-ignore>
          <button
            type="button"
            className={button}
            data-event-print-hide
            onClick={onPrintDetails}
          >
            <FileText size={22} aria-hidden="true" />
            <span className="flex-1 text-left">
              Event Report
              <span className="block text-xs font-normal text-slate-600">
                Print / Save as PDF
              </span>
            </span>
          </button>

          {hasPdfs && (
            <a
              className={button}
              href={eventDownloadUrl(event._id, "all-pdfs")}
            >
              <FileText size={22} aria-hidden="true" />
              <span className="flex-1">
                Presentations (All Sessions)
                <span className="block text-xs font-normal text-slate-600">
                  ZIP · All PDFs
                </span>
              </span>
              <Download size={18} aria-hidden="true" />
            </a>
          )}
        </div>
      </Section>
        </div>
    </>
  );
}