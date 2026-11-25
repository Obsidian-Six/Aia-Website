
import mongoose from "mongoose";
import SmartFactoryVideo from "../models/SmartFactoryVideo.js";

const extractYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    const allowedHosts = [
      "youtube.com",
      "m.youtube.com",
      "youtube-nocookie.com",
      "youtu.be",
    ];

    if (!allowedHosts.includes(hostname)) {
      return null;
    }

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    } else if (parsedUrl.pathname === "/watch") {
      videoId = parsedUrl.searchParams.get("v") || "";
    } else {
      const match = parsedUrl.pathname.match(
        /^\/(embed|shorts|live)\/([^/?]+)/
      );

      videoId = match?.[2] || "";
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
      ? videoId
      : null;
  } catch {
    return null;
  }
};

const getThumbnail = (youtubeUrl, customThumbnail = "") => {
  if (customThumbnail?.trim()) {
    return customThumbnail.trim();
  }

  const videoId = extractYouTubeVideoId(youtubeUrl);

  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";
};

const parseBoolean = (value, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1";
};

// PUBLIC: Get active Smart Factory videos
export const getSmartFactoryVideos = async (req, res) => {
  try {
    const videos = await SmartFactoryVideo.find({
      isActive: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Get Smart Factory videos error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Smart Factory videos.",
    });
  }
};

// ADMIN: Get all videos
export const getAllSmartFactoryVideos = async (req, res) => {
  try {
    const videos = await SmartFactoryVideo.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Get all Smart Factory videos error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos.",
    });
  }
};

// ADMIN: Create video
export const createSmartFactoryVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      isActive,
      order,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video title is required.",
      });
    }

    if (!youtubeUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required.",
      });
    }

    const videoId = extractYouTubeVideoId(youtubeUrl);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid YouTube video URL.",
      });
    }

    const thumbnail = getThumbnail(youtubeUrl, thumbnailUrl);

    const video = await SmartFactoryVideo.create({
      title: title.trim(),
      description: description?.trim() || "",
      youtubeUrl: youtubeUrl.trim(),
      thumbnailUrl: thumbnail,
      thumbnail,
      isActive: parseBoolean(isActive, true),
      order: Number(order) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Smart Factory video added successfully.",
      data: video,
    });
  } catch (error) {
    console.error("Create Smart Factory video error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add Smart Factory video.",
    });
  }
};

// ADMIN: Update video
export const updateSmartFactoryVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
    }

    const video = await SmartFactoryVideo.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Smart Factory video not found.",
      });
    }

    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      isActive,
      order,
    } = req.body;

    const nextTitle = title !== undefined ? title.trim() : video.title;
    const nextUrl =
      youtubeUrl !== undefined ? youtubeUrl.trim() : video.youtubeUrl;

    if (!nextTitle) {
      return res.status(400).json({
        success: false,
        message: "Video title is required.",
      });
    }

    const videoId = extractYouTubeVideoId(nextUrl);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid YouTube video URL.",
      });
    }

    const nextThumbnailInput =
      thumbnailUrl !== undefined ? thumbnailUrl : video.thumbnailUrl;

    const thumbnail = getThumbnail(nextUrl, nextThumbnailInput);

    video.title = nextTitle;
    video.youtubeUrl = nextUrl;
    video.thumbnailUrl = thumbnail;
    video.thumbnail = thumbnail;

    if (description !== undefined) {
      video.description = description.trim();
    }

    if (isActive !== undefined) {
      video.isActive = parseBoolean(isActive, video.isActive);
    }

    if (order !== undefined) {
      video.order = Number(order) || 0;
    }

    await video.save();

    return res.status(200).json({
      success: true,
      message: "Smart Factory video updated successfully.",
      data: video,
    });
  } catch (error) {
    console.error("Update Smart Factory video error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Smart Factory video.",
    });
  }
};

// ADMIN: Delete video
export const deleteSmartFactoryVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
    }

    const video = await SmartFactoryVideo.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Smart Factory video not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Smart Factory video deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Smart Factory video error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Smart Factory video.",
    });
  }
};
