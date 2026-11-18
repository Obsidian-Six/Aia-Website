
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

import { PillarFootprint } from "../models/PillarFootprint.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { hasBrochureAccess } from "../utils/brochureAccess.js";

const BASE_FOLDER = "AIA-Project-Assets/Pillar-Footprints";

// ==========================================
// HELPERS
// ==========================================

const getUploadedFiles = (req) => ({
  image: req.files?.image?.[0] || null,
  brochurePdf: req.files?.brochurePdf?.[0] || null,
});

const cleanupTempFiles = async (files = []) => {
  await Promise.all(
    files.filter(Boolean).map(async (file) => {
      if (!file.path) return;

      try {
        await fs.unlink(file.path);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Temporary file cleanup:", error.message);
        }
      }
    })
  );
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value === true || value === "true";
};

const deleteCloudinaryAsset = async (
  publicId,
  resourceType = "image",
  deliveryType = "upload"
) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: deliveryType,
      invalidate: true,
    });
  } catch (error) {
    console.error(
      `Cloudinary ${resourceType} deletion failed:`,
      publicId,
      error.message
    );
  }
};

const deletePillarAssets = async (item) => {
  if (!item) return;

  await Promise.all([
    deleteCloudinaryAsset(
      item.imagePublicId,
      "image",
      "upload"
    ),

    deleteCloudinaryAsset(
      item.brochurePublicId,
      "raw",
      "authenticated"
    ),
  ]);
};

// ==========================================
// IMAGE UPLOAD
// ==========================================

const uploadPillarImage = async (file) => {
  if (!file) return null;

  return uploadToCloudinary(
    file.path,
    `${BASE_FOLDER}/Images`
  );
};

// ==========================================
// PRIVATE PDF UPLOAD
// ==========================================

const uploadPillarPdf = async (file) => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    type: "authenticated",
    folder: `${BASE_FOLDER}/Brochures`,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    access_mode: "authenticated",
  });

  return {
    publicId: result.public_id,
    fileName: path.basename(file.originalname),
  };
};

// ==========================================
// PUBLIC GET
// ==========================================

export const getPillarFootprints = async (_req, res) => {
  try {
    const items = await PillarFootprint.find({
      isActive: { $ne: false },
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const safeItems = items.map((item) => ({
      ...item,

      // Never expose a Cloudinary PDF URL.
      brochureUrl: "",

      hasBrochure: Boolean(
        item.brochurePublicId || item.hasBrochure
      ),
    }));

    return res.json({
      success: true,
      data: safeItems,
    });
  } catch (error) {
    console.error("Get pillar footprints:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// CREATE
// ==========================================

export const createPillarFootprint = async (req, res) => {
  const files = getUploadedFiles(req);
  const uploadedAssets = [];

  try {
    const {
      title,
      description,
      isHighlighted,
      order,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pillar title is required.",
      });
    }

    if (title.trim().length > 60) {
      return res.status(400).json({
        success: false,
        message: "Title exceeds 60 characters limit.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    if (description.trim().length > 300) {
      return res.status(400).json({
        success: false,
        message: "Description exceeds 300 characters limit.",
      });
    }

    if (!files.image) {
      return res.status(400).json({
        success: false,
        message: "Pillar footprint image is required.",
      });
    }

    const image = await uploadPillarImage(files.image);

    if (image) uploadedAssets.push({
      publicId: image.publicId,
      resourceType: "image",
      deliveryType: "upload",
    });

    let brochure = null;

    if (files.brochurePdf) {
      brochure = await uploadPillarPdf(files.brochurePdf);

      uploadedAssets.push({
        publicId: brochure.publicId,
        resourceType: "raw",
        deliveryType: "authenticated",
      });
    }

    const created = await PillarFootprint.create({
      title: title.trim(),
      description: description.trim(),

      imageUrl: image.url,
      imagePublicId: image.publicId,

      brochureUrl: "",
      brochurePublicId: brochure?.publicId || "",
      brochureFileName: brochure?.fileName || "",
      hasBrochure: Boolean(brochure),

      isHighlighted: parseBoolean(isHighlighted),
      order:
        order !== undefined && order !== ""
          ? Number(order)
          : await PillarFootprint.countDocuments(),

      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Pillar Footprint created successfully.",
      data: created,
    });
  } catch (error) {
    console.error("Create pillar footprint:", error);

    await Promise.all(
      uploadedAssets.map((asset) =>
        deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType,
          asset.deliveryType
        )
      )
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await cleanupTempFiles(Object.values(files));
  }
};

// ==========================================
// UPDATE
// ==========================================

export const updatePillarFootprint = async (req, res) => {
  const files = getUploadedFiles(req);
  const uploadedAssets = [];

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pillar footprint ID.",
      });
    }

    const item = await PillarFootprint.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Pillar footprint not found.",
      });
    }

    const {
      title,
      description,
      isHighlighted,
      order,
      isActive,
      removeBrochure,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Pillar title is required.",
        });
      }

      if (title.trim().length > 60) {
        return res.status(400).json({
          success: false,
          message: "Title exceeds 60 characters limit.",
        });
      }

      item.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description is required.",
        });
      }

      if (description.trim().length > 300) {
        return res.status(400).json({
          success: false,
          message: "Description exceeds 300 characters limit.",
        });
      }

      item.description = description.trim();
    }

    if (isHighlighted !== undefined) {
      item.isHighlighted = parseBoolean(isHighlighted);
    }

    if (order !== undefined && order !== "") {
      item.order = Number(order);
    }

    if (isActive !== undefined) {
      item.isActive = parseBoolean(isActive);
    }

    const oldImagePublicId = item.imagePublicId;
    const oldBrochurePublicId = item.brochurePublicId;

    // Replace image.
    if (files.image) {
      const image = await uploadPillarImage(files.image);

      uploadedAssets.push({
        publicId: image.publicId,
        resourceType: "image",
        deliveryType: "upload",
      });

      item.imageUrl = image.url;
      item.imagePublicId = image.publicId;
    }

    // Replace PDF.
    if (files.brochurePdf) {
      const brochure = await uploadPillarPdf(files.brochurePdf);

      uploadedAssets.push({
        publicId: brochure.publicId,
        resourceType: "raw",
        deliveryType: "authenticated",
      });

      item.brochurePublicId = brochure.publicId;
      item.brochureFileName = brochure.fileName;
      item.hasBrochure = true;
      item.brochureUrl = "";
    } else if (parseBoolean(removeBrochure)) {
      item.brochurePublicId = "";
      item.brochureFileName = "";
      item.hasBrochure = false;
      item.brochureUrl = "";
    }

    await item.save();

    // Delete replaced assets only after database save succeeds.
    if (
      files.image &&
      oldImagePublicId &&
      oldImagePublicId !== item.imagePublicId
    ) {
      await deleteCloudinaryAsset(
        oldImagePublicId,
        "image",
        "upload"
      );
    }

    if (
      (files.brochurePdf || parseBoolean(removeBrochure)) &&
      oldBrochurePublicId &&
      oldBrochurePublicId !== item.brochurePublicId
    ) {
      await deleteCloudinaryAsset(
        oldBrochurePublicId,
        "raw",
        "authenticated"
      );
    }

    return res.json({
      success: true,
      message: "Pillar Footprint updated successfully.",
      data: item,
    });
  } catch (error) {
    console.error("Update pillar footprint:", error);

    await Promise.all(
      uploadedAssets.map((asset) =>
        deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType,
          asset.deliveryType
        )
      )
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await cleanupTempFiles(Object.values(files));
  }
};

