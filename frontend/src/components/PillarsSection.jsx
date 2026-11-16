
import { BookOpen, Factory, ClipboardCheck, ArrowRight } from "lucide-react";
import BrochureButton from "./common/BrochureButton";

const ACCENT = "#E96F62";
const INK = "#17202B";
const BODY_TEXT = "#5B6573";
const WHITE = "#FFFFFF";

const iconProps = {
  size: 28,
  strokeWidth: 1.6,
  color: ACCENT,
  "aria-hidden": true,
};

const PILLARS = [
  {
    title: "Knowledge Infrastructure",
    icon: <BookOpen {...iconProps} />,
    description:
      "Comprising an academic curriculum and supporting learning modules, training on modern industrial equipment and introduction to contemporary practices and solutions. It is a cross-disciplinary program that instills basic theory, equipment and integrated approach towards automation with relevant hands-on at various levels.",
  },
  {
    title: "Physical Infrastructure",
    icon: <Factory {...iconProps} />,
    description:
      "Comprising a network of academic partner campuses, and industrial sites to support practical and hands-on training. It exposes the academia and students to the visiting sites and helps connect them to relevant industrial automation solutions. It also provides for internships and creation of faculty consultancy centers, technology / solution incubation laboratories.",
  },
  {
    title: "Management Infrastructure",
    icon: <ClipboardCheck {...iconProps} />,
    description:
      "Comprising a 2-tier assessment and certification process that ensures quality, sustainability and scaling up of the program. It provides a global benchmark for a PAN India evaluation and certification for entry level automation professionals.",
  },
];

function PillarCard({ icon, title, description }) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border-t-4 bg-white px-5 pb-6 pt-6 shadow-[0_10px_30px_rgba(23,32,43,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(23,32,43,0.12)] sm:px-6 sm:pb-7 lg:px-7 lg:pb-8 xl:px-8"
      style={{ borderTopColor: ACCENT }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px]"
          style={{ backgroundColor: `${ACCENT}1A` }}
        >
          {icon}
        </div>

        <h3
          className="text-lg font-semibold leading-tight tracking-tight sm:text-xl"
          style={{ color: INK }}
        >
          {title}
        </h3>
      </div>

      {/* Description */}
      <p
        className="mt-5 text-sm leading-[1.8] sm:text-[13px] lg:mt-6"
        style={{ color: BODY_TEXT }}
      >
        {description}
      </p>
    </article>
  );
}

export default function PillarsSection({ brochureLink = "#" }) {
  return (
    <section
      className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      style={{ backgroundColor: WHITE }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span
              className="h-[2px] w-10 sm:w-14"
              style={{ backgroundColor: ACCENT }}
            />

            <span
              className="text-[13px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: ACCENT }}
            >
              Our Approach
            </span>

            <span
              className="h-[2px] w-10 sm:w-14"
              style={{ backgroundColor: ACCENT }}
            />
          </div>

          <h2
            className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: INK }}
          >
            3 Pillars for an Effective Pan-India Footprint
          </h2>
        </div>

        {/* Pillar Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>

        {/* Brochure CTA */}
        <div className="mt-10 flex justify-center">
          {/* <a
            href={brochureLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_6px_18px_rgba(233,111,98,0.25)]"
            style={{ backgroundColor: ACCENT }}
          >
            View Brochure
            <ArrowRight
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a> */}
           <BrochureButton
              href="/aims-objectives/campus+connect+brochure.pdf"
              label="View Brochure"
              fileName="AIA-Brochure.pdf"
            />
        </div>
      </div>
    </section>
  );
}
