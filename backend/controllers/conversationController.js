
// import fs from "fs";
// import path from "path";
// import { Conversation } from "../models/Conversation.js";
// import { AUDIO_UPLOAD_DIR } from "../config/audioStorage.js";

// const deleteAudioFile = (audioUrl) => {
//   if (!audioUrl) return;

//   const filename = path.basename(audioUrl);
//   const filePath = path.join(AUDIO_UPLOAD_DIR, filename);

//   // Prevent deleting files outside the audio folder
//   if (path.dirname(filePath) !== path.resolve(AUDIO_UPLOAD_DIR)) {
//     return;
//   }

//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//   }
// };

// const parseArray = (value) => {
//   if (Array.isArray(value)) return value;

//   if (!value) return [];

//   try {
//     const parsed = JSON.parse(value);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return String(value)
//       .split("\n")
//       .map((item) => item.trim())
//       .filter(Boolean);
//   }
// };

// // PUBLIC: Get published conversations
// export const getPublishedConversations = async (req, res) => {
//   try {
//     // Fetch all conversations
//     const allConversations = await Conversation.find()
//       .select("title status industryVertical createdAt")
//       .lean();

//     // Fetch only published conversations
//     const publishedConversations = await Conversation.find({
//       status: "published",
//     })
//       .sort({ order: 1, publishedAt: -1 })
//       .lean();

//     // console.log("========== CONVERSATION DEBUG ==========");
//     // console.log("Total Conversations:", allConversations.length);
//     // console.log("All Conversations:", allConversations);
//     // console.log("Published Conversations:", publishedConversations.length);
//     // console.log("========================================");

//     return res.status(200).json({
//       success: true,
//       totalCount: allConversations.length,
//       publishedCount: publishedConversations.length,
//       allConversations,
//       data: publishedConversations,
//     });
//   } catch (error) {
//     console.error("Get Published Conversations Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch conversations",
//       error: error.message,
//     });
//   }
// };
// // PUBLIC: Get one published conversation
// export const getPublishedConversationBySlug = async (req, res) => {
//   const conversation = await Conversation.findOne({
//     slug: req.params.slug,
//     status: "published",
//   });

//   if (!conversation) {
//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: conversation,
//   });
// };

// // ADMIN: Get all conversations
// export const getAllConversations = async (req, res) => {
//   const conversations = await Conversation.find().sort({
//     order: 1,
//     createdAt: -1,
//   });

//   res.status(200).json({
//     success: true,
//     count: conversations.length,
//     data: conversations,
//   });
// };

// // ADMIN: Create conversation
// export const createConversation = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "Please upload an audio file.",
//     });
//   }

//   try {
//     const {
//       title,
//       slug,
//       expertName,
//       expertDesignation,
//       shortDescription,
//       industryVertical,
//       recap,
//       keyTakeaways,
//       pullQuotes,
//       memberInsights,
//       publishedAt,
//       status,
//       order,
//       thumbnail,
//     } = req.body;

//     if (!title || !industryVertical) {
//       deleteAudioFile(`/uploads/conversations/${req.file.filename}`);

//       return res.status(400).json({
//         success: false,
//         message: "Title and Industry Vertical are required.",
//       });
//     }

//     const audioUrl = `/uploads/conversations/${req.file.filename}`;

//     const conversation = await Conversation.create({
//       title,
//       slug: slug?.trim() || undefined,
//       expertName,
//       expertDesignation,
//       shortDescription,
//       industryVertical,
//       audioUrl,
//       audioOriginalName: req.file.originalname,
//       audioMimeType: req.file.mimetype,
//       audioSize: req.file.size,
//       recap,
//       keyTakeaways: parseArray(keyTakeaways),
//       pullQuotes: parseArray(pullQuotes),
//       memberInsights,
//       publishedAt: publishedAt || Date.now(),
//       status: status || "draft",
//       order: Number(order) || 0,
//       thumbnail,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Conversation created successfully.",
//       data: conversation,
//     });
//   } catch (error) {
//     deleteAudioFile(`/uploads/conversations/${req.file.filename}`);
//     throw error;
//   }
// };

