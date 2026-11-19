
// import React, { useState } from "react";
// import { LoaderCircle, ArrowUpRight } from "lucide-react";

// const initialForm = {
//   fullName: "",
//   email: "",
//   inquiry: "",
//   companyName: "",
//   website: "",
//   phone: "",
//   message: "",
// };

// const inquiryOptions = [
//   "Procurement",
//   "Membership",
//   "Partnership",
//   "Training & Certification",
//   "Events & Programs",
//   "Industry Collaboration",
//   "Other",
// ];

// export default function ContactForm({ onSubmit }) {
//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.fullName.trim()) {
//       newErrors.fullName = "Please enter your full name.";
//     } else if (form.fullName.trim().length < 2) {
//       newErrors.fullName = "Name must contain at least 2 characters.";
//     }

//     if (!form.email.trim()) {
//       newErrors.email = "Email address is required.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
//       newErrors.email = "Please enter a valid email address.";
//     }

//     if (!form.inquiry) {
//       newErrors.inquiry = "Please select an area of inquiry.";
//     }

//     if (!form.phone.trim()) {
//       newErrors.phone = "Phone number is required.";
//     } else if (
//       !/^\+?[0-9\s()-]{10,18}$/.test(form.phone.trim()) ||
//       form.phone.replace(/\D/g, "").length < 10
//     ) {
//       newErrors.phone = "Please enter a valid phone number.";
//     }

//     if (form.website.trim()) {
//       try {
//         const url = new URL(
//           /^https?:\/\//i.test(form.website)
//             ? form.website
//             : `https://${form.website}`
//         );

//         if (!url.hostname.includes(".")) {
//           newErrors.website = "Please enter a valid website URL.";
//         }
//       } catch {
//         newErrors.website = "Please enter a valid website URL.";
//       }
//     }

//     if (!form.message.trim()) {
//       newErrors.message = "Please enter your message.";
//     } else if (form.message.trim().length < 10) {
//       newErrors.message = "Message must contain at least 10 characters.";
//     }

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//       submit: "",
//     }));

//     setSuccessMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     setErrors(validationErrors);
//     setSuccessMessage("");

//     if (Object.keys(validationErrors).length > 0) {
//       const firstError = document.querySelector(
//         `[name="${Object.keys(validationErrors)[0]}"]`
//       );
//       firstError?.focus();
//       return;
//     }

//     if (typeof onSubmit !== "function") {
//       setErrors({
//         submit: "Form submission API is not connected yet.",
//       });
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         ...form,
//         fullName: form.fullName.trim(),
//         email: form.email.trim(),
//         website: form.website.trim()
//           ? /^https?:\/\//i.test(form.website)
//             ? form.website.trim()
//             : `https://${form.website.trim()}`
//           : "",
//         phone: form.phone.trim(),
//         message: form.message.trim(),
//       };

//       await onSubmit(payload);

//       setForm(initialForm);
//       setErrors({});
//       setSuccessMessage(
//         "Thank you! Your enquiry has been submitted successfully."
//       );
//     } catch (error) {
//       setErrors({
//         submit:
//           error?.message || "Something went wrong. Please try again later.",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const inputClass = (field) =>
//     `h-[42px] w-full rounded-md border bg-white px-3 text-[12px] text-[#252D3A] outline-none transition-all placeholder:text-gray-400 focus:border-[#E66F61] focus:ring-2 focus:ring-[#E66F61]/10 ${
//       errors[field] ? "border-red-400" : "border-[#DDE1E7]"
//     }`;

//   const labelClass = "mb-1.5 block text-[11px] font-semibold text-[#263142]";

//   return (
//     <form onSubmit={handleSubmit} noValidate>
//       <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-3">

//         {/* Full Name */}
//         <div>
//           <label className={labelClass} htmlFor="fullName">
//             Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="fullName"
//             name="fullName"
//             type="text"
//             autoComplete="name"
//             placeholder="Type"
//             value={form.fullName}
//             onChange={handleChange}
//             className={inputClass("fullName")}
//             aria-invalid={!!errors.fullName}
//           />
//           {errors.fullName && (
//             <p className="mt-1 text-[11px] text-red-500">{errors.fullName}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className={labelClass} htmlFor="email">
//             Email <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             autoComplete="email"
//             placeholder="you@company.com"
//             value={form.email}
//             onChange={handleChange}
//             className={inputClass("email")}
//             aria-invalid={!!errors.email}
//           />
//           {errors.email && (
//             <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
//           )}
//         </div>

