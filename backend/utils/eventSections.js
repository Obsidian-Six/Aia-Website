import mongoose from "mongoose";
import uploadToCloudinary from "./uploadToCloudinary.js";

const { Schema } = mongoose;

const cardSchema = new Schema({
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, trim: true },
  imageAlt: { type: String, trim: true },
  url: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  imagePublicId: String,
});

export const eventSectionsSchema = new Schema(
  {
    format: {
      type: String,
      enum: ["", "conference", "workshop"],
      default: "",
    },
    speakers: { type: [cardSchema], default: [] },
    gallery: [
      {
        heading: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        cards: { type: [cardSchema], default: [] },
      },
    ],
  },
  { _id: false },
);

const speakersFolder = "AIA-Project-Assets/Events/Speakers";
const galleryFolder = "AIA-Project-Assets/Events/Gallery";
const imageType = /^image\/(jpeg|png|webp|avif|gif)$/;
const maxImageSize = 5 * 1024 * 1024;

export const isEventSectionImage = (field) =>
  /^(?:speakerImage_\d+|galleryImage_\d+_\d+)$/.test(field);

const trim = (value) => (typeof value === "string" ? value.trim() : "");

const invalid = (message) =>
  Object.assign(new Error(message), { status: 400, statusCode: 400 });

function asHttpUrl(value) {
  const url = trim(value);
  if (!url) return "";

  try {
    if (["http:", "https:"].includes(new URL(url).protocol)) return url;
  } catch {
    // Report invalid links consistently.
  }

  throw invalid("Card links must use an absolute HTTP or HTTPS URL.");
}

export function eventSectionImageIds(sections) {
  const galleryCards = (sections?.gallery || []).flatMap(
    (group) => group.cards,
  );

  return [...(sections?.speakers || []), ...galleryCards]
    .map((card) => card.imagePublicId)
    .filter(Boolean);
}

export async function readEventSections(req, previous, uploadedIds) {
  const raw = req.body.eventSections;
  const sectionFiles = (req.files || []).filter((file) =>
    isEventSectionImage(file.fieldname),
  );

  if (raw === undefined) {
    if (sectionFiles.length) {
      throw invalid("Event section images require matching card data.");
    }
    return undefined;
  }

  let input;

  try {
    input = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw invalid("Invalid event sections.");
  }

  if (
    !Array.isArray(input?.speakers) ||
    !Array.isArray(input?.gallery) ||
    !["", "conference", "workshop"].includes(input.format ?? "")
  ) {
    throw invalid("Invalid event sections.");
  }

  const images = new Map();

  for (const file of sectionFiles) {
    if (
      images.has(file.fieldname) ||
      !imageType.test(file.mimetype) ||
      file.size > maxImageSize
    ) {
      throw invalid(
        "Each speaker or gallery image must be a supported image of up to 5 MB.",
      );
    }

    images.set(file.fieldname, file);
  }

  const previousCards = [
    ...(previous?.speakers || []),
    ...(previous?.gallery || []).flatMap((group) => group.cards),
  ];

  const existingImages = new Map(
    previousCards.map((card) => [card.imageUrl, card.imagePublicId]),
  );

  const pendingUploads = [];

  function normalizeCard(inputCard, field, folder) {
    const file = images.get(field);
    const name = trim(inputCard?.name);
    const imageUrl = trim(inputCard?.imageUrl);

    if (!name || (!file && !existingImages.has(imageUrl))) {
      throw invalid("Each speaker and gallery card needs a name and image.");
    }

    const card = {
      name,
      subtitle: trim(inputCard.subtitle),
      description: trim(inputCard.description),
      imageAlt: trim(inputCard.imageAlt),
      url: asHttpUrl(inputCard.url),
      imageUrl: existingImages.has(imageUrl) ? imageUrl : "",
      imagePublicId: existingImages.get(imageUrl),
    };

    if (file) {
      pendingUploads.push({ file, card, folder });
      images.delete(field);
    }

    return card;
  }

  const speakers = input.speakers.map((card, index) =>
    normalizeCard(card, `speakerImage_${index}`, speakersFolder),
  );

  const gallery = input.gallery.map((group, index) => {
    if (
      !trim(group?.heading) ||
      !Array.isArray(group.cards) ||
      !group.cards.length
    ) {
      throw invalid("Each gallery session needs a heading and at least one card.");
    }

    return {
      heading: trim(group.heading),
      description: trim(group.description),
      cards: group.cards.map((card, cardIndex) =>
        normalizeCard(card, `galleryImage_${index}_${cardIndex}`, galleryFolder),
      ),
    };
  });

  if (images.size) {
    throw invalid("An uploaded image does not have a matching card.");
  }

  for (const { file, card, folder } of pendingUploads) {
    const result = await uploadToCloudinary(file.path, folder, {
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
    });

    uploadedIds.push(result.publicId);
    card.imageUrl = result.url;
    card.imagePublicId = result.publicId;
  }

  return { format: input.format ?? "", speakers, gallery };
}