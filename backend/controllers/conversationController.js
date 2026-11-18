
import fs from "fs";
import path from "path";
import { Conversation } from "../models/Conversation.js";
import { AUDIO_UPLOAD_DIR } from "../config/audioStorage.js";

const deleteAudioFile = (audioUrl) => {
  if (!audioUrl) return;

  const filename = path.basename(audioUrl);
  const filePath = path.join(AUDIO_UPLOAD_DIR, filename);

  // Prevent deleting files outside the audio folder
  if (path.dirname(filePath) !== path.resolve(AUDIO_UPLOAD_DIR)) {
    return;
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

// PUBLIC: Get published conversations
export const getPublishedConversations = async (req, res) => {
  try {
    // Fetch all conversations
    const allConversations = await Conversation.find()
      .select("title status industryVertical createdAt")
      .lean();

    // Fetch only published conversations
    const publishedConversations = await Conversation.find({
      status: "published",
    })
      .sort({ order: 1, publishedAt: -1 })
      .lean();

    // console.log("========== CONVERSATION DEBUG ==========");
    // console.log("Total Conversations:", allConversations.length);
    // console.log("All Conversations:", allConversations);
    // console.log("Published Conversations:", publishedConversations.length);
    // console.log("========================================");

    return res.status(200).json({
      success: true,
      totalCount: allConversations.length,
      publishedCount: publishedConversations.length,
      allConversations,
      data: publishedConversations,
    });
  } catch (error) {
    console.error("Get Published Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};
// PUBLIC: Get one published conversation
export const getPublishedConversationBySlug = async (req, res) => {
  const conversation = await Conversation.findOne({
    slug: req.params.slug,
    status: "published",
  });

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  res.status(200).json({
    success: true,
    data: conversation,
  });
};

// ADMIN: Get all conversations
export const getAllConversations = async (req, res) => {
  const conversations = await Conversation.find().sort({
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations,
  });
};

// ADMIN: Create conversation
export const createConversation = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an audio file.",
    });
  }

  try {
    const {
      title,
      slug,
      expertName,
      expertDesignation,
      shortDescription,
      industryVertical,
      recap,
      keyTakeaways,
      pullQuotes,
      memberInsights,
      publishedAt,
      status,
      order,
      thumbnail,
    } = req.body;

    if (!title || !industryVertical) {
      deleteAudioFile(`/uploads/conversations/${req.file.filename}`);

      return res.status(400).json({
        success: false,
        message: "Title and Industry Vertical are required.",
      });
    }

    const audioUrl = `/uploads/conversations/${req.file.filename}`;

    const conversation = await Conversation.create({
      title,
      slug: slug?.trim() || undefined,
      expertName,
      expertDesignation,
      shortDescription,
      industryVertical,
      audioUrl,
      audioOriginalName: req.file.originalname,
      audioMimeType: req.file.mimetype,
      audioSize: req.file.size,
      recap,
      keyTakeaways: parseArray(keyTakeaways),
      pullQuotes: parseArray(pullQuotes),
      memberInsights,
      publishedAt: publishedAt || Date.now(),
      status: status || "draft",
      order: Number(order) || 0,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: conversation,
    });
  } catch (error) {
    deleteAudioFile(`/uploads/conversations/${req.file.filename}`);
    throw error;
  }
};

// ADMIN: Update conversation
export const updateConversation = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    if (req.file) {
      deleteAudioFile(`/uploads/conversations/${req.file.filename}`);
    }

    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  const {
    title,
    slug,
    expertName,
    expertDesignation,
    shortDescription,
    industryVertical,
    recap,
    keyTakeaways,
    pullQuotes,
    memberInsights,
    publishedAt,
    status,
    order,
    thumbnail,
  } = req.body;

  if (title !== undefined) conversation.title = title;
  if (slug !== undefined) conversation.slug = slug;
  if (expertName !== undefined) conversation.expertName = expertName;
  if (expertDesignation !== undefined) {
    conversation.expertDesignation = expertDesignation;
  }
  if (shortDescription !== undefined) {
    conversation.shortDescription = shortDescription;
  }
  if (industryVertical !== undefined) {
    conversation.industryVertical = industryVertical;
  }
  if (recap !== undefined) conversation.recap = recap;
  if (keyTakeaways !== undefined) {
    conversation.keyTakeaways = parseArray(keyTakeaways);
  }
  if (pullQuotes !== undefined) {
    conversation.pullQuotes = parseArray(pullQuotes);
  }
  if (memberInsights !== undefined) {
    conversation.memberInsights = memberInsights;
  }
  if (publishedAt !== undefined) conversation.publishedAt = publishedAt;
  if (status !== undefined) conversation.status = status;
  if (order !== undefined) conversation.order = Number(order) || 0;
  if (thumbnail !== undefined) conversation.thumbnail = thumbnail;

  if (req.file) {
    const oldAudioUrl = conversation.audioUrl;

    conversation.audioUrl = `/uploads/conversations/${req.file.filename}`;
    conversation.audioOriginalName = req.file.originalname;
    conversation.audioMimeType = req.file.mimetype;
    conversation.audioSize = req.file.size;

    await conversation.save();

    deleteAudioFile(oldAudioUrl);

    return res.status(200).json({
      success: true,
      message: "Conversation and audio updated successfully.",
      data: conversation,
    });
  }

  await conversation.save();

  res.status(200).json({
    success: true,
    message: "Conversation updated successfully.",
    data: conversation,
  });
};

// ADMIN: Delete conversation
export const deleteConversation = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  deleteAudioFile(conversation.audioUrl);

  await conversation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Conversation deleted successfully.",
  });
};

// ADMIN: Update card order
export const reorderConversations = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide conversation IDs and their order.",
    });
  }

  const operations = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { order: Number(item.order) } },
    },
  }));

  await Conversation.bulkWrite(operations);

  res.status(200).json({
    success: true,
    message: "Conversation order updated successfully.",
  });
};
