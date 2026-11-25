
// import FormSubmission from "../models/FormSubmission.js";
// import { ArticleFeedback } from "../models/ArticleFeedback.js";
// import { appendSubmissionToGoogleSheet } from "../config/googleSheets.js";

// const POLL_INTERVAL = 10 * 1000;
// const STALE_PROCESSING_TIME = 5 * 60 * 1000;

// let workerStarted = false;
// let workerRunning = false;
// let timer = null;

// const getRetryDelay = (attempts) => {
//   const delay = Math.min(
//     60 * 60 * 1000,
//     30 * 1000 * Math.pow(2, Math.max(0, attempts - 1))
//   );

//   return delay;
// };

// const claimNextRecord = async (Model, extraFilter = {}) => {
//   const now = new Date();
//   const staleBefore = new Date(
//     now.getTime() - STALE_PROCESSING_TIME
//   );

//   return Model.findOneAndUpdate(
//     {
//       ...extraFilter,
//       $or: [
//         { "googleSheetsSync.status": "pending" },
//         {
//           "googleSheetsSync.status": "failed",
//           "googleSheetsSync.nextRetryAt": { $lte: now },
//         },
//         {
//           "googleSheetsSync.status": "processing",
//           "googleSheetsSync.lastAttemptAt": { $lte: staleBefore },
//         },
//       ],
//     },
//     {
//       $set: {
//         "googleSheetsSync.status": "processing",
//         "googleSheetsSync.lastAttemptAt": now,
//         "googleSheetsSync.lastError": "",
//       },
//       $inc: {
//         "googleSheetsSync.attempts": 1,
//       },
//     },
//     {
//       new: true,
//       sort: { createdAt: 1 },
//     }
//   );
// };


// const syncOneRecord = async (Model, formType, extraFilter = {}) => {
//   const record = await claimNextRecord(Model, extraFilter);

//   if (!record) return false;

//   console.log(
//     `[Google Sheets] Starting sync: ${formType}, ID: ${record._id}`
//   );

//   try {
//     console.log("[Google Sheets] Calling append function...");

//     const result = await appendSubmissionToGoogleSheet(
//       formType,
//       record
//     );

//     console.log(
//       `[Google Sheets] Append completed: ${formType}`,
//       result
//     );

//     record.googleSheetsSync.status = "synced";
//     record.googleSheetsSync.syncedAt = new Date();
//     record.googleSheetsSync.nextRetryAt = null;
//     record.googleSheetsSync.lastError = "";

//     await record.save();

//     console.log(
//       `[Google Sheets] Successfully marked synced: ${record._id}`
//     );
//   } catch (error) {
//     const attempts = record.googleSheetsSync.attempts || 1;

//     record.googleSheetsSync.status = "failed";
//     record.googleSheetsSync.nextRetryAt = new Date(
//       Date.now() + getRetryDelay(attempts)
//     );
//     record.googleSheetsSync.lastError = String(
//       error.message || "Google Sheets sync failed."
//     ).slice(0, 1000);

//     await record.save();

//     console.error(
//       `[Google Sheets] Sync failed: ${formType}, ID: ${record._id}`,
//       error
//     );
//   }

//   return true;
// };


// const runWorker = async () => {
//   if (workerRunning) return;

//   workerRunning = true;

//   try {
//     let hasMore = true;

//     while (hasMore) {
//       hasMore = false;

//       // Only the four selected FormSubmission types are synced.
//       for (const formType of [
//         "contact-us",
//         "aia-membership",
//         "brochure-enquiry",
//         "article-reader",
//       ]) {
//         const synced = await syncOneRecord(
//           FormSubmission,
//           formType,
//           { formType }
//         );

//         if (synced) hasMore = true;
//       }

//       // Article feedback goes to Sheets only, not FormSubmission/CMS.
//       const feedbackSynced = await syncOneRecord(
//         ArticleFeedback,
//         "article-feedback"
//       );

//       if (feedbackSynced) hasMore = true;
//     }
//   } catch (error) {
//     console.error("[Google Sheets] Worker error:", error);
//   } finally {
//     workerRunning = false;
//   }
// };

// export const startGoogleSheetsWorker = () => {
//   if (workerStarted) return;

//   workerStarted = true;

//   console.log("[Google Sheets] Background sync worker started.");

//   runWorker();

//   timer = setInterval(runWorker, POLL_INTERVAL);
// };

// export const stopGoogleSheetsWorker = () => {
//   if (timer) clearInterval(timer);

//   timer = null;
//   workerStarted = false;
// };



import FormSubmission from "../models/FormSubmission.js";
import { ArticleFeedback } from "../models/ArticleFeedback.js";
import SelfAssessmentSubmission from "../models/SelfAssessmentSubmission.js";

import { appendSubmissionToGoogleSheet } from "../config/googleSheets.js";

