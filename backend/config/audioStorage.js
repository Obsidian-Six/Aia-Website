
import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";

export const AUDIO_UPLOAD_DIR =
  process.env.AUDIO_UPLOAD_DIR ||
  path.join(process.cwd(), "uploads", "conversations");

// Create folder if it doesn't exist
fs.mkdirSync(AUDIO_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AUDIO_UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
];

const allowedExtensions = [
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".webm",
];

export const conversationAudioUpload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(extension)
    ) {
      return cb(null, true);
    }

    cb(
      new Error(
        "Invalid audio format. Allowed: MP3, WAV, M4A, AAC, OGG and WEBM."
      )
    );
  },
});
