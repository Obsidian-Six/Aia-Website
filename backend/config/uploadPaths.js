
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Common upload directory: backend/uploads
// export const uploadsDir = path.resolve(__dirname, "../uploads");

// // Automatically create directory if it does not exist
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// console.log("[Uploads Directory]:", uploadsDir);



import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public uploads directory: backend/uploads
export const uploadsDir = path.resolve(__dirname, "../uploads");

// Private temporary uploads directory: backend/private-temp/event-uploads
// Never expose this directory through express.static().
export const eventTempUploadsDir = path.resolve(
  __dirname,
  "../private-temp/event-uploads"
);

// Create directories if they do not exist
for (const directory of [uploadsDir, eventTempUploadsDir]) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

console.log("[Public Uploads Directory]:", uploadsDir);
console.log("[Private Event Temp Directory]:", eventTempUploadsDir);
