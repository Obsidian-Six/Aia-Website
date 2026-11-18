
// import React from "react";
// import { ExternalLink } from "lucide-react";

// export default function ViewSampleButton({
//   href,
//   label = "View Sample",
//   className = "",
// }) {
//   if (!href) return null;

//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`group inline-flex items-center justify-center gap-2 rounded-md border border-[#E52B18] bg-transparent px-5 py-3 text-sm font-semibold text-[#E52B18] transition-all duration-300 hover:bg-[#E52B18] hover:text-white active:scale-95 ${className}`}
//     >
//       {label}
//       <ExternalLink
//         size={16}
//         className="transition-transform duration-300 group-hover:translate-x-0.5"
//       />
//     </a>
//   );
// }



import React, { useState } from "react";
import {
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export default function ViewSampleButton({
  href = "/samples/campus-connect/download",
  label = "View Sample",
  className = "",
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  if (!href) return null;

  const getSampleUrl = () => `${API_BASE_URL}${href}`;

  // Open protected PDF
  const openSample = async (tab) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(getSampleUrl(), {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        if (tab && !tab.closed) tab.close();

        setShowModal(true);
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Unable to open sample PDF.");
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      if (tab && !tab.closed) {
        tab.location.href = pdfUrl;
      } else {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
      }

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (err) {
      if (tab && !tab.closed) tab.close();

      console.error("Sample PDF Error:", err);
      setError(err.message || "Something went wrong.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // View Sample button
  const handleViewSample = () => {
    const tab = window.open("about:blank", "_blank");

    openSample(tab);
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit enquiry
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tab = window.open("about:blank", "_blank");

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/brochure-enquiries`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            resourceType: "sample",
            resourceId: "campus-connect",
            resourceTitle: "AIA Campus Connect Sample",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit enquiry."
        );
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      setShowModal(false);

      // Cookie is now set. Open the originally requested PDF.
      await openSample(tab);
    } catch (err) {
      if (tab && !tab.closed) tab.close();

      console.error("Brochure Enquiry Error:", err);
      setError(err.message || "Unable to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* View Sample Button */}
      <button
        type="button"
        onClick={handleViewSample}
        disabled={loading}
        className={`group inline-flex items-center justify-center gap-2 rounded-md border border-[#E52B18] bg-transparent px-5 py-3 text-sm font-semibold text-[#E52B18] transition-all duration-300 hover:bg-[#E52B18] hover:text-white active:scale-95 disabled:cursor-wait disabled:opacity-60 ${className}`}
      >
        {loading ? "Please wait..." : label}

        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ExternalLink
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        )}
      </button>

      {/* Shared Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6">
          <div className="relative my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setError("");
              }}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
              aria-label="Close enquiry form"
            >
              <X size={20} />
            </button>

            <div className="mb-6 pr-8">
              <h2 className="text-2xl font-bold text-[#172033]">
                Access Sample
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Please submit your details to view the AIA Campus
                Connect sample.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  minLength={7}
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message (Optional)
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E52B18] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c92313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit & View Sample"
                )}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your details will be used to process your sample access
                request.
              </p>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
