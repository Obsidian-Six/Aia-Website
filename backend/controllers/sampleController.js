
import path from "path";
import { fileURLToPath } from "url";
import { hasBrochureAccess } from "../utils/brochureAccess.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadCampusConnectSample = async (req, res) => {
  try {
    if (!hasBrochureAccess(req)) {
      return res.status(401).json({
        success: false,
        requiresEnquiry: true,
        message: "Please submit an enquiry to view this sample.",
      });
    }

    const filePath = path.resolve(
      __dirname,
      "../private-samples/campus+connect+sampler.pdf"
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="campus-connect-sampler.pdf"'
    );
    res.setHeader("Cache-Control", "private, no-store");

    return res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) {
        console.error("Sample PDF Error:", error);

        res.status(404).json({
          success: false,
          message: "Sample PDF not found.",
        });
      }
    });
  } catch (error) {
    console.error("Sample Download Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to open sample PDF.",
      });
    }
  }
};