//         {/* Area of Inquiry */}
//         <div>
//           <label className={labelClass} htmlFor="inquiry">
//             Area of Inquiry <span className="text-red-500">*</span>
//           </label>
//           <select
//             id="inquiry"
//             name="inquiry"
//             value={form.inquiry}
//             onChange={handleChange}
//             className={`${inputClass("inquiry")} appearance-none`}
//             aria-invalid={!!errors.inquiry}
//           >
//             <option value="">Select</option>
//             {inquiryOptions.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//           {errors.inquiry && (
//             <p className="mt-1 text-[11px] text-red-500">{errors.inquiry}</p>
//           )}
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className={labelClass} htmlFor="companyName">
//             Company Name
//           </label>
//           <input
//             id="companyName"
//             name="companyName"
//             type="text"
//             autoComplete="organization"
//             placeholder="Type"
//             value={form.companyName}
//             onChange={handleChange}
//             className={inputClass("companyName")}
//           />
//         </div>

//         {/* Website */}
//         <div>
//           <label className={labelClass} htmlFor="website">
//             Website
//           </label>
//           <input
//             id="website"
//             name="website"
//             type="text"
//             inputMode="url"
//             placeholder="www.company.com"
//             value={form.website}
//             onChange={handleChange}
//             className={inputClass("website")}
//             aria-invalid={!!errors.website}
//           />
//           {errors.website && (
//             <p className="mt-1 text-[11px] text-red-500">{errors.website}</p>
//           )}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className={labelClass} htmlFor="phone">
//             Phone number <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="phone"
//             name="phone"
//             type="tel"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="+91 98765 43210"
//             value={form.phone}
//             onChange={handleChange}
//             className={inputClass("phone")}
//             aria-invalid={!!errors.phone}
//           />
//           {errors.phone && (
//             <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>
//           )}
//         </div>
//       </div>

//       {/* Message */}
//       <div className="mt-5">
//         <label className={labelClass} htmlFor="message">
//           Message <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           id="message"
//           name="message"
//           rows={5}
//           placeholder="Leave us a message..."
//           value={form.message}
//           onChange={handleChange}
//           className={`w-full resize-y rounded-md border bg-white px-3 py-3 text-[12px] text-[#252D3A] outline-none transition-all placeholder:text-gray-400 focus:border-[#E66F61] focus:ring-2 focus:ring-[#E66F61]/10 ${
//             errors.message ? "border-red-400" : "border-[#DDE1E7]"
//           }`}
//           aria-invalid={!!errors.message}
//         />
//         {errors.message && (
//           <p className="mt-1 text-[11px] text-red-500">{errors.message}</p>
//         )}
//       </div>

//       {/* Feedback */}
//       {(successMessage || errors.submit) && (
//         <div
//           role="status"
//           className={`mt-4 rounded-md px-4 py-3 text-sm ${
//             errors.submit
//               ? "bg-red-50 text-red-600"
//               : "bg-green-50 text-green-700"
//           }`}
//         >
//           {errors.submit || successMessage}
//         </div>
//       )}

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={submitting}
//         className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#E87565] px-6 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#D95F50] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[200px]"
//       >
//         {submitting ? (
//           <>
//             <LoaderCircle size={15} className="animate-spin" />
//             Submitting...
//           </>
//         ) : (
//           <>
//             Submit
//             <ArrowUpRight size={15} />
//           </>
//         )}
//       </button>
//     </form>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  ArrowUpRight,
  X,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const INDUSTRY_SEGMENT_OPTIONS = [
  "Apparel",
  "Automotive",
  "Cement",
  "Chemical",
  "Defence Equipment Production",
  "Electrical",
  "Electronics",
  "Fiber & Textiles",
  "Food & Beverage",
  "Household & Personal Care",
  "Infrastructure Equipment",
  "Life Sciences",
  "Material Handling Equipment",
  "Metals",
  "Mining",
  "Oil & Gas",
  "Packaging Machinery",
  "Plastics",
  "Printing Machinery",
  "Process Equipment",
  "Production Machinery",
  "Pulp & Paper",
  "Railway Equipment",
  "Rubber",
  "Solar Energy Equipment",
  "Textile",
  "Wind Energy Equipment",
];

