
import React from "react";
import { ArrowRight, UserRound } from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-lg border border-[#DDE1E8] bg-white px-4 py-3.5 text-sm text-[#172033] outline-none transition placeholder:text-gray-400 focus:border-[#E25238] focus:ring-2 focus:ring-[#E25238]/10";

const labelClass = "text-sm font-semibold text-[#293449]";

const SelfAssessmentStepOne = ({
  participant,
  functionOptions,
  onChange,
  onContinue,
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
          <span className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]" />
          <span className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]" />
        </div>

        <p className="mb-2 text-sm font-semibold text-gray-500">
          Step 1 of 3
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
          Participant Information
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
          Please provide your details before starting the manufacturing
          self-assessment. All fields marked with an asterisk are required.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8EAF0] bg-white p-5 shadow-[0_8px_35px_rgba(20,32,55,0.04)] sm:p-8 lg:p-10">
        <div className="mb-8 flex items-center gap-3 border-b border-[#EDF0F4] pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E25238]/10 text-[#E25238]">
            <UserRound size={21} />
          </div>
          <div>
            <h2 className="font-bold text-[#172033]">
              Your Information
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Tell us a little about yourself and your organisation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Name <span className="text-[#E25238]">*</span>
            </label>
            <input
              type="text"
              value={participant.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Function <span className="text-[#E25238]">*</span>
            </label>
            <select
              value={participant.function}
              onChange={(e) => onChange("function", e.target.value)}
              className={`${inputClass} ${
                participant.function ? "" : "text-gray-400"
              }`}
              required
            >
              <option value="" disabled>
                Select your function
              </option>
              {functionOptions.map((option, index) => (
                <option key={`${option}-${index}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Company <span className="text-[#E25238]">*</span>
            </label>
            <input
              type="text"
              value={participant.company}
              onChange={(e) => onChange("company", e.target.value)}
              placeholder="Enter your company name"
              className={inputClass}
              autoComplete="organization"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Email Address <span className="text-[#E25238]">*</span>
            </label>
            <input
              type="email"
              value={participant.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="name@company.com"
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Mobile Number <span className="text-[#E25238]">*</span>
            </label>

            <div className="mt-2 flex gap-2">
              <select
                value={participant.countryCode}
                onChange={(e) => onChange("countryCode", e.target.value)}
                className="w-[112px] shrink-0 rounded-lg border border-[#DDE1E8] bg-white px-3 py-3.5 text-sm text-[#172033] outline-none focus:border-[#E25238] focus:ring-2 focus:ring-[#E25238]/10 sm:w-[135px]"
                aria-label="Country calling code"
              >
                <option value="+91">IN +91</option>
                <option value="+1">US +1</option>
                <option value="+44">UK +44</option>
                <option value="+971">UAE +971</option>
                <option value="+65">SG +65</option>
                <option value="+61">AU +61</option>
                <option value="+49">DE +49</option>
                <option value="+33">FR +33</option>
                <option value="+81">JP +81</option>
              </select>

              <input
                type="tel"
                inputMode="numeric"
                value={participant.mobile}
                onChange={(e) =>
                  onChange(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 15)
                  )
                }
                placeholder="Enter mobile number"
                className={`${inputClass} mt-0 min-w-0`}
                autoComplete="tel-national"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Website <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={participant.website}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="www.company.com"
              className={inputClass}
              autoComplete="url"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-9 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#EDF0F4] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-500">
            <span className="text-[#E25238]">*</span> Required fields
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#E25238] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#C9442D] focus:outline-none focus:ring-4 focus:ring-[#E25238]/20"
          >
            Continue to Assessment
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessmentStepOne;
