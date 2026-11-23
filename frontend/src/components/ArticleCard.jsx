
// import React from "react";
// import { Link } from "react-router-dom";

// export default function ArticleCard({
//   image,
//   imageAlt = "",
//   title,
//   category,
//   categoryLink,
//   slug,
//   link,
//   detailBasePath = "/industry-insight/articles",
//   className = "",
// }) {
//   const content = (
//     <article
//       className={`group flex h-full min-w-0 flex-col bg-white font-sans ${className}`}
//     >
//       {/* Image */}
//       <div className="aspect-[1.15/1] w-full overflow-hidden border border-[#DCDCDC] bg-gray-100 p-1">
//         <div className="h-full w-full overflow-hidden">
//           <img
//             src={image}
//             alt={imageAlt || title}
//             loading="lazy"
//             decoding="async"
//             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         </div>
//       </div>

//       {/* Title */}
//       <h3 className="mt-2.5 text-[11px] font-medium leading-[1.5] text-[#172337] transition-colors duration-300 group-hover:text-[#E87565] sm:text-sm">
//         {title}
//       </h3>

//       {/* Category */}
//       {category && (
//         <div className="mt-3">
//           {categoryLink ? (
//             <a
//               href={categoryLink}
//               onClick={(e) => e.stopPropagation()}
//               className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2 transition-colors hover:text-[#E87565]"
//             >
//               {category}
//             </a>
//           ) : (
//             <span className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2">
//               {category}
//             </span>
//           )}
//         </div>
//       )}
//     </article>
//   );

//  const destination =
//     link && link !== "#"
//       ? link
//       : slug
//         ? `${detailBasePath}/${slug}`
//         : "";

//   return destination ? (
//     <Link
//       to={destination}
//       className="block h-full"
//       aria-label={`Read ${title}`}
//     >
//       {content}
//     </Link>
//   ) : (
//     content
//   );
// }



// import React from "react";
// import { Link } from "react-router-dom";
// import { LockKeyhole } from "lucide-react";

// export default function ArticleCard({
//   image,
//   imageAlt = "",
//   title,
//   category,
//   categoryLink,
//   slug,
//   link,
//   isSpecial = false,
//   detailBasePath = "/industry-insight/articles",
//   className = "",
//   showAccessBadge
// }) {
//   const content = (
//     <article
//       className={`group flex h-full min-w-0 flex-col bg-white font-sans ${className}`}
//     >
//       {/* Image */}
//       <div className="relative aspect-[1.15/1] w-full overflow-hidden border border-[#DCDCDC] bg-gray-100 p-1">
//         <div className="h-full w-full overflow-hidden">
//           <img
//             src={image}
//             alt={imageAlt || title}
//             loading="lazy"
//             decoding="async"
//             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         </div>

//         {/* Article Access Badge */}
// {showAccessBadge && (
//   <div className="absolute left-3 top-3 z-10">
//     {isSpecial ? (
//       <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#E87565] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
//         <LockKeyhole size={11} />
//         Special
//       </span>
//     ) : (
//       // <span className="inline-flex items-center rounded-sm bg-[#20466C] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
//       //   General
//       // </span>
//       ""
//     )}
//   </div>
// )}
//       </div>

//       {/* Title */}
//       <h3 className="mt-2.5 text-[11px] font-medium leading-[1.5] text-[#172337] transition-colors duration-300 group-hover:text-[#E87565] sm:text-sm">
//         {title}
//       </h3>

//       {/* Category */}
//       {category && (
//         <div className="mt-3">
//           {categoryLink ? (
//             <a
//               href={categoryLink}
//               onClick={(e) => e.stopPropagation()}
//               className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2 transition-colors hover:text-[#E87565]"
//             >
//               {category}
//             </a>
//           ) : (
//             <span className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2">
//               {category}
//             </span>
//           )}
//         </div>
//       )}
//     </article>
//   );

//   const destination =
//     link && link !== "#"
//       ? link
//       : slug
//         ? `${detailBasePath}/${slug}`
//         : "";

//   return destination ? (
//     <Link
//       to={destination}
//       className="block h-full"
//       aria-label={`Read ${title}${isSpecial ? " - Special article, registration required" : ""}`}
//     >
//       {content}
//     </Link>
//   ) : (
//     content
//   );
// }



import React from "react";
import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

export default function ArticleCard({
  image,
  imageAlt = "",
  title,
  category,
  categoryLink,
  slug,
  link,
  isSpecial = false,
  detailBasePath = "/industry-insight/articles",
  className = "",
  showAccessBadge = true,
  onSpecialClick,
}) {
  const content = (
    <article
      className={`group flex h-full min-w-0 flex-col bg-white font-sans ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[1.15/1] w-full overflow-hidden border border-[#DCDCDC] bg-gray-100 p-1">
        <div className="h-full w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Special Article Badge */}
        {showAccessBadge && isSpecial && (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#E87565] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
              <LockKeyhole size={11} />
              Special
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2.5 text-[11px] font-medium leading-[1.5] text-[#172337] transition-colors duration-300 group-hover:text-[#E87565] sm:text-sm">
        {title}
      </h3>

      {/* Category */}
      {category && (
        <div className="mt-3">
          {categoryLink ? (
            <a
              href={categoryLink}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2 transition-colors hover:text-[#E87565]"
            >
              {category}
            </a>
          ) : (
            <span className="text-[11px] text-gray-500 underline decoration-gray-400 underline-offset-2">
              {category}
            </span>
          )}
        </div>
      )}
    </article>
  );

  const destination =
    link && link !== "#"
      ? link
      : slug
        ? `${detailBasePath}/${slug}`
        : "";

  const handleClick = (e) => {
    if (isSpecial) {
      e.preventDefault();

      onSpecialClick?.({
        title,
        destination,
      });
    }
  };

  return destination ? (
    <Link
      to={destination}
      onClick={handleClick}
      className="block h-full"
      aria-label={`Read ${title}${isSpecial ? " - Special article, registration required" : ""}`}
    >
      {content}
    </Link>
  ) : (
    content
  );
}
