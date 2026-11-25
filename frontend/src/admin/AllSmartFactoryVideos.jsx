
import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Youtube,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const getToken = () =>
  sessionStorage.getItem("aia_admin_token") ||
  localStorage.getItem("aia_admin_token") ||
  "";

export default function AllSmartFactoryVideos({ onNavigate }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/smart-factory-videos/admin`,
        {
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch videos.");
      }

      setVideos(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleEdit = (video) => {
    onNavigate?.("add-smart-factory-video", video);
  };

  const handleToggleStatus = async (video) => {
    try {
      setActionId(video._id);

      const response = await fetch(
        `${API_URL}/smart-factory-videos/admin/${video._id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            isActive: !video.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update status.");
      }

      setVideos((prev) =>
        prev.map((item) =>
          item._id === video._id
            ? { ...item, isActive: !video.isActive }
            : item
        )
      );
    } catch (err) {
      alert(err.message || "Unable to update video status.");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (video) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${video.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(video._id);

      const response = await fetch(
        `${API_URL}/smart-factory-videos/admin/${video._id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete video.");
      }

      setVideos((prev) =>
        prev.filter((item) => item._id !== video._id)
      );
    } catch (err) {
      alert(err.message || "Unable to delete video.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Smart Factory Videos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage YouTube videos shown in the Explore Smart Factory popup.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchVideos}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.("add-smart-factory-video")}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={17} />
            Add Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Videos</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {videos.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active Videos</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            {videos.filter((video) => video.isActive).length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Inactive Videos</p>
          <p className="mt-2 text-2xl font-semibold text-gray-500">
            {videos.filter((video) => !video.isActive).length}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={fetchVideos}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
          Loading Smart Factory videos...
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <Youtube size={36} className="mx-auto text-gray-300" />
          <h3 className="mt-4 font-semibold text-gray-800">
            No videos added yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first YouTube video to display it in the website popup.
          </p>
          <button
            type="button"
            onClick={() => onNavigate?.("add-smart-factory-video")}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm text-white"
          >
            Add First Video
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="w-full shrink-0 sm:w-44">
                  <img
                    src={
                      video.thumbnailUrl ||
                      video.thumbnail ||
                      ""
                    }
                    alt={video.title}
                    className="aspect-video w-full rounded-lg bg-gray-100 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {video.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        video.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {video.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {video.description || "No description added."}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>Order: {video.order ?? 0}</span>

                    {video.youtubeUrl && (
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink size={13} />
                        Open YouTube
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={actionId === video._id}
                    onClick={() => handleToggleStatus(video)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                      video.isActive
                        ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {video.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(video)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={actionId === video._id}
                    onClick={() => handleDelete(video)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            Showing {videos.length} video{videos.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
    </div>
  );
}
