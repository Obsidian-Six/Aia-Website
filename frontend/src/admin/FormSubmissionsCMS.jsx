// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Search,
//   Eye,
//   Trash2,
//   X,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
//   Phone,
//   Building2,
//   CalendarDays,
//   FileText,
//   Loader2,
//   Filter,
//   CheckCircle2,
//   Clock,
//   Inbox,
// } from "lucide-react";
// import { adminRequest } from "../services/adminAuth.js";

// const FORM_TYPES = [
//   { value: "contact-us", label: "Contact Us" },
//   { value: "aia-membership", label: "AIA Membership" },
//   { value: "brochure-enquiry", label: "Brochure Enquiry" },
//   { value: "article-reader", label: "Article Reader Registration" },
// ];

// const STATUSES = [
//   { value: "new", label: "New" },
//   { value: "contacted", label: "Contacted" },
//   { value: "closed", label: "Closed" },
// ];

// const getFormLabel = (type) =>
//   FORM_TYPES.find((item) => item.value === type)?.label || type || "Unknown";

// const formatDate = (date) => {
//   if (!date) return "—";

//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "contacted":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "closed":
//       return "bg-green-50 text-green-700 border-green-200";
//     default:
//       return "bg-orange-50 text-orange-700 border-orange-200";
//   }
// };

// const formatValue = (value) => {
//   if (value === null || value === undefined || value === "") {
//     return "—";
//   }

//   if (typeof value === "boolean") {
//     return value ? "Yes" : "No";
//   }

//   if (Array.isArray(value)) {
//     return value.length ? value.join(", ") : "—";
//   }

//   if (typeof value === "object") {
//     return JSON.stringify(value, null, 2);
//   }

//   return String(value);
// };

// const getDisplayName = (submission) => {
//   const data = submission?.data || {};

//   return (
//     data.fullName ||
//     data.name ||
//     data.companyName ||
//     data.email ||
//     "Unnamed Submission"
//   );
// };

// const getFieldLabel = (key) => {
//   const labels = {
//     companyName: "Company Name / Institution Name",
//     company: "Company Name / Institution Name",
//     website: "Website Link",
//   };

//   return labels[key] || key.replace(/([A-Z])/g, " $1");
// };

// export default function FormSubmissionsCMS() {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [formType, setFormType] = useState("");
//   const [status, setStatus] = useState("");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   const fetchSubmissions = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: "10",
//       });

//       if (search.trim()) params.set("search", search.trim());
//       if (formType) params.set("formType", formType);
//       if (status) params.set("status", status);

//       const result = await adminRequest(
//         `/form-submissions?${params.toString()}`,
//       );

//       setSubmissions(result.data || []);
//       setTotal(result.total ?? result.count ?? 0);
//       setTotalPages(result.totalPages || 1);
//     } catch (err) {
//       setError(err.message || "Unable to load form submissions.");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, formType, status]);

//   useEffect(() => {
//     fetchSubmissions();
//   }, [fetchSubmissions]);

//   const openSubmission = async (id) => {
//     try {
//       setDetailLoading(true);
//       setSelectedSubmission(null);

//       const result = await adminRequest(`/form-submissions/${id}`);

//       setSelectedSubmission(result.data);

