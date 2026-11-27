import mongoose from "mongoose";
import fs from "node:fs/promises";
import FeaturedCompanyHighlight from "../models/FeaturedCompanyHighlight.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const folder = "AIA-Project-Assets/Featured-Highlights";
const trim = (value) => typeof value === "string" ? value.trim() : "";
const invalid = (message) => Object.assign(new Error(message), { status: 400 });

async function removeImage(publicId) {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
    if (!["ok", "not found"].includes(result.result)) {
      console.error("Featured banner cleanup:", publicId, result.result);
    }
  } catch (error) {
    console.error("Featured banner cleanup:", publicId, error.message);
  }
}

function getFields(body) {
  const name = trim(body.name);
  const headline = trim(body.headline);
  const description = trim(body.description);
  const bannerAlt = trim(body.bannerAlt);
  const linkUrl = trim(body.linkUrl);
  const order = Number(body.order ?? 0);
  const lane = body.lane || "left";
  if (!name || name.length > 100) throw invalid("Company name is required and must be at most 100 characters.");
  if (headline.length > 160 || description.length > 500 || bannerAlt.length > 180) throw invalid("A text field exceeds its length limit.");
  if (!["left", "right"].includes(lane) || !Number.isSafeInteger(order) || order < 0) throw invalid("Choose a slider and enter a valid display order.");
  if (linkUrl) {
    try {
      if (!["http:", "https:"].includes(new URL(linkUrl).protocol)) throw new Error();
    } catch {
      throw invalid("Know More URL must be an absolute HTTP or HTTPS link.");
    }
  }
  return { name, headline, description, bannerAlt, linkUrl, order, lane, isActive: body.isActive !== false && body.isActive !== "false" };
}

async function list(res, next, filter) {
  try {
    const items = await FeaturedCompanyHighlight.find(filter).sort({ order: 1, _id: 1 }).lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

export const getPublicHighlights = (_req, res, next) => list(res, next, { isActive: true });
export const getAdminHighlights = (_req, res, next) => list(res, next, {});

export async function saveHighlight(req, res, next) {
  let uploaded;
  let saved = false;
  try {
    const { id } = req.params;
    if (id && !mongoose.isValidObjectId(id)) throw invalid("Invalid highlight ID.");
    const item = id
      ? await FeaturedCompanyHighlight.findById(id).select("+bannerPublicId")
      : new FeaturedCompanyHighlight();
    if (!item) return res.status(404).json({ message: "Highlight not found." });
    if (!id && !req.file) throw invalid("Upload a banner image.");
    const fields = getFields(req.body || {});
    const oldId = item.bannerPublicId;
    item.set(fields);
    if (req.file) {
      uploaded = await uploadToCloudinary(req.file.path, folder);
      item.set({ bannerUrl: uploaded.url, bannerPublicId: uploaded.publicId });
    }
    await item.save();
    saved = true;
    if (uploaded && oldId !== uploaded.publicId) await removeImage(oldId);
    const { bannerPublicId, ...data } = item.toObject();
    return res.status(id ? 200 : 201).json({ item: data });
  } catch (error) {
    if (!saved && uploaded) await removeImage(uploaded.publicId);
    if (["VersionError", "DocumentNotFoundError"].includes(error.name)) {
      return res.status(409).json({ message: "This highlight changed. Reload and try again." });
    }
    if (error.status === 400 || error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  } finally {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
  }
}

export async function deleteHighlight(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw invalid("Invalid highlight ID.");
    const item = await FeaturedCompanyHighlight.findByIdAndDelete(req.params.id).select("+bannerPublicId");
    if (!item) return res.status(404).json({ message: "Highlight not found." });
    await removeImage(item.bannerPublicId);
    return res.json({ success: true });
  } catch (error) {
    if (error.status === 400) return res.status(400).json({ message: error.message });
    next(error);
  }
}
