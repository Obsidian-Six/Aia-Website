
import React, { useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";

const categoryOptions = [
  "Manufacturing Sector",
  "Technology Stream",
  "Service Stream",
];

const categoryData = {
  "Manufacturing Sector": [
    "Apparel", "Automotive", "Cement", "Chemical",
    "Defence Equipment Production", "Electrical", "Electronics",
    "Fiber & Textiles", "Food & Beverage", "Household & Personal Care",
    "Infrastructure Equipment", "Life Sciences",
    "Material Handling Equipment", "Metals", "Mining", "Oil & Gas",
    "Packaging Machinery", "Plastics", "Printing Machinery",
    "Process Equipment", "Production Machinery", "Pulp & Paper",
    "Railway Equipment", "Rubber", "Solar Energy Equipment",
    "Textile", "Wind Energy Equipment", "OTHER (Custom)",
  ],
  "Technology Stream": [
    "3D Printing", "3D Simulation Software", "Advanced Logic Control",
    "Advanced Process Control", "Cloud Computing Systems",
    "Condition Monitoring", "Digital Twin Software",
    "Edge Computing Systems", "Electrical Sensing and Actuation",
    "Electro-Hydraulic Actuation", "Electro-Pneumatic Actuation",
    "Industrial IoT Software", "Industrial Networking Systems",
    "Intelligent Conveying Systems", "Intelligent Packaging Systems",
    "Intrusion Detection", "Level, Temp, Pressure, Flow Sensing",
    "Machine Learning Systems", "Manufacturing Execution Systems",
    "Material and Presence Sensing", "Position and Safety Sensing",
    "Precision Motion Control", "Smart HMIs", "Tracking and Tracing",
    "Vision Sensing and Inspection", "OTHER (Custom)",
  ],
  "Service Stream": [
    "Process Reengineering Services", "Automation Consulting Services",
    "Digital Deployment Services", "Automation Integration Services",
    "Automation Software Development", "Business Process App Development",
    "Commissioning Services", "Data Integration Services",
    "Education & Skilling Services", "Energy Audit Services",
    "Field Installation Services", "Maturity Assessment Services",
    "Project Management Services", "Quality Audit Services",
    "Safety Assessment Services", "Supply Chain Integration",
    "OTHER (Custom)",
  ],
};

const initialForm = {
  category: "Manufacturing Sector",
  selectedOption: "Apparel",
  customOption: "",
  fullName: "",
  email: "",
  companyName: "",
  website: "",
  phoneNumber: "",
  message: "",
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const normalizeWebsite = (value) => {
  const website = value.trim();
  if (!website) return "";
  return /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;
};

const isValidWebsite = (value) => {
  if (!value.trim()) return false;

  try {
    const url = new URL(normalizeWebsite(value));
    const hostnameRegex =
      /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

    return (
      ["http:", "https:"].includes(url.protocol) &&
      hostnameRegex.test(url.hostname)
    );
  } catch {
    return false;
  }
};

function SearchableDropdown({
  label,
  value,
  options,
  placeholder,
  error,
  disabled,
  onChange,
  variant,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase().trim())
  );

  const popup = variant === "popup";

  return (
    <div className="relative min-w-0">
      <label
        className={`mb-1 block text-[13px] font-medium ${
          popup ? "text-[#A9A9A9]" : "text-[#263247]"
        }`}
      >
        {label} <span className="text-red-500">*</span>
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setSearch("");
        }}
        aria-expanded={isOpen}
        className={`flex h-[42px] w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left text-[12px] outline-none transition focus:border-[#E37263] focus:ring-2 focus:ring-[#E37263]/20 disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <span className={`min-w-0 truncate ${value ? "text-[#202938]" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-[10000] cursor-default"
            onClick={() => {
              setIsOpen(false);
              setSearch("");
            }}
          />

          <div className="absolute left-0 top-[calc(100%+5px)] z-[10001] w-full min-w-[190px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
            <div className="sticky top-0 border-b border-gray-100 bg-white p-2">
              <div className="flex h-8 items-center gap-2 rounded border border-gray-200 px-2 focus-within:border-[#E37263]">
                <Search size={13} className="shrink-0 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsOpen(false);
                      setSearch("");
                    }
                    if (event.key === "Enter" && filteredOptions.length) {
                      event.preventDefault();
                      onChange(filteredOptions[0]);
                      setIsOpen(false);
                      setSearch("");
                    }
                  }}
                  placeholder="Type to search..."
                  className="h-full w-full min-w-0 bg-transparent text-[11px] text-[#202938] outline-none"
                />
              </div>
            </div>

            <div className="max-h-[190px] overflow-y-auto p-1">
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`flex min-h-[32px] w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-[11px] transition hover:bg-[#FCEAE7] hover:text-[#D94F40] ${
                      value === option
                        ? "bg-[#FCEAE7] font-semibold text-[#D94F40]"
                        : "text-[#303846]"
                    }`}
                  >
                    <span>{option}</span>
                    {value === option && (
                      <Check size={13} className="shrink-0 text-[#D94F40]" />
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-5 text-center text-[11px] text-gray-400">
                  No options found
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 px-3 py-1.5 text-[9px] text-gray-400">
              {filteredOptions.length} options available
            </div>
          </div>
        </>
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <p className="mt-1 text-[11px] text-red-500" role="alert">
      {children}
    </p>
  );
}

