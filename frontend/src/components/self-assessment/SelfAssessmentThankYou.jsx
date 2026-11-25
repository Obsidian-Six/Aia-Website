
import React from "react";
import { ArrowRight, Check } from "lucide-react";

const SelfAssessmentThankYou = ({ onBackHome }) => {
  return (
    <div className="flex min-h-[65vh] items-center justify-center py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E8EAF0] bg-white px-6 py-12 text-center shadow-[0_8px_35px_rgba(20,32,55,0.04)] sm:px-12 sm:py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E25238]/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E25238] text-white">
            <Check size={30} strokeWidth={3} />
          </div>
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#E25238]">
          Manufacturers Self-Assessment
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
          Thank You!
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#667085] sm:text-base">
          Your assessment has been submitted successfully.
        </p>

        <div className="mx-auto mt-8 h-px max-w-xs bg-[#E8EAF0]" />

        <p className="mt-7 text-sm leading-7 text-gray-500">
          Thank you for taking the time to assess your organisation&apos;s
          manufacturing and automation capabilities.
        </p>

        <button
          type="button"
          onClick={onBackHome}
          className="mt-9 inline-flex items-center justify-center gap-3 rounded-lg bg-[#E25238] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#C9442D] focus:outline-none focus:ring-4 focus:ring-[#E25238]/20"
        >
          Back to Home
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default SelfAssessmentThankYou;