const TECHNOLOGY_STREAM_OPTIONS = [
  "3D Printing",
  "3D Simulation Software",
  "Advanced Logic Control",
  "Advanced Process Control",
  "Cloud Computing Systems",
  "Condition Monitoring",
  "Digital Twin Software",
  "Edge Computing Systems",
  "Electrical Sensing and Actuation",
  "Electro-Hydraulic Actuation",
  "Electro-Pneumatic Actuation",
  "Industrial IoT Software",
  "Industrial Networking Systems",
  "Intelligent Conveying Systems",
  "Intelligent Packaging Systems",
  "Intrusion Detection",
  "Level, Temp, Pressure, Flow Sensing",
  "Machine Learning Systems",
  "Manufacturing Execution Systems",
  "Material and Presence Sensing",
  "Position and Safety Sensing",
  "Precision Motion Control",
  "Smart HMIs",
  "Tracking and Tracing",
  "Vision Sensing and Inspection",
  "OTHER (Custom)",
];

const SERVICE_STREAM_OPTIONS = [
  "Process Reengineering Services",
  "Automation Consulting Services",
  "Digital Deployment Services",
  "Automation Integration Services",
  "Automation Software Development",
  "Business Process App Development",
  "Commissioning Services",
  "Data Integration Services",
  "Education & Skilling Services",
  "Energy Audit Services",
  "Field Installation Services",
  "Maturity Assessment Services",
  "Project Management Services",
  "Quality Audit Services",
  "Safety Assessment Services",
  "Supply Chain Integration",
  "OTHER (Custom)",
];

const INQUIRY_OPTIONS = [
  "Procurement",
  "Membership",
  "Partnership",
  "Training & Certification",
  "Events & Programs",
  "Industry Collaboration",
  "Other",
];

const OTHER_OPTION = "OTHER (Custom)";
const MAX_TECHNOLOGY_STREAMS = 5;
const MAX_SERVICE_STREAMS = 3;

const initialForm = {
  fullName: "",
  email: "",
  inquiry: "",
  inquiryOther: "",
  companyName: "",
  website: "",
  phone: "",
  message: "",
  industrySegment: "",
  technologyStream: [],
  technologyStreamOther: "",
  serviceStream: [],
  serviceStreamOther: "",
};

const SUCCESS_TITLE = "Thank You for Connecting with AIA!";
const SUCCESS_DESCRIPTION =
  "Your details have been successfully submitted. Our team will review your submission and connect with you regarding the next steps.";



  
export default function ContactForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formRef = useRef(null);

