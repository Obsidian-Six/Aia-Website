
import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Network,
  Users,
  Lightbulb,
  Factory,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const focusAreas = [
  {
    number: "01",
    title: "Knowledge & Perspectives",
    description:
      "A space to exchange industry insights, share experiences and explore emerging developments in smart manufacturing.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Industry - Academia Connect",
    description:
      "Strengthening collaboration between manufacturing organisations, academic institutions and research communities to bridge knowledge with practical application.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Professional Networks",
    description:
      "Building connections across disciplines, sectors and expertise to encourage meaningful dialogue and collaborative opportunities.",
    icon: Network,
  },
  {
    number: "04",
    title: "Learning & Capability Development",
    description:
      "Encouraging continuous learning through knowledge sessions, workshops, expert interactions and skill development initiatives.",
    icon: Users,
  },
  {
    number: "05",
    title: "Innovation & Applied Research",
    description:
      "Creating opportunities to explore new technologies, address manufacturing challenges and accelerate the adoption of innovative solutions.",
    icon: Lightbulb,
  },
];

const SamarthCommunity = () => {
  return (
    <main className="w-full overflow-hidden bg-white text-[#1F2937]">

      {/* HERO SECTION */}
      <section className="relative bg-[#17202B] text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-white/[0.07]" />
          <div className="absolute -right-20 -top-20 h-[330px] w-[330px] rounded-full border border-white/[0.07]" />
          <div className="absolute bottom-[-180px] left-[35%] h-[350px] w-[350px] rounded-full border border-white/[0.05]" />

          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#E25238]/10 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#E25238]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF806B]">
                AIA Community Initiative
              </span>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
              Samarth
              <span className="block text-[#E25238]">
                Community
              </span>
            </h1>

            <h2 className="mt-7 max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-3xl">
              Bringing Manufacturing Minds Together
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              Samarth Community is a collaborative ecosystem that brings
              together manufacturing professionals, industry leaders,
              academic institutions, researchers and technology enablers
              to shape the future of smart manufacturing in India.
            </p>

            <a
              href="#about-samarth"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#E25238] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#C94029]"
            >
              Explore Samarth
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
            {["Industry", "Academia", "Research", "Technology"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#E25238]">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-200 sm:text-base">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ABOUT SAMARTH */}
      <section
        id="about-samarth"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E25238]">
              <span className="h-2 w-2 rounded-full bg-[#E25238]" />
              About Samarth
            </span>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#17202B] sm:text-5xl">
              Bringing People
              <br />
              <span className="text-[#E25238]">
                Together for Progress.
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-gray-600 sm:text-lg">
            <p>
              Samarth Community is a collaborative ecosystem that brings
              together manufacturing professionals, industry leaders,
              academic institutions, researchers and technology enablers
              to shape the future of smart manufacturing in India.
            </p>

            <p>
              Rooted in shared knowledge, collective expertise and industry
              collaboration, Samarth aims to create meaningful connections
              that translate ideas into insights, partnerships and progress.
            </p>

            <div className="rounded-2xl border-l-4 border-[#E25238] bg-[#F8FAFC] p-6 sm:p-8">
              <p className="text-lg font-semibold leading-relaxed text-[#17202B] sm:text-xl">
                A collaborative ecosystem where shared knowledge and
                collective expertise drive meaningful progress in
                manufacturing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT SAMARTH BRINGS TOGETHER */}
      <section className="bg-[#F8FAFC] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E25238]">
              <span className="h-2 w-2 rounded-full bg-[#E25238]" />
              Our Focus Areas
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#17202B] sm:text-5xl">
              What Samarth
              <span className="text-[#E25238]"> Brings Together</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Connecting people, knowledge and capabilities to build a
              stronger smart manufacturing ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area, index) => {
              const Icon = area.icon;

              return (
                <article
                  key={area.number}
                  className={`group rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#E25238]/40 hover:shadow-xl hover:shadow-gray-200/60 sm:p-8 ${
                    index === 3 ? "lg:col-span-1" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wider text-[#E25238]">
                      {area.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#E25238] transition-colors duration-300 group-hover:bg-[#E25238] group-hover:text-white">
                      <Icon size={23} strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3 className="mt-9 text-xl font-extrabold leading-snug text-[#17202B] sm:text-2xl">
                    {area.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                    {area.description}
                  </p>

                  <div className="mt-7 h-[2px] w-10 bg-[#E25238] transition-all duration-300 group-hover:w-20" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BE PART OF WHAT COMES NEXT */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E25238]">
              <span className="h-2 w-2 rounded-full bg-[#E25238]" />
              Be Part of the Journey
            </span>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#17202B] sm:text-5xl">
              Be Part of
              <br />
              <span className="text-[#E25238]">What Comes Next.</span>
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-gray-600 sm:text-lg">
            <p>
              Samarth is envisioned as a growing network of people and
              organisations committed to strengthening India's
              manufacturing ecosystem.
            </p>

            <p>
              Whether you represent industry, academia, research or
              technology, your knowledge and perspective can contribute
              to this collective journey.
            </p>
          </div>
        </div>
      </section>

      {/* COMING SOON HIGHLIGHT */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#17202B] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-[#E25238]/30" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-2 w-1/2 bg-[#E25238]" />

          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E25238]/40 bg-[#E25238]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#FF8A76]">
              <Sparkles size={15} />
              Coming Soon
            </div>

            <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              The Digital Community Platform
              <span className="mt-2 block text-[#FF725D]">
                Is Coming Soon.
              </span>
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
              We are developing a dedicated digital platform to bring
              the Samarth ecosystem closer together. The upcoming platform
              will facilitate knowledge exchange, professional connections,
              collaborative discussions and access to community initiatives.
            </p>

            <div className="mt-9 flex flex-col gap-4 border-t border-white/15 pt-7 sm:flex-row sm:items-start">
              <CheckCircle2
                size={21}
                className="shrink-0 text-[#FF725D]"
              />

              <p className="text-sm font-medium leading-7 text-gray-200 sm:text-base">
                The platform is currently under development. Stay connected
                with AIA for updates on its launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING SECTION */}
      <section className="border-t border-gray-200 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E25238]">
              Samarth Community
            </span>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#17202B] sm:text-5xl">
              Connect. Contribute.
              <span className="block text-[#E25238]">
                Advance Manufacturing.
              </span>
            </h2>
          </div>

          {/* <a
            href="https://www.iafsm.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#E25238] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#C94029]"
          >
            Join Samarth Community
            <ArrowUpRight size={18} />
          </a> */}
        </div>
      </section>
    </main>
  );
};

export default SamarthCommunity;
