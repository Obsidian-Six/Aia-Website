
// import React, { useEffect, useRef, useState } from "react";
// import { Check, ChevronDown } from "lucide-react";

// export default function MembershipMultiSelect({
//   label,
//   options = [],
//   value = [],
//   onChange,
//   maxSelections = 5,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     document.addEventListener("touchstart", handleOutsideClick);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//       document.removeEventListener("touchstart", handleOutsideClick);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const selectedValues = Array.isArray(value) ? value : [];

//   const toggleOption = (option) => {
//     if (selectedValues.includes(option)) {
//       onChange(
//         selectedValues.filter((item) => item !== option)
//       );
//       return;
//     }

//     if (selectedValues.length < maxSelections) {
//       onChange([...selectedValues, option]);
//     }
//   };

//   return (
//     <div ref={dropdownRef} className="relative w-full">
//       <label className="mb-3 block text-xs font-semibold text-[#263247] sm:text-xs">
//         {label} <span className="text-[#E87565]">*</span>
//       </label>

//       <button
//         type="button"
//         aria-expanded={isOpen}
//         onClick={() => setIsOpen((open) => !open)}
//         className="flex min-h-[50px] w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-xs text-gray-600 transition hover:border-[#E87565] sm:min-h-[50px] sm:px-5 sm:text-xs"
//       >
//         <span className="truncate ">
//           {selectedValues.length
//             ? `${selectedValues.length} categor${
//                 selectedValues.length === 1 ? "y" : "ies"
//               } selected`
//             : "Select applicable categories"}
//         </span>

//         <ChevronDown
//           size={19}
//           className={`shrink-0 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {selectedValues.length > 0 && (
//         <div className="mt-2 flex flex-wrap gap-2">
//           {selectedValues.map((item) => (
//             <span
//               key={item}
//               className="rounded-full bg-[#FFF5F3] px-3 py-1.5 text-xs text-[#263247]"
//             >
//               {item}
//             </span>
//           ))}
//         </div>
//       )}

//       {isOpen && (
//         <div className="absolute left-0 top-full z-[120] mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
//           <div className="sticky top-0 mb-1 flex justify-between bg-white px-2 py-2 text-xs text-gray-500">
//             <span>Select up to {maxSelections}</span>
//             <span>
//               {selectedValues.length}/{maxSelections}
//             </span>
//           </div>

//           {options.map((option) => {
//             const checked = selectedValues.includes(option);

//             const disabled =
//               !checked &&
//               selectedValues.length >= maxSelections;

//             return (
//               <button
//                 key={option}
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => toggleOption(option)}
//                 className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-xs transition ${
//                   checked
//                     ? "bg-[#FFF5F3] font-medium text-[#263247]"
//                     : "text-gray-700 hover:bg-gray-50"
//                 } ${
//                   disabled
//                     ? "cursor-not-allowed opacity-40"
//                     : ""
//                 }`}
//               >
//                 <span>{option}</span>
//                 {checked && <Check size={16} />}
//               </button>
//             );
//           })}
//         </div>
//       )}

//       <p className="mt-2 text-xs text-gray-500">
//         You can select up to {maxSelections} categories.
//       </p>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function MembershipMultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  maxSelections = 5,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const updateDropdownPosition = () => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const estimatedMenuHeight = Math.min(
      options.length * 42 + 55,
      256
    );

    setOpenUpward(
      spaceBelow < estimatedMenuHeight &&
      spaceAbove > spaceBelow
    );
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }

    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleResizeOrScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);

      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [isOpen, options.length]);

  const handleOptionClick = (option) => {
    const isSelected = value.includes(option);

    if (isSelected) {
      onChange(value.filter((item) => item !== option));
      return;
    }

    if (value.length >= maxSelections) return;

    onChange([...value, option]);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="mb-2 block text-xs font-medium text-gray-700">
        {label}
        <span className="ml-1 text-red-500">*</span>
      </label>

      <button
        type="button"
        onClick={toggleDropdown}
        className="flex min-h-[48px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-xs outline-none transition focus:border-black"
      >
        <span className="pr-3 text-gray-700">
          {value.length > 0
            ? `${value.length} selected`
            : "Select options"}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute left-0 z-[9999] max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl ${
            openUpward
              ? "bottom-full mb-2"
              : "top-full mt-2"
          }`}
        >
          <div className="p-2">
            {options.map((option) => {
              const isSelected = value.includes(option);
              const isLimitReached =
                value.length >= maxSelections && !isSelected;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={isLimitReached}
                  onClick={() => handleOptionClick(option)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs transition ${
                    isSelected
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${
                    isLimitReached
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer"
                  }`}
                >
                  <span>{option}</span>

                  {isSelected && (
                    <Check
                      size={16}
                      className="shrink-0 text-green-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            {value.length} of {maxSelections} selected
          </div>
        </div>
      )}
    </div>
  );
}