//       // Refresh list because opening a submission may mark it as read.
//       fetchSubmissions();
//     } catch (err) {
//       setError(err.message || "Unable to load submission details.");
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const updateStatus = async (id, nextStatus) => {
//     try {
//       setActionLoading(true);

//       await adminRequest(`/form-submissions/${id}/status`, {
//         method: "PATCH",
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       if (selectedSubmission?._id === id) {
//         setSelectedSubmission((previous) => ({
//           ...previous,
//           status: nextStatus,
//         }));
//       }

//       await fetchSubmissions();
//     } catch (err) {
//       setError(err.message || "Unable to update submission status.");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const deleteSubmission = async (submission) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete the submission from ${getDisplayName(
//         submission,
//       )}? This action cannot be undone.`,
//     );

//     if (!confirmed) return;

//     try {
//       setActionLoading(true);

//       await adminRequest(`/form-submissions/${submission._id}`, {
//         method: "DELETE",
//       });

//       if (selectedSubmission?._id === submission._id) {
//         setSelectedSubmission(null);
//       }

//       await fetchSubmissions();
//     } catch (err) {
//       setError(err.message || "Unable to delete submission.");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleFilterChange = (setter, value) => {
//     setter(value);
//     setPage(1);
//   };

//   const data = selectedSubmission?.data || {};

//   return (
//     <div className="space-y-6">
//       {/* Page heading */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-xl bg-[#E25238]/10 text-[#E25238] flex items-center justify-center">
//               <Inbox className="w-5 h-5" />
//             </div>

//             <div>
//               <h2 className="text-xl sm:text-2xl font-black text-slate-800">
//                 Form Submissions
//               </h2>
//               <p className="text-sm text-slate-500">
//                 Manage all website inquiries in one place.
//               </p>
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={fetchSubmissions}
//           disabled={loading}
//           className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* Total count */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white border border-slate-200 rounded-2xl p-5">
//           <p className="text-sm text-slate-500">Filtered Submissions</p>
//           <p className="text-3xl font-black text-slate-800 mt-2">{total}</p>
//         </div>

//         <div className="bg-white border border-slate-200 rounded-2xl p-5">
//           <p className="text-sm text-slate-500">Current Page</p>
//           <p className="text-3xl font-black text-slate-800 mt-2">
//             {page}{" "}
//             <span className="text-base text-slate-400">/ {totalPages}</span>
//           </p>
//         </div>

//         <div className="bg-white border border-slate-200 rounded-2xl p-5">
//           <p className="text-sm text-slate-500">Forms Supported</p>
//           <p className="text-3xl font-black text-slate-800 mt-2">
//             {FORM_TYPES.length}
//           </p>
//         </div>
//       </div>

//       {/* Search and filters */}
//       <div className="bg-white border border-slate-200 rounded-2xl p-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <div className="relative">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

//             <input
//               type="search"
//               value={search}
//               onChange={(e) => handleFilterChange(setSearch, e.target.value)}
//               placeholder="Search name, email, company..."
//               className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238]"
//             />
//           </div>

//           <div className="relative">
//             <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

//             <select
//               value={formType}
//               onChange={(e) => handleFilterChange(setFormType, e.target.value)}
//               className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238] bg-white"
//             >
//               <option value="">All Form Types</option>
//               {FORM_TYPES.map((item) => (
//                 <option key={item.value} value={item.value}>
//                   {item.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <select
//             value={status}
//             onChange={(e) => handleFilterChange(setStatus, e.target.value)}
//             className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238] bg-white"
//           >
//             <option value="">All Statuses</option>
//             {STATUSES.map((item) => (
//               <option key={item.value} value={item.value}>
//                 {item.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start justify-between gap-3">
//           <span>{error}</span>
//           <button type="button" onClick={() => setError("")}>
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Submissions table */}
//       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
//         <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
//           <h3 className="font-bold text-slate-800">All Submissions</h3>
//           <span className="text-xs text-slate-500">{total} result(s)</span>
//         </div>

//         {loading ? (
//           <div className="py-16 flex flex-col items-center justify-center text-slate-500">
//             <Loader2 className="w-8 h-8 animate-spin text-[#E25238] mb-3" />
//             <p className="text-sm">Loading submissions...</p>
//           </div>
//         ) : submissions.length === 0 ? (
//           <div className="py-16 flex flex-col items-center justify-center text-center px-4">
//             <Inbox className="w-10 h-10 text-slate-300 mb-3" />
//             <h3 className="font-bold text-slate-700">No submissions found</h3>
//             <p className="text-sm text-slate-500 mt-1">
//               Website form submissions will appear here.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[850px] text-left">
//                 <thead className="bg-slate-50">
//                   <tr className="text-[11px] uppercase tracking-wider text-slate-500">
//                     <th className="px-5 py-4 font-bold">Submitted By</th>
//                     <th className="px-5 py-4 font-bold">Form Type</th>
//                     <th className="px-5 py-4 font-bold">
//                       Company Name / Institution Name
//                     </th>
//                     <th className="px-5 py-4 font-bold">Date</th>
//                     <th className="px-5 py-4 font-bold">Status</th>
//                     <th className="px-5 py-4 font-bold text-right">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {submissions.map((item) => (
//                     <tr
//                       key={item._id}
//                       className="hover:bg-slate-50/70 transition"
//                     >
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2">
//                           {!item.isRead && (
//                             <span
//                               className="w-2 h-2 rounded-full bg-[#E25238]"
//                               title="Unread"
//                             />
//                           )}

//                           <div>
//                             <p className="text-sm font-bold text-slate-800">
//                               {getDisplayName(item)}
//                             </p>
//                             <p className="text-xs text-slate-500 mt-1">
//                               {item.data?.email || "No email"}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-5 py-4">
//                         <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
//                           {getFormLabel(item.formType)}
//                         </span>
//                       </td>

//                      <td className="px-5 py-4 text-sm text-slate-600">
//   {item.data?.companyName ||
//     item.data?.company ||
//     "—"}
// </td>

//                       <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
//                         {formatDate(item.createdAt)}
//                       </td>

//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(
//                             item.status,
//                           )}`}
//                         >
//                           {item.status || "new"}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             type="button"
//                             onClick={() => openSubmission(item._id)}
//                             title="View details"
//                             className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => deleteSubmission(item)}
//                             disabled={actionLoading}
//                             title="Delete submission"
//                             className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-50"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
//               <p className="text-xs text-slate-500">
//                 Page {page} of {totalPages}
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => setPage((previous) => previous - 1)}
//                   className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>

