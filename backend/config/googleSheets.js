import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const SHEETS = {
  "contact-us": {
    title: "Contact Us",
    headers: [
      "Submission ID",
      "Submitted At",
      "Source Page",
      "Name",
      "Email",
      "Mobile",
      "Inquiry",
      "Message",
      "Status",
      "Form Data JSON",
      "Company Name / Institution Name",
      "Website Link",
    ],
  },

  "aia-membership": {
    title: "AIA Membership",
    headers: [
      "Submission ID",
      "Submitted At",
      "Source Page",
      "Company Name",
      "Membership Class",
      "Name",
      "Email",
      "Mobile",
      "Form Data JSON",
    ],
  },

  "brochure-enquiry": {
    title: "Brochure Enquiry",
    headers: [
      "Submission ID",
      "Submitted At",
      "Source Page",
      "Name",
      "Email",
      "Mobile",
      "Message",
      "Resource Type",
      "Resource Title",
      "Resource ID",
      "Form Data JSON",
    ],
  },

  "article-reader": {
    title: "Article Reader",
    headers: [
      "Submission ID",
      "Submitted At",
      "Source Page",
      "Name",
      "Email",
      "Company",
      "Mobile",
      "Form Data JSON",
    ],
  },

  "article-feedback": {
    title: "Article Feedback",
    headers: [
      "Submission ID",
      "Submitted At",
      "Article ID",
      "Article Title",
      "Article Slug",
      "Article URL",
      "Helpful",
      "Comment",
      "Wants To Contribute",
      "Contribution Email",
    ],
  },

  // NEW: Manufacturers Self-Assessment
  "self-assessment": {
    title: "Self-Assessment",
    headers: [
      "Submission ID",
      "Submitted At",
      "Name",
      "Function",
      "Company",
      "Email",
      "Country Code",
      "Mobile",
      "Website",
      "01 - Sensing Infrastructure",
      "02 - Connectivity Infrastructure",
      "03 - Visualisation Infrastructure",
      "04 - Act",
      "05 - Improve",
      "Source Video ID",
      "Source Video Title",
      "Status",
    ],
  },
};

let sheetsClient;

const getSheetsClient = () => {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_CLIENT_EMAIL;

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!SPREADSHEET_ID || !email || !privateKey) {
    throw new Error(
      "Google Sheets environment variables are missing."
    );
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  sheetsClient = google.sheets({
    version: "v4",
    auth,
  });

  return sheetsClient;
};

const escapeSheetTitle = (title) =>
  `'${title.replace(/'/g, "''")}'`;

const ensureSheetTabs = async (sheets) => {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const existingTitles = new Set(
    (spreadsheet.data.sheets || []).map(
      (sheet) => sheet.properties.title
    )
  );

  const requests = Object.values(SHEETS)
    .filter(
      (config) => !existingTitles.has(config.title)
    )
    .map((config) => ({
      addSheet: {
        properties: {
          title: config.title,
        },
      },
    }));

  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests,
      },
    });
  }

  // Update headers without changing existing submission rows.
  for (const config of Object.values(SHEETS)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${escapeSheetTitle(config.title)}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [config.headers],
      },
    });
  }
};

let initializationPromise;

const initializeSheets = async (sheets) => {
  if (!initializationPromise) {
    initializationPromise = ensureSheetTabs(sheets).catch(
      (error) => {
        initializationPromise = null;
        throw error;
      }
    );
  }

  await initializationPromise;
};

const toJson = (value) => {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return "{}";
  }
};

// Get answer by section number.
// This keeps the Google Sheets columns consistent even if
// the order of responses changes.
const getAssessmentAnswer = (responses = [], sectionNumber) => {
  const response = responses.find(
    (item) =>
      String(item.sectionNumber).padStart(2, "0") ===
      String(sectionNumber).padStart(2, "0")
  );

  return response?.selectedOption || "";
};

const buildRow = (formType, record) => {
  const data = record.data || {};

  const id = String(record._id);

  const createdAt = record.createdAt
    ? new Date(record.createdAt).toISOString()
    : new Date().toISOString();

  switch (formType) {
    case "contact-us":
      return [
        id,
        createdAt,
        record.sourcePage || "",
        data.fullName || "",
        data.email || "",
        data.phone || "",
        data.inquiry || "",
        data.message || "",
        record.status || "new",
        toJson(data),
        data.companyName || data.company || "",
        data.website || "",
      ];

    case "aia-membership":
      return [
        id,
        createdAt,
        record.sourcePage || "",
        data.companyName || "",
        data.membershipClass || "",
        data.ceoName ||
        data.submittedByName ||
        data.fullName ||
        "",
        data.ceoEmail ||
        data.submittedByEmail ||
        data.email ||
        "",
        data.phone || data.phoneNumber || "",
        toJson(data),
      ];

    case "brochure-enquiry":
      return [
        id,
        createdAt,
        record.sourcePage || "",
        data.name || "",
        data.email || "",
        data.phone || "",
        data.message || "",
        data.resourceType || "",
        data.resourceTitle || "",
        data.resourceId || "",
        toJson(data),
      ];

    case "article-reader":
      return [
        id,
        createdAt,
        record.sourcePage || "",
        data.name || "",
        data.email || "",
        data.company || "",
        data.phone || "",
        toJson(data),
      ];

    case "article-feedback":
      return [
        id,
        createdAt,
        record.article?.toString?.() ||
        record.article ||
        "",
        record.articleTitle || "",
        record.articleSlug || "",
        record.articleUrl || "",
        record.helpful === true ? "Yes" : "No",
        record.comment || "",
        record.wantsToContribute === null ||
          record.wantsToContribute === undefined
          ? ""
          : record.wantsToContribute
            ? "Yes"
            : "No",
        record.contributionEmail || "",
      ];

    // NEW: Manufacturers Self-Assessment
    case "self-assessment": {
      const participant = record.participant || {};
      const responses = record.responses || [];
      const sourceVideo = record.sourceVideo || {};

      return [
        id,
        createdAt,

        participant.name || "",
        participant.function || "",
        participant.company || "",
        participant.email || "",
        participant.countryCode || "",
        participant.mobile || "",
        participant.website || "",

        getAssessmentAnswer(responses, "01"),
        getAssessmentAnswer(responses, "02"),
        getAssessmentAnswer(responses, "03"),
        getAssessmentAnswer(responses, "04"),
        getAssessmentAnswer(responses, "05"),

        sourceVideo.videoId || "",
        sourceVideo.videoTitle || "",

        record.status || "new",
      ];
    }

    default:
      throw new Error(
        `Unsupported Google Sheets form type: ${formType}`
      );
  }
};

export const appendSubmissionToGoogleSheet = async (
  formType,
  record
) => {
  const config = SHEETS[formType];

  if (!config) {
    throw new Error(
      `No Google Sheet tab configured for: ${formType}`
    );
  }

  const sheets = getSheetsClient();

  await initializeSheets(sheets);

  const sheetRange = `${escapeSheetTitle(config.title)}!A:A`;

  // Prevent duplicate rows using MongoDB submission ID.
  const existingRows = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
  });

  const existingIds = existingRows.data.values || [];

  const submissionId = String(record._id);

  const alreadyExists = existingIds.some(
    (row, index) =>
      index > 0 && String(row[0]) === submissionId
  );

  if (alreadyExists) {
    return {
      alreadyExists: true,
    };
  }

  const row = buildRow(formType, record);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${escapeSheetTitle(config.title)}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

  return {
    alreadyExists: false,
  };
};
