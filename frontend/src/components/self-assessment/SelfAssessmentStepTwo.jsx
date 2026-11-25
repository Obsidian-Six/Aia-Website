
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
} from "lucide-react";

const SelfAssessmentStepTwo = ({
  sections,
  responses,
  onResponseChange,
  onBack,
  onSubmit,
  submitting,
  error,
}) => {
  return (
    <div>
      <div className="mb-9">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#E25238]">
          Manufacturers Self-Assessment
        </p>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-1.5 flex-1 rounded-full bg-[#E25238]" />
          <span className="h-1.5 flex-1 rounded-full bg-[#E25238]" />
          <span className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]" />
        </div>

        <p className="mb-2 text-sm font-semibold text-gray-500">
          Step 2 of 3
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
          Manufacturing Self-Assessment
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085] sm:text-base">
          Assess your organisation&apos;s current manufacturing and automation
          capabilities. Select the option that best describes your current
          implementation.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[#E8EAF0] bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E25238]/10 text-[#E25238]">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#172033]">
              Assessment Questions
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Please complete all sections to submit.
            </p>
          </div>
        </div>

        <span className="whitespace-nowrap rounded-full bg-[#FCECE8] px-3 py-1.5 text-xs font-bold text-[#C9442D]">
          {Object.values(responses).filter(Boolean).length}/{sections.length}{" "}
          Completed
        </span>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <article
            key={section._id}
            className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_8px_35px_rgba(20,32,55,0.035)]"
          >
            <div className="flex items-start gap-4 border-b border-[#EDF0F4] px-5 py-5 sm:px-7">
              <div className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-[#172033] text-sm font-extrabold tracking-wide text-white">
                {section.sectionNumber || String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="mt-1.5 text-sm leading-6 text-gray-500">
                    {section.description}
                  </p>
                )}
              </div>

              {responses[section._id] && (
                <CheckCircle2
                  size={21}
                  className="mt-1 shrink-0 text-green-600"
                />
              )}
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <label
                htmlFor={`assessment-${section._id}`}
                className="block text-sm font-semibold leading-6 text-[#293449] sm:text-base"
              >
                {section.question}
                <span className="ml-1 text-[#E25238]">*</span>
              </label>

              <select
                id={`assessment-${section._id}`}
                value={responses[section._id] || ""}
                onChange={(e) =>
                  onResponseChange(section._id, e.target.value)
                }
                className={`mt-4 w-full rounded-lg border bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E25238] focus:ring-2 focus:ring-[#E25238]/10 ${
                  responses[section._id]
                    ? "border-[#E25238]/50 text-[#172033]"
                    : "border-[#DDE1E8] text-gray-400"
                }`}
              >
                <option value="" disabled>
                  Select your response...
                </option>

                {(section.options || []).map((option, optionIndex) => (
                  <option
                    key={`${section._id}-${optionIndex}`}
                    value={option}
                    className="text-[#172033]"
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-[#E5E7EB] pt-6 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE1E8] bg-white px-6 py-3.5 text-sm font-bold text-[#293449] transition hover:border-[#E25238] hover:text-[#E25238] disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Previous Step
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || sections.length === 0}
          className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#E25238] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#C9442D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Assessment
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SelfAssessmentStepTwo;