//                 <button
//                   type="button"
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((previous) => previous + 1)}
//                   className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Submission details modal */}
//       {(selectedSubmission || detailLoading) && (
//         <div
//           className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget) {
//               setSelectedSubmission(null);
//             }
//           }}
//         >
//           <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
//             <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-black text-slate-800">
//                   Submission Details
//                 </h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Complete website form response
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setSelectedSubmission(null)}
//                 className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
//               >
//                 <X className="w-5 h-5 text-slate-600" />
//               </button>
//             </div>

//             {detailLoading ? (
//               <div className="py-16 flex justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-[#E25238]" />
//               </div>
//             ) : selectedSubmission ? (
//               <>
//                 <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                     <div>
//                       <span className="text-xs text-slate-500">
//                         Form Category
//                       </span>
//                       <h4 className="text-lg font-bold text-slate-800 mt-1">
//                         {getFormLabel(selectedSubmission.formType)}
//                       </h4>
//                     </div>

//                     <span
//                       className={`inline-flex w-fit px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusStyle(
//                         selectedSubmission.status,
//                       )}`}
//                     >
//                       {selectedSubmission.status || "new"}
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="p-4 rounded-xl bg-slate-50">
//                       <div className="flex items-center gap-2 text-slate-400 mb-2">
//                         <CalendarDays className="w-4 h-4" />
//                         <span className="text-xs font-semibold">
//                           Submitted On
//                         </span>
//                       </div>
//                       <p className="text-sm font-semibold text-slate-700">
//                         {formatDate(selectedSubmission.createdAt)}
//                       </p>
//                     </div>

//                     <div className="p-4 rounded-xl bg-slate-50">
//                       <div className="flex items-center gap-2 text-slate-400 mb-2">
//                         <FileText className="w-4 h-4" />
//                         <span className="text-xs font-semibold">
//                           Source Page
//                         </span>
//                       </div>
//                       <p className="text-sm font-semibold text-slate-700 break-all">
//                         {selectedSubmission.sourcePage || "—"}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-bold text-slate-800 mb-3">
//                       Submitted Information
//                     </h4>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       {Object.entries(data).map(([key, value]) => (
//                         <div
//                           key={key}
//                           className="p-3.5 rounded-xl border border-slate-200 min-w-0"
//                         >
//                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
//   {getFieldLabel(key)}
// </p>

//                           <p className="text-sm text-slate-700 font-medium break-words whitespace-pre-wrap">
//                             {formatValue(value)}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <button
//                     type="button"
//                     onClick={() => deleteSubmission(selectedSubmission)}
//                     disabled={actionLoading}
//                     className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>

