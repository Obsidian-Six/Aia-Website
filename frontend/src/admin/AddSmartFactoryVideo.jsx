
import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, Youtube, Image as ImageIcon } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const getToken = () =>
  sessionStorage.getItem("aia_admin_token") ||
  localStorage.getItem("aia_admin_token") ||
  "";

const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      ![
        "youtube.com",
        "m.youtube.com",
        "youtube-nocookie.com",
      ].includes(host)
    ) {
      return "";
    }

    if (parsed.pathname === "/watch") {
      return parsed.searchParams.get("v") || "";
    }

    return (
      parsed.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/)?.[2] || ""
    );
  } catch {
    return "";
  }
};

const initialForm = {
  title: "",
  description: "",
  youtubeUrl: "",
  thumbnailUrl: "",
  isActive: true,
  order: 0,
};

export default function AddSmartFactoryVideo({
  onNavigate,
  videoToEdit,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEdit = Boolean(videoToEdit?._id);
  const videoId = getYouTubeId(form.youtubeUrl);
  const previewThumbnail =
    form.thumbnailUrl.trim() ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "");

  useEffect(() => {
    if (videoToEdit) {
      setForm({
        title: videoToEdit.title || "",
        description: videoToEdit.description || "",
        youtubeUrl: videoToEdit.youtubeUrl || "",
        thumbnailUrl: videoToEdit.thumbnailUrl || videoToEdit.thumbnail || "",
        isActive: videoToEdit.isActive !== false,
        order: videoToEdit.order ?? 0,
      });
    } else {
      setForm(initialForm);
    }

    setError("");
    setSuccess("");
  }, [videoToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter a video title.");
      return;
    }

    if (!form.youtubeUrl.trim() || !videoId || videoId.length !== 11) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(
        isEdit
          ? `${API_URL}/smart-factory-videos/admin/${videoToEdit._id}`
          : `${API_URL}/smart-factory-videos/admin`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...form,
            order: Number(form.order) || 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong.");
      }

      setSuccess(
        isEdit
          ? "Video updated successfully."
          : "Video added successfully."
      );

      if (!isEdit) {
        setForm(initialForm);
      }
    } catch (err) {
      setError(err.message || "Unable to save video.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black";

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate?.("all-smart-factory-videos")}
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to all videos
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Edit Smart Factory Video" : "Add Smart Factory Video"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage YouTube videos displayed in the Explore Smart Factory popup.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]"
      >
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Video Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              YouTube Video URL *
            </label>
            <div className="relative">
              <Youtube
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600"
              />
              <input
                name="youtubeUrl"
                type="url"
                value={form.youtubeUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`${inputClass} pl-10`}
                required
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Supports YouTube watch, youtu.be, embed, shorts and live links.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter video description"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Custom Thumbnail URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="thumbnailUrl"
                type="url"
                value={form.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://example.com/thumbnail.jpg"
                className={`${inputClass} pl-10`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Leave empty to use the default YouTube thumbnail.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Display Order
            </label>
            <input
              name="order"
              type="number"
              min="0"
              value={form.order}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 accent-black"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Active Video
              </span>
              <span className="block text-xs text-gray-500">
                Active videos will be visible in the website popup.
              </span>
            </span>
          </label>

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Video"
                  : "Save Video"}
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("all-smart-factory-videos")}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Thumbnail Preview
          </h2>

          {previewThumbnail ? (
            <img
              src={previewThumbnail}
              alt="Video thumbnail preview"
              className="aspect-video w-full rounded-lg bg-gray-100 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
              Add a YouTube URL to preview thumbnail
            </div>
          )}

          <p className="mt-3 break-words text-sm font-medium text-gray-800">
            {form.title || "Your video title"}
          </p>

          <p className="mt-2 line-clamp-4 text-xs text-gray-500">
            {form.description || "Your video description will appear here."}
          </p>
        </div>
      </form>
    </div>
  );
}