// // ADMIN: Update conversation
// export const updateConversation = async (req, res) => {
//   const conversation = await Conversation.findById(req.params.id);

//   if (!conversation) {
//     if (req.file) {
//       deleteAudioFile(`/uploads/conversations/${req.file.filename}`);
//     }

//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found.",
//     });
//   }

//   const {
//     title,
//     slug,
//     expertName,
//     expertDesignation,
//     shortDescription,
//     industryVertical,
//     recap,
//     keyTakeaways,
//     pullQuotes,
//     memberInsights,
//     publishedAt,
//     status,
//     order,
//     thumbnail,
//   } = req.body;

//   if (title !== undefined) conversation.title = title;
//   if (slug !== undefined) conversation.slug = slug;
//   if (expertName !== undefined) conversation.expertName = expertName;
//   if (expertDesignation !== undefined) {
//     conversation.expertDesignation = expertDesignation;
//   }
//   if (shortDescription !== undefined) {
//     conversation.shortDescription = shortDescription;
//   }
//   if (industryVertical !== undefined) {
//     conversation.industryVertical = industryVertical;
//   }
//   if (recap !== undefined) conversation.recap = recap;
//   if (keyTakeaways !== undefined) {
//     conversation.keyTakeaways = parseArray(keyTakeaways);
//   }
//   if (pullQuotes !== undefined) {
//     conversation.pullQuotes = parseArray(pullQuotes);
//   }
//   if (memberInsights !== undefined) {
//     conversation.memberInsights = memberInsights;
//   }
//   if (publishedAt !== undefined) conversation.publishedAt = publishedAt;
//   if (status !== undefined) conversation.status = status;
//   if (order !== undefined) conversation.order = Number(order) || 0;
//   if (thumbnail !== undefined) conversation.thumbnail = thumbnail;

//   if (req.file) {
//     const oldAudioUrl = conversation.audioUrl;

//     conversation.audioUrl = `/uploads/conversations/${req.file.filename}`;
//     conversation.audioOriginalName = req.file.originalname;
//     conversation.audioMimeType = req.file.mimetype;
//     conversation.audioSize = req.file.size;

//     await conversation.save();

//     deleteAudioFile(oldAudioUrl);

//     return res.status(200).json({
//       success: true,
//       message: "Conversation and audio updated successfully.",
//       data: conversation,
//     });
//   }

//   await conversation.save();

//   res.status(200).json({
//     success: true,
//     message: "Conversation updated successfully.",
//     data: conversation,
//   });
// };

// // ADMIN: Delete conversation
// export const deleteConversation = async (req, res) => {
//   const conversation = await Conversation.findById(req.params.id);

//   if (!conversation) {
//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found.",
//     });
//   }

//   deleteAudioFile(conversation.audioUrl);

//   await conversation.deleteOne();

//   res.status(200).json({
//     success: true,
//     message: "Conversation deleted successfully.",
//   });
// };

// // ADMIN: Update card order
// export const reorderConversations = async (req, res) => {
//   const { items } = req.body;

//   if (!Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide conversation IDs and their order.",
//     });
//   }

//   const operations = items.map((item) => ({
//     updateOne: {
//       filter: { _id: item.id },
//       update: { $set: { order: Number(item.order) } },
//     },
//   }));

//   await Conversation.bulkWrite(operations);

//   res.status(200).json({
//     success: true,
//     message: "Conversation order updated successfully.",
//   });
// };


import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

import { Conversation } from "../models/Conversation.js";
import cloudinary from "../config/cloudinary.js";
import { AUDIO_UPLOAD_DIR } from "../config/audioStorage.js";

const AUDIO_FOLDER = "AIA-Project-Assets/Conversations/Audio";
const SORT_ORDER = { order: 1, publishedAt: -1, createdAt: -1 };