//                   <div className="flex flex-wrap gap-2">
//                     {STATUSES.map((item) => (
//                       <button
//                         key={item.value}
//                         type="button"
//                         disabled={
//                           actionLoading ||
//                           selectedSubmission.status === item.value
//                         }
//                         onClick={() =>
//                           updateStatus(selectedSubmission._id, item.value)
//                         }
//                         className={`px-3 py-2 rounded-xl text-xs font-bold border transition disabled:opacity-40 ${
//                           selectedSubmission.status === item.value
//                             ? "bg-slate-200 text-slate-500 border-slate-200"
//                             : "bg-white text-slate-700 border-slate-200 hover:border-[#E25238] hover:text-[#E25238]"
//                         }`}
//                       >
//                         {item.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileText,
  Loader2,
  Filter,
  Inbox,
  ClipboardCheck,
  Globe,
  UserRound,
  Building2,
  Mail,
  Phone,
  Video,
  CheckCircle2,
} from "lucide-react";
import { adminRequest } from "../services/adminAuth.js";

const FORM_TYPES = [
  { value: "contact-us", label: "Contact Us" },
  { value: "aia-membership", label: "AIA Membership" },
  { value: "brochure-enquiry", label: "Brochure Enquiry" },
  { value: "article-reader", label: "Article Reader Registration" },
];

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const TABS = [
  { value: "all", label: "All Submissions", icon: Inbox },
  { value: "website", label: "Website Forms", icon: Globe },
  { value: "assessment", label: "Self-Assessment", icon: ClipboardCheck },
];

const PAGE_LIMIT = 10;
const SELF_ASSESSMENT_ENDPOINT = "/self-assessment/admin/submissions";

const getFormLabel = (type) =>
  FORM_TYPES.find((item) => item.value === type)?.label || type || "Unknown";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  switch (status) {
    case "contacted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "closed":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-orange-50 text-orange-700 border-orange-200";
  }
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const getDisplayName = (submission) => {
  if (submission?.submissionType === "assessment") {
    return (
      submission.participant?.name ||
      submission.participant?.email ||
      "Unnamed Participant"
    );
  }

  const data = submission?.data || {};

  return (
    data.fullName ||
    data.name ||
    data.companyName ||
    data.email ||
    "Unnamed Submission"
  );
};

const getEmail = (submission) =>
  submission?.submissionType === "assessment"
    ? submission.participant?.email || "No email"
    : submission?.data?.email || "No email";

const getCompany = (submission) =>
  submission?.submissionType === "assessment"
    ? submission.participant?.company || "—"
    : submission?.data?.companyName ||
      submission?.data?.company ||
      "—";

const getFieldLabel = (key) => {
  const labels = {
    companyName: "Company Name / Institution Name",
    company: "Company Name / Institution Name",
    website: "Website Link",
    fullName: "Full Name",
    countryCode: "Country Code",
    mobile: "Mobile Number",
    ceoEmail: "CEO Email",
  };

  return labels[key] || key.replace(/([A-Z])/g, " $1");
};

const getAssessmentStatusLabel = (status) =>
  STATUSES.find((item) => item.value === status)?.label || "New";

const normalizeAssessment = (item) => ({
  ...item,
  submissionType: "assessment",
});

const normalizeWebsiteSubmission = (item) => ({
  ...item,
  submissionType: "website",
});

