// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function GovernmentInitiative() {
//   return (
//     <section id="about" className="py-20 bg-white text-center font-sans relative overflow-hidden">
      
//       {/* Subtle Micro-Grid Background */}
//       <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px]"></div>

//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
//         {/* Main Section Heading */}
//         <h2 className="text-4xl sm:text-5xl font-black text-[#1F2937] tracking-tight mb-16 font-semibold">
//           National Priority 
//         </h2>

//         {/* 2-Column Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
//           {/* Left Column: Samarth Udyog Portal Preview Screenshot */}
//           <div className="lg:col-span-7">
//             <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200/80 bg-white group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
//               <img 
//                 src="/national-party.png" 
//                 alt="SAMARTH Udyog Bharat 4.0 - A Industry 4.0 Initiative of Ministry of HI & PE, Government of India" 
//                 className="w-full h-auto object-contain block"
//               />
//             </div>
//           </div>

//           {/* Right Column: Information & Call to Action */}
//           <div className="lg:col-span-5 text-left space-y-6">
//             <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug tracking-tight">
//               Driving India’s Smart <br />
// Manufacturing Mission
//             </h3>

//             <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-md font-normal">
//               Proud contributor to the Samarth Udyog Bharat
//  4.0 Initiative, enabling industries to adopt
// advanced manufacturing technologies and
// accelerate digital transformation. 
//             </p>

//             <div className="pt-2">
//               <Link 
//                 to="/learn-more"
//                 className="pointer-events-none inline-flex items-center justify-center px-7 py-2.5 rounded-xl border border-[#E37263] bg-white text-[#E37263] hover:bg-[#E37263] hover:text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
//               >
//                 Learn More
//               </Link>
//             </div>
//           </div>

//         </div>

//       </div>
//     </section>
//   )
// }



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function GovernmentInitiative() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isPopupOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isPopupOpen]);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 text-center font-sans"
    >
      {/* Subtle Micro-Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Section Heading */}
        <h2 className="mb-16 text-4xl font-black tracking-tight text-[#1F2937] sm:text-5xl">
          National Priority
        </h2>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Image */}
          <div className="lg:col-span-7">
            <div className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <img
                src="/national-party.png"
                alt="SAMARTH Udyog Bharat 4.0 - An Industry 4.0 Initiative of Ministry of HI & PE, Government of India"
                className="block h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="space-y-6 text-left lg:col-span-5">
            <h3 className="text-2xl font-extrabold leading-snug tracking-tight text-[#1F2937] sm:text-3xl">
              Driving India’s Smart
              <br />
              Manufacturing Mission
            </h3>

            <p className="max-w-md text-sm font-normal leading-relaxed text-black/70 sm:text-base">
              Proud contributor to the Samarth Udyog Bharat 4.0 Initiative,
              enabling industries to adopt advanced manufacturing technologies
              and accelerate digital transformation.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-[#E37263] bg-white px-7 py-2.5 text-sm font-semibold text-[#E37263] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#E37263] hover:text-white hover:shadow-md active:scale-95"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="national-priority-title"
            className="relative w-full max-w-xl rounded-2xl bg-white p-6 text-left shadow-2xl sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Close popup"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-[#E37263] hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Popup Content */}
            <div className="pr-8">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.15em] text-[#E37263]">
                National Priority
              </span>

              <h3
                id="national-priority-title"
                className="mb-5 text-2xl font-extrabold leading-snug tracking-tight text-[#1F2937] sm:text-3xl"
              >
                Driving India’s Smart Manufacturing Mission
              </h3>

              <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                Proud contributor to the Samarth Udyog Bharat 4.0 Initiative,
                enabling industries to adopt advanced manufacturing
                technologies and accelerate digital transformation.
              </p>
            </div>

            {/* Cancel Button */}
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-[#E37263] hover:bg-[#E37263] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
