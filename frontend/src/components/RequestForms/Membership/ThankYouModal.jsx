
import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function ThankYouModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="membership-success-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center shadow-2xl sm:px-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close success message"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2
            size={38}
            className="text-green-600"
          />
        </div>

        <h2
          id="membership-success-title"
          className="mt-5 text-xl font-bold text-[#263247] sm:text-2xl"
        >
          Thank You for Applying to AIA!
        </h2>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Your membership application has been successfully submitted.
          Our team will review your details and get in touch with you
          regarding the next steps.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#D72C1D] to-[#F27D70] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg sm:w-auto"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