export default function FormSubmissionsCMS() {
  const [activeTab, setActiveTab] = useState("all");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [formType, setFormType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      if (activeTab === "website") {
        if (formType) params.set("formType", formType);

        const result = await adminRequest(
          `/form-submissions?${params.toString()}`,
        );

        setSubmissions(
          (result.data || []).map(normalizeWebsiteSubmission),
        );
        setTotal(result.total ?? result.count ?? 0);
        setTotalPages(result.totalPages || 1);
        return;
      }

      if (activeTab === "assessment") {
        const result = await adminRequest(
          `${SELF_ASSESSMENT_ENDPOINT}?${params.toString()}`,
        );

        setSubmissions(
          (result.data || []).map(normalizeAssessment),
        );
        setTotal(result.total ?? result.count ?? 0);
        setTotalPages(result.totalPages || 1);
        return;
      }

      /*
       * All Submissions:
       * Fetch both collections, merge and sort by submission date.
       * Pagination is applied after merging so both submission types
       * appear together in chronological order.
       */
      const allParams = new URLSearchParams({
        page: "1",
        limit: "1000",
      });

      if (search.trim()) allParams.set("search", search.trim());
      if (status) allParams.set("status", status);

      const websiteParams = new URLSearchParams(allParams);
      if (formType) websiteParams.set("formType", formType);

      const requests = [
        adminRequest(`/form-submissions?${websiteParams.toString()}`),
      ];

      // A selected website form type should not hide assessment records
      // only when no form type is selected.
      if (!formType) {
        requests.push(
          adminRequest(
            `${SELF_ASSESSMENT_ENDPOINT}?${allParams.toString()}`,
          ),
        );
      }

      const results = await Promise.all(requests);

      const websiteRecords = (results[0]?.data || []).map(
        normalizeWebsiteSubmission,
      );

      const assessmentRecords = (results[1]?.data || []).map(
        normalizeAssessment,
      );

      const merged = [...websiteRecords, ...assessmentRecords].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );

      const startIndex = (page - 1) * PAGE_LIMIT;
      const paginatedRecords = merged.slice(
        startIndex,
        startIndex + PAGE_LIMIT,
      );

      setSubmissions(paginatedRecords);
      setTotal(merged.length);
      setTotalPages(Math.max(1, Math.ceil(merged.length / PAGE_LIMIT)));
    } catch (err) {
      setError(err.message || "Unable to load form submissions.");
      setSubmissions([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, formType, status]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const openSubmission = async (submission) => {
    try {
      setDetailLoading(true);
      setSelectedSubmission(null);

      const isAssessment = submission.submissionType === "assessment";

      const endpoint = isAssessment
        ? `${SELF_ASSESSMENT_ENDPOINT}/${submission._id}`
        : `/form-submissions/${submission._id}`;

      const result = await adminRequest(endpoint);

      const detail = isAssessment
        ? normalizeAssessment(result.data)
        : normalizeWebsiteSubmission(result.data);

      setSelectedSubmission(detail);

      // Opening a record may mark it as read.
      fetchSubmissions();
    } catch (err) {
      setError(err.message || "Unable to load submission details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (submission, nextStatus) => {
    try {
      setActionLoading(true);

      const isAssessment = submission.submissionType === "assessment";

      const endpoint = isAssessment
        ? `${SELF_ASSESSMENT_ENDPOINT}/${submission._id}/status`
        : `/form-submissions/${submission._id}/status`;

      await adminRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (selectedSubmission?._id === submission._id) {
        setSelectedSubmission((previous) => ({
          ...previous,
          status: nextStatus,
        }));
      }

      await fetchSubmissions();
    } catch (err) {
      setError(err.message || "Unable to update submission status.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSubmission = async (submission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the submission from ${getDisplayName(
        submission,
      )}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const isAssessment = submission.submissionType === "assessment";

      const endpoint = isAssessment
        ? `${SELF_ASSESSMENT_ENDPOINT}/${submission._id}`
        : `/form-submissions/${submission._id}`;

      await adminRequest(endpoint, {
        method: "DELETE",
      });

      if (selectedSubmission?._id === submission._id) {
        setSelectedSubmission(null);
      }

      await fetchSubmissions();
    } catch (err) {
      setError(err.message || "Unable to delete submission.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    setPage(1);
    setFormType("");
    setSearch("");
    setStatus("");
    setSelectedSubmission(null);
  };

  const isAssessmentDetail =
    selectedSubmission?.submissionType === "assessment";

  const websiteData = selectedSubmission?.data || {};
  const participant = selectedSubmission?.participant || {};
  const assessmentResponses = selectedSubmission?.responses || [];
  const sourceVideo = selectedSubmission?.sourceVideo || {};

  const tabTitle =
    activeTab === "assessment"
      ? "Self-Assessment Submissions"
      : activeTab === "website"
        ? "Website Form Submissions"
        : "All Submissions";

  const emptyMessage =
    activeTab === "assessment"
      ? "Self-Assessment submissions will appear here."
      : "Website form submissions will appear here.";

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E25238]/10 text-[#E25238] flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Form Submissions
            </h2>
            <p className="text-sm text-slate-500">
              Manage website inquiries and manufacturer assessments.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  active
                    ? "bg-[#E25238] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Filtered Submissions</p>
          <p className="text-3xl font-black text-slate-800 mt-2">
            {total}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Current Page</p>
          <p className="text-3xl font-black text-slate-800 mt-2">
            {page}{" "}
            <span className="text-base text-slate-400">
              / {totalPages}
            </span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            {activeTab === "assessment"
              ? "Assessment Type"
              : activeTab === "website"
                ? "Website Form Types"
                : "Submission Sources"}
          </p>
          <p className="text-3xl font-black text-slate-800 mt-2">
            {activeTab === "assessment"
              ? "01"
              : activeTab === "website"
                ? FORM_TYPES.length
                : "02"}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div
          className={`grid grid-cols-1 ${
            activeTab === "website"
              ? "md:grid-cols-3"
              : "md:grid-cols-2"
          } gap-3`}
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                handleFilterChange(setSearch, e.target.value)
              }
              placeholder={
                activeTab === "assessment"
                  ? "Search name, email, company, mobile..."
                  : "Search name, email, company..."
              }
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238]"
            />
          </div>

          {activeTab === "website" && (
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              <select
                value={formType}
                onChange={(e) =>
                  handleFilterChange(setFormType, e.target.value)
                }
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238] bg-white"
              >
                <option value="">All Form Types</option>
                {FORM_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <select
            value={status}
            onChange={(e) =>
              handleFilterChange(setStatus, e.target.value)
            }
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#E25238] bg-white"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Submissions table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-800">{tabTitle}</h3>
            <p className="text-xs text-slate-500 mt-1">
              View and manage submitted information.
            </p>
          </div>

          <span className="text-xs text-slate-500">
            {total} result(s)
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#E25238] mb-3" />
            <p className="text-sm">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <Inbox className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700">
              No submissions found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-bold">Submitted By</th>
                    <th className="px-5 py-4 font-bold">Submission Type</th>
                    <th className="px-5 py-4 font-bold">
                      Company Name / Institution Name
                    </th>
                    <th className="px-5 py-4 font-bold">Date</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {submissions.map((item) => {
                    const isAssessment =
                      item.submissionType === "assessment";

                    return (
                      <tr
                        key={`${item.submissionType}-${item._id}`}
                        className="hover:bg-slate-50/70 transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {!item.isRead && (
                              <span
                                className="w-2 h-2 rounded-full bg-[#E25238] shrink-0"
                                title="Unread"
                              />
                            )}

                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {getDisplayName(item)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {getEmail(item)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              isAssessment
                                ? "bg-[#E25238]/10 text-[#C7432B]"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {isAssessment ? (
                              <ClipboardCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                            {isAssessment
                              ? "Self-Assessment"
                              : getFormLabel(item.formType)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {getCompany(item)}
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(
                              item.status,
                            )}`}
                          >
                            {item.status || "new"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openSubmission(item)}
                              title="View details"
                              className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteSubmission(item)}
                              disabled={actionLoading}
                              title="Delete submission"
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Submission details modal */}
      {(selectedSubmission || detailLoading) && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedSubmission(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  Submission Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isAssessmentDetail
                    ? "Manufacturer self-assessment response"
                    : "Complete website form response"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#E25238]" />
              </div>
            ) : selectedSubmission ? (
              <>
                <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                  {/* Submission header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-500">
                        Submission Category
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 mt-1">
                        {isAssessmentDetail
                          ? "Manufacturer Self-Assessment"
                          : getFormLabel(selectedSubmission.formType)}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex w-fit px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusStyle(
                        selectedSubmission.status,
                      )}`}
                    >
                      {selectedSubmission.status || "new"}
                    </span>
                  </div>

                  {/* Submission metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          Submitted On
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        {formatDate(selectedSubmission.createdAt)}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          {isAssessmentDetail ? "Submission ID" : "Source Page"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 break-all">
                        {isAssessmentDetail
                          ? selectedSubmission._id
                          : selectedSubmission.sourcePage || "—"}
                      </p>
                    </div>
                  </div>

                  {isAssessmentDetail ? (
                    <>
                      {/* Participant information */}
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <UserRound className="w-4 h-4 text-[#E25238]" />
                          <h4 className="font-bold text-slate-800">
                            Participant Information
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            {
                              label: "Full Name",
                              value: participant.name,
                            },
                            {
                              label: "Function / Department",
                              value: participant.function,
                            },
                            {
                              label: "Company",
                              value: participant.company,
                            },
                            {
                              label: "Email Address",
                              value: participant.email,
                            },
                            {
                              label: "Country Code",
                              value: participant.countryCode,
                            },
                            {
                              label: "Mobile Number",
                              value: participant.mobile,
                            },
                            {
                              label: "Website",
                              value: participant.website,
                            },
                          ].map((field) => (
                            <div
                              key={field.label}
                              className="p-3.5 rounded-xl border border-slate-200 min-w-0"
                            >
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                                {field.label}
                              </p>
                              <p className="text-sm text-slate-700 font-medium break-words">
                                {formatValue(field.value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Assessment responses */}
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <ClipboardCheck className="w-4 h-4 text-[#E25238]" />
                          <h4 className="font-bold text-slate-800">
                            Assessment Responses
                          </h4>
                          <span className="ml-auto text-xs text-slate-500">
                            {assessmentResponses.length} responses
                          </span>
                        </div>

                        {assessmentResponses.length === 0 ? (
                          <div className="p-5 rounded-xl bg-slate-50 text-sm text-slate-500 text-center">
                            No assessment responses available.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {assessmentResponses.map((response, index) => (
                              <div
                                key={`${response.sectionId || response.sectionNumber || index}`}
                                className="border border-slate-200 rounded-xl p-4"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                  <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#E25238]">
                                      Section{" "}
                                      {response.sectionNumber || index + 1}
                                    </p>
                                    <h5 className="font-bold text-slate-800 mt-1">
                                      {response.sectionTitle ||
                                        `Assessment Section ${index + 1}`}
                                    </h5>
                                  </div>

                                  <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Answer Submitted
                                  </span>
                                </div>

                                <div className="mt-3">
                                  <p className="text-xs font-semibold text-slate-500 mb-1">
                                    Question
                                  </p>
                                  <p className="text-sm text-slate-700 leading-relaxed">
                                    {response.question || "—"}
                                  </p>
                                </div>

                                <div className="mt-3 p-3 rounded-lg bg-[#E25238]/5 border border-[#E25238]/10">
                                  <p className="text-xs font-bold text-[#C7432B] mb-1">
                                    Selected Answer
                                  </p>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {formatValue(response.selectedOption)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      {/* Source video */}
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <Video className="w-4 h-4 text-[#E25238]" />
                          <h4 className="font-bold text-slate-800">
                            Source Video
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl border border-slate-200">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                              Video Title
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {sourceVideo.videoTitle || "—"}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-slate-200">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                              Video ID
                            </p>
                            <p className="text-sm font-medium text-slate-700 break-all">
                              {sourceVideo.videoId || "—"}
                            </p>
                          </div>
                        </div>
                      </section>
                    </>
                  ) : (
                    /* Existing website form details */
                    <section>
                      <h4 className="font-bold text-slate-800 mb-3">
                        Submitted Information
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(websiteData).map(([key, value]) => (
                          <div
                            key={key}
                            className="p-3.5 rounded-xl border border-slate-200 min-w-0"
                          >
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                              {getFieldLabel(key)}
                            </p>

                            <p className="text-sm text-slate-700 font-medium break-words whitespace-pre-wrap">
                              {formatValue(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Modal footer */}
                <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => deleteSubmission(selectedSubmission)}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={
                          actionLoading ||
                          selectedSubmission.status === item.value
                        }
                        onClick={() =>
                          updateStatus(selectedSubmission, item.value)
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition disabled:opacity-40 ${
                          selectedSubmission.status === item.value
                            ? "bg-slate-200 text-slate-500 border-slate-200"
                            : "bg-white text-slate-700 border-slate-200 hover:border-[#E25238] hover:text-[#E25238]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}