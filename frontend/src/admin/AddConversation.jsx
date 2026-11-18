
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  AudioLines,
  Upload,
  Save,
  X,
  FileAudio,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () =>
  sessionStorage.getItem("aia_admin_token") ||
  localStorage.getItem("aia_admin_token") ||
  localStorage.getItem("token") ||
  localStorage.getItem("adminToken");

const verticals = [
  "EV-driven Automation",
  "OT Cybersecurity",
  "SME Adoption",
  "Open Architectures",
  "Skilling",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#E25238] focus:ring-2 focus:ring-[#E25238]/10";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600";

const getAudioUrl = (audioUrl) => {
  if (!audioUrl) return "";

  if (audioUrl.startsWith("http")) return audioUrl;

  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "";

  return `${baseUrl}${audioUrl}`;
};

const initialForm = {
  title: "",
  expertName: "",
  expertDesignation: "",
  shortDescription: "",
  industryVertical: "",
  recap: "",
  keyTakeaways: "",
  pullQuotes: "",
  memberInsights: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  status: "published",
  order: 0,
  thumbnail: "",
};

export default function AddConversation({
  onNavigate,
  conversationToEdit,
  onConversationSaved,
}) {
  const isEditing = Boolean(conversationToEdit);

  const [form, setForm] = useState(initialForm);
  const [audio, setAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!conversationToEdit) {
      setForm(initialForm);
      setAudio(null);
      setAudioPreview("");
      return;
    }

    setForm({
      title: conversationToEdit.title || "",
      expertName: conversationToEdit.expertName || "",
      expertDesignation: conversationToEdit.expertDesignation || "",
      shortDescription: conversationToEdit.shortDescription || "",
      industryVertical: conversationToEdit.industryVertical || "",
      recap: conversationToEdit.recap || "",
      keyTakeaways: (conversationToEdit.keyTakeaways || []).join("\n"),
      pullQuotes: (conversationToEdit.pullQuotes || []).join("\n"),
      memberInsights: conversationToEdit.memberInsights || "",
      publishedAt: conversationToEdit.publishedAt
        ? new Date(conversationToEdit.publishedAt)
            .toISOString()
            .slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      status: conversationToEdit.status || "published",
      order: conversationToEdit.order ?? 0,
      thumbnail: conversationToEdit.thumbnail || "",
    });

    setAudio(null);
    setAudioPreview(getAudioUrl(conversationToEdit.audioUrl));
  }, [conversationToEdit]);

  const updateField = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [
      ".mp3",
      ".wav",
      ".m4a",
      ".aac",
      ".ogg",
      ".webm",
    ];

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError("Please select a supported audio file.");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Audio file must be smaller than 100 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setAudio(file);

    setAudioPreview((previous) => {
      if (previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (audioPreview.startsWith("blob:")) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isEditing && !audio) {
      setError("Please select an audio file.");
      return;
    }

    if (!form.title.trim() || !form.industryVertical) {
      setError("Title and Industry Vertical are required.");
      return;
    }

    if (!form.status) {
      setError("Please select a publication status.");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, String(value ?? ""));
    });

    // Explicitly send the selected publication status.
    data.set("status", form.status);
    data.set("order", String(Number(form.order) || 0));

    if (audio) {
      data.append("audio", audio);
    }

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        isEditing
          ? `${API_URL}/conversations/admin/${conversationToEdit._id}`
          : `${API_URL}/conversations/admin`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save conversation."
        );
      }

      setSuccess(
        result.message ||
          (form.status === "published"
            ? "Conversation published successfully."
            : "Conversation saved successfully.")
      );

      if (onConversationSaved) {
        onConversationSaved();
      }

      if (onNavigate) {
        setTimeout(() => {
          onNavigate("all-conversations");
        }, 700);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate?.("all-conversations")}
            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#E25238]"
          >
            <ArrowLeft size={15} />
            Back to Conversations
          </button>

          <h2 className="text-2xl font-black text-slate-900">
            {isEditing ? "Edit Conversation" : "Add Conversation"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload member expert audio and manage episode information.
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-[#E25238]">
          AIA Conversations
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E25238]">
              <AudioLines size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Episode Information
              </h3>
              <p className="text-xs text-slate-500">
                Basic details displayed on the conversation card.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Episode Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                className={inputClass}
                placeholder="Enter conversation title"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Expert Name</label>
              <input
                name="expertName"
                value={form.expertName}
                onChange={updateField}
                className={inputClass}
                placeholder="Expert name"
              />
            </div>

            <div>
              <label className={labelClass}>Expert Designation</label>
              <input
                name="expertDesignation"
                value={form.expertDesignation}
                onChange={updateField}
                className={inputClass}
                placeholder="Designation / Organisation"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Industry Vertical *</label>
              <select
                name="industryVertical"
                value={form.industryVertical}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">Select Industry Vertical</option>
                {verticals.map((vertical) => (
                  <option key={vertical} value={vertical}>
                    {vertical}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Short Description</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={updateField}
                rows={3}
                className={inputClass}
                placeholder="Short introduction for the episode card..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Thumbnail Image URL</label>
              <input
                name="thumbnail"
                value={form.thumbnail}
                onChange={updateField}
                className={inputClass}
                placeholder="Optional image URL"
              />
              <p className="mt-1 text-xs text-slate-400">
                Optional. You can use an existing website image URL.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="mb-2 font-bold text-slate-900">Audio File</h3>

          <p className="mb-5 text-xs text-slate-500">
            Upload MP3, WAV, M4A, AAC, OGG or WEBM. Maximum 100 MB.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center transition hover:border-[#E25238] hover:bg-orange-50/30">
            <Upload className="mb-3 text-[#E25238]" size={28} />

            <span className="text-sm font-bold text-slate-800">
              {audio ? audio.name : "Click to upload audio"}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              {audio
                ? `${(audio.size / (1024 * 1024)).toFixed(2)} MB`
                : "Select an audio file from your device"}
            </span>

            <input
              type="file"
              accept=".mp3,.wav,.m4a,.aac,.ogg,.webm,audio/*"
              onChange={handleAudioChange}
              className="hidden"
            />
          </label>

          {audioPreview && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileAudio size={16} className="text-[#E25238]" />
                Audio Preview

                {audio && (
                  <button
                    type="button"
                    onClick={() => {
                      setAudio(null);
                      setAudioPreview(
                        getAudioUrl(conversationToEdit?.audioUrl)
                      );
                    }}
                    className="ml-auto text-red-500"
                  >
                    Remove selected file
                  </button>
                )}
              </div>

              <audio
                controls
                preload="metadata"
                className="w-full"
                key={audioPreview}
              >
                <source src={audioPreview} />
                Your browser does not support audio playback.
              </audio>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="mb-5 font-bold text-slate-900">
            Editorial Content
          </h3>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Written Recap</label>
              <textarea
                name="recap"
                value={form.recap}
                onChange={updateField}
                rows={8}
                className={inputClass}
                placeholder="Write the 300–400 word conversation recap..."
              />
              <p className="mt-1 text-xs text-slate-400">
                Recommended length: 300–400 words.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Key Takeaways (one per line)
              </label>
              <textarea
                name="keyTakeaways"
                value={form.keyTakeaways}
                onChange={updateField}
                rows={4}
                className={inputClass}
                placeholder={"First key takeaway\nSecond key takeaway\nThird key takeaway"}
              />
            </div>

            <div>
              <label className={labelClass}>
                Pull Quotes (one per line)
              </label>
              <textarea
                name="pullQuotes"
                value={form.pullQuotes}
                onChange={updateField}
                rows={4}
                className={inputClass}
                placeholder={"Expert quote one\nExpert quote two"}
              />
            </div>

            <div>
              <label className={labelClass}>
                What This Means for Members
              </label>
              <textarea
                name="memberInsights"
                value={form.memberInsights}
                onChange={updateField}
                rows={4}
                className={inputClass}
                placeholder="Explain the practical implications for AIA members..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="mb-5 font-bold text-slate-900">
            Publishing & Ordering
          </h3>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Publish Date</label>
              <input
                type="date"
                name="publishedAt"
                value={form.publishedAt}
                onChange={updateField}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Display Order</label>
              <input
                type="number"
                name="order"
                min="0"
                value={form.order}
                onChange={updateField}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.("all-conversations")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E25238] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c9442d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Conversation"
                : "Save Conversation"}
          </button>
        </div>
      </form>
    </div>
  );
}