export default function GeneralInquiryFields({
  sourcePage = "learn-more",
  variant = "page",
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const popup = variant === "popup";

  const labelClass = `mb-1 block text-[13px] font-medium ${
    popup ? "text-[#A9A9A9]" : "text-[#263247]"
  }`;

  const requiredMark = <span className="text-red-500"> *</span>;

  const inputClass = (field) =>
    `h-[42px] w-full min-w-0 rounded-md border bg-white px-3 text-[12px] text-[#202938] outline-none transition placeholder:text-[#687386] focus:border-[#E37263] focus:ring-2 focus:ring-[#E37263]/20 ${
      errors[field] ? "border-red-500" : "border-gray-200"
    }`;

  const textareaClass = `w-full resize-y rounded-md border bg-white px-3 py-3 text-[12px] text-[#202938] outline-none transition placeholder:text-[#687386] focus:border-[#E37263] focus:ring-2 focus:ring-[#E37263]/20 ${
    errors.message ? "border-red-500" : "border-gray-200"
  }`;

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category"
        ? { selectedOption: "", customOption: "" }
        : {}),
      ...(name === "selectedOption" ? { customOption: "" } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "category"
        ? { selectedOption: "", customOption: "" }
        : {}),
      ...(name === "selectedOption" ? { customOption: "" } : {}),
    }));

    setSubmitError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phoneNumber") {
      if (!/^[0-9+\s()-]*$/.test(value)) return;
      if ((value.match(/\+/g) || []).length > 1) return;
      if (value.includes("+") && !value.startsWith("+")) return;
    }

    updateField(name, value);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.category) {
      nextErrors.category = "Please select a category.";
    }

    if (
      !form.selectedOption ||
      !(categoryData[form.category] || []).includes(form.selectedOption)
    ) {
      nextErrors.selectedOption = "Please select a valid option.";
    }

    if (form.selectedOption === "OTHER (Custom)") {
      if (!form.customOption.trim()) {
        nextErrors.customOption = "Please enter your custom option.";
      } else if (form.customOption.trim().length < 2) {
        nextErrors.customOption =
          "Custom option must contain at least 2 characters.";
      } else if (form.customOption.trim().length > 150) {
        nextErrors.customOption =
          "Custom option cannot exceed 150 characters.";
      }
    }

    const name = form.fullName.trim();

    if (!name) {
      nextErrors.fullName = "Full name is required.";
    } else if (name.length < 2 || name.length > 100) {
      nextErrors.fullName = "Name must contain 2 to 100 characters.";
    } else if (!/^[a-zA-ZÀ-ÿ\s.'-]+$/.test(name)) {
      nextErrors.fullName = "Please enter a valid name.";
    }

    const email = form.email.trim();
    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    } else if (form.companyName.trim().length > 150) {
      nextErrors.companyName = "Company name cannot exceed 150 characters.";
    }

    if (!form.website.trim()) {
      nextErrors.website = "Website is required.";
    } else if (!isValidWebsite(form.website)) {
      nextErrors.website = "Please enter a valid website URL.";
    }

    const phone = form.phoneNumber.trim().replace(/[\s()-]/g, "");
    if (!phone) {
      nextErrors.phoneNumber = "Mobile number is required.";
    } else if (!/^\+?[1-9]\d{6,14}$/.test(phone)) {
      nextErrors.phoneNumber = "Enter a valid mobile number (7–15 digits).";
    }

    if (form.message.length > 2000) {
      nextErrors.message = "Message cannot exceed 2000 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setStatus("loading");

    const payload = {
      category: form.category,
      selectedOption: form.selectedOption,
      customOption:
        form.selectedOption === "OTHER (Custom)"
          ? form.customOption.trim()
          : "",
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      companyName: form.companyName.trim(),
      website: normalizeWebsite(form.website),
      phoneNumber: form.phoneNumber.trim().replace(/[\s()-]/g, ""),
      message: form.message.trim(),
      sourcePage,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit inquiry.");
      }

      setStatus("success");
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error("General inquiry submission error:", error);
      setSubmitError(
        error.message || "Unable to submit your inquiry. Please try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-md px-5 py-10 text-center ${
          popup ? "min-h-[260px]" : "bg-green-50"
        }`}
      >
        <CheckCircle2
          size={popup ? 48 : 36}
          className={popup ? "text-[#70D6A0]" : "text-green-600"}
        />
        <h3
          className={`mt-3 font-bold ${
            popup ? "text-xl text-white" : "text-[#263247]"
          }`}
        >
          Inquiry Submitted!
        </h3>
        <p
          className={`mt-2 max-w-sm text-xs ${
            popup ? "text-white/65" : "text-black"
          }`}
        >
          Thank you for contacting AIA. Our team will get back to you soon.
        </p>

        {popup ? (
          <button
            type="button"
            onClick={onCancel}
            className="mt-6 rounded-md bg-[#E37263] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d95f51]"
          >
            Close
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-5 text-xs font-semibold text-[#E87565] underline"
          >
            Submit another inquiry
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        <SearchableDropdown
          label="Select Category"
          value={form.category}
          options={categoryOptions}
          placeholder="Select Category"
          error={errors.category}
          variant={variant}
          onChange={(value) => updateField("category", value)}
        />

        <SearchableDropdown
          label="Select Option"
          value={form.selectedOption}
          options={categoryData[form.category] || []}
          placeholder="Select Option"
          error={errors.selectedOption}
          disabled={!form.category}
          variant={variant}
          onChange={(value) => updateField("selectedOption", value)}
        />

        {form.selectedOption === "OTHER (Custom)" && (
          <div className="sm:col-span-2">
            <label className={labelClass}>
              Enter Custom Option{requiredMark}
            </label>
            <input
              name="customOption"
              value={form.customOption}
              onChange={handleChange}
              placeholder="Please specify your industry, technology or service"
              maxLength={150}
              autoComplete="off"
              className={inputClass("customOption")}
            />
            {errors.customOption && (
              <ErrorText>{errors.customOption}</ErrorText>
            )}
          </div>
        )}
      </div>

      <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name{requiredMark}</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
            maxLength={100}
            className={inputClass("fullName")}
          />
          {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
        </div>

        <div>
          <label className={labelClass}>Email Address{requiredMark}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            maxLength={150}
            className={inputClass("email")}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </div>
      </div>

      <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Company Name{requiredMark}</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            autoComplete="organization"
            maxLength={150}
            className={inputClass("companyName")}
          />
          {errors.companyName && <ErrorText>{errors.companyName}</ErrorText>}
        </div>

        <div>
          <label className={labelClass}>Website{requiredMark}</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="www.example.com"
            autoComplete="url"
            maxLength={200}
            className={inputClass("website")}
          />
          {errors.website && <ErrorText>{errors.website}</ErrorText>}
        </div>

        <div>
          <label className={labelClass}>Mobile Number{requiredMark}</label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            inputMode="tel"
            maxLength={20}
            className={inputClass("phoneNumber")}
          />
          {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Your Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows={3}
          maxLength={2000}
          className={textareaClass}
        />
        <div className="mt-1 flex justify-end">
          <span className={popup ? "text-[11px] text-white/40" : "text-[11px] text-gray-400"}>
            {form.message.length}/2000
          </span>
        </div>
        {errors.message && <ErrorText>{errors.message}</ErrorText>}
      </div>

      {submitError && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-400/30 bg-red-500/10 p-2.5 text-xs text-red-500">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {submitError}
        </div>
      )}

      {status === "error" && !submitError && (
        <p className="mt-3 text-xs text-red-500">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full inline-flex min-w-[105px] items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
            popup
              ? "border border-white/30 bg-[#E37263] hover:bg-[#d95f51]"
              : "bg-gradient-to-r from-[#D92D20] to-[#F27D70] hover:brightness-95"
          }`}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting
            </>
          ) : (
            "Submit"
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={status === "loading"}
            className={`w-full rounded-md px-2 py-2 text-xs font-medium transition disabled:opacity-40 ${
              popup
                ? "text-white/75 hover:text-white"
                : "text-[#263247] hover:text-[#E87565]"
            }`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
