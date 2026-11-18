
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";

// const uploadsDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadsDir);
//   },

//   filename: (_req, file, cb) => {
//     const extension = path.extname(file.originalname).toLowerCase();
//     cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
//   },
// });

// const imageMimes = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ]);

// const imageExtensions = new Set([
//   ".jpg",
//   ".jpeg",
//   ".png",
//   ".webp",
//   ".gif",
// ]);

// const pdfMimes = new Set(["application/pdf"]);

// const fileFilter = (_req, file, cb) => {
//   const extension = path.extname(file.originalname).toLowerCase();

//   if (file.fieldname === "brochurePdf") {
//     if (
//       pdfMimes.has(file.mimetype) &&
//       extension === ".pdf"
//     ) {
//       return cb(null, true);
//     }

//     return cb(new Error("Only PDF files are allowed for the event brochure."));
//   }

//   if (
//     imageMimes.has(file.mimetype) &&
//     imageExtensions.has(extension)
//   ) {
//     return cb(null, true);
//   }

//   return cb(new Error("Invalid image file type."));
// };

// export const eventUpload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     files: 32,
//     fileSize: 20 * 1024 * 1024,
//     fieldSize: 20 * 1024 * 1024,
//   },
// }).any();



// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";

// const uploadsDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadsDir);
//   },

//   filename: (_req, file, cb) => {
//     const extension = path.extname(file.originalname).toLowerCase();

//     cb(
//       null,
//       `${Date.now()}-${crypto.randomUUID()}${extension}`
//     );
//   },
// });

// const imageMimes = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ]);

// const imageExtensions = new Set([
//   ".jpg",
//   ".jpeg",
//   ".png",
//   ".webp",
//   ".gif",
// ]);

// const pdfMimes = new Set(["application/pdf"]);

// const fileFilter = (_req, file, cb) => {
//   const extension = path.extname(file.originalname).toLowerCase();

//   if (file.fieldname === "brochurePdf") {
//     if (
//       pdfMimes.has(file.mimetype) &&
//       extension === ".pdf"
//     ) {
//       return cb(null, true);
//     }

//     return cb(
//       new Error("Only PDF files are allowed for the event brochure.")
//     );
//   }

//   if (
//     imageMimes.has(file.mimetype) &&
//     imageExtensions.has(extension)
//   ) {
//     return cb(null, true);
//   }

//   return cb(new Error("Invalid image file type."));
// };

// export const eventUpload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     files: 32,
//     fileSize: 20 * 1024 * 1024,
//     fieldSize: 20 * 1024 * 1024,
//   },
// }).any();




import multer from "multer";
import path from "path";
import crypto from "crypto";
import { eventTempUploadsDir } from "./uploadPaths.js";

// Store temporary event files outside the public uploads directory.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, eventTempUploadsDir);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(
      null,
      `${Date.now()}-${crypto.randomUUID()}${extension}`
    );
  },
});

// Allowed image MIME types
const imageMimes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Allowed image extensions
const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]);

// Allowed PDF MIME types
const pdfMimes = new Set(["application/pdf"]);

// Validate uploaded files
const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // Event brochure PDF validation
  if (file.fieldname === "brochurePdf") {
    if (
      pdfMimes.has(file.mimetype) &&
      extension === ".pdf"
    ) {
      return cb(null, true);
    }

    return cb(
      new Error("Only PDF files are allowed for the event brochure.")
    );
  }

  // Event image validation
  if (
    imageMimes.has(file.mimetype) &&
    imageExtensions.has(extension)
  ) {
    return cb(null, true);
  }

  return cb(new Error("Invalid image file type."));
};

// Multer configuration
export const eventUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: 32,
    fileSize: 20 * 1024 * 1024,
    fieldSize: 20 * 1024 * 1024,
  },
}).any();
