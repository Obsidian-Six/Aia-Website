
import multer from "multer";
import path from "path";
import { uploadsDir } from "./uploadPaths.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname).toLowerCase()}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
};

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = allowedMimeTypes[file.mimetype] || [];

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error("Only JPG, PNG, WEBP, GIF images and PDF files are allowed.")
    );
  }

  cb(null, true);
};

export const pillarFootprintUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: 2,
    fileSize: 20 * 1024 * 1024,
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "brochurePdf", maxCount: 1 },
]);
