
import React from "react";
import { Link } from "react-router-dom";

export default function MembershipPartners({ partners = [] }) {
  if (!partners.length) return null;

  return (
    <div className="rounded-lg border border-[#F2D5D1] bg-white p-4">
      <h3 className="mb-3 text-xs font-bold text-[#E87565]">
        Contributing Partners
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {partners.map((partner) => (
          <div
            key={partner.id || partner.name}
            className="flex h-auto w-auto items-center justify-center rounded border border-gray-100 bg-white shadow-lg"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
        <button className="mt-2 group inline-flex items-center justify-center gap-2 rounded-md bg-[#E52B18] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#C92313] active:scale-95">
          <Link to={"/membership/member-directory"}>Explore MemberDirectory</Link>
        </button>
    </div>
  );
}
