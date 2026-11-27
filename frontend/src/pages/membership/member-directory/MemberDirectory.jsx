// import React, { useMemo, useState } from "react";
// import { Search, X } from "lucide-react";

// import { membershipDirectory } from "../../../data/membership-directory";
// import MemberDirectoryHero from "../../../components/membership/member-directory/MemberDirectoryHero";
// import MemberCard from "../../../components/membership/member-directory/MemberCard";

// export default function MemberDirectory() {
//   const [search, setSearch] = useState("");

//   const filteredMembers = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) return membershipDirectory;

//     return membershipDirectory.filter((member) =>
//       [
//         member.name,
//         member.shortName,
//         member.category,
//       ].some((value) => value?.toLowerCase().includes(query))
//     );
//   }, [search]);

//   return (
//     <main className="min-h-screen bg-white font-sans">
//       <MemberDirectoryHero members={membershipDirectory} />

//       <section className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">

//         {/* Search and Count */}
//         <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <h2 className="text-xl font-semibold text-[#202A3A] sm:text-2xl">
//               Explore Our Members
//             </h2>

//             <p className="mt-1 text-xs text-gray-500">
//               Discover companies across the automation ecosystem.
//             </p>
//           </div>

//           <div className="relative w-full sm:max-w-[280px]">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               type="search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search members..."
//               className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#E87565] focus:ring-2 focus:ring-[#E87565]/10"
//             />

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 aria-label="Clear search"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         <p className="mb-5 text-[11px] text-gray-500">
//           Showing {filteredMembers.length} of {membershipDirectory.length} members
//         </p>

//         {/* Members Grid */}
//         {filteredMembers.length > 0 ? (
//           <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
//             {filteredMembers.map((member) => (
//               <MemberCard key={member.id} member={member} />
//             ))}
//           </div>
//         ) : (
//           <div className="py-20 text-center">
//             <h3 className="text-lg font-semibold text-[#202A3A]">
//               No members found
//             </h3>
//             <p className="mt-2 text-sm text-gray-500">
//               Try searching with a different company name or category.
//             </p>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// import React, { useEffect, useMemo, useState } from "react";
// import { Search, X } from "lucide-react";

// import MemberDirectoryHero from "../../../components/membership/member-directory/MemberDirectoryHero";
// import MemberCard from "../../../components/membership/member-directory/MemberCard";

// const API = `${import.meta.env.VITE_API_URL || ""}/members`;

// export default function MemberDirectory() {
//   const [members, setMembers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await fetch(API);
//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message);
//         }

//         setMembers(result.members || []);
//       } catch (error) {
//         console.error("Member fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//   }, []);

//   const filteredMembers = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) return members;

//     return members.filter((member) =>
//       [
//         member.name,
//         member.shortName,
//         member.category,
//       ].some((value) =>
//         value?.toLowerCase().includes(query)
//       )
//     );
//   }, [search, members]);

//   // Keep compatibility with existing card components.
//   const formattedMembers = filteredMembers.map((member) => ({
//     ...member,
//     id: member._id,
//     logo: member.logo?.url || "",
//     coverLogo: member.coverLogo?.url || "",
//   }));

//   const formattedAllMembers = members.map((member) => ({
//     ...member,
//     id: member._id,
//     logo: member.logo?.url || "",
//     coverLogo: member.coverLogo?.url || "",
//   }));

//   return (
//     <main className="min-h-screen bg-white font-sans">

//       <MemberDirectoryHero
//         members={formattedAllMembers}
//       />

//       <section className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">

//         <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <h2 className="text-xl font-semibold text-[#202A3A] sm:text-2xl">
//               Explore Our Members
//             </h2>

//             <p className="mt-1 text-xs text-gray-500">
//               Discover companies across the automation ecosystem.
//             </p>
//           </div>

//           <div className="relative w-full sm:max-w-[280px]">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               type="search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search members..."
//               className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#E87565] focus:ring-2 focus:ring-[#E87565]/10"
//             />

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         <p className="mb-5 text-[11px] text-gray-500">
//           Showing {filteredMembers.length} of {members.length} members
//         </p>

//         {loading ? (
//           <div className="py-20 text-center text-gray-500">
//             Loading members...
//           </div>
//         ) : formattedMembers.length > 0 ? (
//           <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
//             {formattedMembers.map((member) => (
//               <MemberCard
//                 key={member._id}
//                 member={member}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="py-20 text-center">
//             <h3 className="text-lg font-semibold text-[#202A3A]">
//               No members found
//             </h3>