const POLL_INTERVAL = 10 * 1000;
const STALE_PROCESSING_TIME = 5 * 60 * 1000;

let workerStarted = false;
let workerRunning = false;
let timer = null;

// Retry delay:
// 1st attempt: 30 seconds
// 2nd attempt: 60 seconds
// 3rd attempt: 120 seconds
// Maximum: 1 hour
const getRetryDelay = (attempts) => {
  const delay = Math.min(
    60 * 60 * 1000,
    30 * 1000 * Math.pow(2, Math.max(0, attempts - 1))
  );

  return delay;
};

// Claim one pending/failed/stale record atomically.
const claimNextRecord = async (Model, extraFilter = {}) => {
  const now = new Date();

  const staleBefore = new Date(
    now.getTime() - STALE_PROCESSING_TIME
  );

  return Model.findOneAndUpdate(
    {
      ...extraFilter,

      $or: [
        {
          "googleSheetsSync.status": "pending",
        },
        {
          "googleSheetsSync.status": "failed",
          "googleSheetsSync.nextRetryAt": { $lte: now },
        },
        {
          "googleSheetsSync.status": "processing",
          "googleSheetsSync.lastAttemptAt": { $lte: staleBefore },
        },
      ],
    },

    {
      $set: {
        "googleSheetsSync.status": "processing",
        "googleSheetsSync.lastAttemptAt": now,
        "googleSheetsSync.lastError": "",
      },

      $inc: {
        "googleSheetsSync.attempts": 1,
      },
    },

    {
      new: true,
      sort: { createdAt: 1 },
    }
  );
};

// Process one record and update its sync status.
const syncOneRecord = async (
  Model,
  formType,
  extraFilter = {}
) => {
  const record = await claimNextRecord(
    Model,
    extraFilter
  );

  if (!record) return false;

  console.log(
    `[Google Sheets] Starting sync: ${formType}, ID: ${record._id}`
  );

  try {
    console.log(
      `[Google Sheets] Calling append function: ${formType}`
    );

    const result = await appendSubmissionToGoogleSheet(
      formType,
      record
    );

    console.log(
      `[Google Sheets] Append completed: ${formType}`,
      result
    );

    record.googleSheetsSync.status = "synced";
    record.googleSheetsSync.syncedAt = new Date();
    record.googleSheetsSync.nextRetryAt = null;
    record.googleSheetsSync.lastError = "";

    await record.save();

    console.log(
      `[Google Sheets] Successfully marked synced: ${record._id}`
    );
  } catch (error) {
    const attempts =
      record.googleSheetsSync.attempts || 1;

    record.googleSheetsSync.status = "failed";

    record.googleSheetsSync.nextRetryAt = new Date(
      Date.now() + getRetryDelay(attempts)
    );

    record.googleSheetsSync.lastError = String(
      error.message || "Google Sheets sync failed."
    ).slice(0, 1000);

    await record.save();

    console.error(
      `[Google Sheets] Sync failed: ${formType}, ID: ${record._id}`,
      error
    );
  }

  return true;
};

// Main background worker.
const runWorker = async () => {
  if (workerRunning) return;

  workerRunning = true;

  try {
    let hasMore = true;

    while (hasMore) {
      hasMore = false;

      // 1. Existing website form submissions.
      // These four form types retain their existing workflow.
      for (const formType of [
        "contact-us",
        "aia-membership",
        "brochure-enquiry",
        "article-reader",
      ]) {
        const synced = await syncOneRecord(
          FormSubmission,
          formType,
          { formType }
        );

        if (synced) {
          hasMore = true;
        }
      }

      // 2. Article feedback.
      // Article feedback goes to Google Sheets only.
      const feedbackSynced = await syncOneRecord(
        ArticleFeedback,
        "article-feedback"
      );

      if (feedbackSynced) {
        hasMore = true;
      }

      // 3. Self-Assessment submissions.
      // Separate MongoDB collection and separate Google Sheets tab.
      const assessmentSynced = await syncOneRecord(
        SelfAssessmentSubmission,
        "self-assessment"
      );

      if (assessmentSynced) {
        hasMore = true;
      }
    }
  } catch (error) {
    console.error(
      "[Google Sheets] Worker error:",
      error
    );
  } finally {
    workerRunning = false;
  }
};

// Start worker.
export const startGoogleSheetsWorker = () => {
  if (workerStarted) return;

  workerStarted = true;

  console.log(
    "[Google Sheets] Background sync worker started."
  );

  // Run immediately when the server starts.
  runWorker();

  // Continue checking every 10 seconds.
  timer = setInterval(
    runWorker,
    POLL_INTERVAL
  );
};

// Stop worker.
export const stopGoogleSheetsWorker = () => {
  if (timer) {
    clearInterval(timer);
  }

  timer = null;
  workerStarted = false;

  console.log(
    "[Google Sheets] Background sync worker stopped."
  );
};
