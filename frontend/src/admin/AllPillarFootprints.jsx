
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  GripVertical,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("aia_admin_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const EMPTY_FORM = {
  title: "",
  description: "",
  isHighlighted: false,
  order: 0,
  isActive: true,
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const getResponseData = (response) => {
  const data = response?.data?.data;
  return Array.isArray(data) ? data : [];
};

export default function AllPillarFootprints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [imageFile, setImageFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [existingBrochure, setExistingBrochure] = useState(false);
  const [existingBrochureName, setExistingBrochureName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------
  // FETCH ALL PILLAR FOOTPRINTS
  // -----------------------------------------
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/pillar-footprints");

      setItems(getResponseData(response));
    } catch (err) {
      console.error("Fetch pillar footprints error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // -----------------------------------------
  // CLEANUP IMAGE PREVIEW URL
  // -----------------------------------------
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // -----------------------------------------
  // RESET FORM
  // -----------------------------------------
  const resetForm = () => {
    setFormData({
      ...EMPTY_FORM,
      order: items.length,
    });

    setImageFile(null);
    setBrochureFile(null);
    setImagePreview("");
    setExistingBrochure(false);
    setExistingBrochureName("");
    setEditingId(null);
    setError("");
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  // -----------------------------------------
  // OPEN ADD FORM
  // -----------------------------------------
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // -----------------------------------------
  // INPUT CHANGE
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------------------
  // IMAGE SELECT
  // -----------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // -----------------------------------------
  // BROCHURE PDF SELECT
  // -----------------------------------------
  const handleBrochureChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("PDF size must be less than 20MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setBrochureFile(file);
  };

  // -----------------------------------------
  // EDIT PILLAR
  // -----------------------------------------
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      isHighlighted: Boolean(item.isHighlighted),
      order: item.order ?? 0,
      isActive: item.isActive !== false,
    });

    setImageFile(null);
    setBrochureFile(null);
    setImagePreview(item.imageUrl || "");

    setExistingBrochure(Boolean(item.hasBrochure));
    setExistingBrochureName(item.brochureFileName || "");

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // -----------------------------------------
  // SAVE / UPDATE PILLAR
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter pillar title.");
      return;
    }

    if (formData.title.trim().length > 60) {
      setError("Title cannot exceed 60 characters.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter pillar description.");
      return;
    }

    if (formData.description.trim().length > 300) {
      setError("Description cannot exceed 300 characters.");
      return;
    }

    if (!editingId && !imageFile) {
      setError("Please upload a pillar image.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append(
        "isHighlighted",
        String(formData.isHighlighted)
      );
      payload.append("order", String(Number(formData.order) || 0));
      payload.append("isActive", String(formData.isActive));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (brochureFile) {
        payload.append("brochurePdf", brochureFile);
      }

      if (editingId) {
        await api.put(`/pillar-footprints/${editingId}`, payload);
        setSuccess("Pillar footprint updated successfully.");
      } else {
        await api.post("/pillar-footprints", payload);
        setSuccess("Pillar footprint created successfully.");
      }

      setShowForm(false);
      resetForm();

      await fetchItems();
    } catch (err) {
      console.error("Save pillar footprint error:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // DELETE PILLAR
  // -----------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pillar footprint? Its uploaded image and brochure will also be removed from Cloudinary."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/pillar-footprints/${id}`);

      setSuccess("Pillar footprint deleted successfully.");

      await fetchItems();
    } catch (err) {
      console.error("Delete pillar footprint error:", err);
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------------------
  // FILTER ITEMS
  // -----------------------------------------
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && item.isActive !== false) ||
      (filterStatus === "inactive" && item.isActive === false);

    return matchesSearch && matchesStatus;
  });

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E52B18]">
              AIA Website CMS
            </p>

            <h1 className="text-2xl font-bold text-[#17202B] sm:text-3xl">
              All Pillar Footprints
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage pillar content, images and brochure PDFs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchItems}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E52B18] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C92313]"
            >
              <Plus size={18} />
              Add New Pillar
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && !showForm && (
          <div className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && !showForm && (
          <div className="mb-5 flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Pillars</p>
            <h3 className="mt-2 text-3xl font-bold text-[#17202B]">
              {items.length}
            </h3>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Active Pillars</p>
            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {items.filter((item) => item.isActive !== false).length}
            </h3>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Brochures Uploaded</p>
            <h3 className="mt-2 text-3xl font-bold text-[#E52B18]">
              {items.filter((item) => item.hasBrochure).length}
            </h3>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-6 flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pillar by title or description..."
              className="w-full rounded-md border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#E52B18]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#E52B18]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* PILLAR LIST */}
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-bold text-[#17202B]">
              Pillar Footprints
            </h2>

            <span className="text-xs text-gray-500">
              {filteredItems.length} records
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#E52B18]" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
              <ImageIcon size={42} className="mb-4 text-gray-300" />

              <h3 className="font-semibold text-gray-700">
                No pillar footprints found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add a new pillar or change your search filters.
              </p>

              {items.length === 0 && (
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="mt-5 rounded-md bg-[#E52B18] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C92313]"
                >
                  Add First Pillar
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-gray-50/70 lg:flex-row lg:items-center"
                >
                  {/* IMAGE */}
                  <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-md bg-gray-100 sm:w-[190px]">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon
                          size={35}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                    <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
                      ORDER: {item.order ?? index}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#17202B]">
                        {item.title}
                      </h3>

                      {item.isHighlighted && (
                        <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase text-orange-600">
                          <Star size={11} />
                          Featured
                        </span>
                      )}

                      {item.isActive === false ? (
                        <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-500">
                          Inactive
                        </span>
                      ) : (
                        <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-bold uppercase text-green-600">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
                        <ImageIcon size={15} />
                        Image uploaded
                      </span>

                      {item.hasBrochure ? (
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-green-600">
                          <FileText size={15} />
                          {item.brochureFileName || "PDF uploaded"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-400">
                          <FileText size={15} />
                          No brochure
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 items-center gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      title="Edit pillar"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      title="Delete pillar"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === item._id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ========================================= */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="my-auto w-full max-w-[750px] overflow-hidden rounded-md bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-xl font-bold text-[#17202B]">
                  {editingId ? "Edit Pillar Footprint" : "Add New Pillar"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Manage pillar details, image and brochure PDF.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="max-h-[calc(100vh-180px)] space-y-6 overflow-y-auto p-5 sm:p-7">

                {error && (
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17202B]">
                    Pillar Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={60}
                    required
                    placeholder="Enter pillar title"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.title.length}/60
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17202B]">
                    Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={300}
                    rows={4}
                    required
                    placeholder="Enter pillar description"
                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E52B18] focus:ring-1 focus:ring-[#E52B18]"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.description.length}/300
                  </p>
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17202B]">
                    Pillar Image{" "}
                    {!editingId && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>

                  <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#E52B18] hover:bg-red-50/30">
                    {imagePreview ? (
                      <div className="relative h-[190px] w-full">
                        <img
                          src={imagePreview}
                          alt="Pillar preview"
                          className="h-full w-full object-contain"
                        />

                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                          Change Image
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload size={30} className="mb-3 text-gray-400" />

                        <span className="text-sm font-semibold text-gray-700">
                          Click to upload image
                        </span>

                        <span className="mt-2 text-xs text-gray-400">
                          JPG, PNG, WEBP (Maximum 5MB)
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <p className="mt-2 text-xs text-green-600">
                      Selected: {imageFile.name}
                    </p>
                  )}

                  {editingId && !imageFile && (
                    <p className="mt-2 text-xs text-gray-400">
                      Leave unchanged to keep the existing image.
                    </p>
                  )}
                </div>

                {/* PDF UPLOAD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17202B]">
                    Brochure PDF
                  </label>

                  <label className="flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-[#E52B18] hover:bg-red-50/30">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-50 text-[#E52B18]">
                      <FileText size={25} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-700">
                        {brochureFile
                          ? brochureFile.name
                          : existingBrochure
                          ? existingBrochureName || "Existing brochure PDF"
                          : "Upload brochure PDF"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        PDF format only · Maximum 20MB
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600">
                      Browse
                    </span>

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleBrochureChange}
                      className="hidden"
                    />
                  </label>

                  {brochureFile && (
                    <p className="mt-2 text-xs text-green-600">
                      New PDF selected: {brochureFile.name}
                    </p>
                  )}

                  {editingId && existingBrochure && !brochureFile && (
                    <p className="mt-2 text-xs text-gray-400">
                      Existing brochure will remain unchanged unless you
                      upload a replacement.
                    </p>
                  )}

                  {!editingId && (
                    <p className="mt-2 text-xs text-gray-400">
                      Brochure is optional. You can upload it now or later.
                    </p>
                  )}
                </div>

                {/* ORDER */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17202B]">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E52B18]"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Lower numbers appear first.
                  </p>
                </div>

                {/* CHECKBOXES */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-4 transition hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="isHighlighted"
                      checked={formData.isHighlighted}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#E52B18]"
                    />

                    <div>
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#17202B]">
                        <Star size={15} className="text-orange-500" />
                        Featured Pillar
                      </span>

                      <p className="mt-1 text-xs text-gray-400">
                        Highlight this pillar on the website.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-4 transition hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#E52B18]"
                    />

                    <div>
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#17202B]">
                        {formData.isActive ? (
                          <Eye size={15} className="text-green-600" />
                        ) : (
                          <EyeOff size={15} className="text-gray-400" />
                        )}
                        Active Status
                      </span>

                      <p className="mt-1 text-xs text-gray-400">
                        Show or hide this pillar on the website.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* FORM FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E52B18] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#C92313] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      {editingId ? "Update Pillar" : "Save Pillar"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
