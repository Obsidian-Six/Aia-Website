
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  X,
  LoaderCircle,
  ClipboardList,
  Building2,
  Mail,
  Phone,
  CalendarDays,
  Video,
  Download,
  UserRound,
  ClipboardCheck,
  FileText,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUSES = [
  { value: "new", label: "Mark as New" },
  { value: "contacted", label: "Mark as Contacted" },
  { value: "closed", label: "Mark as Closed" },
];

const getToken = () => sessionStorage.getItem("aia_admin_token");

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

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

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const getStatusStyle = (status) => {
  switch (status) {
    case "contacted":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "closed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-orange-50 text-[#D65A32] border-orange-100";
  }
};

const getSyncStatusStyle = (status) => {
  switch (status) {
    case "synced":
      return "bg-green-50 text-green-700";
    case "failed":
      return "bg-red-50 text-red-700";
    case "processing":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-orange-50 text-orange-700";
  }
};

function AllSelfAssessmentSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await request(
        "/self-assessment/admin/submissions"
      );

      setSubmissions(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return submissions;

    return submissions.filter((item) => {
      const participant = item.participant || {};

      return [
        participant.name,
        participant.company,
        participant.email,
        participant.function,
        participant.mobile,
        participant.countryCode,
        participant.website,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [submissions, search]);

  const openSubmission = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedSubmission(null);
      setError("");

      const result = await request(
        `/self-assessment/admin/submissions/${id}`
      );

      const submission = result.data || result.submission || result;

      setSelectedSubmission(submission);

      // Keep the list's read state in sync if the API marks it as read.
      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, ...(submission || {}), isRead: true }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteSubmission = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this assessment submission?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await request(`/self-assessment/admin/submissions/${id}`, {
        method: "DELETE",
      });

      setSubmissions((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (selectedSubmission?._id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      setError("");

      const result = await request(
        `/self-assessment/admin/submissions/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      const updatedSubmission =
        result.data || result.submission || {};

      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, ...updatedSubmission, status }
            : item
        )
      );

      setSelectedSubmission((prev) =>
        prev?._id === id
          ? { ...prev, ...updatedSubmission, status }
          : prev
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Submission ID",
      "Name",
      "Function",
      "Company",
      "Email",
      "Country Code",
      "Mobile",
      "Website",
      "Video Title",
      "Video ID",
      "Submitted At",
      "Status",
      "Google Sheets Sync",
      "Assessment Responses",
    ];

    const rows = filteredSubmissions.map((item) => {
      const participant = item.participant || {};

      const responses = (item.responses || [])
        .map(
          (response) =>
            `${response.sectionTitle || ""}: ${response.question || ""} - ${response.selectedOption || ""}`
        )
        .join(" | ");

      return [
        item._id,
        participant.name,
        participant.function,
        participant.company,
        participant.email,
        participant.countryCode,
        participant.mobile,
        participant.website,
        item.sourceVideo?.videoTitle,
        item.sourceVideo?.videoId,
        formatDate(item.createdAt),
        item.status,
        item.googleSheetsSync?.status,
        responses,
      ];
    });

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `AIA-Self-Assessment-Submissions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const participant = selectedSubmission?.participant || {};
  const sourceVideo = selectedSubmission?.sourceVideo || {};
  const assessmentResponses = selectedSubmission?.responses || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#E25238]">
            <ClipboardList size={19} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">
              AIA CMS / Submissions
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#202938]">
            Self-Assessment Submissions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View participant details and submitted manufacturing assessment responses.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            disabled={filteredSubmissions.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            onClick={loadSubmissions}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E25238] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c9432d] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Total Submissions
          </p>
          <p className="mt-2 text-3xl font-bold text-[#202938]">
            {submissions.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            New Submissions
          </p>
          <p className="mt-2 text-3xl font-bold text-[#E25238]">
            {submissions.filter((item) => item.status === "new").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Contacted
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {submissions.filter((item) => item.status === "contacted").length}
          </p>
        </div>
      </div>

      {/* Listing */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#202938]">
              All Participants
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredSubmissions.length} result(s) found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#E25238]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <LoaderCircle
              size={30}
              className="animate-spin text-[#E25238]"
            />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
            <ClipboardList size={38} className="mb-3 text-gray-300" />
            <h3 className="font-semibold text-gray-700">
              No submissions found
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {search
                ? "Try searching with another name, company or email."
                : "Participant submissions will appear here after they complete the assessment."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Participant</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Function</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((item) => {
                  const rowParticipant = item.participant || {};

                  return (
                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {rowParticipant.name || "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {rowParticipant.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {rowParticipant.company || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {rowParticipant.function || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {item.status || "new"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openSubmission(item._id)}
                            title="View details"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-[#E25238] hover:text-[#E25238]"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => deleteSubmission(item._id)}
                            disabled={deletingId === item._id}
                            title="Delete submission"
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                          >
                            {deletingId === item._id ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Submission Details Modal */}
      {(selectedSubmission || detailLoading) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !actionLoading) {
              setSelectedSubmission(null);
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E25238]">
                  AIA / Assessment Record
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-800">
                  Submission Details
                </h2>
                {selectedSubmission && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status || "new"}
                    </span>
                    <span className="text-xs text-slate-400">
                      Manufacturer Self-Assessment
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                disabled={actionLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              >
                <X size={19} className="text-slate-600" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-16">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-[#E25238]"
                />
              </div>
            ) : selectedSubmission ? (
              <>
                <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
                  {/* Submission Metadata */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#E25238]" />
                      <h3 className="font-bold text-slate-800">
                        Submission Metadata
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-slate-400">
                          <CalendarDays size={15} />
                          <span className="text-xs font-semibold">
                            Submitted On
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          {formatDate(selectedSubmission.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-slate-400">
                          <FileText size={15} />
                          <span className="text-xs font-semibold">
                            Submission ID
                          </span>
                        </div>
                        <p className="break-all font-mono text-xs font-semibold text-slate-700">
                          {selectedSubmission._id || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold text-slate-400">
                          Submission Status
                        </p>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                            selectedSubmission.status
                          )}`}
                        >
                          {selectedSubmission.status || "new"}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold text-slate-400">
                          Google Sheets Sync
                        </p>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getSyncStatusStyle(
                            selectedSubmission.googleSheetsSync?.status
                          )}`}
                        >
                          {selectedSubmission.googleSheetsSync?.status ||
                            "pending"}
                        </span>
                        {selectedSubmission.googleSheetsSync?.syncedAt && (
                          <p className="mt-2 text-xs text-slate-500">
                            Synced:{" "}
                            {formatDate(
                              selectedSubmission.googleSheetsSync.syncedAt
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Participant Information */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-[#E25238]" />
                      <h3 className="font-bold text-slate-800">
                        Participant Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                          icon: Building2,
                        },
                        {
                          label: "Email Address",
                          value: participant.email,
                          icon: Mail,
                        },
                        {
                          label: "Country Code",
                          value: participant.countryCode,
                        },
                        {
                          label: "Mobile Number",
                          value: participant.mobile,
                          icon: Phone,
                        },
                        {
                          label: "Website",
                          value: participant.website,
                        },
                      ].map((field) => {
                        const FieldIcon = field.icon;

                        return (
                          <div
                            key={field.label}
                            className="min-w-0 rounded-xl border border-slate-200 p-3.5"
                          >
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                              {field.label}
                            </p>
                            <p className="flex items-center gap-2 break-words text-sm font-medium text-slate-700">
                              {FieldIcon && (
                                <FieldIcon className="h-4 w-4 shrink-0 text-slate-400" />
                              )}
                              <span className="min-w-0 break-all">
                                {formatValue(field.value)}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Assessment Responses */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-[#E25238]" />
                      <h3 className="font-bold text-slate-800">
                        Manufacturing Self-Assessment Responses
                      </h3>
                      <span className="ml-auto text-xs text-slate-500">
                        {assessmentResponses.length} responses
                      </span>
                    </div>

                    {assessmentResponses.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                        No assessment responses available.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assessmentResponses.map((response, index) => (
                          <div
                            key={
                              response.sectionId ||
                              response.sectionNumber ||
                              index
                            }
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#E25238]">
                                  Section{" "}
                                  {response.sectionNumber || index + 1}
                                </p>
                                <h4 className="mt-1 font-bold text-slate-800">
                                  {response.sectionTitle ||
                                    `Assessment Section ${index + 1}`}
                                </h4>
                              </div>

                              <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                                <CheckCircle2 size={14} />
                                Answer Submitted
                              </span>
                            </div>

                            <div className="mt-3">
                              <p className="mb-1 text-xs font-semibold text-slate-500">
                                Question
                              </p>
                              <p className="text-sm leading-relaxed text-slate-700">
                                {response.question || "—"}
                              </p>
                            </div>

                            <div className="mt-3 rounded-lg border border-[#E25238]/10 bg-[#E25238]/5 p-3">
                              <p className="mb-1 text-xs font-bold text-[#C7432B]">
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

                  {/* Source Video */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#E25238]" />
                      <h3 className="font-bold text-slate-800">
                        Source Video
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 p-3.5">
                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Video Title
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {sourceVideo.videoTitle || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-3.5">
                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Video ID
                        </p>
                        <p className="break-all text-sm font-medium text-slate-700">
                          {sourceVideo.videoId || "—"}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <button
                    type="button"
                    onClick={() =>
                      deleteSubmission(selectedSubmission._id)
                    }
                    disabled={
                      deletingId === selectedSubmission._id ||
                      actionLoading
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === selectedSubmission._id ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Submission
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {STATUSES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={
                          actionLoading ||
                          selectedSubmission.status === item.value
                        }
                        onClick={() =>
                          updateStatus(
                            selectedSubmission._id,
                            item.value
                          )
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          selectedSubmission.status === item.value
                            ? "border-slate-200 bg-slate-200 text-slate-500"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#E25238] hover:text-[#E25238]"
                        }`}
                      >
                        {actionLoading &&
                        selectedSubmission.status !== item.value
                          ? item.label
                          : item.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      disabled={actionLoading}
                      className="rounded-xl bg-[#202938] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#303d50] disabled:opacity-50"
                    >
                      Close
                    </button>
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

export default AllSelfAssessmentSubmissions;
