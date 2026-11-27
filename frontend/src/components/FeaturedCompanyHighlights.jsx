import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getFeaturedHighlights } from "../services/api";

const arrowClass = "grid h-10 w-10 place-items-center rounded-full bg-white text-[#172033] shadow-md hover:bg-[#E25238] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function CompanySlider({ companies, label }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = companies.length;
  if (!count) return null;
  const index = activeIndex % count;
  const company = companies[index];
  const move = (direction) => setActiveIndex((current) => (current + direction + count) % count);

  return (
    <article aria-label={label} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#172033]">
        <img src={company.bannerUrl} alt={company.bannerAlt || ""} loading="lazy" decoding="async"
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101C2D] via-[#101C2D]/40 to-transparent" />
        {count > 1 && (
          <div className="absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between sm:inset-x-4">
            <button type="button" className={arrowClass} onClick={() => move(-1)} aria-label="Previous company"><ChevronLeft size={21} aria-hidden="true" /></button>
            <button type="button" className={arrowClass} onClick={() => move(1)} aria-label="Next company"><ChevronRight size={21} aria-hidden="true" /></button>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
          <p className="text-sm font-medium text-white/85">{company.name}</p>
          {company.headline && <p className="mt-2 max-w-xs text-xl font-bold leading-tight sm:text-2xl">{company.headline}</p>}
          {count > 1 && (
            <div className="mt-4 flex max-w-full items-center gap-1 overflow-x-auto">
              {companies.map((item, dotIndex) => (
                <button key={item._id} type="button" aria-label={`Show ${item.name}`} aria-pressed={index === dotIndex}
                  onClick={() => setActiveIndex(dotIndex)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
                  <span aria-hidden="true" className={`h-2.5 rounded-full transition-all ${index === dotIndex ? "w-5 bg-[#E25238]" : "w-2.5 bg-white/70"}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="min-w-0 flex-1" aria-live="polite">
          <h3 className="text-base font-bold text-[#172033]">{company.name}</h3>
          {company.description && <p className="mt-1 text-sm leading-relaxed text-slate-600">{company.description}</p>}
        </div>
        {company.linkUrl && (
          <a href={company.linkUrl} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#C9452E] hover:underline">
            Know More <ArrowRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function FeaturedCompanyHighlights() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getFeaturedHighlights({ signal: controller.signal }).then(setCompanies).catch((error) => {
      if (!controller.signal.aborted) console.error("Featured highlights:", error.message);
    });
    return () => controller.abort();
  }, []);

  const left = companies.filter((company) => company.lane === "left");
  const right = companies.filter((company) => company.lane === "right");
  if (!companies.length) return null;

  return (
    <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#E25238]" aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">Featured Highlights</h2>
        </div>
        <div className={`grid gap-5 ${left.length && right.length ? "md:grid-cols-2" : "mx-auto max-w-lg"}`}>
          <CompanySlider companies={left} label="Featured companies, left slider" />
          <CompanySlider companies={right} label="Featured companies, right slider" />
        </div>
      </div>
    </section>
  );
}
