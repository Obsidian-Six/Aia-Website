// import React from "react";

// const CardHeading = ({
//   number,
//   title,
//   description,
// }) => {
//   return (
//     <div className="mb-7 border-b border-gray-200 pb-5">
//       <div className="flex items-start gap-4">
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
//           {String(number).padStart(2, "0")}
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             {title}
//           </h2>

//           {description && (
//             <p className="mt-1 text-sm leading-6 text-gray-500">
//               {description}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardHeading;


import React from "react";

export default function CardHeading({
  children,
  description,
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold leading-[1.3] text-[#263247] sm:text-[16px] lg:text-[18px]">
        {children}
      </h2>

      {description && (
        <p className="mt-2 max-w-[850px] text-xs leading-[1.3] text-[#263247] sm:text-xs">
          {description}
        </p>
      )}
    </div>
  );
}
