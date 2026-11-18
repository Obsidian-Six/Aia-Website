
import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  RefreshCw,
  AudioLines,
  Save,
  Play,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () =>
  sessionStorage.getItem("aia_admin_token") ||
  localStorage.getItem("aia_admin_token") ||
  localStorage.getItem("token") ||
  localStorage.getItem("adminToken");

const getAudioUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "";

  return `${base}${url}`;
};

export default function AllConversations({ onNavigate }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  const headers = useCallback(() => {
    const token = getToken();

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/conversations/admin`, {
        headers: headers(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load conversations.");
      }

      setConversations(result.data || []);
      setHasOrderChanges(false);
    } catch (err) {
      setError(err.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleDelete = async (conversation) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${conversation.title}"? The uploaded audio file will also be deleted.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/conversations/admin/${conversation._id}`,
        {
          method: "DELETE",
          headers: headers(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete conversation.");
      }

      setConversations((prev) =>
        prev.filter((item) => item._id !== conversation._id)
      );
      setHasOrderChanges(true);
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDrop = (targetId) => {
    if (!draggedId || draggedId === targetId) return;

    setConversations((prev) => {
      const updated = [...prev];

      const fromIndex = updated.findIndex(
        (item) => item._id === draggedId
      );

      const toIndex = updated.findIndex(
        (item) => item._id === targetId
      );

      if (fromIndex === -1 || toIndex === -1) return prev;

      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);

      return updated.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
    });

    setDraggedId(null);
    setHasOrderChanges(true);
  };

  const saveOrder = async () => {
    try {
      setSavingOrder(true);
      setError("");

      const response = await fetch(
        `${API_URL}/conversations/admin/reorder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...headers(),
          },
          body: JSON.stringify({
            items: conversations.map((item, index) => ({
              id: item._id,
              order: index + 1,
            })),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save order.");
      }

      setConversations((prev) =>
        prev.map((item, index) => ({
          ...item,
          order: index + 1,
        }))
      );

      setHasOrderChanges(false);
      window.alert("Conversation order updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update order.");
    } finally {
      setSavingOrder(false);
    }
  };

  const editConversation = (conversation) => {
    onNavigate?.("add-conversation", conversation);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            All Conversations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage audio episodes, editorial content and display order.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchConversations}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.("add-conversation")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E25238] px-5 py-3 text-xs font-bold text-white hover:bg-[#c9442d]"
          >
            <Plus size={16} />
            Add Conversation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Episodes</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {conversations.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-black text-green-600">
            {conversations.filter((item) => item.status === "published").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Drafts</p>
          <p className="mt-2 text-3xl font-black text-amber-500">
            {conversations.filter((item) => item.status === "draft").length}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {hasOrderChanges && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-800">
            Display order changed. Save to apply it on the website.
          </p>

          <button
            type="button"
            onClick={saveOrder}
            disabled={savingOrder}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E25238] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
          >
            <Save size={15} />
            {savingOrder ? "Saving..." : "Save Order"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading conversations...
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <AudioLines className="mx-auto mb-3 text-slate-300" size={36} />
          <h3 className="font-bold text-slate-800">
            No conversations added yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first member expert conversation.
          </p>
          <button
            type="button"
            onClick={() => onNavigate?.("add-conversation")}
            className="mt-5 rounded-xl bg-[#E25238] px-5 py-3 text-xs font-bold text-white"
          >
            Add First Conversation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((item, index) => (
            <article
              key={item._id}
              draggable
              onDragStart={() => handleDragStart(item._id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item._id)}
              onDragEnd={() => setDraggedId(null)}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                draggedId === item._id
                  ? "border-[#E25238] opacity-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className="flex shrink-0 cursor-grab items-center gap-3 text-slate-400 active:cursor-grabbing"
                  title="Drag to change order"
                >
                  <GripVertical size={20} />
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
                    {index + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        item.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.expertName || "Expert not specified"}
                    {item.expertDesignation
                      ? ` • ${item.expertDesignation}`
                      : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-[11px] font-semibold text-[#C84C36]">
                      {item.industryVertical}
                    </span>

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
                      Order: {item.order}
                    </span>
                  </div>

                  {item.shortDescription && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.shortDescription}
                    </p>
                  )}

                  {item.audioUrl && (
                    <div className="mt-4 flex items-center gap-2">
                      <Play size={15} className="shrink-0 text-[#E25238]" />
                      <audio
                        controls
                        preload="none"
                        className="h-9 w-full max-w-md"
                      >
                        <source src={getAudioUrl(item.audioUrl)} />
                      </audio>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => editConversation(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-[#E25238] hover:text-[#E25238]"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