useEffect(() => {
  const handleOutsideClick = (event) => {
    const openDropdowns = formRef.current?.querySelectorAll(
      'details[data-multi-select][open]'
    );

    openDropdowns?.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.removeAttribute("open");
      }
    });
  };

  document.addEventListener("mousedown", handleOutsideClick);
  document.addEventListener("touchstart", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
    document.removeEventListener("touchstart", handleOutsideClick);
  };
}, []);

  const isProcurement = form.inquiry === "Procurement";

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Name must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.inquiry) {
      newErrors.inquiry = "Please select an area of inquiry.";
    }

    if (form.inquiry === "Other" && !form.inquiryOther.trim()) {
      newErrors.inquiryOther = "Please specify your inquiry.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (
      !/^\+?[0-9\s()-]{10,18}$/.test(form.phone.trim()) ||
      form.phone.replace(/\D/g, "").length < 10
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (form.website.trim()) {
      try {
        const url = new URL(
          /^https?:\/\//i.test(form.website)
            ? form.website
            : `https://${form.website}`,
        );

        if (!url.hostname.includes(".")) {
          newErrors.website = "Please enter a valid website URL.";
        }
      } catch {
        newErrors.website = "Please enter a valid website URL.";
      }
    }

    if (!form.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must contain at least 10 characters.";
    }

    if (isProcurement) {
      if (!form.industrySegment) {
        newErrors.industrySegment = "Please select an industry segment.";
      }

      if (form.technologyStream.length === 0) {
        newErrors.technologyStream =
          "Please select at least one technology stream.";
      }

      if (
        form.technologyStream.includes(OTHER_OPTION) &&
        !form.technologyStreamOther.trim()
      ) {
        newErrors.technologyStreamOther =
          "Please specify your technology stream.";
      }

      if (form.serviceStream.length === 0) {
        newErrors.serviceStream = "Please select at least one service stream.";
      }

      if (
        form.serviceStream.includes(OTHER_OPTION) &&
        !form.serviceStreamOther.trim()
      ) {
        newErrors.serviceStreamOther =
          "Please specify your service stream.";
      }
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "inquiry") {
        if (value !== "Other") updated.inquiryOther = "";

        if (value !== "Procurement") {
          updated.industrySegment = "";
          updated.technologyStream = [];
          updated.technologyStreamOther = "";
          updated.serviceStream = [];
          updated.serviceStreamOther = "";
        }
      }

      if (
        name === "technologyStreamOther" &&
        !updated.technologyStream.includes(OTHER_OPTION)
      ) {
        updated.technologyStreamOther = "";
      }

      if (
        name === "serviceStreamOther" &&
        !updated.serviceStream.includes(OTHER_OPTION)
      ) {
        updated.serviceStreamOther = "";
      }

      return updated;
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      submit: "",
    }));
  };

  const handleMultiSelect = (field, option, limit) => {
    setForm((previous) => {
      const selected = previous[field];
      const alreadySelected = selected.includes(option);

      if (!alreadySelected && selected.length >= limit) {
        return previous;
      }

      const nextSelected = alreadySelected
        ? selected.filter((item) => item !== option)
        : [...selected, option];

      const otherField =
        field === "technologyStream"
          ? "technologyStreamOther"
          : "serviceStreamOther";

      return {
        ...previous,
        [field]: nextSelected,
        ...(!nextSelected.includes(OTHER_OPTION) ? { [otherField]: "" } : {}),
      };
    });

    setErrors((previous) => ({
      ...previous,
      [field]: "",
      [field === "technologyStream"
        ? "technologyStreamOther"
        : "serviceStreamOther"]: "",
      submit: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    if (typeof onSubmit !== "function") {
      setErrors({
        submit: "Form submission API is not connected yet.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        inquiryOther:
          form.inquiry === "Other" ? form.inquiryOther.trim() : "",
        companyName: form.companyName.trim(),
        website: form.website.trim()
          ? /^https?:\/\//i.test(form.website.trim())
            ? form.website.trim()
            : `https://${form.website.trim()}`
          : "",
        phone: form.phone.trim(),
        message: form.message.trim(),
        industrySegment: isProcurement ? form.industrySegment : "",
        technologyStream: isProcurement ? form.technologyStream : [],
        technologyStreamOther: isProcurement
          ? form.technologyStreamOther.trim()
          : "",
        serviceStream: isProcurement ? form.serviceStream : [],
        serviceStreamOther: isProcurement
          ? form.serviceStreamOther.trim()
          : "",
      };

      await onSubmit(payload);

      setForm({ ...initialForm, technologyStream: [], serviceStream: [] });
      setErrors({});
      setShowSuccessModal(true);
    } catch (error) {
      setErrors({
        submit:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `h-[42px] w-full rounded-md border bg-white px-3 text-[12px] text-[#252D3A] outline-none transition-all placeholder:text-gray-400 focus:border-[#E66F61] focus:ring-2 focus:ring-[#E66F61]/10 ${
      errors[field] ? "border-red-400" : "border-[#DDE1E7]"
    }`;

  const labelClass = "mb-1.5 block text-[11px] font-semibold text-[#263142]";

  const renderError = (field) =>
    errors[field] ? (
      <p className="mt-1 text-[11px] text-red-500" role="alert">
        {errors[field]}
      </p>
    ) : null;

  const renderOtherInput = (field, label, placeholder) => (
    <div className="mt-3">
      <label className={labelClass} htmlFor={field}>
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={field}
        name={field}
        type="text"
        value={form[field]}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass(field)}
        aria-invalid={!!errors[field]}
      />
      {renderError(field)}
    </div>
  );

  const renderMultiSelect = (field, label, options, limit) => {
    const selectedOptions = form[field];

    return (
      <div>
        <label className={labelClass}>
          {label} <span className="text-red-500">*</span>
        </label>

        <details data-multi-select className="group relative">
          <summary
            className={`${inputClass(field)} flex cursor-pointer list-none items-center justify-between ${
              errors[field] ? "border-red-400" : ""
            }`}
          >
            <span className="truncate">
              {selectedOptions.length
                ? `${selectedOptions.length} selected`
                : "Select options"}
            </span>
            <ChevronDown
              size={15}
              className="shrink-0 text-gray-500 transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="absolute left-0 top-full z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-[#DDE1E7] bg-white p-3 shadow-lg">
            <p className="mb-2 text-[10px] text-gray-500">
              Select up to {limit} options.
            </p>

            {options.map((option) => {
              const checked = selectedOptions.includes(option);
              const limitReached = selectedOptions.length >= limit;

              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 py-2 text-xs text-[#252D3A]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && limitReached}
                    onChange={() => handleMultiSelect(field, option, limit)}
                    className="h-4 w-4 accent-[#E87565]"
                  />
                  <span
                    className={!checked && limitReached ? "text-gray-400" : ""}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </details>

        {renderError(field)}

        {field === "technologyStream" &&
          selectedOptions.includes(OTHER_OPTION) &&
          renderOtherInput(
            "technologyStreamOther",
            "Specify Other Technology Stream",
            "Enter technology stream",
          )}

        {field === "serviceStream" &&
          selectedOptions.includes(OTHER_OPTION) &&
          renderOtherInput(
            "serviceStreamOther",
            "Specify Other Service Stream",
            "Enter service stream",
          )}
      </div>
    );
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Type"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass("fullName")}
              aria-invalid={!!errors.fullName}
            />
            {renderError("fullName")}
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass("email")}
              aria-invalid={!!errors.email}
            />
            {renderError("email")}
          </div>

          <div>
            <label className={labelClass} htmlFor="inquiry">
              Area of Inquiry <span className="text-red-500">*</span>
            </label>
            <select
              id="inquiry"
              name="inquiry"
              value={form.inquiry}
              onChange={handleChange}
              className={`${inputClass("inquiry")} appearance-none`}
              aria-invalid={!!errors.inquiry}
            >
              <option value="">Select</option>
              {INQUIRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {renderError("inquiry")}

            {form.inquiry === "Other" &&
              renderOtherInput(
                "inquiryOther",
                "Specify Other Inquiry",
                "Please specify your inquiry",
              )}
          </div>

          <div>
            <label className={labelClass} htmlFor="companyName">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              autoComplete="organization"
              placeholder="Type"
              value={form.companyName}
              onChange={handleChange}
              className={inputClass("companyName")}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="text"
              inputMode="url"
              placeholder="www.company.com"
              value={form.website}
              onChange={handleChange}
              className={inputClass("website")}
              aria-invalid={!!errors.website}
            />
            {renderError("website")}
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              className={inputClass("phone")}
              aria-invalid={!!errors.phone}
            />
            {renderError("phone")}
          </div>
        </div>

        {isProcurement && (
          <div className="mt-6 rounded-lg border border-[#E6E9EE] bg-[#FAFBFC] p-4 sm:p-5">
            <h3 className="mb-4 text-sm font-semibold text-[#263142]">
              Procurement Details
            </h3>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="industrySegment">
                  Industry Segment <span className="text-red-500">*</span>
                </label>
                <select
                  id="industrySegment"
                  name="industrySegment"
                  value={form.industrySegment}
                  onChange={handleChange}
                  className={`${inputClass("industrySegment")} appearance-none`}
                  aria-invalid={!!errors.industrySegment}
                >
                  <option value="">Select Industry Segment</option>
                  {INDUSTRY_SEGMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {renderError("industrySegment")}
              </div>

              {renderMultiSelect(
                "technologyStream",
                "Technology Stream (Maximum 5)",
                TECHNOLOGY_STREAM_OPTIONS,
                MAX_TECHNOLOGY_STREAMS,
              )}

              {renderMultiSelect(
                "serviceStream",
                "Service Stream (Maximum 3)",
                SERVICE_STREAM_OPTIONS,
                MAX_SERVICE_STREAMS,
              )}
            </div>
          </div>
        )}

        <div className="mt-5">
          <label className={labelClass} htmlFor="message">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Leave us a message..."
            value={form.message}
            onChange={handleChange}
            className={`w-full resize-y rounded-md border bg-white px-3 py-3 text-[12px] text-[#252D3A] outline-none transition-all placeholder:text-gray-400 focus:border-[#E66F61] focus:ring-2 focus:ring-[#E66F61]/10 ${
              errors.message ? "border-red-400" : "border-[#DDE1E7]"
            }`}
            aria-invalid={!!errors.message}
          />
          {renderError("message")}
        </div>

        {errors.submit && (
          <div
            role="alert"
            className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#E87565] px-6 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#D95F50] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[200px]"
        >
          {submitting ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <ArrowUpRight size={15} />
            </>
          )}
        </button>
      </form>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white px-6 py-9 text-center shadow-2xl sm:px-9">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close success message"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <X size={18} />
            </button>

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={30} />
            </div>

            <h2
              id="contact-success-title"
              className="text-lg font-bold text-[#263142] sm:text-xl"
            >
              {SUCCESS_TITLE}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {SUCCESS_DESCRIPTION}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-7 min-h-[42px] rounded-md bg-[#E87565] px-8 py-3 text-xs font-semibold text-white transition hover:bg-[#D95F50]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
