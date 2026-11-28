
import React from "react";

import MembershipFeeTable from "./MembershipFeeTable";
import MembershipRegistrationForm from "./MembershipRegistrationForm";
import MembershipPartners from "./MembershipPartners";
import MembershipFAQ from "./MembershipFAQ";
import { Link, useLocation } from "react-router-dom";
import { submitFormSubmission } from "../../services/formSubmissionApi";
import FAQSections from "./FAQSections";

export default function MembershipAudiencePage({ data }) {
  const location = useLocation();

  if (!data) return null;

  // Identify which registration page is currently open.
  const formType = location.pathname.includes(
    "technology-providers-signup"
  )
    ? "technology-provider"
    : location.pathname.includes("service-providers")
      ? "system-provider"
      : null;

  const handleRegistration = async (payload) => {
    if (!formType) {
      throw new Error("Invalid membership registration page.");
    }

    return await submitFormSubmission({
      formType,
      data: payload,
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFE] font-sans text-left">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_left,_rgba(238,113,99,0.07),_transparent_45%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">

          {/* Left Content */}
          <div className="min-w-0 lg:col-span-7">
            <h1 className="max-w-2xl text-3xl leading-tight text-[#263247] sm:text-4xl font-semibold">
              {data.title}
            </h1>

            {data.description?.map((paragraph, index) => (
              <p
                key={index}
                className="mt-4 max-w-3xl text-xs leading-[1.8] text-[#465366] sm:text-sm"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-7">
              <MembershipFeeTable rows={data.feeStructure} />
            </div>
            {/* Benefits */}
        <section className="mt-12 max-w-4xl sm:mt-16">
          <h2 className="mb-7 text-xl font-semibold text-[#263247]">
            {data.benefitsTitle}
          </h2>

          <div className="space-y-7">
            {data.benefits?.map((benefit, index) => (
              <div key={`${benefit.title}-${index}`}>
                <h3 className="mb-2 text-sm font-semibold text-[#315778] sm:text-base">
                  {benefit.title}
                </h3>

                <p className="text-xs leading-[1.8] text-[#465366] sm:text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5 lg:col-span-5">
            {/* <MembershipRegistrationForm
              onSubmit={handleRegistration}
            /> */}

            <div className="flex flex-col">
              {/* <h1 className="capitalize">
                Join Our {data.slug}
              </h1> */}

              <Link
                to="/request-form/membership"
                className="mt-3 w-fit rounded-lg bg-gradient-to-r from-[#D92716] via-[#E83D2B] to-[#F17C6D] py-3 px-4 text-lg font-semibold text-white transition hover:brightness-95"
              >
                Apply for Membership
              </Link>
            </div>

            <MembershipPartners partners={data.partners} />
          </aside>

        </div>

        

        {/* FAQ */}
              <FAQSections />
        {/* <MembershipFAQ faqs={data.faqs} /> */}

        <div className="flex item-center justify-center">
              {/* <h1 className="capitalize">
                Join Our {data.slug}
              </h1> */}

              <Link
                to="/contact-us"
                className="mt-3 w-fit rounded-lg bg-gradient-to-r from-[#D92716] via-[#E83D2B] to-[#F17C6D] py-3 px-4 text-lg font-semibold text-white transition hover:brightness-95"
              >
                Contact Us
              </Link>
            </div>

      </div>
    </main>
  );
}
