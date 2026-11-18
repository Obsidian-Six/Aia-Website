
import React, { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  FileText,
  X,
} from "lucide-react";

import { createPillarFootprint } from "../services/api";

export default function AddPillarFootprint({
  onFootprintAdded,
  onNavigate,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [selectedPdf, setSelectedPdf] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const MAX_TITLE_LEN = 60;
  const MAX_DESC_LEN = 220;
  const MAX_PDF_SIZE = 20 * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must not exceed 5 MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleImageChange = (e) => {
    selectImage(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    selectImage(e.dataTransfer.files?.[0]);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMsg("Please select a valid PDF file.");
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setErrorMsg("PDF size must not exceed 20 MB.");
      return;
    }

    setSelectedPdf(file);
    setErrorMsg("");
  };

  const removeImage = () => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg("Pillar title is required.");
      return;
    }

    if (title.trim().length > MAX_TITLE_LEN) {
      setErrorMsg(`Title cannot exceed ${MAX_TITLE_LEN} characters.`);
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Pillar description is required.");
      return;
    }

    if (description.trim().length > MAX_DESC_LEN) {
      setErrorMsg(
        `Description cannot exceed ${MAX_DESC_LEN} characters.`
      );
      return;
    }

    if (!selectedImage) {
      setErrorMsg("Please upload a pillar footprint image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("isHighlighted", String(isHighlighted));
    formData.append("isActive", "true");
    formData.append("image", selectedImage);

    if (selectedPdf) {
      formData.append("brochurePdf", selectedPdf);
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await createPillarFootprint(formData);

      setSuccessMsg(
        "Pillar Footprint created successfully! Files uploaded to Cloudinary."
      );

      setTitle("");
      setDescription("");
      setIsHighlighted(false);
      setSelectedImage(null);
      setSelectedPdf(null);
      removeImage();

      onFootprintAdded?.();
    } catch (err) {
      console.error(err);

      setErrorMsg(
        err.response?.data?.message ||
          "Failed to save pillar footprint."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      <div className="text-center pb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
          Add Pillar Footprint
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Add cards displayed under Our 3 Pillars Footprint.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* IMAGE UPLOAD */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#F4F8FF] px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-blue-600" />

              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Pillar Image
                </h3>
                <p className="text-[10px] text-gray-400">
                  JPG, PNG, WEBP or GIF · Max 5 MB
                </p>
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition min-h-[220px] flex items-center justify-center"
            >
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full rounded-xl overflow-hidden h-56 bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Pillar preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <UploadCloud className="w-10 h-10 text-blue-600 mx-auto" />

                  <p className="text-sm text-gray-700 font-semibold">
                    Drop image here or{" "}
                    <span className="text-blue-600 underline">
                      browse
                    </span>
                  </p>

                  <p className="text-xs text-gray-400">
                    Image will be uploaded to Cloudinary.
                  </p>
                </div>
              )}
            </div>

            {/* PDF UPLOAD */}
            <div className="bg-[#FFF7F5] px-4 py-3 rounded-xl border border-orange-100 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#E25238]" />

              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Pillar Brochure PDF
                </h3>

                <p className="text-[10px] text-gray-400">
                  PDF only · Max 20 MB · Optional
                </p>
              </div>
            </div>

            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePdfChange}
              className="hidden"
            />

            {selectedPdf ? (
              <div className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-8 h-8 text-red-500 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {selectedPdf.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(selectedPdf.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center gap-2 hover:border-[#E25238] hover:bg-orange-50/30 transition"
              >
                <UploadCloud className="w-7 h-7 text-[#E25238]" />

                <span className="text-sm font-semibold text-gray-700">
                  Upload Brochure PDF
                </span>

                <span className="text-xs text-gray-400">
                  Select a PDF from your device
                </span>
              </button>
            )}
          </div>

          {/* FORM FIELDS */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Pillar Title
                </label>

                <span className="text-[11px] text-gray-400">
                  {title.length}/{MAX_TITLE_LEN}
                </span>
              </div>

              <input
                type="text"
                maxLength={MAX_TITLE_LEN}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Knowledge infrastructure"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Description
                </label>

                <span className="text-[11px] text-gray-400">
                  {description.length}/{MAX_DESC_LEN}
                </span>
              </div>

              <textarea
                rows={4}
                maxLength={MAX_DESC_LEN}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter pillar description..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isHighlighted"
                checked={isHighlighted}
                onChange={(e) => setIsHighlighted(e.target.checked)}
                className="w-4 h-4 rounded text-red-500"
              />

              <label
                htmlFor="isHighlighted"
                className="text-xs text-gray-700 font-semibold cursor-pointer"
              >
                Highlight Card
              </label>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading to Cloudinary...
                  </span>
                ) : (
                  "Submit Pillar Footprint"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