const text = (value) => (typeof value === "string" ? value.trim() : "");

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function toLines(value) {
  const items = Array.isArray(value) ? value : text(value).split(/\r?\n/);
  return items.map(text).filter(Boolean);
}

function readFields(body, current) {
  const fields = {};

  for (const key of [
    "title",
    "expertName",
    "expertDesignation",
    "shortDescription",
    "industryVertical",
    "thumbnail",
    "recap",
    "memberInsights",
  ]) {
    if (body[key] !== undefined || !current) {
      fields[key] = text(body[key]);
    }
  }

  for (const key of ["keyTakeaways", "pullQuotes"]) {
    if (body[key] !== undefined) {
      fields[key] = toLines(body[key]);
    }
  }

  if (!(fields.title ?? current?.title)) {
    throw badRequest("Title is required.");
  }

  if (!(fields.industryVertical ?? current?.industryVertical)) {
    throw badRequest("Industry Vertical is required.");
  }

  if (body.status !== undefined) {
    if (!["draft", "published"].includes(body.status)) {
      throw badRequest("Choose a valid publication status.");
    }
    fields.status = body.status;
  }

  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isSafeInteger(order) || order < 0) {
      throw badRequest("Display order must be a non-negative integer.");
    }
    fields.order = order;
  }

  if (body.publishedAt) {
    const date = new Date(body.publishedAt);
    if (Number.isNaN(date.getTime())) {
      throw badRequest("Choose a valid publication date.");
    }
    fields.publishedAt = date;
  }

  return fields;
}

function slugFromTitle(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function makeUniqueSlug(title) {
  const base = slugFromTitle(title) || `conversation-${Date.now()}`;
  let slug = base;
  let suffix = 2;

  while (await Conversation.exists({ slug })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}

async function uploadAudio(file) {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
    folder: AUDIO_FOLDER,
    overwrite: false,
  });

  return {
    audioUrl: result.secure_url,
    audioPublicId: result.public_id,
    audioOriginalName: file.originalname,
    audioMimeType: file.mimetype,
    audioSize: file.size,
  };
}

async function removeLocalFile(filePath) {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Conversation file cleanup failed:", error.message);
    }
  }
}

async function removeSavedAudio({ audioPublicId, audioUrl } = {}) {
  if (audioPublicId) {
    try {
      const result = await cloudinary.uploader.destroy(audioPublicId, {
        resource_type: "video",
        invalidate: true,
      });

      if (!["ok", "not found"].includes(result.result)) {
        console.error("Conversation Cloudinary cleanup:", result.result);
      }
    } catch (error) {
      console.error("Conversation Cloudinary cleanup failed:", error.message);
    }
    return;
  }

  // Older episodes may still point to a file in the local upload directory.
  const match = /^\/uploads\/conversations\/([A-Za-z0-9._-]+)$/.exec(
    audioUrl || "",
  );

  if (match && ![".", ".."].includes(match[1])) {
    await removeLocalFile(path.join(AUDIO_UPLOAD_DIR, match[1]));
  }
}

function publicConversation(conversation) {
  const { audioPublicId, ...data } = conversation;
  return data;
}

function sendError(res, error, fallback) {
  if (error.status === 400 || error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A conversation already uses this slug. Please retry.",
    });
  }

  console.error(fallback, error);
  return res.status(500).json({ success: false, message: fallback });
}

export async function getPublishedConversations(_req, res) {
  try {
    const [allConversations, published] = await Promise.all([
      Conversation.find()
        .select("title industryVertical status createdAt")
        .sort(SORT_ORDER)
        .lean(),
      Conversation.find({ status: "published" }).sort(SORT_ORDER).lean(),
    ]);

    return res.json({
      success: true,
      totalCount: allConversations.length,
      publishedCount: published.length,
      allConversations,
      data: published.map(publicConversation),
    });
  } catch (error) {
    return sendError(res, error, "Unable to load published conversations.");
  }
}