// ==========================================
// DELETE
// ==========================================

export const deletePillarFootprint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pillar footprint ID.",
      });
    }

    const item = await PillarFootprint.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Pillar footprint not found.",
      });
    }

    await item.deleteOne();
    await deletePillarAssets(item);

    return res.json({
      success: true,
      message: "Pillar Footprint and its Cloudinary assets deleted successfully.",
    });
  } catch (error) {
    console.error("Delete pillar footprint:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// PROTECTED BROCHURE DOWNLOAD
// ==========================================

export const downloadPillarFootprintBrochure = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pillar Footprint ID.",
      });
    }

    // Check shared brochure access cookie
    if (!hasBrochureAccess(req)) {
      return res.status(401).json({
        success: false,
        requiresEnquiry: true,
        message: "Please submit the brochure enquiry form to download.",
      });
    }

    // Find pillar footprint
    const item = await PillarFootprint.findById(id).select(
      "+brochurePublicId"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Pillar Footprint not found.",
      });
    }

    if (!item.hasBrochure || !item.brochurePublicId) {
      return res.status(404).json({
        success: false,
        message: "Brochure PDF is not available.",
      });
    }

    // Generate authenticated Cloudinary download URL
    const downloadUrl = cloudinary.utils.private_download_url(
      item.brochurePublicId,
      "pdf",
      {
        resource_type: "raw",
        type: "authenticated",
        attachment: true,
      }
    );

    // Download PDF through backend to avoid Cloudinary browser CORS issue
const cloudinaryResponse = await fetch(downloadUrl);

if (!cloudinaryResponse.ok) {
  console.error(
    "Cloudinary PDF download failed:",
    cloudinaryResponse.status,
    await cloudinaryResponse.text()
  );

  return res.status(502).json({
    success: false,
    message: "Unable to retrieve brochure from Cloudinary.",
  });
}

const pdfBuffer = Buffer.from(
  await cloudinaryResponse.arrayBuffer()
);

const fileName =
  item.brochureFileName || `pillar-footprint-${id}.pdf`;

res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename="${fileName.replace(/["\r\n]/g, "_")}"`
);
res.setHeader("Content-Length", pdfBuffer.length);

return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("Pillar Footprint brochure download error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to download brochure. Please try again.",
    });
  }
};
