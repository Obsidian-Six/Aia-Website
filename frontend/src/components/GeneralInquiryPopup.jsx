
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import GeneralInquiryFields from "./general-inquiry/GeneralInquiryFields";

const POPUP_SESSION_KEY = "aia_general_inquiry_popup_shown";

export default function GeneralInquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(POPUP_SESSION_KEY) === "true") {
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(POPUP_SESSION_KEY, "true");
      setIsOpen(true);
    }, 20000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closePopup = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/75 px-3 py-5 backdrop-blur-[5px] sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePopup();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="relative my-auto w-full max-w-[535px] overflow-visible rounded-lg border border-white/15 bg-gradient-to-br from-[#252525] to-[#191919] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.5)] sm:p-5 md:p-6"
      >
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close inquiry form"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>

        <div className="mb-4 pr-7">
          <h2
            id="inquiry-title"
            className="text-lg font-bold tracking-tight text-white sm:text-xl"
          >
            General Inquiry
          </h2>
        </div>

        <GeneralInquiryFields
          sourcePage="popup"
          variant="popup"
          onCancel={closePopup}
        />
      </div>
    </div>
  );
}