export async function getPublishedConversationBySlug(req, res) {
  try {
    const conversation = await Conversation.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.json({
      success: true,
      data: publicConversation(conversation),
    });
  } catch (error) {
    return sendError(res, error, "Unable to load the conversation.");
  }
}

export async function getAllConversations(_req, res) {
  try {
    const data = await Conversation.find().sort(SORT_ORDER).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return sendError(res, error, "Unable to load conversations.");
  }
}

export async function createConversation(req, res) {
  let uploadedAudio;
  let saved = false;

  try {
    if (!req.file) throw badRequest("Please select an audio file.");

    const fields = readFields(req.body || {});
    const slug = await makeUniqueSlug(fields.title);
    uploadedAudio = await uploadAudio(req.file);

    const conversation = await Conversation.create({
      ...fields,
      ...uploadedAudio,
      slug,
    });
    saved = true;

    return res.status(201).json({
      success: true,
      message: "Conversation saved successfully.",
      data: conversation,
    });
  } catch (error) {
    if (!saved && uploadedAudio) await removeSavedAudio(uploadedAudio);
    return sendError(res, error, "Unable to create the conversation.");
  } finally {
    await removeLocalFile(req.file?.path);
  }
}

export async function updateConversation(req, res) {
  let uploadedAudio;
  let saved = false;

  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw badRequest("Invalid conversation ID.");
    }

    const current = await Conversation.findById(id).lean();
    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const fields = readFields(req.body || {}, current);

    if (req.file) {
      uploadedAudio = await uploadAudio(req.file);
      Object.assign(fields, uploadedAudio);
    }

    // Guard against concurrent edits replacing or deleting the same audio.
    const version = current.__v ?? { $exists: false };
    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, __v: version },
      { $set: fields, $inc: { __v: 1 } },
      { returnDocument: "after", runValidators: true },
    );

    if (!conversation) {
      if (uploadedAudio) await removeSavedAudio(uploadedAudio);
      return res.status(409).json({
        success: false,
        message: "This conversation changed. Reopen it and try again.",
      });
    }

    saved = true;

    if (uploadedAudio && current.audioPublicId !== uploadedAudio.audioPublicId) {
      await removeSavedAudio(current);
    }

    return res.json({
      success: true,
      message: "Conversation updated successfully.",
      data: conversation,
    });
  } catch (error) {
    if (!saved && uploadedAudio) await removeSavedAudio(uploadedAudio);
    return sendError(res, error, "Unable to update the conversation.");
  } finally {
    await removeLocalFile(req.file?.path);
  }
}

export async function deleteConversation(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw badRequest("Invalid conversation ID.");
    }

    const conversation = await Conversation.findByIdAndDelete(id).lean();
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await removeSavedAudio(conversation);

    return res.json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    return sendError(res, error, "Unable to delete the conversation.");
  }
}

export async function reorderConversations(req, res) {
  try {
    const payload = req.body || {};
    const items = Array.isArray(payload)
      ? payload
      : payload.items ?? payload.conversations ?? payload.orderedIds;

    if (!Array.isArray(items) || !items.length) {
      throw badRequest("Send the conversations in the desired order.");
    }

    const ids = new Set();

    const operations = items.map((item, index) => {
      const id = typeof item === "string" ? item : item?._id ?? item?.id;
      const order = typeof item === "string"
        ? index
        : Number(item?.order ?? index);

      if (
        !mongoose.isValidObjectId(id) ||
        !Number.isSafeInteger(order) ||
        order < 0 ||
        ids.has(String(id))
      ) {
        throw badRequest("The conversation order contains an invalid entry.");
      }

      ids.add(String(id));

      return {
        updateOne: {
          filter: { _id: id },
          update: { $set: { order }, $inc: { __v: 1 } },
        },
      };
    });

    await Conversation.bulkWrite(operations);

    return res.json({
      success: true,
      message: "Conversation order updated successfully.",
    });
  } catch (error) {
    return sendError(res, error, "Unable to reorder conversations.");
  }
}