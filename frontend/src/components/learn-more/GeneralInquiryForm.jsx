

import React from "react";
import GeneralInquiryFields from "../general-inquiry/GeneralInquiryFields";

export default function GeneralInquiryForm({
  logo = "/aia-logo-blue.png",
}) {
  return (
    <section className="relative overflow-hidden bg-[#fff] px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-6 border-t border-dotted border-white/40" />

       <div className="grid grid-cols-1 items-center gap-7 rounded-md border border-black bg-white p-5 shadow-xl sm:p-7 lg:grid-cols-[0.65fr_1.35fr] lg:gap-10 lg:p-10">
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Automation Industry Association"
              loading="lazy"
              decoding="async"
              className="h-auto max-h-[180px] w-[190px] object-contain sm:w-[220px]"
            />
          </div>

          <div className="min-w-0">
            <h2 className="mb-5 text-left text-xl font-bold text-[#263247]">
              General Inquiry
            </h2>

            <GeneralInquiryFields sourcePage="learn-more" variant="page" />
          </div>
        </div>
      </div>
    </section>
  );
}