//             <p className="mt-2 text-sm text-gray-500">
//               Try searching with a different company name or category.
//             </p>
//           </div>
//         )}

//       </section>
//     </main>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import MemberDirectoryHero from "../../../components/membership/member-directory/MemberDirectoryHero";
import MemberCard from "../../../components/membership/member-directory/MemberCard";
import MemberFilterPicker, {
  filterLabels,
} from "../../../components/membership/member-directory/MemberFilterPicker";
import { getMembers, getMemberFilterOptions } from "../../../services/api";

const emptyFilters = {
  manufacturingSectors: [],
  technologyStreams: [],
  serviceStreams: [],
  keyword: "",
};

function formatMember(member) {
  return {
    ...member,
    id: member._id,
    logo: member.logo?.url || "",
    coverLogo: member.coverLogo?.url || "",
  };
}

export default function MemberDirectory() {
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState({});
  const [draft, setDraft] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [memberError, setMemberError] = useState("");
  const [optionsError, setOptionsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getMembers({ signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setMembers(items.map(formatMember));
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setMemberError(
            "Unable to load members. Please refresh to try again.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    getMemberFilterOptions({ signal: controller.signal })
      .then(({ groups }) => {
        if (!controller.signal.aborted) setGroups(groups);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setOptionsError(
            "Filter options could not be loaded. Keyword search is still available.",
          );
      });

    return () => controller.abort();
  }, []);

  const labelsById = useMemo(
    () =>
      new Map(
        Object.values(groups)
          .flat()
          .map(({ id, label }) => [id, label]),
      ),
    [groups],
  );

  const filteredMembers = useMemo(() => {
    const keywords = applied.keyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    return members.filter((member) => {
      const matchesTags = Object.keys(filterLabels).every((key) =>
        applied[key].every((id) => (member[key] || []).includes(id)),
      );
      if (!matchesTags) return false;
      if (!keywords.length) return true;

      const text = [
        member.name,
        member.shortName,
        member.category,
        member.about,
        ...(member.directoryKeywords || []),
        ...(member.services || []).flatMap(({ title, description }) => [
          title,
          description,
        ]),
        ...Object.keys(filterLabels).flatMap((key) =>
          (member[key] || []).map((id) => labelsById.get(id)),
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return keywords.every((keyword) => text.includes(keyword));
    });
  }, [members, applied, labelsById]);

  const clearFilters = () => {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
  };


  const selectionLimits = {
  manufacturingSectors: 1,
  technologyStreams: 3,
  serviceStreams: Infinity,
};
  return (
    <main className="min-h-screen bg-white font-sans">
      <MemberDirectoryHero members={members} />

      <section className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-[#202A3A] sm:text-2xl">
            Explore Our Members
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Discover companies across the automation ecosystem.
          </p>
        </div>

        <form
          className="mb-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            setApplied(draft);
          }}
        >
          {Object.entries(filterLabels).map(([key, label]) => (
            <MemberFilterPicker
              key={key}
              label={label}
              options={groups[key]}
              limit={selectionLimits[key]}
              values={draft[key]}
              onChange={(values) =>
                setDraft((current) => ({ ...current, [key]: values }))
              }
            />
          ))}
          <label className="block min-w-0 text-sm font-semibold text-[#202A3A]">
            Keyword Search
            <span className="relative mt-2 block">
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-2 top-2.5 text-slate-400"
              />
              <input
                type="search"
                value={draft.keyword}
                placeholder="Search members…"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    keyword: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-2 text-sm font-normal"
              />
            </span>
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#A93525]"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#203D59] px-3 py-2 text-sm font-semibold text-white hover:bg-[#172C40]"
            >
              Apply Filters
            </button>
          </div>
        </form>
        {optionsError && (
          <p role="status" className="mb-4 text-sm text-amber-800">
            {optionsError}
          </p>
        )}

        {!loading && !memberError && (
          <p className="mb-5 text-[11px] text-gray-500" aria-live="polite">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading members...
          </div>
        ) : memberError ? (
          <p role="alert" className="py-20 text-center text-red-700">
            {memberError}
          </p>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMembers.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-lg font-semibold text-[#202A3A]">
              No members match these filters
            </h3>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-semibold text-[#A93525] underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
