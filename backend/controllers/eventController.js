// // import mongoose from "mongoose";
// // import { Event } from "../models/Event.js";
// // import cloudinary from "../config/cloudinary.js";
// // import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// // const EVENT_FOLDER = "AIA-Project-Assets/Events";

// // const allowedCategories = [
// //   "Conference",
// //   "Workshops",
// //   "Webinars",
// //   "Training Program",
// //   "Exhibitions",
// // ];

// // const deleteCloudinaryImage = async (publicId) => {
// //   if (!publicId) return;

// //   try {
// //     await cloudinary.uploader.destroy(publicId, {
// //       resource_type: "image",
// //       invalidate: true,
// //     });
// //   } catch (error) {
// //     console.error("Event image deletion error:", error);
// //   }
// // };

// // const parseJSON = (value, fallback = {}) => {
// //   if (!value) return fallback;
// //   if (typeof value === "object") return value;

// //   try {
// //     return JSON.parse(value);
// //   } catch {
// //     return fallback;
// //   }
// // };

// // const slugify = (value = "") =>
// //   value
// //     .toLowerCase()
// //     .trim()
// //     .replace(/[^a-z0-9]+/g, "-")
// //     .replace(/^-|-$/g, "");

// // const makeUniqueSlug = async (title, excludeId = null) => {
// //   const base = slugify(title) || `event-${Date.now()}`;
// //   let slug = base;
// //   let count = 1;

// //   while (
// //     await Event.exists({
// //       slug,
// //       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
// //     })
// //   ) {
// //     slug = `${base}-${count++}`;
// //   }

// //   return slug;
// // };

// // const normalizeBoolean = (value, fallback = true) => {
// //   if (value === undefined) return fallback;
// //   return value === true || value === "true";
// // };

// // const getFilesByField = (files = []) => {
// //   const result = {};

// //   files.forEach((file) => {
// //     result[file.fieldname] = file;
// //   });

// //   return result;
// // };

// // const uploadFile = async (file, folder) => {
// //   if (!file) return null;
// //   return uploadToCloudinary(file.path, folder);
// // };

// // const uploadDetailImages = async (detailPage, files, oldDetailPage = {}) => {
// //   const uploaded = [];

// //   try {
// //     const heroFile = files.heroImage;
// //     const agendaFile = files.agendaImage;

// //     if (heroFile) {
// //       const result = await uploadFile(
// //         heroFile,
// //         `${EVENT_FOLDER}/Detail-Heroes`
// //       );

// //       uploaded.push(result);

// //       detailPage.hero = {
// //         ...detailPage.hero,
// //         imageUrl: result.url,
// //         imagePublicId: result.publicId,
// //       };
// //     }

// //     if (agendaFile) {
// //       const result = await uploadFile(
// //         agendaFile,
// //         `${EVENT_FOLDER}/Agendas`
// //       );

// //       uploaded.push(result);

// //       detailPage.agenda = {
// //         ...detailPage.agenda,
// //         imageUrl: result.url,
// //         imagePublicId: result.publicId,
// //       };
// //     }

// //     return uploaded;
// //   } catch (error) {
// //     await Promise.all(
// //       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
// //     );
// //     throw error;
// //   }
// // };

// // const cleanDetailPage = (value = {}) => {
// //   const detail = parseJSON(value, {});

// //   return {
// //     hero: {
// //       eyebrow: detail.hero?.eyebrow || "",
// //       title: detail.hero?.title || "",
// //       description: detail.hero?.description || "",
// //       imageUrl: detail.hero?.imageUrl || "",
// //       imagePublicId: detail.hero?.imagePublicId || "",
// //       imageAlt: detail.hero?.imageAlt || "",
// //       imagePosition: detail.hero?.imagePosition || "right",
// //       background: detail.hero?.background || "dark",
// //     },

// //     introduction: {
// //       title: detail.introduction?.title || "Introduction",
// //       sections: Array.isArray(detail.introduction?.sections)
// //         ? detail.introduction.sections
// //         : [],

// //       eventInfo: {
// //         date: detail.introduction?.eventInfo?.date || "",
// //         title: detail.introduction?.eventInfo?.title || "",
// //         venue: detail.introduction?.eventInfo?.venue || "",
// //         time: detail.introduction?.eventInfo?.time || "",
// //         saveDateLink: detail.introduction?.eventInfo?.saveDateLink || "",
// //         registrationLink:
// //           detail.introduction?.eventInfo?.registrationLink || "",
// //         locationLink: detail.introduction?.eventInfo?.locationLink || "",
// //       },

// //       partners: Array.isArray(detail.introduction?.partners)
// //         ? detail.introduction.partners
// //         : [],

// //       supporters: Array.isArray(detail.introduction?.supporters)
// //         ? detail.introduction.supporters
// //         : [],

// //       contact: {
// //         email: detail.introduction?.contact?.email || "",
// //         phone: detail.introduction?.contact?.phone || "",
// //         website: detail.introduction?.contact?.website || "",
// //       },
// //     },

// //     agenda: {
// //       title: detail.agenda?.title || "",
// //       imageUrl: detail.agenda?.imageUrl || "",
// //       imagePublicId: detail.agenda?.imagePublicId || "",
// //       imageAlt: detail.agenda?.imageAlt || "",
// //       items: Array.isArray(detail.agenda?.items)
// //         ? detail.agenda.items
// //         : [],
// //     },

// //     contentSections: Array.isArray(detail.contentSections)
// //       ? detail.contentSections
// //       : [],
// //   };
// // };

// // export const getEvents = async (req, res) => {
// //   try {
// //     const events = await Event.find({ isActive: true })
// //       .sort({ order: 1, createdAt: -1 })
// //       .lean();

// //     res.json({ success: true, data: events });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // export const getAdminEvents = async (req, res) => {
// //   try {
// //     const events = await Event.find()
// //       .sort({ order: 1, createdAt: -1 })
// //       .lean();

// //     res.json({ success: true, data: events });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // export const getEventBySlug = async (req, res) => {
// //   try {
// //     const event = await Event.findOne({
// //       slug: req.params.slug,
// //       isActive: true,
// //     }).lean();

// //     if (!event) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Event not found",
// //       });
// //     }

// //     res.json({ success: true, data: event });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // export const createEvent = async (req, res) => {
// //   let uploadedCard = null;
// //   let uploadedDetail = [];

// //   try {
// //     const files = getFilesByField(req.files);

// //     const title = String(req.body.title || req.body.heading || "").trim();
// //     const description = String(
// //       req.body.description || req.body.text || ""
// //     ).trim();
// //     const eventLink = String(
// //       req.body.eventLink || req.body.link || ""
// //     ).trim();
// //     const date = String(req.body.date || "").trim();
// //     const category = String(req.body.category || "Conference").trim();

// //     if (!title || title.length > 70) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event heading is required and must be under 70 characters.",
// //       });
// //     }

// //     if (description.length > 220) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event description cannot exceed 220 characters.",
// //       });
// //     }

// //     if (!eventLink) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event redirect link is required.",
// //       });
// //     }

// //     if (!allowedCategories.includes(category)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid event category.",
// //       });
// //     }

// //     if (!files.image) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event card image is required.",
// //       });
// //     }

// //     const detailPage = cleanDetailPage(req.body.detailPage);

// //     uploadedCard = await uploadFile(
// //       files.image,
// //       `${EVENT_FOLDER}/Event-Posters`
// //     );

// //     uploadedDetail = await uploadDetailImages(
// //       detailPage,
// //       files
// //     );

// //     const slug = await makeUniqueSlug(title);

// //     const created = await Event.create({
// //       title,
// //       slug,
// //       description,
// //       eventLink,
// //       date,
// //       category,
// //       imageUrl: uploadedCard.url,
// //       imagePublicId: uploadedCard.publicId,
// //       detailPage,
// //       order:
// //         req.body.order !== undefined && req.body.order !== ""
// //           ? Number(req.body.order)
// //           : await Event.countDocuments(),
// //       isActive: normalizeBoolean(req.body.isActive),
// //     });

// //     res.status(201).json({
// //       success: true,
// //       data: created,
// //       message: "Event created successfully.",
// //     });
// //   } catch (error) {
// //     if (uploadedCard?.publicId) {
// //       await deleteCloudinaryImage(uploadedCard.publicId);
// //     }

// //     await Promise.all(
// //       uploadedDetail.map((item) =>
// //         deleteCloudinaryImage(item.publicId)
// //       )
// //     );

// //     console.error("Create event error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // export const updateEvent = async (req, res) => {
// //   let uploadedCard = null;
// //   let uploadedDetail = [];

// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.isValidObjectId(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid event ID.",
// //       });
// //     }

// //     const event = await Event.findById(id);

// //     if (!event) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Event not found.",
// //       });
// //     }

// //     const files = getFilesByField(req.files);
// //     const update = {};

// //     const title = String(
// //       req.body.title || req.body.heading || event.title
// //     ).trim();

// //     const description = String(
// //       req.body.description ?? req.body.text ?? event.description
// //     ).trim();

// //     const eventLink = String(
// //       req.body.eventLink ?? req.body.link ?? event.eventLink
// //     ).trim();

// //     if (!title || title.length > 70) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event heading is required and must be under 70 characters.",
// //       });
// //     }

// //     if (description.length > 220) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event description cannot exceed 220 characters.",
// //       });
// //     }

// //     if (!eventLink) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Event redirect link is required.",
// //       });
// //     }

// //     update.title = title;
// //     update.description = description;
// //     update.eventLink = eventLink;

// //     if (title !== event.title) {
// //       update.slug = await makeUniqueSlug(title, id);
// //     }

// //     if (req.body.date !== undefined) {
// //       update.date = String(req.body.date).trim();
// //     }

// //     if (req.body.category !== undefined) {
// //       const category = String(req.body.category).trim();

// //       if (!allowedCategories.includes(category)) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Invalid event category.",
// //         });
// //       }

// //       update.category = category;
// //     }

// //     if (req.body.order !== undefined && req.body.order !== "") {
// //       const order = Number(req.body.order);

// //       if (!Number.isFinite(order) || order < 0) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Invalid event order.",
// //         });
// //       }

// //       update.order = order;
// //     }

// //     if (req.body.isActive !== undefined) {
// //       update.isActive = normalizeBoolean(req.body.isActive);
// //     }

// //     const detailPage =
// //       req.body.detailPage !== undefined
// //         ? cleanDetailPage(req.body.detailPage)
// //         : cleanDetailPage(event.detailPage);

// //     if (files.image) {
// //       uploadedCard = await uploadFile(
// //         files.image,
// //         `${EVENT_FOLDER}/Event-Posters`
// //       );

// //       update.imageUrl = uploadedCard.url;
// //       update.imagePublicId = uploadedCard.publicId;
// //     }

// //     uploadedDetail = await uploadDetailImages(
// //       detailPage,
// //       files,
// //       event.detailPage
// //     );

// //     update.detailPage = detailPage;

// //     const oldCardPublicId = event.imagePublicId;
// //     const oldHeroPublicId = event.detailPage?.hero?.imagePublicId;
// //     const oldAgendaPublicId = event.detailPage?.agenda?.imagePublicId;

// //     Object.assign(event, update);
// //     await event.save();

// //     if (uploadedCard && oldCardPublicId) {
// //       await deleteCloudinaryImage(oldCardPublicId);
// //     }

// //     if (files.heroImage && oldHeroPublicId) {
// //       await deleteCloudinaryImage(oldHeroPublicId);
// //     }

// //     if (files.agendaImage && oldAgendaPublicId) {
// //       await deleteCloudinaryImage(oldAgendaPublicId);
// //     }

// //     res.json({
// //       success: true,
// //       data: event,
// //       message: "Event updated successfully.",
// //     });
// //   } catch (error) {
// //     if (uploadedCard?.publicId) {
// //       await deleteCloudinaryImage(uploadedCard.publicId);
// //     }

// //     await Promise.all(
// //       uploadedDetail.map((item) =>
// //         deleteCloudinaryImage(item.publicId)
// //       )
// //     );

// //     console.error("Update event error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // export const deleteEvent = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.isValidObjectId(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid event ID.",
// //       });
// //     }

// //     const event = await Event.findById(id);

// //     if (!event) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Event not found.",
// //       });
// //     }

// //     const publicIds = [
// //       event.imagePublicId,
// //       event.detailPage?.hero?.imagePublicId,
// //       event.detailPage?.agenda?.imagePublicId,
// //       ...(event.detailPage?.introduction?.partners || []).map(
// //         (item) => item.logoPublicId
// //       ),
// //       ...(event.detailPage?.introduction?.supporters || []).map(
// //         (item) => item.logoPublicId
// //       ),
// //     ].filter(Boolean);

// //     await event.deleteOne();

// //     await Promise.all(
// //       publicIds.map((publicId) => deleteCloudinaryImage(publicId))
// //     );

// //     res.json({
// //       success: true,
// //       message: "Event deleted successfully.",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// import mongoose from "mongoose";
// import fs from "fs/promises";

// import { Event } from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// const EVENT_FOLDER = "AIA-Project-Assets/Events";

// const allowedCategories = [
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// // ------------------------------------------
// // COMMON HELPERS
// // ------------------------------------------

// const parseJSON = (value, fallback = {}) => {
//   if (!value) return fallback;
//   if (typeof value === "object") return value;

//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const normalizeBoolean = (value, fallback = true) => {
//   if (value === undefined) return fallback;
//   return value === true || value === "true";
// };

// const slugify = (value = "") =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// const makeUniqueSlug = async (title, excludeId = null) => {
//   const base = slugify(title) || `event-${Date.now()}`;
//   let slug = base;
//   let count = 1;

//   while (
//     await Event.exists({
//       slug,
//       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
//     })
//   ) {
//     slug = `${base}-${count++}`;
//   }

//   return slug;
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   for (const file of files) {
//     result[file.fieldname] = file;
//   }

//   return result;
// };

// const uploadFile = async (file, folder) => {
//   if (!file) return null;
//   return uploadToCloudinary(file.path, folder);
// };

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error(
//       `Cloudinary deletion failed for ${publicId}:`,
//       error.message
//     );
//   }
// };

// const deleteTemporaryFiles = async (files = []) => {
//   await Promise.all(
//     files.map(async (file) => {
//       if (!file?.path) return;

//       try {
//         await fs.unlink(file.path);
//       } catch (error) {
//         if (error.code !== "ENOENT") {
//           console.error("Temporary upload cleanup error:", error.message);
//         }
//       }
//     })
//   );
// };

// const uniquePublicIds = (ids = []) => [
//   ...new Set(ids.filter(Boolean)),
// ];

// // ------------------------------------------
// // CLEAN DETAIL PAGE DATA
// // ------------------------------------------

// const cleanDetailPage = (value = {}, oldDetailPage = {}) => {
//   const detail = parseJSON(value, {});
//   const old = oldDetailPage?.toObject
//     ? oldDetailPage.toObject()
//     : oldDetailPage || {};

//   const oldBlocks = old.introduction?.blocks || [];
//   const oldContentSections = old.contentSections || [];

//   const blocks = Array.isArray(detail.introduction?.blocks)
//     ? detail.introduction.blocks
//     : oldBlocks;

//   const contentSections = Array.isArray(detail.contentSections)
//     ? detail.contentSections
//     : oldContentSections;

//   return {
//     hero: {
//       eyebrow: detail.hero?.eyebrow || "",
//       title: detail.hero?.title || "",
//       subtitle: detail.hero?.subtitle || "",
//       description: detail.hero?.description || "",
//       imageUrl:
//         detail.hero?.imageUrl || old.hero?.imageUrl || "",
//       imagePublicId:
//         detail.hero?.imagePublicId || old.hero?.imagePublicId || "",
//       imageAlt: detail.hero?.imageAlt || "",
//       imagePosition: detail.hero?.imagePosition || "right",
//       background: detail.hero?.background || "dark",
//     },

//     introduction: {
//       eyebrow: detail.introduction?.eyebrow || "",
//       title: detail.introduction?.title || "Introduction",
//       description: detail.introduction?.description || "",

//       blocks: blocks.map((block, index) => ({
//         ...block,
//         image:
//           block.image ||
//           oldBlocks[index]?.image ||
//           "",
//         imagePublicId:
//           block.imagePublicId ||
//           oldBlocks[index]?.imagePublicId ||
//           "",
//       })),

//       // Keep legacy fields for older event pages.
//       sections: Array.isArray(detail.introduction?.sections)
//         ? detail.introduction.sections
//         : old.introduction?.sections || [],

//       eventInfo: {
//         date: detail.introduction?.eventInfo?.date || "",
//         title: detail.introduction?.eventInfo?.title || "",
//         venue: detail.introduction?.eventInfo?.venue || "",
//         time: detail.introduction?.eventInfo?.time || "",
//         saveDateLink:
//           detail.introduction?.eventInfo?.saveDateLink || "",
//         registrationLink:
//           detail.introduction?.eventInfo?.registrationLink || "",
//         locationLink:
//           detail.introduction?.eventInfo?.locationLink || "",
//       },

//       partners: Array.isArray(detail.introduction?.partners)
//         ? detail.introduction.partners
//         : old.introduction?.partners || [],

//       supporters: Array.isArray(detail.introduction?.supporters)
//         ? detail.introduction.supporters
//         : old.introduction?.supporters || [],

//       contact: {
//         email: detail.introduction?.contact?.email || "",
//         phone: detail.introduction?.contact?.phone || "",
//         website: detail.introduction?.contact?.website || "",
//       },
//     },

//     agenda: {
//       eyebrow: detail.agenda?.eyebrow || "",
//       title: detail.agenda?.title || "",
//       description: detail.agenda?.description || "",
//       imageUrl:
//         detail.agenda?.imageUrl || old.agenda?.imageUrl || "",
//       imagePublicId:
//         detail.agenda?.imagePublicId || old.agenda?.imagePublicId || "",
//       imageAlt: detail.agenda?.imageAlt || "",
//       items: Array.isArray(detail.agenda?.items)
//         ? detail.agenda.items
//         : old.agenda?.items || [],
//     },

//     contentSections: contentSections.map((section, index) => ({
//       ...section,
//       image:
//         section.image ||
//         oldContentSections[index]?.image ||
//         "",
//       imagePublicId:
//         section.imagePublicId ||
//         oldContentSections[index]?.imagePublicId ||
//         "",
//     })),
//   };
// };

// // ------------------------------------------
// // UPLOAD DETAIL PAGE IMAGES
// // ------------------------------------------

// const uploadDetailImages = async (detailPage, files) => {
//   const uploaded = [];

//   try {
//     // Hero image
//     if (files.heroImage) {
//       const result = await uploadFile(
//         files.heroImage,
//         `${EVENT_FOLDER}/Detail-Heroes`
//       );

//       uploaded.push(result);

//       detailPage.hero.imageUrl = result.url;
//       detailPage.hero.imagePublicId = result.publicId;
//     }

//     // Agenda image
//     if (files.agendaImage) {
//       const result = await uploadFile(
//         files.agendaImage,
//         `${EVENT_FOLDER}/Agendas`
//       );

//       uploaded.push(result);

//       detailPage.agenda.imageUrl = result.url;
//       detailPage.agenda.imagePublicId = result.publicId;
//     }

//     // Introduction images
//     for (let index = 0; index < detailPage.introduction.blocks.length; index++) {
//       const fieldName = `introductionBlockImage_${index}`;
//       const file = files[fieldName];

//       if (!file) continue;

//       const result = await uploadFile(
//         file,
//         `${EVENT_FOLDER}/Introduction`
//       );

//       uploaded.push(result);

//       detailPage.introduction.blocks[index].image = result.url;
//       detailPage.introduction.blocks[index].imagePublicId =
//         result.publicId;
//     }

//     // Additional content section images
//     for (let index = 0; index < detailPage.contentSections.length; index++) {
//       const fieldName = `contentSectionImage_${index}`;
//       const file = files[fieldName];

//       if (!file) continue;

//       const result = await uploadFile(
//         file,
//         `${EVENT_FOLDER}/Content-Sections`
//       );

//       uploaded.push(result);

//       detailPage.contentSections[index].image = result.url;
//       detailPage.contentSections[index].imagePublicId =
//         result.publicId;
//     }

//     return uploaded;
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
//     );

//     throw error;
//   }
// };

// // ------------------------------------------
// // COLLECT ALL EVENT IMAGE PUBLIC IDS
// // ------------------------------------------

// const collectEventPublicIds = (event) => {
//   const detail = event.detailPage || {};
//   const introduction = detail.introduction || {};

//   return uniquePublicIds([
//     event.imagePublicId,

//     detail.hero?.imagePublicId,
//     detail.agenda?.imagePublicId,

//     ...(introduction.blocks || []).map(
//       (block) => block.imagePublicId
//     ),

//     ...(detail.contentSections || []).map(
//       (section) => section.imagePublicId
//     ),

//     ...(introduction.partners || []).map(
//       (item) => item.logoPublicId
//     ),

//     ...(introduction.supporters || []).map(
//       (item) => item.logoPublicId
//     ),
//   ]);
// };

// // ------------------------------------------
// // EXPLICIT IMAGE REMOVAL
// // ------------------------------------------

// const removeRequestedImages = async (detailPage, files, reqBody) => {
//   const removedIds = [];

//   const removeHero = reqBody.removeHeroImage === "true";
//   const removeAgenda = reqBody.removeAgendaImage === "true";

//   if (removeHero && !files.heroImage) {
//     if (detailPage.hero.imagePublicId) {
//       removedIds.push(detailPage.hero.imagePublicId);
//     }

//     detailPage.hero.imageUrl = "";
//     detailPage.hero.imagePublicId = "";
//   }

//   if (removeAgenda && !files.agendaImage) {
//     if (detailPage.agenda.imagePublicId) {
//       removedIds.push(detailPage.agenda.imagePublicId);
//     }

//     detailPage.agenda.imageUrl = "";
//     detailPage.agenda.imagePublicId = "";
//   }

//   const removedIntroductionKeys = parseJSON(
//     reqBody.removedIntroductionImageKeys,
//     []
//   );

//   if (Array.isArray(removedIntroductionKeys)) {
//     detailPage.introduction.blocks.forEach((block) => {
//       if (
//         removedIntroductionKeys.includes(block._key) &&
//         !block.imagePublicId
//       ) {
//         block.image = "";
//       }
//     });
//   }

//   const removedContentIndexes = parseJSON(
//     reqBody.removedContentSectionImageIndexes,
//     []
//   );

//   if (Array.isArray(removedContentIndexes)) {
//     removedContentIndexes.forEach((index) => {
//       const section = detailPage.contentSections[Number(index)];

//       if (section) {
//         if (section.imagePublicId) {
//           removedIds.push(section.imagePublicId);
//         }

//         section.image = "";
//         section.imagePublicId = "";
//       }
//     });
//   }

//   return removedIds;
// };

// // ------------------------------------------
// // GET EVENTS
// // ------------------------------------------

// export const getEvents = async (_req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     res.json({ success: true, data: events });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getAdminEvents = async (_req, res) => {
//   try {
//     const events = await Event.find()
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     res.json({ success: true, data: events });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getEventBySlug = async (req, res) => {
//   try {
//     const event = await Event.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).lean();

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     res.json({ success: true, data: event });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ------------------------------------------
// // CREATE EVENT
// // ------------------------------------------

// export const createEvent = async (req, res) => {
//   const filesArray = req.files || [];
//   const files = getFilesByField(filesArray);

//   const uploaded = [];

//   try {
//     const title = String(
//       req.body.title || req.body.heading || ""
//     ).trim();

//     const description = String(
//       req.body.description || req.body.text || ""
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink || req.body.link || ""
//     ).trim();

//     const date = String(req.body.date || "").trim();
//     const category = String(
//       req.body.category || "Conference"
//     ).trim();

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event detail page URL is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     if (!files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Event card image is required.",
//       });
//     }

//     const detailPage = cleanDetailPage(req.body.detailPage);

//     const cardUpload = await uploadFile(
//       files.image,
//       `${EVENT_FOLDER}/Event-Posters`
//     );

//     uploaded.push(cardUpload);

//     const detailUploads = await uploadDetailImages(
//       detailPage,
//       files
//     );

//     uploaded.push(...detailUploads);

//     const slug = await makeUniqueSlug(title);

//     const created = await Event.create({
//       title,
//       slug,
//       description,
//       eventLink,
//       date,
//       category,

//       imageUrl: cardUpload.url,
//       imagePublicId: cardUpload.publicId,

//       detailPage,

//       order:
//         req.body.order !== undefined && req.body.order !== ""
//           ? Number(req.body.order)
//           : await Event.countDocuments(),

//       isActive: normalizeBoolean(req.body.isActive),
//     });

//     res.status(201).json({
//       success: true,
//       data: created,
//       message: "Event created successfully.",
//     });
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
//     );

//     console.error("Create event error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ------------------------------------------
// // UPDATE EVENT
// // ------------------------------------------

// export const updateEvent = async (req, res) => {
//   const filesArray = req.files || [];
//   const files = getFilesByField(filesArray);

//   const uploaded = [];

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const title = String(
//       req.body.title || req.body.heading || event.title
//     ).trim();

//     const description = String(
//       req.body.description ?? req.body.text ?? event.description
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink ?? req.body.link ?? event.eventLink
//     ).trim();

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event detail page URL is required.",
//       });
//     }

//     const category =
//       req.body.category !== undefined
//         ? String(req.body.category).trim()
//         : event.category;

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     const detailPage = cleanDetailPage(
//       req.body.detailPage !== undefined
//         ? req.body.detailPage
//         : event.detailPage,
//       event.detailPage
//     );

//     const removedIds = await removeRequestedImages(
//       detailPage,
//       files,
//       req.body
//     );

//     let newCardUpload = null;

//     if (files.image) {
//       newCardUpload = await uploadFile(
//         files.image,
//         `${EVENT_FOLDER}/Event-Posters`
//       );

//       uploaded.push(newCardUpload);
//     }

//     const detailUploads = await uploadDetailImages(
//       detailPage,
//       files
//     );

//     uploaded.push(...detailUploads);

//     const oldPublicIds = collectEventPublicIds(event);

//     event.title = title;
//     event.slug =
//       title !== event.title
//         ? await makeUniqueSlug(title, id)
//         : event.slug;

//     event.description = description;
//     event.eventLink = eventLink;
//     event.category = category;

//     if (req.body.date !== undefined) {
//       event.date = String(req.body.date).trim();
//     }

//     if (req.body.order !== undefined && req.body.order !== "") {
//       const order = Number(req.body.order);

//       if (!Number.isFinite(order) || order < 0) {
//         throw new Error("Invalid event order.");
//       }

//       event.order = order;
//     }

//     if (req.body.isActive !== undefined) {
//       event.isActive = normalizeBoolean(req.body.isActive);
//     }

//     if (newCardUpload) {
//       event.imageUrl = newCardUpload.url;
//       event.imagePublicId = newCardUpload.publicId;
//     }

//     event.detailPage = detailPage;

//     await event.save();

//     const newPublicIds = collectEventPublicIds(event);

//     const obsoleteIds = oldPublicIds.filter(
//       (publicId) => !newPublicIds.includes(publicId)
//     );

//     await Promise.all(
//       [...obsoleteIds, ...removedIds].map(deleteCloudinaryImage)
//     );

//     res.json({
//       success: true,
//       data: event,
//       message: "Event updated successfully.",
//     });
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
//     );

//     console.error("Update event error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ------------------------------------------
// // DELETE EVENT
// // ------------------------------------------

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const publicIds = collectEventPublicIds(event);

//     await event.deleteOne();

//     await Promise.all(
//       publicIds.map(deleteCloudinaryImage)
//     );

//     res.json({
//       success: true,
//       message: "Event deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete event error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// import mongoose from "mongoose";
// import { Event } from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import { hasBrochureAccess } from "../utils/brochureAccess.js";

// const EVENT_FOLDER = "AIA-Project-Assets/Events";

// const allowedCategories = [
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// const parseJSON = (value, fallback = {}) => {
//   if (!value) return fallback;
//   if (typeof value === "object") return value;

//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const slugify = (value = "") =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// const makeUniqueSlug = async (title, excludeId = null) => {
//   const base = slugify(title) || `event-${Date.now()}`;
//   let slug = base;
//   let count = 1;

//   while (
//     await Event.exists({
//       slug,
//       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
//     })
//   ) {
//     slug = `${base}-${count++}`;
//   }

//   return slug;
// };

// const normalizeBoolean = (value, fallback = true) => {
//   if (value === undefined) return fallback;
//   return value === true || value === "true";
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   if (Array.isArray(files)) {
//     files.forEach((file) => {
//       result[file.fieldname] = file;
//     });
//   } else if (files && typeof files === "object") {
//     Object.entries(files).forEach(([field, fieldFiles]) => {
//       result[field] = Array.isArray(fieldFiles)
//         ? fieldFiles[0]
//         : fieldFiles;
//     });
//   }

//   return result;
// };

// const uploadFile = async (file, folder) => {
//   if (!file) return null;

//   return uploadToCloudinary(file.path, folder);
// };

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error("Cloudinary delete error:", publicId, error.message);
//   }
// };

// const cleanDetailPage = (value = {}) => {
//   const detail = parseJSON(value, {});
//   const hero = detail.hero || {};
//   const introduction = detail.introduction || {};
//   const agenda = detail.agenda || {};

//   return {
//     hero: {
//       ...hero,
//       eyebrow: hero.eyebrow || "",
//       title: hero.title || "",
//       subtitle: hero.subtitle || "",
//       description: hero.description || "",
//       imageUrl: hero.imageUrl || hero.image || "",
//       imagePublicId: hero.imagePublicId || "",
//       imageAlt: hero.imageAlt || "",
//       imagePosition: hero.imagePosition || "right",
//       background: hero.background || "dark",
//     },

//     introduction: {
//       ...introduction,
//       eyebrow: introduction.eyebrow || "",
//       title: introduction.title || "",
//       description: introduction.description || "",
//       blocks: Array.isArray(introduction.blocks)
//         ? introduction.blocks
//         : [],
//       // Keep compatibility with previously saved events.
//       sections: Array.isArray(introduction.sections)
//         ? introduction.sections
//         : [],
//       eventInfo: introduction.eventInfo || {},
//       partners: Array.isArray(introduction.partners)
//         ? introduction.partners
//         : [],
//       supporters: Array.isArray(introduction.supporters)
//         ? introduction.supporters
//         : [],
//       contact: introduction.contact || {},
//     },

//     agenda: {
//       ...agenda,
//       eyebrow: agenda.eyebrow || "",
//       title: agenda.title || "",
//       description: agenda.description || "",
//       imageUrl: agenda.imageUrl || agenda.image || "",
//       imagePublicId: agenda.imagePublicId || "",
//       imageAlt: agenda.imageAlt || "",
//       items: Array.isArray(agenda.items) ? agenda.items : [],
//     },

//     contentSections: Array.isArray(detail.contentSections)
//       ? detail.contentSections
//       : [],
//   };
// };

// const getOldBlock = (oldBlocks, block, index) => {
//   if (block?._key) {
//     const match = oldBlocks.find((item) => item?._key === block._key);
//     if (match) return match;
//   }

//   return oldBlocks[index] || {};
// };

// const uploadDetailImages = async (
//   detailPage,
//   files,
//   oldDetailPage = {}
// ) => {
//   const uploaded = [];
//   const oldImagesToDelete = [];

//   const uploadAndReplace = async ({
//     file,
//     folder,
//     currentPublicId,
//     onSuccess,
//   }) => {
//     if (!file) return;

//     const result = await uploadFile(file, folder);
//     uploaded.push(result);

//     if (currentPublicId && currentPublicId !== result.publicId) {
//       oldImagesToDelete.push(currentPublicId);
//     }

//     onSuccess(result);
//   };

//   try {
//     const oldHero = oldDetailPage?.hero || {};
//     const oldAgenda = oldDetailPage?.agenda || {};

//     await uploadAndReplace({
//       file: files.heroImage,
//       folder: `${EVENT_FOLDER}/Detail-Heroes`,
//       currentPublicId: oldHero.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.hero.imageUrl = result.url;
//         detailPage.hero.imagePublicId = result.publicId;
//       },
//     });

//     await uploadAndReplace({
//       file: files.agendaImage,
//       folder: `${EVENT_FOLDER}/Agendas`,
//       currentPublicId: oldAgenda.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.agenda.imageUrl = result.url;
//         detailPage.agenda.imagePublicId = result.publicId;
//       },
//     });

//     const oldBlocks = oldDetailPage?.introduction?.blocks || [];

//     detailPage.introduction.blocks = await Promise.all(
//       (detailPage.introduction.blocks || []).map(
//         async (block, index) => {
//           const oldBlock = getOldBlock(oldBlocks, block, index);
//           const file = files[`introductionBlockImage_${index}`];

//           const nextBlock = { ...block };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Introduction`,
//             currentPublicId: oldBlock.imagePublicId,
//             onSuccess: (result) => {
//               nextBlock.imageUrl = result.url;
//               nextBlock.image = result.url;
//               nextBlock.imagePublicId = result.publicId;
//             },
//           });

//           // Preserve old image when no new file is selected.
//           if (!file) {
//             nextBlock.imageUrl =
//               nextBlock.imageUrl ||
//               nextBlock.image ||
//               oldBlock.imageUrl ||
//               oldBlock.image ||
//               "";

//             nextBlock.imagePublicId =
//               nextBlock.imagePublicId ||
//               oldBlock.imagePublicId ||
//               "";
//           }

//           return nextBlock;
//         }
//       )
//     );

//     const oldSections = oldDetailPage?.contentSections || [];

//     detailPage.contentSections = await Promise.all(
//       (detailPage.contentSections || []).map(
//         async (section, index) => {
//           const oldSection = oldSections[index] || {};
//           const file = files[`contentSectionImage_${index}`];
//           const nextSection = { ...section };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Content-Sections`,
//             currentPublicId: oldSection.imagePublicId,
//             onSuccess: (result) => {
//               nextSection.imageUrl = result.url;
//               nextSection.image = result.url;
//               nextSection.imagePublicId = result.publicId;
//             },
//           });

//           if (!file) {
//             nextSection.imageUrl =
//               nextSection.imageUrl ||
//               nextSection.image ||
//               oldSection.imageUrl ||
//               oldSection.image ||
//               "";

//             nextSection.imagePublicId =
//               nextSection.imagePublicId ||
//               oldSection.imagePublicId ||
//               "";
//           }

//           return nextSection;
//         }
//       )
//     );


//     // Upload Contributing Partners and Supported By logos.
//     const uploadPartnerLogos = async ({
//       items = [],
//       oldItems = [],
//       fieldPrefix,
//       folder,
//     }) => {
//       const usedOldIndexes = new Set();

//       const nextItems = await Promise.all(
//         items.map(async (item, index) => {
//           let oldIndex = -1;

//           // First match by MongoDB subdocument ID.
//           if (item?._id) {
//             oldIndex = oldItems.findIndex(
//               (oldItem, oldItemIndex) =>
//                 !usedOldIndexes.has(oldItemIndex) &&
//                 String(oldItem?._id) === String(item._id)
//             );
//           }

//           // Fall back to the same array position.
//           if (oldIndex === -1 && oldItems[index] && !usedOldIndexes.has(index)) {
//             oldIndex = index;
//           }

//           const oldItem = oldIndex >= 0 ? oldItems[oldIndex] : {};

//           if (oldIndex >= 0) {
//             usedOldIndexes.add(oldIndex);
//           }

//           const file = files[`${fieldPrefix}_${index}`];
//           const nextItem = { ...item };
//           const oldPublicId = oldItem?.logoPublicId || "";

//           if (file) {
//             await uploadAndReplace({
//               file,
//               folder,
//               currentPublicId: oldPublicId,
//               onSuccess: (result) => {
//                 nextItem.logo = result.url;
//                 nextItem.logoPublicId = result.publicId;
//               },
//             });
//           } else {
//             // Preserve existing logo if the frontend did not send
//             // a logo field. An explicitly empty logo means removal.
//             if (nextItem.logo === undefined) {
//               nextItem.logo = oldItem?.logo || "";
//             }

//             if (nextItem.logoPublicId === undefined) {
//               nextItem.logoPublicId = oldPublicId;
//             }

//             // Delete the old Cloudinary image if its logo was removed.
//             if (
//               oldPublicId &&
//               nextItem.logoPublicId !== oldPublicId
//             ) {
//               oldImagesToDelete.push(oldPublicId);
//             }
//           }

//           return nextItem;
//         })
//       );

//       // Delete logos belonging to partner/supporter rows removed
//       // from the updated event.
//       oldItems.forEach((oldItem, index) => {
//         if (
//           !usedOldIndexes.has(index) &&
//           oldItem?.logoPublicId
//         ) {
//           oldImagesToDelete.push(oldItem.logoPublicId);
//         }
//       });

//       return nextItems;
//     };

//     // Contributing Partners
//     detailPage.introduction.partners = await uploadPartnerLogos({
//       items: detailPage.introduction.partners || [],
//       oldItems: oldDetailPage?.introduction?.partners || [],
//       fieldPrefix: "partnerLogo",
//       folder: `${EVENT_FOLDER}/Partners`,
//     });

//     // Supported By
//     detailPage.introduction.supporters = await uploadPartnerLogos({
//       items: detailPage.introduction.supporters || [],
//       oldItems: oldDetailPage?.introduction?.supporters || [],
//       fieldPrefix: "supporterLogo",
//       folder: `${EVENT_FOLDER}/Supporters`,
//     });


//     return { uploaded, oldImagesToDelete };
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
//     );

//     throw error;
//   }
// };

// const getAllPublicIds = (event) => {
//   const detail = event.detailPage || {};
//   const intro = detail.introduction || {};

//   return [
//     event.imagePublicId,
//     detail.hero?.imagePublicId,
//     detail.agenda?.imagePublicId,

//     ...(intro.blocks || []).map((item) => item.imagePublicId),
//     ...(detail.contentSections || []).map(
//       (item) => item.imagePublicId
//     ),

//     ...(intro.partners || []).map((item) => item.logoPublicId),
//     ...(intro.supporters || []).map((item) => item.logoPublicId),
//   ].filter(Boolean);
// };

// // GET ALL PUBLIC EVENTS
// export const getEvents = async (_req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({ success: true, data: events });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET ALL EVENTS FOR ADMIN
// export const getAdminEvents = async (_req, res) => {
//   try {
//     const events = await Event.find()
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({ success: true, data: events });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET EVENT BY SLUG
// export const getEventBySlug = async (req, res) => {
//   try {
//     const event = await Event.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).lean();

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     return res.json({ success: true, data: event });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // CREATE EVENT
// export const createEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];

//   try {
//     const files = getFilesByField(req.files);

//     const title = String(req.body.title || req.body.heading || "").trim();
//     const description = String(
//       req.body.description || req.body.text || ""
//     ).trim();
//     const eventLink = String(
//       req.body.eventLink || req.body.link || ""
//     ).trim();
//     const category = String(
//       req.body.category || "Conference"
//     ).trim();

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     if (!files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Event card image is required.",
//       });
//     }

//     const detailPage = cleanDetailPage(req.body.detailPage);

//     uploadedCard = await uploadFile(
//       files.image,
//       `${EVENT_FOLDER}/Event-Posters`
//     );

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files
//     );
//     uploadedDetail = detailResult.uploaded;

//     const slug = await makeUniqueSlug(title);

//     const event = await Event.create({
//       title,
//       slug,
//       description,
//       eventLink,
//       date: String(req.body.date || "").trim(),
//       category,
//       imageUrl: uploadedCard.url,
//       imagePublicId: uploadedCard.publicId,
//       detailPage,
//       order:
//         req.body.order !== undefined && req.body.order !== ""
//           ? Number(req.body.order)
//           : await Event.countDocuments(),
//       isActive: normalizeBoolean(req.body.isActive),
//     });

//     return res.status(201).json({
//       success: true,
//       data: event,
//       message: "Event created successfully.",
//     });
//   } catch (error) {
//     if (uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       uploadedDetail.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Create event error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // UPDATE EVENT
// export const updateEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const files = getFilesByField(req.files);

//     const title = String(
//       req.body.title ?? req.body.heading ?? event.title
//     ).trim();

//     const description = String(
//       req.body.description ?? req.body.text ?? event.description
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink ?? req.body.link ?? event.eventLink
//     ).trim();

//     const category = String(
//       req.body.category ?? event.category
//     ).trim();

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     const oldDetailPage = event.detailPage?.toObject
//       ? event.detailPage.toObject()
//       : event.detailPage || {};

//     const detailPage =
//       req.body.detailPage !== undefined
//         ? cleanDetailPage(req.body.detailPage)
//         : cleanDetailPage(oldDetailPage);

//     if (files.image) {
//       uploadedCard = await uploadFile(
//         files.image,
//         `${EVENT_FOLDER}/Event-Posters`
//       );
//     }

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files,
//       oldDetailPage
//     );
//     uploadedDetail = detailResult.uploaded;

//     const oldCardPublicId = event.imagePublicId;

//    const titleChanged = title !== event.title;

// if (titleChanged) {
//   event.slug = await makeUniqueSlug(title, id);
// }

// event.title = title;
//     event.description = description;
//     event.eventLink = eventLink;
//     event.category = category;

//     if (req.body.date !== undefined) {
//       event.date = String(req.body.date).trim();
//     }

//     if (req.body.order !== undefined && req.body.order !== "") {
//       event.order = Number(req.body.order);
//     }

//     if (req.body.isActive !== undefined) {
//       event.isActive = normalizeBoolean(req.body.isActive);
//     }

//     if (uploadedCard) {
//       event.imageUrl = uploadedCard.url;
//       event.imagePublicId = uploadedCard.publicId;
//     }

//     event.detailPage = detailPage;

//     await event.save();

//     if (uploadedCard && oldCardPublicId) {
//       await deleteCloudinaryImage(oldCardPublicId);
//     }

//     await Promise.all(
//       detailResult.oldImagesToDelete.map(deleteCloudinaryImage)
//     );

//     return res.json({
//       success: true,
//       data: event,
//       message: "Event updated successfully.",
//     });
//   } catch (error) {
//     if (uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       uploadedDetail.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Update event error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE EVENT
// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const publicIds = [...new Set(getAllPublicIds(event))];

//     await event.deleteOne();

//     await Promise.all(publicIds.map(deleteCloudinaryImage));

//     return res.json({
//       success: true,
//       message: "Event and its Cloudinary images deleted successfully.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const downloadEventBrochure = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check whether the user has submitted a brochure enquiry
//     const hasAccess = hasBrochureAccess(req);

//     if (!hasAccess) {
//       return res.status(401).json({
//         success: false,
//         requiresEnquiry: true,
//         message: "Please submit an enquiry to download the brochure.",
//       });
//     }

//     // Find event and retrieve its private brochure details
//     const event = await Event.findById(id).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     if (!event.hasBrochure || !event.brochurePublicId) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure not available for this event.",
//       });
//     }

//     // Generate authenticated Cloudinary PDF download URL
//     const downloadUrl = cloudinary.utils.private_download_url(
//       event.brochurePublicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         attachment: true,
//       }
//     );

//     return res.redirect(downloadUrl);
//   } catch (error) {
//     console.error("Download Event Brochure Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to download event brochure.",
//     });
//   }
// };



// import mongoose from "mongoose";
// import fs from "fs/promises";
// import { Event } from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import { hasBrochureAccess } from "../utils/brochureAccess.js";

// import { eventSectionImageIds, readEventSections } from "../utils/eventSections.js";

// const EVENT_FOLDER = "AIA-Project-Assets/Events";
// const MAX_BROCHURE_SIZE = 20 * 1024 * 1024;

// const allowedCategories = [
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// const parseJSON = (value, fallback = {}) => {
//   if (!value) return fallback;
//   if (typeof value === "object") return value;

//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const slugify = (value = "") =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// const makeUniqueSlug = async (title, excludeId = null) => {
//   const base = slugify(title) || `event-${Date.now()}`;
//   let slug = base;
//   let count = 1;

//   while (
//     await Event.exists({
//       slug,
//       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
//     })
//   ) {
//     slug = `${base}-${count++}`;
//   }

//   return slug;
// };

// const normalizeBoolean = (value, fallback = true) => {
//   if (value === undefined) return fallback;
//   return value === true || value === "true";
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   if (Array.isArray(files)) {
//     files.forEach((file) => {
//       result[file.fieldname] = file;
//     });
//   } else if (files && typeof files === "object") {
//     Object.entries(files).forEach(([field, fieldFiles]) => {
//       result[field] = Array.isArray(fieldFiles)
//         ? fieldFiles[0]
//         : fieldFiles;
//     });
//   }

//   return result;
// };

// const removeTemporaryFile = async (file) => {
//   if (!file?.path) return;

//   try {
//     await fs.unlink(file.path);
//   } catch (error) {
//     if (error.code !== "ENOENT") {
//       console.error("Temporary file cleanup error:", error.message);
//     }
//   }
// };

// const removeTemporaryFiles = async (files = {}) => {
//   await Promise.all(
//     Object.values(files)
//       .filter(Boolean)
//       .map(removeTemporaryFile)
//   );
// };

// const uploadFile = async (file, folder) => {
//   if (!file) return null;
//   return uploadToCloudinary(file.path, folder);
// };

// // =====================================================
// // BROCHURE HELPERS
// // =====================================================

// const uploadEventBrochure = async (file) => {
//   if (!file) return null;

//   const extension = file.originalname
//     ?.split(".")
//     .pop()
//     ?.toLowerCase();

//   if (
//     file.mimetype !== "application/pdf" ||
//     extension !== "pdf"
//   ) {
//     throw new Error("Only PDF brochure files are allowed.");
//   }

//   if (file.size > MAX_BROCHURE_SIZE) {
//     throw new Error("Brochure PDF cannot exceed 20 MB.");
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     resource_type: "raw",
//     type: "authenticated",
//     access_mode: "authenticated",
//     folder: `${EVENT_FOLDER}/Brochures`,
//     use_filename: true,
//     unique_filename: true,
//     overwrite: false,
//   });

//   return {
//     publicId: result.public_id,
//     fileName: file.originalname,
//   };
// };

// const deleteEventBrochure = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "raw",
//       type: "authenticated",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error(
//       "Cloudinary brochure delete error:",
//       publicId,
//       error.message
//     );
//   }
// };

// // =====================================================
// // IMAGE HELPERS
// // =====================================================

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error(
//       "Cloudinary image delete error:",
//       publicId,
//       error.message
//     );
//   }
// };

// // =====================================================
// // ORDER HELPERS
// // =====================================================

// const validateOrder = (value) => {
//   if (value === undefined || value === "") {
//     return { valid: true, value: null };
//   }

//   const order = Number(value);

//   if (!Number.isInteger(order) || order < 0) {
//     return {
//       valid: false,
//       value: null,
//     };
//   }

//   return {
//     valid: true,
//     value: order,
//   };
// };

// const getNextEventOrder = async () => {
//   const lastEvent = await Event.findOne()
//     .sort({ order: -1 })
//     .select("order")
//     .lean();

//   if (!lastEvent || !Number.isFinite(Number(lastEvent.order))) {
//     return 0;
//   }

//   return Number(lastEvent.order) + 1;
// };

// // =====================================================
// // DETAIL PAGE HELPERS
// // =====================================================

// const cleanDetailPage = (value = {}) => {
//   const detail = parseJSON(value, {});
//   const hero = detail.hero || {};
//   const introduction = detail.introduction || {};
//   const agenda = detail.agenda || {};

//   return {
//     hero: {
//       ...hero,
//       eyebrow: hero.eyebrow || "",
//       title: hero.title || "",
//       subtitle: hero.subtitle || "",
//       description: hero.description || "",
//       imageUrl: hero.imageUrl || hero.image || "",
//       imagePublicId: hero.imagePublicId || "",
//       imageAlt: hero.imageAlt || "",
//       imagePosition: hero.imagePosition || "right",
//       background: hero.background || "dark",
//     },

//     introduction: {
//       ...introduction,
//       eyebrow: introduction.eyebrow || "",
//       title: introduction.title || "",
//       description: introduction.description || "",
//       blocks: Array.isArray(introduction.blocks)
//         ? introduction.blocks
//         : [],
//       sections: Array.isArray(introduction.sections)
//         ? introduction.sections
//         : [],
//       eventInfo: introduction.eventInfo || {},
//       partners: Array.isArray(introduction.partners)
//         ? introduction.partners
//         : [],
//       supporters: Array.isArray(introduction.supporters)
//         ? introduction.supporters
//         : [],
//       contact: introduction.contact || {},
//     },

//     agenda: {
//       ...agenda,
//       eyebrow: agenda.eyebrow || "",
//       title: agenda.title || "",
//       description: agenda.description || "",
//       imageUrl: agenda.imageUrl || agenda.image || "",
//       imagePublicId: agenda.imagePublicId || "",
//       imageAlt: agenda.imageAlt || "",
//       items: Array.isArray(agenda.items) ? agenda.items : [],
//     },

//     contentSections: Array.isArray(detail.contentSections)
//       ? detail.contentSections
//       : [],
//   };
// };

// const getOldBlock = (oldBlocks, block, index) => {
//   if (block?._key) {
//     const match = oldBlocks.find(
//       (item) => item?._key === block._key
//     );

//     if (match) return match;
//   }

//   return oldBlocks[index] || {};
// };

// const uploadDetailImages = async (
//   detailPage,
//   files,
//   oldDetailPage = {}
// ) => {
//   const uploaded = [];
//   const oldImagesToDelete = [];

//   const uploadAndReplace = async ({
//     file,
//     folder,
//     currentPublicId,
//     onSuccess,
//   }) => {
//     if (!file) return;

//     const result = await uploadFile(file, folder);
//     uploaded.push(result);

//     if (
//       currentPublicId &&
//       currentPublicId !== result.publicId
//     ) {
//       oldImagesToDelete.push(currentPublicId);
//     }

//     onSuccess(result);
//   };

//   try {
//     const oldHero = oldDetailPage?.hero || {};
//     const oldAgenda = oldDetailPage?.agenda || {};

//     await uploadAndReplace({
//       file: files.heroImage,
//       folder: `${EVENT_FOLDER}/Detail-Heroes`,
//       currentPublicId: oldHero.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.hero.imageUrl = result.url;
//         detailPage.hero.imagePublicId = result.publicId;
//       },
//     });

//     await uploadAndReplace({
//       file: files.agendaImage,
//       folder: `${EVENT_FOLDER}/Agendas`,
//       currentPublicId: oldAgenda.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.agenda.imageUrl = result.url;
//         detailPage.agenda.imagePublicId = result.publicId;
//       },
//     });

//     const oldBlocks = oldDetailPage?.introduction?.blocks || [];

//     detailPage.introduction.blocks = await Promise.all(
//       (detailPage.introduction.blocks || []).map(
//         async (block, index) => {
//           const oldBlock = getOldBlock(oldBlocks, block, index);
//           const file = files[`introductionBlockImage_${index}`];
//           const nextBlock = { ...block };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Introduction`,
//             currentPublicId: oldBlock.imagePublicId,
//             onSuccess: (result) => {
//               nextBlock.imageUrl = result.url;
//               nextBlock.image = result.url;
//               nextBlock.imagePublicId = result.publicId;
//             },
//           });

//           if (!file) {
//             nextBlock.imageUrl =
//               nextBlock.imageUrl ||
//               nextBlock.image ||
//               oldBlock.imageUrl ||
//               oldBlock.image ||
//               "";

//             nextBlock.imagePublicId =
//               nextBlock.imagePublicId ||
//               oldBlock.imagePublicId ||
//               "";
//           }

//           return nextBlock;
//         }
//       )
//     );

//     const oldSections = oldDetailPage?.contentSections || [];

//     detailPage.contentSections = await Promise.all(
//       (detailPage.contentSections || []).map(
//         async (section, index) => {
//           const oldSection = oldSections[index] || {};
//           const file = files[`contentSectionImage_${index}`];
//           const nextSection = { ...section };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Content-Sections`,
//             currentPublicId: oldSection.imagePublicId,
//             onSuccess: (result) => {
//               nextSection.imageUrl = result.url;
//               nextSection.image = result.url;
//               nextSection.imagePublicId = result.publicId;
//             },
//           });

//           if (!file) {
//             nextSection.imageUrl =
//               nextSection.imageUrl ||
//               nextSection.image ||
//               oldSection.imageUrl ||
//               oldSection.image ||
//               "";

//             nextSection.imagePublicId =
//               nextSection.imagePublicId ||
//               oldSection.imagePublicId ||
//               "";
//           }

//           return nextSection;
//         }
//       )
//     );

//     const uploadPartnerLogos = async ({
//       items = [],
//       oldItems = [],
//       fieldPrefix,
//       folder,
//     }) => {
//       const usedOldIndexes = new Set();

//       const nextItems = await Promise.all(
//         items.map(async (item, index) => {
//           let oldIndex = -1;

//           if (item?._id) {
//             oldIndex = oldItems.findIndex(
//               (oldItem, oldItemIndex) =>
//                 !usedOldIndexes.has(oldItemIndex) &&
//                 String(oldItem?._id) === String(item._id)
//             );
//           }

//           if (
//             oldIndex === -1 &&
//             oldItems[index] &&
//             !usedOldIndexes.has(index)
//           ) {
//             oldIndex = index;
//           }

//           const oldItem = oldIndex >= 0
//             ? oldItems[oldIndex]
//             : {};

//           if (oldIndex >= 0) {
//             usedOldIndexes.add(oldIndex);
//           }

//           const file = files[`${fieldPrefix}_${index}`];
//           const nextItem = { ...item };
//           const oldPublicId = oldItem?.logoPublicId || "";

//           if (file) {
//             await uploadAndReplace({
//               file,
//               folder,
//               currentPublicId: oldPublicId,
//               onSuccess: (result) => {
//                 nextItem.logo = result.url;
//                 nextItem.logoPublicId = result.publicId;
//               },
//             });
//           } else {
//             if (nextItem.logo === undefined) {
//               nextItem.logo = oldItem?.logo || "";
//             }

//             if (nextItem.logoPublicId === undefined) {
//               nextItem.logoPublicId = oldPublicId;
//             }

//             if (
//               oldPublicId &&
//               nextItem.logoPublicId !== oldPublicId
//             ) {
//               oldImagesToDelete.push(oldPublicId);
//             }
//           }

//           return nextItem;
//         })
//       );

//       oldItems.forEach((oldItem, index) => {
//         if (
//           !usedOldIndexes.has(index) &&
//           oldItem?.logoPublicId
//         ) {
//           oldImagesToDelete.push(oldItem.logoPublicId);
//         }
//       });

//       return nextItems;
//     };

//     detailPage.introduction.partners =
//       await uploadPartnerLogos({
//         items: detailPage.introduction.partners || [],
//         oldItems: oldDetailPage?.introduction?.partners || [],
//         fieldPrefix: "partnerLogo",
//         folder: `${EVENT_FOLDER}/Partners`,
//       });

//     detailPage.introduction.supporters =
//       await uploadPartnerLogos({
//         items: detailPage.introduction.supporters || [],
//         oldItems: oldDetailPage?.introduction?.supporters || [],
//         fieldPrefix: "supporterLogo",
//         folder: `${EVENT_FOLDER}/Supporters`,
//       });

//     return { uploaded, oldImagesToDelete };
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     throw error;
//   }
// };

// const getAllPublicIds = (event) => {
//   const detail = event.detailPage || {};
//   const intro = detail.introduction || {};

//   return [
//     event.imagePublicId,
//     detail.hero?.imagePublicId,
//     detail.agenda?.imagePublicId,

//     ...(intro.blocks || []).map((item) => item.imagePublicId),
//     ...(detail.contentSections || []).map(
//       (item) => item.imagePublicId
//     ),

//     ...(intro.partners || []).map((item) => item.logoPublicId),
//     ...(intro.supporters || []).map((item) => item.logoPublicId),
//     ...eventSectionImageIds(event.eventSections),
//   ].filter(Boolean);
// };

// // =====================================================
// // GET ALL PUBLIC EVENTS
// // =====================================================

// export const getEvents = async (_req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({
//       success: true,
//       data: events,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // GET ALL EVENTS FOR ADMIN
// // =====================================================

// export const getAdminEvents = async (_req, res) => {
//   try {
//     const events = await Event.find()
//       .select("+brochurePublicId")
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({
//       success: true,
//       data: events,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // GET EVENT BY SLUG
// // =====================================================

// export const getEventBySlug = async (req, res) => {
//   try {
//     const event = await Event.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).lean();

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     return res.json({
//       success: true,
//       data: event,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // CREATE EVENT
// // =====================================================

// export const createEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const title = String(
//       req.body.title || req.body.heading || ""
//     ).trim();

//     const description = String(
//       req.body.description || req.body.text || ""
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink || req.body.link || ""
//     ).trim();

//     const category = String(
//       req.body.category || "Conference"
//     ).trim();

//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     if (!files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Event card image is required.",
//       });
//     }

//     const detailPage = cleanDetailPage(req.body.detailPage);
//     const eventSections = await readEventSections(req, undefined, uploadedSectionIds);

//     uploadedCard = await uploadFile(
//       files.image,
//       `${EVENT_FOLDER}/Event-Posters`
//     );

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files
//     );

//     uploadedDetail = detailResult.uploaded;

//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(
//         files.brochurePdf
//       );
//     }

//     const slug = await makeUniqueSlug(title);

//     const eventOrder =
//       orderValidation.value !== null
//         ? orderValidation.value
//         : await getNextEventOrder();

//     const event = await Event.create({
//       title,
//       slug,
//       description,
//       eventLink,
//       date: String(req.body.date || "").trim(),
//       category,

//       imageUrl: uploadedCard.url,
//       imagePublicId: uploadedCard.publicId,

//       detailPage,
//       eventSections,

//       order: eventOrder,
//       isActive: normalizeBoolean(req.body.isActive),

//       brochurePublicId: uploadedBrochure?.publicId || "",
//       brochureFileName: uploadedBrochure?.fileName || "",
//       hasBrochure: Boolean(uploadedBrochure),
//     });

//     saved = true;

//     return res.status(201).json({
//       success: true,
//       data: event,
//       message: "Event created successfully.",
//     });
//   } catch (error) {
//     if (!saved) await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));

//     if (!saved && uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       (saved ? [] : uploadedDetail).map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     if (!saved && uploadedBrochure?.publicId) {
//       await deleteEventBrochure(uploadedBrochure.publicId);
//     }

//     console.error("Create event error:", error);

//     return res.status(
//       error.status === 400 || error.message?.includes("PDF") ||
//       error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// // =====================================================
// // UPDATE EVENT
// // =====================================================

// export const updateEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select(
//       "+brochurePublicId"
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const title = String(
//       req.body.title ?? req.body.heading ?? event.title
//     ).trim();

//     const description = String(
//       req.body.description ?? req.body.text ?? event.description
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink ?? req.body.link ?? event.eventLink
//     ).trim();

//     const category = String(
//       req.body.category ?? event.category
//     ).trim();

//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     const oldDetailPage = event.detailPage?.toObject
//       ? event.detailPage.toObject()
//       : event.detailPage || {};

//     const detailPage =
//       req.body.detailPage !== undefined
//         ? cleanDetailPage(req.body.detailPage)
//         : cleanDetailPage(oldDetailPage);

//     const eventSections = await readEventSections(req, event.eventSections, uploadedSectionIds);

//     if (files.image) {
//       uploadedCard = await uploadFile(
//         files.image,
//         `${EVENT_FOLDER}/Event-Posters`
//       );
//     }

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files,
//       oldDetailPage
//     );

//     uploadedDetail = detailResult.uploaded;

//     // Upload a replacement brochure, if provided.
//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(
//         files.brochurePdf
//       );
//     }

//     const oldCardPublicId = event.imagePublicId;
//     const oldBrochurePublicId = event.brochurePublicId;

//     const titleChanged = title !== event.title;

//     if (titleChanged) {
//       event.slug = await makeUniqueSlug(title, id);
//     }

//     event.title = title;
//     event.description = description;
//     event.eventLink = eventLink;
//     event.category = category;

//     if (req.body.date !== undefined) {
//       event.date = String(req.body.date).trim();
//     }

//     // Preserve existing order unless a new order is submitted.
//     if (orderValidation.value !== null) {
//       event.order = orderValidation.value;
//     }

//     if (req.body.isActive !== undefined) {
//       event.isActive = normalizeBoolean(req.body.isActive);
//     }

//     if (uploadedCard) {
//       event.imageUrl = uploadedCard.url;
//       event.imagePublicId = uploadedCard.publicId;
//     }

//     event.detailPage = detailPage;
//     if (eventSections !== undefined) event.eventSections = eventSections;

//     // Replace existing brochure.
//     if (uploadedBrochure) {
//       event.brochurePublicId = uploadedBrochure.publicId;
//       event.brochureFileName = uploadedBrochure.fileName;
//       event.hasBrochure = true;
//     }

//     // A replacement brochure takes priority over the remove flag.
//     if (!uploadedBrochure && req.body.removeBrochure === "true") {
//       event.brochurePublicId = "";
//       event.brochureFileName = "";
//       event.hasBrochure = false;
//     }

//     await event.save();
//     saved = true;

//     if (uploadedCard && oldCardPublicId) {
//       await deleteCloudinaryImage(oldCardPublicId);
//     }

//     await Promise.all(
//       detailResult.oldImagesToDelete.map(
//         deleteCloudinaryImage
//       )
//     );

//     if (
//       (uploadedBrochure || req.body.removeBrochure === "true") &&
//       oldBrochurePublicId
//     ) {
//       await deleteEventBrochure(oldBrochurePublicId);
//     }

//     return res.json({
//       success: true,
//       data: event,
//       message: "Event updated successfully.",
//     });
//   } catch (error) {
//     if (!saved) await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));

//     if (!saved && uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       (saved ? [] : uploadedDetail).map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     if (!saved && uploadedBrochure?.publicId) {
//       await deleteEventBrochure(uploadedBrochure.publicId);
//     }

//     console.error("Update event error:", error);

//     return res.status(
//       error.status === 400 || error.message?.includes("PDF") ||
//       error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// // =====================================================
// // DELETE EVENT
// // =====================================================

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select(
//       "+brochurePublicId"
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const publicIds = [
//       ...new Set(getAllPublicIds(event)),
//     ];

//     const brochurePublicId = event.brochurePublicId;

//     await event.deleteOne();

//     await Promise.all(
//       publicIds.map(deleteCloudinaryImage)
//     );

//     if (brochurePublicId) {
//       await deleteEventBrochure(brochurePublicId);
//     }

//     return res.json({
//       success: true,
//       message: "Event and its Cloudinary assets deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete event error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // DOWNLOAD EVENT BROCHURE
// // =====================================================


// export const downloadEventBrochure = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     // Check shared brochure access cookie
//     if (!hasBrochureAccess(req)) {
//       return res.status(401).json({
//         success: false,
//         requiresEnquiry: true,
//         message: "Please submit an enquiry to download the brochure.",
//       });
//     }

//     // Find active event
//     const event = await Event.findOne({
//       _id: id,
//       isActive: true,
//     }).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     if (!event.hasBrochure || !event.brochurePublicId) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure not available for this event.",
//       });
//     }

//     // Generate authenticated Cloudinary download URL
//     const downloadUrl = cloudinary.utils.private_download_url(
//       event.brochurePublicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         attachment: true,
//       }
//     );

//     // Fetch PDF from Cloudinary through backend
//     const cloudinaryResponse = await fetch(downloadUrl);

//     if (!cloudinaryResponse.ok) {
//       console.error(
//         "Cloudinary Event PDF Error:",
//         cloudinaryResponse.status,
//         await cloudinaryResponse.text()
//       );

//       return res.status(502).json({
//         success: false,
//         message: "Unable to retrieve event brochure from Cloudinary.",
//       });
//     }

//     const pdfBuffer = Buffer.from(
//       await cloudinaryResponse.arrayBuffer()
//     );

//     const fileName =
//       event.brochureFileName || `event-${id}-brochure.pdf`;

//     const safeFileName = fileName.replace(/["\r\n]/g, "_");

//     res.setHeader("Content-Type", "application/pdf");

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${safeFileName}"`
//     );

//     res.setHeader("Content-Length", pdfBuffer.length);

//     return res.status(200).send(pdfBuffer);

//   } catch (error) {
//     console.error("Download Event Brochure Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to download event brochure.",
//     });
//   }
// };


// import mongoose from "mongoose";
// import fs from "fs/promises";
// import { Event } from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import { isEventSectionImage } from "../config/eventUpload.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import { hasBrochureAccess } from "../utils/brochureAccess.js";

// const EVENT_FOLDER = "AIA-Project-Assets/Events";
// const MAX_BROCHURE_SIZE = 20 * 1024 * 1024;

// const allowedCategories = [
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// const parseJSON = (value, fallback = {}) => {
//   if (!value) return fallback;
//   if (typeof value === "object") return value;

//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const slugify = (value = "") =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// const makeUniqueSlug = async (title, excludeId = null) => {
//   const base = slugify(title) || `event-${Date.now()}`;
//   let slug = base;
//   let count = 1;

//   while (
//     await Event.exists({
//       slug,
//       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
//     })
//   ) {
//     slug = `${base}-${count++}`;
//   }

//   return slug;
// };

// const normalizeBoolean = (value, fallback = true) => {
//   if (value === undefined) return fallback;
//   return value === true || value === "true";
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   if (Array.isArray(files)) {
//     files.forEach((file) => {
//       result[file.fieldname] = file;
//     });
//   } else if (files && typeof files === "object") {
//     Object.entries(files).forEach(([field, fieldFiles]) => {
//       result[field] = Array.isArray(fieldFiles) ? fieldFiles[0] : fieldFiles;
//     });
//   }

//   return result;
// };

// const removeTemporaryFile = async (file) => {
//   if (!file?.path) return;

//   try {
//     await fs.unlink(file.path);
//   } catch (error) {
//     if (error.code !== "ENOENT") {
//       console.error("Temporary file cleanup error:", error.message);
//     }
//   }
// };

// const removeTemporaryFiles = async (files = {}) => {
//   await Promise.all(
//     Object.values(files).filter(Boolean).map(removeTemporaryFile)
//   );
// };

// const uploadFile = async (file, folder) => {
//   if (!file) return null;
//   return uploadToCloudinary(file.path, folder);
// };

// const uploadEventBrochure = async (file) => {
//   if (!file) return null;

//   const extension = file.originalname?.split(".").pop()?.toLowerCase();

//   if (file.mimetype !== "application/pdf" || extension !== "pdf") {
//     throw new Error("Only PDF brochure files are allowed.");
//   }

//   if (file.size > MAX_BROCHURE_SIZE) {
//     throw new Error("Brochure PDF cannot exceed 20 MB.");
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     resource_type: "raw",
//     type: "authenticated",
//     access_mode: "authenticated",
//     folder: `${EVENT_FOLDER}/Brochures`,
//     use_filename: true,
//     unique_filename: true,
//     overwrite: false,
//   });

//   return {
//     publicId: result.public_id,
//     fileName: file.originalname,
//   };
// };

// const deleteEventBrochure = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "raw",
//       type: "authenticated",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error("Cloudinary brochure delete error:", publicId, error.message);
//   }
// };

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error("Cloudinary image delete error:", publicId, error.message);
//   }
// };

// const validateOrder = (value) => {
//   if (value === undefined || value === "") {
//     return { valid: true, value: null };
//   }

//   const order = Number(value);

//   if (!Number.isInteger(order) || order < 0) {
//     return { valid: false, value: null };
//   }

//   return { valid: true, value: order };
// };

// const getNextEventOrder = async () => {
//   const lastEvent = await Event.findOne().sort({ order: -1 }).select("order").lean();

//   if (!lastEvent || !Number.isFinite(Number(lastEvent.order))) {
//     return 0;
//   }

//   return Number(lastEvent.order) + 1;
// };

// const cleanDetailPage = (value = {}) => {
//   const detail = parseJSON(value, {});
//   const hero = detail.hero || {};
//   const introduction = detail.introduction || {};
//   const agenda = detail.agenda || {};

//   return {
//     hero: {
//       ...hero,
//       eyebrow: hero.eyebrow || "",
//       title: hero.title || "",
//       subtitle: hero.subtitle || "",
//       description: hero.description || "",
//       imageUrl: hero.imageUrl || hero.image || "",
//       imagePublicId: hero.imagePublicId || "",
//       imageAlt: hero.imageAlt || "",
//       imagePosition: hero.imagePosition || "right",
//       background: hero.background || "dark",
//     },

//     introduction: {
//       ...introduction,
//       eyebrow: introduction.eyebrow || "",
//       title: introduction.title || "",
//       description: introduction.description || "",
//       blocks: Array.isArray(introduction.blocks) ? introduction.blocks : [],
//       sections: Array.isArray(introduction.sections) ? introduction.sections : [],
//       eventInfo: introduction.eventInfo || {},
//       partners: Array.isArray(introduction.partners) ? introduction.partners : [],
//       supporters: Array.isArray(introduction.supporters) ? introduction.supporters : [],
//       contact: introduction.contact || {},
//     },

//     agenda: {
//       ...agenda,
//       eyebrow: agenda.eyebrow || "",
//       title: agenda.title || "",
//       description: agenda.description || "",
//       imageUrl: agenda.imageUrl || agenda.image || "",
//       imagePublicId: agenda.imagePublicId || "",
//       imageAlt: agenda.imageAlt || "",
//       items: Array.isArray(agenda.items) ? agenda.items : [],
//     },

//     contentSections: Array.isArray(detail.contentSections)
//       ? detail.contentSections
//       : [],
//   };
// };

// const getOldBlock = (oldBlocks, block, index) => {
//   if (block?._key) {
//     const match = oldBlocks.find((item) => item?._key === block._key);
//     if (match) return match;
//   }

//   return oldBlocks[index] || {};
// };

// const uploadDetailImages = async (detailPage, files, oldDetailPage = {}) => {
//   const uploaded = [];
//   const oldImagesToDelete = [];

//   const uploadAndReplace = async ({
//     file,
//     folder,
//     currentPublicId,
//     onSuccess,
//   }) => {
//     if (!file) return;

//     const result = await uploadFile(file, folder);
//     uploaded.push(result);

//     if (currentPublicId && currentPublicId !== result.publicId) {
//       oldImagesToDelete.push(currentPublicId);
//     }

//     onSuccess(result);
//   };

//   try {
//     const oldHero = oldDetailPage?.hero || {};
//     const oldAgenda = oldDetailPage?.agenda || {};

//     await uploadAndReplace({
//       file: files.heroImage,
//       folder: `${EVENT_FOLDER}/Detail-Heroes`,
//       currentPublicId: oldHero.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.hero.imageUrl = result.url;
//         detailPage.hero.imagePublicId = result.publicId;
//       },
//     });

//     await uploadAndReplace({
//       file: files.agendaImage,
//       folder: `${EVENT_FOLDER}/Agendas`,
//       currentPublicId: oldAgenda.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.agenda.imageUrl = result.url;
//         detailPage.agenda.imagePublicId = result.publicId;
//       },
//     });

//     const oldBlocks = oldDetailPage?.introduction?.blocks || [];

//     detailPage.introduction.blocks = await Promise.all(
//       (detailPage.introduction.blocks || []).map(async (block, index) => {
//         const oldBlock = getOldBlock(oldBlocks, block, index);
//         const file = files[`introductionBlockImage_${index}`];
//         const nextBlock = { ...block };

//         await uploadAndReplace({
//           file,
//           folder: `${EVENT_FOLDER}/Introduction`,
//           currentPublicId: oldBlock.imagePublicId,
//           onSuccess: (result) => {
//             nextBlock.imageUrl = result.url;
//             nextBlock.image = result.url;
//             nextBlock.imagePublicId = result.publicId;
//           },
//         });

//         if (!file) {
//           nextBlock.imageUrl =
//             nextBlock.imageUrl || nextBlock.image ||
//             oldBlock.imageUrl || oldBlock.image || "";

//           nextBlock.imagePublicId =
//             nextBlock.imagePublicId || oldBlock.imagePublicId || "";
//         }

//         return nextBlock;
//       })
//     );

//     const oldSections = oldDetailPage?.contentSections || [];

//     detailPage.contentSections = await Promise.all(
//       (detailPage.contentSections || []).map(async (section, index) => {
//         const oldSection = oldSections[index] || {};
//         const file = files[`contentSectionImage_${index}`];
//         const nextSection = { ...section };

//         await uploadAndReplace({
//           file,
//           folder: `${EVENT_FOLDER}/Content-Sections`,
//           currentPublicId: oldSection.imagePublicId,
//           onSuccess: (result) => {
//             nextSection.imageUrl = result.url;
//             nextSection.image = result.url;
//             nextSection.imagePublicId = result.publicId;
//           },
//         });

//         if (!file) {
//           nextSection.imageUrl =
//             nextSection.imageUrl || nextSection.image ||
//             oldSection.imageUrl || oldSection.image || "";

//           nextSection.imagePublicId =
//             nextSection.imagePublicId || oldSection.imagePublicId || "";
//         }

//         return nextSection;
//       })
//     );

//     const uploadPartnerLogos = async ({
//       items = [],
//       oldItems = [],
//       fieldPrefix,
//       folder,
//     }) => {
//       const usedOldIndexes = new Set();

//       const nextItems = await Promise.all(
//         items.map(async (item, index) => {
//           let oldIndex = -1;

//           if (item?._id) {
//             oldIndex = oldItems.findIndex(
//               (oldItem, oldItemIndex) =>
//                 !usedOldIndexes.has(oldItemIndex) &&
//                 String(oldItem?._id) === String(item._id)
//             );
//           }

//           if (oldIndex === -1 && oldItems[index] && !usedOldIndexes.has(index)) {
//             oldIndex = index;
//           }

//           const oldItem = oldIndex >= 0 ? oldItems[oldIndex] : {};

//           if (oldIndex >= 0) {
//             usedOldIndexes.add(oldIndex);
//           }

//           const file = files[`${fieldPrefix}_${index}`];
//           const nextItem = { ...item };
//           const oldPublicId = oldItem?.logoPublicId || "";

//           if (file) {
//             await uploadAndReplace({
//               file,
//               folder,
//               currentPublicId: oldPublicId,
//               onSuccess: (result) => {
//                 nextItem.logo = result.url;
//                 nextItem.logoPublicId = result.publicId;
//               },
//             });
//           } else {
//             if (nextItem.logo === undefined) {
//               nextItem.logo = oldItem?.logo || "";
//             }

//             if (nextItem.logoPublicId === undefined) {
//               nextItem.logoPublicId = oldPublicId;
//             }

//             if (oldPublicId && nextItem.logoPublicId !== oldPublicId) {
//               oldImagesToDelete.push(oldPublicId);
//             }
//           }

//           return nextItem;
//         })
//       );

//       oldItems.forEach((oldItem, index) => {
//         if (!usedOldIndexes.has(index) && oldItem?.logoPublicId) {
//           oldImagesToDelete.push(oldItem.logoPublicId);
//         }
//       });

//       return nextItems;
//     };

//     detailPage.introduction.partners = await uploadPartnerLogos({
//       items: detailPage.introduction.partners || [],
//       oldItems: oldDetailPage?.introduction?.partners || [],
//       fieldPrefix: "partnerLogo",
//       folder: `${EVENT_FOLDER}/Partners`,
//     });

//     detailPage.introduction.supporters = await uploadPartnerLogos({
//       items: detailPage.introduction.supporters || [],
//       oldItems: oldDetailPage?.introduction?.supporters || [],
//       fieldPrefix: "supporterLogo",
//       folder: `${EVENT_FOLDER}/Supporters`,
//     });

//     return { uploaded, oldImagesToDelete };
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) => deleteCloudinaryImage(item.publicId))
//     );
//     throw error;
//   }
// };

// // Speaker and gallery uploads
// const imageType = /^image\/(jpeg|png|webp|avif|gif)$/;
// const speakersFolder = `${EVENT_FOLDER}/Speakers`;
// const galleryFolder = `${EVENT_FOLDER}/Gallery`;
// const trim = (value) => (typeof value === "string" ? value.trim() : "");
// const invalid = (message) =>
//   Object.assign(new Error(message), { status: 400, statusCode: 400 });

// function asHttpUrl(value) {
//   const url = trim(value);
//   if (!url) return "";

//   try {
//     if (["http:", "https:"].includes(new URL(url).protocol)) return url;
//   } catch {
//     // Report invalid links consistently.
//   }

//   throw invalid("Card links must use an absolute HTTP or HTTPS URL.");
// }

// function eventSectionImageIds(sections) {
//   const galleryCards = (sections?.gallery || []).flatMap((group) => group.cards);

//   return [...(sections?.speakers || []), ...galleryCards]
//     .map((card) => card.imagePublicId)
//     .filter(Boolean);
// }

// async function readEventSections(req, previous, uploadedIds) {
//   const raw = req.body.eventSections;
//   const sectionFiles = (req.files || []).filter((file) =>
//     isEventSectionImage(file.fieldname)
//   );

//   if (raw === undefined) {
//     if (sectionFiles.length) {
//       throw invalid("Event section images require matching card data.");
//     }
//     return undefined;
//   }

//   let input;
//   try {
//     input = typeof raw === "string" ? JSON.parse(raw) : raw;
//   } catch {
//     throw invalid("Invalid event sections.");
//   }

//   if (
//     !Array.isArray(input?.speakers) ||
//     !Array.isArray(input?.gallery) ||
//     !["", "conference", "workshop"].includes(input.format ?? "")
//   ) {
//     throw invalid("Invalid event sections.");
//   }

//   const images = new Map();
//   for (const file of sectionFiles) {
//     if (
//       images.has(file.fieldname) ||
//       !imageType.test(file.mimetype) ||
//       file.size > 5 * 1024 * 1024
//     ) {
//       throw invalid(
//         "Each speaker or gallery image must be a supported image of up to 5 MB."
//       );
//     }
//     images.set(file.fieldname, file);
//   }

//   const previousCards = [
//     ...(previous?.speakers || []),
//     ...(previous?.gallery || []).flatMap((group) => group.cards),
//   ];
//   const existingImages = new Map(
//     previousCards.map((card) => [card.imageUrl, card.imagePublicId])
//   );
//   const pendingUploads = [];

//   function normalizeCard(inputCard, field, folder) {
//     const file = images.get(field);
//     const name = trim(inputCard?.name);
//     const imageUrl = trim(inputCard?.imageUrl);

//     if (!name || (!file && !existingImages.has(imageUrl))) {
//       throw invalid("Each speaker and gallery card needs a name and image.");
//     }

//     const card = {
//       name,
//       subtitle: trim(inputCard.subtitle),
//       description: trim(inputCard.description),
//       imageAlt: trim(inputCard.imageAlt),
//       url: asHttpUrl(inputCard.url),
//       imageUrl: existingImages.has(imageUrl) ? imageUrl : "",
//       imagePublicId: existingImages.get(imageUrl),
//     };

//     if (file) {
//       pendingUploads.push({ file, card, folder });
//       images.delete(field);
//     }

//     return card;
//   }

//   const speakers = input.speakers.map((card, index) =>
//     normalizeCard(card, `speakerImage_${index}`, speakersFolder)
//   );

//   const gallery = input.gallery.map((group, index) => {
//     if (!trim(group?.heading) || !Array.isArray(group.cards) || !group.cards.length) {
//       throw invalid("Each gallery session needs a heading and at least one card.");
//     }

//     return {
//       heading: trim(group.heading),
//       description: trim(group.description),
//       cards: group.cards.map((card, cardIndex) =>
//         normalizeCard(card, `galleryImage_${index}_${cardIndex}`, galleryFolder)
//       ),
//     };
//   });

//   if (images.size) {
//     throw invalid("An uploaded image does not have a matching card.");
//   }

//   for (const { file, card, folder } of pendingUploads) {
//     const result = await uploadToCloudinary(file.path, folder, {
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
//     });
//     uploadedIds.push(result.publicId);
//     card.imageUrl = result.url;
//     card.imagePublicId = result.publicId;
//   }

//   return { format: input.format ?? "", speakers, gallery };
// }

// const getAllPublicIds = (event) => {
//   const detail = event.detailPage || {};
//   const intro = detail.introduction || {};

//   return [
//     event.imagePublicId,
//     detail.hero?.imagePublicId,
//     detail.agenda?.imagePublicId,
//     ...(intro.blocks || []).map((item) => item.imagePublicId),
//     ...(detail.contentSections || []).map((item) => item.imagePublicId),
//     ...(intro.partners || []).map((item) => item.logoPublicId),
//     ...(intro.supporters || []).map((item) => item.logoPublicId),
//     ...eventSectionImageIds(event.eventSections),
//   ].filter(Boolean);
// };

// export const getEvents = async (_req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({ success: true, data: events });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAdminEvents = async (_req, res) => {
//   try {
//     const events = await Event.find()
//       .select("+brochurePublicId")
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({ success: true, data: events });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getEventBySlug = async (req, res) => {
//   try {
//     const event = await Event.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).lean();

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     return res.json({ success: true, data: event });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const createEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const title = String(req.body.title || req.body.heading || "").trim();
//     const description = String(req.body.description || req.body.text || "").trim();
//     const eventLink = String(req.body.eventLink || req.body.link || "").trim();
//     const category = String(req.body.category || "Conference").trim();
//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     if (!files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Event card image is required.",
//       });
//     }

//     const detailPage = cleanDetailPage(req.body.detailPage);
//     const eventSections = await readEventSections(req, undefined, uploadedSectionIds);

//     uploadedCard = await uploadFile(files.image, `${EVENT_FOLDER}/Event-Posters`);

//     const detailResult = await uploadDetailImages(detailPage, files);
//     uploadedDetail = detailResult.uploaded;

//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(files.brochurePdf);
//     }

//     const slug = await makeUniqueSlug(title);
//     const eventOrder =
//       orderValidation.value !== null
//         ? orderValidation.value
//         : await getNextEventOrder();

//     const event = await Event.create({
//       title,
//       slug,
//       description,
//       eventLink,
//       date: String(req.body.date || "").trim(),
//       category,
//       imageUrl: uploadedCard.url,
//       imagePublicId: uploadedCard.publicId,
//       detailPage,
//       eventSections,
//       order: eventOrder,
//       isActive: normalizeBoolean(req.body.isActive),
//       brochurePublicId: uploadedBrochure?.publicId || "",
//       brochureFileName: uploadedBrochure?.fileName || "",
//       hasBrochure: Boolean(uploadedBrochure),
//     });

//     saved = true;

//     return res.status(201).json({
//       success: true,
//       data: event,
//       message: "Event created successfully.",
//     });
//   } catch (error) {
//     if (!saved) {
//       await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));

//       if (uploadedCard?.publicId) {
//         await deleteCloudinaryImage(uploadedCard.publicId);
//       }

//       await Promise.all(
//         uploadedDetail.map((item) => deleteCloudinaryImage(item.publicId))
//       );

//       if (uploadedBrochure?.publicId) {
//         await deleteEventBrochure(uploadedBrochure.publicId);
//       }
//     }

//     console.error("Create event error:", error);

//     return res.status(
//       error.status === 400 ||
//       error.message?.includes("PDF") ||
//       error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({ success: false, message: error.message });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// export const updateEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const title = String(req.body.title ?? req.body.heading ?? event.title).trim();
//     const description = String(
//       req.body.description ?? req.body.text ?? event.description
//     ).trim();
//     const eventLink = String(
//       req.body.eventLink ?? req.body.link ?? event.eventLink
//     ).trim();
//     const category = String(req.body.category ?? event.category).trim();
//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     const oldDetailPage = event.detailPage?.toObject
//       ? event.detailPage.toObject()
//       : event.detailPage || {};

//     const detailPage =
//       req.body.detailPage !== undefined
//         ? cleanDetailPage(req.body.detailPage)
//         : cleanDetailPage(oldDetailPage);

//     const oldSectionImageIds = new Set(eventSectionImageIds(event.eventSections));
//     const eventSections = await readEventSections(
//       req,
//       event.eventSections,
//       uploadedSectionIds
//     );

//     if (files.image) {
//       uploadedCard = await uploadFile(files.image, `${EVENT_FOLDER}/Event-Posters`);
//     }

//     const detailResult = await uploadDetailImages(detailPage, files, oldDetailPage);
//     uploadedDetail = detailResult.uploaded;

//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(files.brochurePdf);
//     }

//     const oldCardPublicId = event.imagePublicId;
//     const oldBrochurePublicId = event.brochurePublicId;

//     if (title !== event.title) {
//       event.slug = await makeUniqueSlug(title, id);
//     }

//     event.title = title;
//     event.description = description;
//     event.eventLink = eventLink;
//     event.category = category;

//     if (req.body.date !== undefined) {
//       event.date = String(req.body.date).trim();
//     }

//     if (orderValidation.value !== null) {
//       event.order = orderValidation.value;
//     }

//     if (req.body.isActive !== undefined) {
//       event.isActive = normalizeBoolean(req.body.isActive);
//     }

//     if (uploadedCard) {
//       event.imageUrl = uploadedCard.url;
//       event.imagePublicId = uploadedCard.publicId;
//     }

//     event.detailPage = detailPage;

//     if (eventSections !== undefined) {
//       // Reject concurrent section edits based on an outdated image list.
//       event.$where = {
//         ...event.$where,
//         __v: event.__v ?? { $exists: false },
//       };
//       event.increment();
//       event.eventSections = eventSections;
//     }

//     if (uploadedBrochure) {
//       event.brochurePublicId = uploadedBrochure.publicId;
//       event.brochureFileName = uploadedBrochure.fileName;
//       event.hasBrochure = true;
//     }

//     if (!uploadedBrochure && req.body.removeBrochure === "true") {
//       event.brochurePublicId = "";
//       event.brochureFileName = "";
//       event.hasBrochure = false;
//     }

//     await event.save();
//     saved = true;

//     if (eventSections !== undefined) {
//       const retainedImageIds = new Set(getAllPublicIds(event));
//       const removedSectionImageIds = [...oldSectionImageIds].filter(
//         (publicId) => !retainedImageIds.has(publicId)
//       );

//       await Promise.all(removedSectionImageIds.map(deleteCloudinaryImage));
//     }

//     if (uploadedCard && oldCardPublicId) {
//       await deleteCloudinaryImage(oldCardPublicId);
//     }

//     await Promise.all(detailResult.oldImagesToDelete.map(deleteCloudinaryImage));

//     if (
//       (uploadedBrochure || req.body.removeBrochure === "true") &&
//       oldBrochurePublicId
//     ) {
//       await deleteEventBrochure(oldBrochurePublicId);
//     }

//     return res.json({
//       success: true,
//       data: event,
//       message: "Event updated successfully.",
//     });
//   } catch (error) {
//     if (!saved) {
//       await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));

//       if (uploadedCard?.publicId) {
//         await deleteCloudinaryImage(uploadedCard.publicId);
//       }

//       await Promise.all(
//         uploadedDetail.map((item) => deleteCloudinaryImage(item.publicId))
//       );

//       if (uploadedBrochure?.publicId) {
//         await deleteEventBrochure(uploadedBrochure.publicId);
//       }
//     }

//     if (error.name === "VersionError" || error.name === "DocumentNotFoundError") {
//       return res.status(409).json({
//         success: false,
//         message: "This event changed while you were editing it. Reopen it and retry.",
//       });
//     }

//     console.error("Update event error:", error);

//     return res.status(
//       error.status === 400 ||
//       error.message?.includes("PDF") ||
//       error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({ success: false, message: error.message });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const publicIds = [...new Set(getAllPublicIds(event))];
//     const brochurePublicId = event.brochurePublicId;

//     await event.deleteOne();
//     await Promise.all(publicIds.map(deleteCloudinaryImage));

//     if (brochurePublicId) {
//       await deleteEventBrochure(brochurePublicId);
//     }

//     return res.json({
//       success: true,
//       message: "Event and its Cloudinary assets deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete event error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const downloadEventBrochure = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     if (!hasBrochureAccess(req)) {
//       return res.status(401).json({
//         success: false,
//         requiresEnquiry: true,
//         message: "Please submit an enquiry to download the brochure.",
//       });
//     }

//     const event = await Event.findOne({
//       _id: id,
//       isActive: true,
//     }).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     if (!event.hasBrochure || !event.brochurePublicId) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure not available for this event.",
//       });
//     }

//     const downloadUrl = cloudinary.utils.private_download_url(
//       event.brochurePublicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         attachment: true,
//       }
//     );

//     const cloudinaryResponse = await fetch(downloadUrl);

//     if (!cloudinaryResponse.ok) {
//       console.error(
//         "Cloudinary Event PDF Error:",
//         cloudinaryResponse.status,
//         await cloudinaryResponse.text()
//       );

//       return res.status(502).json({
//         success: false,
//         message: "Unable to retrieve event brochure from Cloudinary.",
//       });
//     }

//     const pdfBuffer = Buffer.from(await cloudinaryResponse.arrayBuffer());
//     const fileName = event.brochureFileName || `event-${id}-brochure.pdf`;
//     const safeFileName = fileName.replace(/["\r\n]/g, "_");

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${safeFileName}"`
//     );
//     res.setHeader("Content-Length", pdfBuffer.length);

//     return res.status(200).send(pdfBuffer);
//   } catch (error) {
//     console.error("Download Event Brochure Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to download event brochure.",
//     });
//   }
// };

// import mongoose from "mongoose";
// import fs from "fs/promises";
// import { createReadStream, createWriteStream } from "node:fs";
// import { tmpdir } from "node:os";
// import { join } from "node:path";
// import { Readable } from "node:stream";
// import { pipeline } from "node:stream/promises";
// import JSZip from "jszip";
// import { Event } from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import { hasBrochureAccess } from "../utils/brochureAccess.js";

// import { isEventSectionImage, isEventResource, eventResourceType } from "../config/eventUpload.js";

// import { eventTemplate } from "../utils/eventStage.js";

// const EVENT_FOLDER = "AIA-Project-Assets/Events";
// const MAX_BROCHURE_SIZE = 20 * 1024 * 1024;

// const allowedCategories = [
//   "Conference",
//   "Workshops",
//   "Webinars",
//   "Training Program",
//   "Exhibitions",
// ];

// const parseJSON = (value, fallback = {}) => {
//   if (!value) return fallback;
//   if (typeof value === "object") return value;

//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const slugify = (value = "") =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// const makeUniqueSlug = async (title, excludeId = null) => {
//   const base = slugify(title) || `event-${Date.now()}`;
//   let slug = base;
//   let count = 1;

//   while (
//     await Event.exists({
//       slug,
//       ...(excludeId ? { _id: { $ne: excludeId } } : {}),
//     })
//   ) {
//     slug = `${base}-${count++}`;
//   }

//   return slug;
// };

// const normalizeBoolean = (value, fallback = true) => {
//   if (value === undefined) return fallback;
//   return value === true || value === "true";
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   if (Array.isArray(files)) {
//     files.forEach((file) => {
//       result[file.fieldname] = file;
//     });
//   } else if (files && typeof files === "object") {
//     Object.entries(files).forEach(([field, fieldFiles]) => {
//       result[field] = Array.isArray(fieldFiles)
//         ? fieldFiles[0]
//         : fieldFiles;
//     });
//   }

//   return result;
// };

// const removeTemporaryFile = async (file) => {
//   if (!file?.path) return;

//   try {
//     await fs.unlink(file.path);
//   } catch (error) {
//     if (error.code !== "ENOENT") {
//       console.error("Temporary file cleanup error:", error.message);
//     }
//   }
// };

// const removeTemporaryFiles = async (files = {}) => {
//   await Promise.all(
//     Object.values(files)
//       .filter(Boolean)
//       .map(removeTemporaryFile)
//   );
// };

// const uploadFile = async (file, folder) => {
//   if (!file) return null;
//   return uploadToCloudinary(file.path, folder);
// };

// // =====================================================
// // BROCHURE HELPERS
// // =====================================================

// const uploadEventBrochure = async (file) => {
//   if (!file) return null;

//   const extension = file.originalname
//     ?.split(".")
//     .pop()
//     ?.toLowerCase();

//   if (
//     file.mimetype !== "application/pdf" ||
//     extension !== "pdf"
//   ) {
//     throw new Error("Only PDF brochure files are allowed.");
//   }

//   if (file.size > MAX_BROCHURE_SIZE) {
//     throw new Error("Brochure PDF cannot exceed 20 MB.");
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     resource_type: "raw",
//     type: "authenticated",
//     access_mode: "authenticated",
//     folder: `${EVENT_FOLDER}/Brochures`,
//     use_filename: true,
//     unique_filename: true,
//     overwrite: false,
//   });

//   return {
//     publicId: result.public_id,
//     fileName: file.originalname,
//   };
// };

// const deleteEventBrochure = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "raw",
//       type: "authenticated",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error(
//       "Cloudinary brochure delete error:",
//       publicId,
//       error.message
//     );
//   }
// };

// // =====================================================
// // IMAGE HELPERS
// // =====================================================

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });
//   } catch (error) {
//     console.error(
//       "Cloudinary image delete error:",
//       publicId,
//       error.message
//     );
//   }
// };

// // =====================================================
// // ORDER HELPERS
// // =====================================================

// const validateOrder = (value) => {
//   if (value === undefined || value === "") {
//     return { valid: true, value: null };
//   }

//   const order = Number(value);

//   if (!Number.isInteger(order) || order < 0) {
//     return {
//       valid: false,
//       value: null,
//     };
//   }

//   return {
//     valid: true,
//     value: order,
//   };
// };

// const getNextEventOrder = async () => {
//   const lastEvent = await Event.findOne()
//     .sort({ order: -1 })
//     .select("order")
//     .lean();

//   if (!lastEvent || !Number.isFinite(Number(lastEvent.order))) {
//     return 0;
//   }

//   return Number(lastEvent.order) + 1;
// };

// // =====================================================
// // DETAIL PAGE HELPERS
// // =====================================================

// const cleanDetailPage = (value = {}) => {
//   const detail = parseJSON(value, {});
//   const hero = detail.hero || {};
//   const introduction = detail.introduction || {};
//   const agenda = detail.agenda || {};

//   return {
//     hero: {
//       ...hero,
//       eyebrow: hero.eyebrow || "",
//       title: hero.title || "",
//       subtitle: hero.subtitle || "",
//       description: hero.description || "",
//       imageUrl: hero.imageUrl || hero.image || "",
//       imagePublicId: hero.imagePublicId || "",
//       imageAlt: hero.imageAlt || "",
//       imagePosition: hero.imagePosition || "right",
//       background: hero.background || "dark",
//     },

//     introduction: {
//       ...introduction,
//       eyebrow: introduction.eyebrow || "",
//       title: introduction.title || "",
//       description: introduction.description || "",
//       blocks: Array.isArray(introduction.blocks)
//         ? introduction.blocks
//         : [],
//       sections: Array.isArray(introduction.sections)
//         ? introduction.sections
//         : [],
//       eventInfo: introduction.eventInfo || {},
//       partners: Array.isArray(introduction.partners)
//         ? introduction.partners
//         : [],
//       supporters: Array.isArray(introduction.supporters)
//         ? introduction.supporters
//         : [],
//       contact: introduction.contact || {},
//     },

//     agenda: {
//       ...agenda,
//       eyebrow: agenda.eyebrow || "",
//       title: agenda.title || "",
//       description: agenda.description || "",
//       imageUrl: agenda.imageUrl || agenda.image || "",
//       imagePublicId: agenda.imagePublicId || "",
//       imageAlt: agenda.imageAlt || "",
//       items: Array.isArray(agenda.items) ? agenda.items : [],
//     },

//     contentSections: Array.isArray(detail.contentSections)
//       ? detail.contentSections
//       : [],
//   };
// };

// const getOldBlock = (oldBlocks, block, index) => {
//   if (block?._key) {
//     const match = oldBlocks.find(
//       (item) => item?._key === block._key
//     );

//     if (match) return match;
//   }

//   return oldBlocks[index] || {};
// };

// const uploadDetailImages = async (
//   detailPage,
//   files,
//   oldDetailPage = {}
// ) => {
//   const uploaded = [];
//   const oldImagesToDelete = [];

//   const uploadAndReplace = async ({
//     file,
//     folder,
//     currentPublicId,
//     onSuccess,
//   }) => {
//     if (!file) return;

//     const result = await uploadFile(file, folder);
//     uploaded.push(result);

//     if (
//       currentPublicId &&
//       currentPublicId !== result.publicId
//     ) {
//       oldImagesToDelete.push(currentPublicId);
//     }

//     onSuccess(result);
//   };

//   try {
//     const oldHero = oldDetailPage?.hero || {};
//     const oldAgenda = oldDetailPage?.agenda || {};

//     await uploadAndReplace({
//       file: files.heroImage,
//       folder: `${EVENT_FOLDER}/Detail-Heroes`,
//       currentPublicId: oldHero.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.hero.imageUrl = result.url;
//         detailPage.hero.imagePublicId = result.publicId;
//       },
//     });

//     await uploadAndReplace({
//       file: files.agendaImage,
//       folder: `${EVENT_FOLDER}/Agendas`,
//       currentPublicId: oldAgenda.imagePublicId,
//       onSuccess: (result) => {
//         detailPage.agenda.imageUrl = result.url;
//         detailPage.agenda.imagePublicId = result.publicId;
//       },
//     });

//     const oldBlocks = oldDetailPage?.introduction?.blocks || [];

//     detailPage.introduction.blocks = await Promise.all(
//       (detailPage.introduction.blocks || []).map(
//         async (block, index) => {
//           const oldBlock = getOldBlock(oldBlocks, block, index);
//           const file = files[`introductionBlockImage_${index}`];
//           const nextBlock = { ...block };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Introduction`,
//             currentPublicId: oldBlock.imagePublicId,
//             onSuccess: (result) => {
//               nextBlock.imageUrl = result.url;
//               nextBlock.image = result.url;
//               nextBlock.imagePublicId = result.publicId;
//             },
//           });

//           if (!file) {
//             nextBlock.imageUrl =
//               nextBlock.imageUrl ||
//               nextBlock.image ||
//               oldBlock.imageUrl ||
//               oldBlock.image ||
//               "";

//             nextBlock.imagePublicId =
//               nextBlock.imagePublicId ||
//               oldBlock.imagePublicId ||
//               "";
//           }

//           return nextBlock;
//         }
//       )
//     );

//     const oldSections = oldDetailPage?.contentSections || [];

//     detailPage.contentSections = await Promise.all(
//       (detailPage.contentSections || []).map(
//         async (section, index) => {
//           const oldSection = oldSections[index] || {};
//           const file = files[`contentSectionImage_${index}`];
//           const nextSection = { ...section };

//           await uploadAndReplace({
//             file,
//             folder: `${EVENT_FOLDER}/Content-Sections`,
//             currentPublicId: oldSection.imagePublicId,
//             onSuccess: (result) => {
//               nextSection.imageUrl = result.url;
//               nextSection.image = result.url;
//               nextSection.imagePublicId = result.publicId;
//             },
//           });

//           if (!file) {
//             nextSection.imageUrl =
//               nextSection.imageUrl ||
//               nextSection.image ||
//               oldSection.imageUrl ||
//               oldSection.image ||
//               "";

//             nextSection.imagePublicId =
//               nextSection.imagePublicId ||
//               oldSection.imagePublicId ||
//               "";
//           }

//           return nextSection;
//         }
//       )
//     );

//     const uploadPartnerLogos = async ({
//       items = [],
//       oldItems = [],
//       fieldPrefix,
//       folder,
//     }) => {
//       const usedOldIndexes = new Set();

//       const nextItems = await Promise.all(
//         items.map(async (item, index) => {
//           let oldIndex = -1;

//           if (item?._id) {
//             oldIndex = oldItems.findIndex(
//               (oldItem, oldItemIndex) =>
//                 !usedOldIndexes.has(oldItemIndex) &&
//                 String(oldItem?._id) === String(item._id)
//             );
//           }

//           if (
//             oldIndex === -1 &&
//             oldItems[index] &&
//             !usedOldIndexes.has(index)
//           ) {
//             oldIndex = index;
//           }

//           const oldItem = oldIndex >= 0
//             ? oldItems[oldIndex]
//             : {};

//           if (oldIndex >= 0) {
//             usedOldIndexes.add(oldIndex);
//           }

//           const file = files[`${fieldPrefix}_${index}`];
//           const nextItem = { ...item };
//           const oldPublicId = oldItem?.logoPublicId || "";

//           if (file) {
//             await uploadAndReplace({
//               file,
//               folder,
//               currentPublicId: oldPublicId,
//               onSuccess: (result) => {
//                 nextItem.logo = result.url;
//                 nextItem.logoPublicId = result.publicId;
//               },
//             });
//           } else {
//             if (nextItem.logo === undefined) {
//               nextItem.logo = oldItem?.logo || "";
//             }

//             if (nextItem.logoPublicId === undefined) {
//               nextItem.logoPublicId = oldPublicId;
//             }

//             if (
//               oldPublicId &&
//               nextItem.logoPublicId !== oldPublicId
//             ) {
//               oldImagesToDelete.push(oldPublicId);
//             }
//           }

//           return nextItem;
//         })
//       );

//       oldItems.forEach((oldItem, index) => {
//         if (
//           !usedOldIndexes.has(index) &&
//           oldItem?.logoPublicId
//         ) {
//           oldImagesToDelete.push(oldItem.logoPublicId);
//         }
//       });

//       return nextItems;
//     };

//     detailPage.introduction.partners =
//       await uploadPartnerLogos({
//         items: detailPage.introduction.partners || [],
//         oldItems: oldDetailPage?.introduction?.partners || [],
//         fieldPrefix: "partnerLogo",
//         folder: `${EVENT_FOLDER}/Partners`,
//       });

//     detailPage.introduction.supporters =
//       await uploadPartnerLogos({
//         items: detailPage.introduction.supporters || [],
//         oldItems: oldDetailPage?.introduction?.supporters || [],
//         fieldPrefix: "supporterLogo",
//         folder: `${EVENT_FOLDER}/Supporters`,
//       });

//     return { uploaded, oldImagesToDelete };
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     throw error;
//   }
// };

// // Speaker and gallery uploads
// const imageType = /^image\/(jpeg|png|webp|avif|gif)$/;
// const speakersFolder = `${EVENT_FOLDER}/Speakers`;
// const galleryFolder = `${EVENT_FOLDER}/Gallery`;
// const trim = (value) => typeof value === "string" ? value.trim() : "";
// const invalid = (message) => Object.assign(new Error(message), { status: 400, statusCode: 400 });

// function asHttpUrl(value) {
//   const url = trim(value);
//   if (!url) return "";
//   try {
//     if (["http:", "https:"].includes(new URL(url).protocol)) return url;
//   } catch {
//     // Report invalid links consistently.
//   }
//   throw invalid("Card links must use an absolute HTTP or HTTPS URL.");
// }

// function eventSectionImageIds(sections) {
//   const galleryCards = (sections?.gallery || []).flatMap((group) => group.cards);
//   return [...(sections?.speakers || []), ...galleryCards]
//     .map((card) => card.imagePublicId)
//     .filter(Boolean);
// }

// async function readEventSections(req, previous, uploadedIds) {
//   const raw = req.body.eventSections;
//   const sectionFiles = (req.files || []).filter((file) => isEventSectionImage(file.fieldname));
//   if (raw === undefined) {
//     if (sectionFiles.length) throw invalid("Event section images require matching card data.");
//     return undefined;
//   }

//   let input;
//   try {
//     input = typeof raw === "string" ? JSON.parse(raw) : raw;
//   } catch {
//     throw invalid("Invalid event sections.");
//   }
//   if (!Array.isArray(input?.speakers) || !Array.isArray(input?.gallery) ||
//     !["", "conference", "workshop"].includes(input.format ?? "")) {
//     throw invalid("Invalid event sections.");
//   }

//   const images = new Map();
//   for (const file of sectionFiles) {
//     if (images.has(file.fieldname) || !imageType.test(file.mimetype) || file.size > 5 * 1024 * 1024) {
//       throw invalid("Each speaker or gallery image must be a supported image of up to 5 MB.");
//     }
//     images.set(file.fieldname, file);
//   }

//   const previousCards = [...(previous?.speakers || []), ...(previous?.gallery || []).flatMap((group) => group.cards)];
//   const existingImages = new Map(previousCards.map((card) => [card.imageUrl, card.imagePublicId]));
//   const pendingUploads = [];
//   function normalizeCard(inputCard, field, folder) {
//     const file = images.get(field);
//     const name = trim(inputCard?.name);
//     const imageUrl = trim(inputCard?.imageUrl);
//     if (!name || (!file && !existingImages.has(imageUrl))) {
//       throw invalid("Each speaker and gallery card needs a name and image.");
//     }

//     const card = {
//       name,
//       subtitle: trim(inputCard.subtitle),
//       description: trim(inputCard.description),
//       imageAlt: trim(inputCard.imageAlt),
//       url: asHttpUrl(inputCard.url),
//       imageUrl: existingImages.has(imageUrl) ? imageUrl : "",
//       imagePublicId: existingImages.get(imageUrl),
//     };
//     if (file) {
//       pendingUploads.push({ file, card, folder });
//       images.delete(field);
//     }
//     return card;
//   }

//   const speakers = input.speakers.map((card, index) => normalizeCard(card, `speakerImage_${index}`, speakersFolder));
//   const gallery = input.gallery.map((group, index) => {
//     if (!trim(group?.heading) || !Array.isArray(group.cards) || !group.cards.length) {
//       throw invalid("Each gallery session needs a heading and at least one card.");
//     }
//     return {
//       heading: trim(group.heading),
//       description: trim(group.description),
//       cards: group.cards.map((card, cardIndex) => normalizeCard(card, `galleryImage_${index}_${cardIndex}`, galleryFolder)),
//     };
//   });
//   if (images.size) throw invalid("An uploaded image does not have a matching card.");

//   for (const { file, card, folder } of pendingUploads) {
//     const result = await uploadToCloudinary(file.path, folder, {
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
//     });
//     uploadedIds.push(result.publicId);
//     card.imageUrl = result.url;
//     card.imagePublicId = result.publicId;
//   }
//   return { format: input.format ?? "", speakers, gallery };
// }

// const resourceIds = (content) => (content?.resources || [])
//   .map((item) => item.publicId)
//   .filter(Boolean);

// async function readEventContent(req, previous, uploadedIds) {
//   const files = new Map();
//   for (const file of (req.files || []).filter((entry) => isEventResource(entry.fieldname))) {
//     if (files.has(file.fieldname) || !eventResourceType(file) || file.size > MAX_BROCHURE_SIZE) {
//       throw invalid("Each event resource must be one PDF, PPT or PPTX file up to 20 MB.");
//     }
//     files.set(file.fieldname, file);
//   }

//   const raw = req.body.eventContent;
//   if (raw === undefined && !files.size) return undefined;
//   const input = parseJSON(raw, null);
//   const keys = ["highlights", "takeaways", "videos"];
//   if (!input || keys.some((key) => !Array.isArray(input[key]))) {
//     throw invalid("Invalid event content.");
//   }

//   function summary(item) {
//     const title = trim(item?.title);
//     if (!title) throw invalid("Each event content entry needs a title.");
//     return { title, description: trim(item.description) };
//   }

//   const highlights = input.highlights.map(summary);
//   const takeaways = input.takeaways.map(summary);
//   const videos = input.videos.map((item) => {
//     const entry = summary(item);
//     const url = asHttpUrl(item.url);
//     const hosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];
//     if (!url || !hosts.includes(new URL(url).hostname)) {
//       throw invalid("Each recording needs a valid YouTube URL.");
//     }
//     return { ...entry, url };
//   });

//   if (input.resources === undefined) {
//     if (files.size) throw invalid("Resource files require matching entries.");
//     return { highlights, takeaways, videos };
//   }

//   if (!Array.isArray(input.resources)) throw invalid("Invalid event resources.");

//   const previousResources = new Map((previous?.resources || []).map((item) => [String(item._id), item]));
//   const pending = [];
//   const resources = input.resources.map((item, index) => {
//     const entry = { ...summary(item), type: item.type };
//     const field = `eventResource_${index}`;
//     const file = files.get(field);
//     const old = previousResources.get(String(item._id ?? ""));

//     if (entry.type === "link") {
//       entry.url = asHttpUrl(item.url);
//       if (!entry.url || file) throw invalid("External resources require a URL.");
//     } else if (entry.type === "pdf" || entry.type === "presentation") {
//       if (file) {
//         if (eventResourceType(file) !== entry.type) {
//           throw invalid("Uploaded file does not match the selected resource type.");
//         }
//         pending.push({ file, entry });
//         files.delete(field);
//       } else {
//         if (old?.type !== entry.type) {
//           throw invalid(`"${entry.title}" could not be matched to an existing resource. Reopen the event before editing its PDFs.`);
//         }
//         entry.publicId = old.publicId;
//         entry.fileName = old.fileName;
//       }
//     } else {
//       throw invalid("Invalid event resource type.");
//     }
//     if (old) entry._id = old._id;
//     return entry;
//   });
//   if (files.size) throw invalid("An uploaded resource does not have a matching entry.");

//   for (const { file, entry } of pending) {
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: "raw",
//       type: "authenticated",
//       folder: `${EVENT_FOLDER}/Resources`,
//       use_filename: true,
//       unique_filename: true,
//       overwrite: false,
//     });
//     uploadedIds.push(result.public_id);
//     entry.publicId = result.public_id;
//     entry.fileName = file.originalname;
//   }

//   return { highlights, takeaways, videos, resources };
// }

// function publicEvent(event) {
//   const { eventContent, ...data } = event;
//   if (!eventContent) return data;

//   const { resources, ...content } = eventContent;
//   return {
//     ...data,
//     eventContent: {
//       ...content,
//       resources: (resources || []).map(({ publicId: _publicId, ...resource }) => resource),
//     },
//   };
// }

// const getAllPublicIds = (event) => {
//   const detail = event.detailPage || {};
//   const intro = detail.introduction || {};

//   return [
//     event.imagePublicId,
//     detail.hero?.imagePublicId,
//     detail.agenda?.imagePublicId,

//     ...(intro.blocks || []).map((item) => item.imagePublicId),
//     ...(detail.contentSections || []).map(
//       (item) => item.imagePublicId
//     ),

//     ...(intro.partners || []).map((item) => item.logoPublicId),
//     ...(intro.supporters || []).map((item) => item.logoPublicId),
//     ...eventSectionImageIds(event.eventSections),
//   ].filter(Boolean);
// };

// // =====================================================
// // GET ALL PUBLIC EVENTS
// // =====================================================

// export const getEvents = async (_req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({
//       success: true,
//       data: events.map(publicEvent),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // GET ALL EVENTS FOR ADMIN
// // =====================================================

// export const getAdminEvents = async (_req, res) => {
//   try {
//     const events = await Event.find()
//       .select("+brochurePublicId")
//       .sort({ order: 1, createdAt: -1 })
//       .lean();

//     return res.json({
//       success: true,
//       data: events,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // GET EVENT BY SLUG
// // =====================================================

// export const getEventBySlug = async (req, res) => {
//   try {
//     const event = await Event.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).lean();

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     return res.json({
//       success: true,
//       data: publicEvent(event),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // CREATE EVENT
// // =====================================================

// export const createEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   const uploadedResourceIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const title = String(
//       req.body.title || req.body.heading || ""
//     ).trim();

//     const description = String(
//       req.body.description || req.body.text || ""
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink || req.body.link || ""
//     ).trim();

//     const category = String(
//       req.body.category || "Conference"
//     ).trim();

//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     if (!files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Event card image is required.",
//       });
//     }

//     const detailPage = cleanDetailPage(req.body.detailPage);
//     const eventSections = await readEventSections(req, undefined, uploadedSectionIds);
//     const eventContent = await readEventContent(req, undefined, uploadedResourceIds);

//     uploadedCard = await uploadFile(
//       files.image,
//       `${EVENT_FOLDER}/Event-Posters`
//     );

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files
//     );

//     uploadedDetail = detailResult.uploaded;

//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(
//         files.brochurePdf
//       );
//     }

//     const slug = await makeUniqueSlug(title);

//     const eventOrder =
//       orderValidation.value !== null
//         ? orderValidation.value
//         : await getNextEventOrder();

//     const event = await Event.create({
//       title,
//       slug,
//       description,
//       eventLink,
//       date: String(req.body.date || "").trim(),
//       category,

//       imageUrl: uploadedCard.url,
//       imagePublicId: uploadedCard.publicId,

//       detailPage,
//       eventSections,
//       eventContent,

//       order: eventOrder,
//       isActive: normalizeBoolean(req.body.isActive),

//       brochurePublicId: uploadedBrochure?.publicId || "",
//       brochureFileName: uploadedBrochure?.fileName || "",
//       hasBrochure: Boolean(uploadedBrochure),
//     });

//     saved = true;

//     return res.status(201).json({
//       success: true,
//       data: event,
//       message: "Event created successfully.",
//     });
//   } catch (error) {
//     if (!saved) {
//       await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));
//       await Promise.all(uploadedResourceIds.map(deleteEventBrochure));
//     }

//     if (!saved && uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       (saved ? [] : uploadedDetail).map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     if (!saved && uploadedBrochure?.publicId) {
//       await deleteEventBrochure(uploadedBrochure.publicId);
//     }

//     console.error("Create event error:", error);

//     return res.status(
//       error.status === 400 || error.message?.includes("PDF") ||
//         error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// // =====================================================
// // UPDATE EVENT
// // =====================================================

// export const updateEvent = async (req, res) => {
//   let uploadedCard = null;
//   let uploadedDetail = [];
//   let uploadedBrochure = null;
//   const uploadedSectionIds = [];
//   const uploadedResourceIds = [];
//   let saved = false;

//   const files = getFilesByField(req.files);

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select(
//       "+brochurePublicId"
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const title = String(
//       req.body.title ?? req.body.heading ?? event.title
//     ).trim();

//     const description = String(
//       req.body.description ?? req.body.text ?? event.description
//     ).trim();

//     const eventLink = String(
//       req.body.eventLink ?? req.body.link ?? event.eventLink
//     ).trim();

//     const category = String(
//       req.body.category ?? event.category
//     ).trim();

//     const orderValidation = validateOrder(req.body.order);

//     if (!orderValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: "Event order must be a valid non-negative integer.",
//       });
//     }

//     if (!title || title.length > 70) {
//       return res.status(400).json({
//         success: false,
//         message: "Event heading is required and must be under 70 characters.",
//       });
//     }

//     if (description.length > 220) {
//       return res.status(400).json({
//         success: false,
//         message: "Event description cannot exceed 220 characters.",
//       });
//     }

//     if (!eventLink) {
//       return res.status(400).json({
//         success: false,
//         message: "Event redirect link is required.",
//       });
//     }

//     if (!allowedCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event category.",
//       });
//     }

//     const oldDetailPage = event.detailPage?.toObject
//       ? event.detailPage.toObject()
//       : event.detailPage || {};

//     const detailPage =
//       req.body.detailPage !== undefined
//         ? cleanDetailPage(req.body.detailPage)
//         : cleanDetailPage(oldDetailPage);

//     const oldSectionImageIds = new Set(eventSectionImageIds(event.eventSections));
//     const eventSections = await readEventSections(req, event.eventSections, uploadedSectionIds);
//     const oldResourceIds = new Set(resourceIds(event.eventContent));
//     const eventContent = await readEventContent(req, event.eventContent, uploadedResourceIds);

//     if (files.image) {
//       uploadedCard = await uploadFile(
//         files.image,
//         `${EVENT_FOLDER}/Event-Posters`
//       );
//     }

//     const detailResult = await uploadDetailImages(
//       detailPage,
//       files,
//       oldDetailPage
//     );

//     uploadedDetail = detailResult.uploaded;

//     // Upload a replacement brochure, if provided.
//     if (files.brochurePdf) {
//       uploadedBrochure = await uploadEventBrochure(
//         files.brochurePdf
//       );
//     }

//     const oldCardPublicId = event.imagePublicId;
//     const oldBrochurePublicId = event.brochurePublicId;

//     const titleChanged = title !== event.title;

//     if (titleChanged) {
//       event.slug = await makeUniqueSlug(title, id);
//     }

//     event.title = title;
//     event.description = description;
//     event.eventLink = eventLink;
//     event.category = category;

//     if (req.body.date !== undefined) {
//       event.date = String(req.body.date).trim();
//     }

//     // Preserve existing order unless a new order is submitted.
//     if (orderValidation.value !== null) {
//       event.order = orderValidation.value;
//     }

//     if (req.body.isActive !== undefined) {
//       event.isActive = normalizeBoolean(req.body.isActive);
//     }

//     if (uploadedCard) {
//       event.imageUrl = uploadedCard.url;
//       event.imagePublicId = uploadedCard.publicId;
//     }

//     event.detailPage = detailPage;
//     if (eventSections !== undefined || eventContent !== undefined) {
//       // Reject concurrent edits based on an outdated image list.
//       event.$where = {
//         ...event.$where,
//         __v: event.__v ?? { $exists: false },
//       };
//       event.increment();
//       if (eventSections !== undefined) event.eventSections = eventSections;
//       if (eventContent !== undefined) {
//         for (const [field, value] of Object.entries(eventContent)) {
//           event.set(`eventContent.${field}`, value);
//         }
//       }
//     }

//     // Replace existing brochure.
//     if (uploadedBrochure) {
//       event.brochurePublicId = uploadedBrochure.publicId;
//       event.brochureFileName = uploadedBrochure.fileName;
//       event.hasBrochure = true;
//     }

//     // A replacement brochure takes priority over the remove flag.
//     if (!uploadedBrochure && req.body.removeBrochure === "true") {
//       event.brochurePublicId = "";
//       event.brochureFileName = "";
//       event.hasBrochure = false;
//     }

//     await event.save();
//     saved = true;

//     if (eventSections !== undefined) {
//       const retainedImageIds = new Set(getAllPublicIds(event));
//       const removedSectionImageIds = [...oldSectionImageIds].filter(
//         (publicId) => !retainedImageIds.has(publicId)
//       );
//       await Promise.all(removedSectionImageIds.map(deleteCloudinaryImage));
//     }

//     if (eventContent?.resources !== undefined) {
//       const retained = new Set(resourceIds(event.eventContent));
//       await Promise.all([...oldResourceIds].filter((id) => !retained.has(id)).map(deleteEventBrochure));
//     }

//     if (uploadedCard && oldCardPublicId) {
//       await deleteCloudinaryImage(oldCardPublicId);
//     }

//     await Promise.all(
//       detailResult.oldImagesToDelete.map(
//         deleteCloudinaryImage
//       )
//     );

//     if (
//       (uploadedBrochure || req.body.removeBrochure === "true") &&
//       oldBrochurePublicId
//     ) {
//       await deleteEventBrochure(oldBrochurePublicId);
//     }

//     return res.json({
//       success: true,
//       data: event,
//       message: "Event updated successfully.",
//     });
//   } catch (error) {
//     if (!saved) {
//       await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));
//       await Promise.all(uploadedResourceIds.map(deleteEventBrochure));
//     }

//     if (!saved && uploadedCard?.publicId) {
//       await deleteCloudinaryImage(uploadedCard.publicId);
//     }

//     await Promise.all(
//       (saved ? [] : uploadedDetail).map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     if (!saved && uploadedBrochure?.publicId) {
//       await deleteEventBrochure(uploadedBrochure.publicId);
//     }

//     if (error.name === "VersionError" || error.name === "DocumentNotFoundError") {
//       return res.status(409).json({
//         success: false,
//         message: "This event changed while you were editing it. Reopen it and retry.",
//       });
//     }

//     console.error("Update event error:", error);

//     return res.status(
//       error.status === 400 || error.message?.includes("PDF") ||
//         error.message?.includes("20 MB")
//         ? 400
//         : 500
//     ).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await removeTemporaryFiles(req.files || files);
//   }
// };

// // =====================================================
// // DELETE EVENT
// // =====================================================

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     const event = await Event.findById(id).select(
//       "+brochurePublicId"
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     const publicIds = [
//       ...new Set(getAllPublicIds(event)),
//     ];

//     const brochurePublicId = event.brochurePublicId;

//     const resources = new Set(resourceIds(event.eventContent));
//     await event.deleteOne();
//     await Promise.all([...resources].map(deleteEventBrochure));

//     await Promise.all(
//       publicIds.map(deleteCloudinaryImage)
//     );

//     if (brochurePublicId) {
//       await deleteEventBrochure(brochurePublicId);
//     }

//     return res.json({
//       success: true,
//       message: "Event and its Cloudinary assets deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete event error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // DOWNLOAD EVENT BROCHURE
// // =====================================================


// export const downloadEventBrochure = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event ID.",
//       });
//     }

//     // Check shared brochure access cookie
//     if (!hasBrochureAccess(req)) {
//       return res.status(401).json({
//         success: false,
//         requiresEnquiry: true,
//         message: "Please submit an enquiry to download the brochure.",
//       });
//     }

//     // Find active event
//     const event = await Event.findOne({
//       _id: id,
//       isActive: true,
//     }).select("+brochurePublicId");

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found.",
//       });
//     }

//     if (!event.hasBrochure || !event.brochurePublicId) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure not available for this event.",
//       });
//     }

//     // Generate authenticated Cloudinary download URL
//     const downloadUrl = cloudinary.utils.private_download_url(
//       event.brochurePublicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         attachment: true,
//       }
//     );

//     // Fetch PDF from Cloudinary through backend
//     const cloudinaryResponse = await fetch(downloadUrl);

//     if (!cloudinaryResponse.ok) {
//       console.error(
//         "Cloudinary Event PDF Error:",
//         cloudinaryResponse.status,
//         await cloudinaryResponse.text()
//       );

//       return res.status(502).json({
//         success: false,
//         message: "Unable to retrieve event brochure from Cloudinary.",
//       });
//     }

//     const pdfBuffer = Buffer.from(
//       await cloudinaryResponse.arrayBuffer()
//     );

//     const fileName =
//       event.brochureFileName || `event-${id}-brochure.pdf`;

//     const safeFileName = fileName.replace(/["\r\n]/g, "_");

//     res.setHeader("Content-Type", "application/pdf");

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${safeFileName}"`
//     );

//     res.setHeader("Content-Length", pdfBuffer.length);

//     return res.status(200).send(pdfBuffer);

//   } catch (error) {
//     console.error("Download Event Brochure Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to download event brochure.",
//     });
//   }
// };

// function fetchEventResource(resource, signal) {
//   const url = cloudinary.utils.private_download_url(resource.publicId, undefined, {
//     resource_type: "raw",
//     type: "authenticated",
//     expires_at: Math.floor(Date.now() / 1000) + 120,
//   });
//   return fetch(url, { signal });
// }

// async function sendAllEventPdfs(event, res) {
//   const pdfs = (event.eventContent?.resources || []).filter(
//     (item) => item.type === "pdf" && item.publicId
//   );

//   if (!pdfs.length) {
//     return res.status(404).json({ success: false, message: "No PDFs are available for this event." });
//   }

//   const directory = await fs.mkdtemp(join(tmpdir(), "aia-event-pdfs-"));
//   const abort = new AbortController();
//   const onClose = () => {
//     if (!res.writableFinished) abort.abort();
//   };
//   const zip = new JSZip();
//   const inputStreams = [];
//   res.once("close", onClose);

//   try {
//     for (const [index, resource] of pdfs.entries()) {
//       const response = await fetchEventResource(resource, abort.signal);
//       if (!response.ok || !response.body) {
//         await response.body?.cancel();
//         return res.status(502).json({ success: false, message: "Unable to retrieve all event PDFs." });
//       }

//       const path = join(directory, String(index));
//       await pipeline(Readable.fromWeb(response.body), createWriteStream(path), {
//         signal: abort.signal,
//       });

//       const title = (resource.fileName || resource.title || "presentation")
//         .replace(/\.pdf$/i, "")
//         .replace(/[^a-zA-Z0-9 ._-]/g, "_")
//         .trim()
//         .slice(0, 120) || "presentation";
//       const input = createReadStream(path);
//       inputStreams.push(input);
//       zip.file(`${String(index + 1).padStart(2, "0")}-${title}.pdf`, input);
//     }

//     const slug = (event.slug || String(event._id)).replace(/[^a-zA-Z0-9-]/g, "-");
//     res.type("application/zip");
//     res.attachment(`${slug}-presentations.zip`);
//     await pipeline(zip.generateNodeStream({ streamFiles: true, compression: "STORE" }), res, {
//       signal: abort.signal,
//     });
//   } finally {
//     res.removeListener("close", onClose);
//     for (const input of inputStreams) input.destroy();
//     await fs.rm(directory, { recursive: true, force: true }).catch((error) => {
//       console.error("Event ZIP cleanup error:", error.message);
//     });
//   }
// }

// export function getEventDownloadAccess(req, res) {
//   res.setHeader("Cache-Control", "no-store");

//   return res.json({
//     hasAccess: Boolean(hasBrochureAccess(req)),
//   });
// }

// export const downloadEventContent = async (req, res) => {
//   const { id, document } = req.params;
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(400).json({ success: false, message: "Invalid event ID." });
//   }

//   try {
//     const event = await Event.findOne({ _id: id, isActive: true }).lean();
//     if (!event) return res.status(404).json({ success: false, message: "Event not found." });

//     if (eventTemplate(event) === "upcoming") {
//       return res.status(404).json({ success: false, message: "Resources are available after the event." });
//     }
//     res.setHeader("Cache-Control", "no-store");
//     if (!hasBrochureAccess(req)) {
//   return res.status(401).json({
//     success: false,
//     requiresEnquiry: true,
//     message: "Please submit the brochure enquiry form to download event resources.",
//   });
// }


//     if (document === "all-pdfs") return await sendAllEventPdfs(event, res);

//     const resource = event.eventContent?.resources?.find((item) => String(item._id) === document);
//     if (!resource?.publicId || !["pdf", "presentation"].includes(resource.type)) {
//       return res.status(404).json({ success: false, message: "Resource not found." });
//     }


//     const response = await fetchEventResource(resource);
//     if (!response.ok) {
//       return res.status(502).json({ success: false, message: "Unable to retrieve the event resource." });
//     }
//     const safeFileName = (resource.fileName || "event-resource").replace(/[^a-zA-Z0-9 ._-]/g, "_");
//     return res.attachment(safeFileName).send(Buffer.from(await response.arrayBuffer()));
//   } catch (error) {
//     if (res.destroyed || res.headersSent) return;
//     console.error("Download event content error:", error.message);
//     return res.status(500).json({ success: false, message: "Unable to download event content." });
//   }
// };



import mongoose from "mongoose";
import fs from "fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import JSZip from "jszip";
import { Event } from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { hasBrochureAccess } from "../utils/brochureAccess.js";

import { isEventSectionImage, isEventResource, eventResourceType } from "../config/eventUpload.js";

import { eventTemplate } from "../utils/eventStage.js";

const EVENT_FOLDER = "AIA-Project-Assets/Events";
const MAX_BROCHURE_SIZE = 20 * 1024 * 1024;

const allowedCategories = [
  "Conference",
  "Workshops",
  "Webinars",
  "Training Program",
  "Exhibitions",
];

const parseJSON = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const makeUniqueSlug = async (title, excludeId = null) => {
  const base = slugify(title) || `event-${Date.now()}`;
  let slug = base;
  let count = 1;

  while (
    await Event.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${count++}`;
  }

  return slug;
};

const normalizeBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return value === true || value === "true";
};

const getFilesByField = (files = []) => {
  const result = {};

  if (Array.isArray(files)) {
    files.forEach((file) => {
      result[file.fieldname] = file;
    });
  } else if (files && typeof files === "object") {
    Object.entries(files).forEach(([field, fieldFiles]) => {
      result[field] = Array.isArray(fieldFiles)
        ? fieldFiles[0]
        : fieldFiles;
    });
  }

  return result;
};

const removeTemporaryFile = async (file) => {
  if (!file?.path) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Temporary file cleanup error:", error.message);
    }
  }
};

const removeTemporaryFiles = async (files = {}) => {
  await Promise.all(
    Object.values(files)
      .filter(Boolean)
      .map(removeTemporaryFile)
  );
};

const uploadFile = async (file, folder) => {
  if (!file) return null;
  return uploadToCloudinary(file.path, folder);
};

// =====================================================
// BROCHURE HELPERS
// =====================================================

const uploadEventBrochure = async (file) => {
  if (!file) return null;

  const extension = file.originalname
    ?.split(".")
    .pop()
    ?.toLowerCase();

  if (
    file.mimetype !== "application/pdf" ||
    extension !== "pdf"
  ) {
    throw new Error("Only PDF brochure files are allowed.");
  }

  if (file.size > MAX_BROCHURE_SIZE) {
    throw new Error("Brochure PDF cannot exceed 20 MB.");
  }

  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    type: "authenticated",
    access_mode: "authenticated",
    folder: `${EVENT_FOLDER}/Brochures`,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return {
    publicId: result.public_id,
    fileName: file.originalname,
  };
};

const deleteEventBrochure = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      type: "authenticated",
      invalidate: true,
    });
  } catch (error) {
    console.error(
      "Cloudinary brochure delete error:",
      publicId,
      error.message
    );
  }
};

// =====================================================
// IMAGE HELPERS
// =====================================================

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error) {
    console.error(
      "Cloudinary image delete error:",
      publicId,
      error.message
    );
  }
};

// =====================================================
// ORDER HELPERS
// =====================================================

const validateOrder = (value) => {
  if (value === undefined || value === "") {
    return { valid: true, value: null };
  }

  const order = Number(value);

  if (!Number.isInteger(order) || order < 0) {
    return {
      valid: false,
      value: null,
    };
  }

  return {
    valid: true,
    value: order,
  };
};

const getNextEventOrder = async () => {
  const lastEvent = await Event.findOne()
    .sort({ order: -1 })
    .select("order")
    .lean();

  if (!lastEvent || !Number.isFinite(Number(lastEvent.order))) {
    return 0;
  }

  return Number(lastEvent.order) + 1;
};

// =====================================================
// DETAIL PAGE HELPERS
// =====================================================

const cleanDetailPage = (value = {}) => {
  const detail = parseJSON(value, {});
  const hero = detail.hero || {};
  const introduction = detail.introduction || {};
  const agenda = detail.agenda || {};

  return {
    hero: {
      ...hero,
      eyebrow: hero.eyebrow || "",
      title: hero.title || "",
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      imageUrl: hero.imageUrl || hero.image || "",
      imagePublicId: hero.imagePublicId || "",
      imageAlt: hero.imageAlt || "",
      imagePosition: hero.imagePosition || "right",
      background: hero.background || "dark",
    },

    introduction: {
      ...introduction,
      eyebrow: introduction.eyebrow || "",
      title: introduction.title || "",
      description: introduction.description || "",
      blocks: Array.isArray(introduction.blocks)
        ? introduction.blocks
        : [],
      sections: Array.isArray(introduction.sections)
        ? introduction.sections
        : [],
      eventInfo: introduction.eventInfo || {},
      partners: Array.isArray(introduction.partners)
        ? introduction.partners
        : [],
      supporters: Array.isArray(introduction.supporters)
        ? introduction.supporters
        : [],
      contact: introduction.contact || {},
    },

    agenda: {
      ...agenda,
      eyebrow: agenda.eyebrow || "",
      title: agenda.title || "",
      description: agenda.description || "",
      imageUrl: agenda.imageUrl || agenda.image || "",
      imagePublicId: agenda.imagePublicId || "",
      imageAlt: agenda.imageAlt || "",
      items: Array.isArray(agenda.items) ? agenda.items : [],
    },

    contentSections: Array.isArray(detail.contentSections)
      ? detail.contentSections
      : [],
  };
};

const getOldBlock = (oldBlocks, block, index) => {
  if (block?._key) {
    const match = oldBlocks.find(
      (item) => item?._key === block._key
    );

    if (match) return match;
  }

  return oldBlocks[index] || {};
};

const uploadDetailImages = async (
  detailPage,
  files,
  oldDetailPage = {}
) => {
  const uploaded = [];
  const oldImagesToDelete = [];

  const uploadAndReplace = async ({
    file,
    folder,
    currentPublicId,
    onSuccess,
  }) => {
    if (!file) return;

    const result = await uploadFile(file, folder);
    uploaded.push(result);

    if (
      currentPublicId &&
      currentPublicId !== result.publicId
    ) {
      oldImagesToDelete.push(currentPublicId);
    }

    onSuccess(result);
  };

  try {
    const oldHero = oldDetailPage?.hero || {};
    const oldAgenda = oldDetailPage?.agenda || {};

    await uploadAndReplace({
      file: files.heroImage,
      folder: `${EVENT_FOLDER}/Detail-Heroes`,
      currentPublicId: oldHero.imagePublicId,
      onSuccess: (result) => {
        detailPage.hero.imageUrl = result.url;
        detailPage.hero.imagePublicId = result.publicId;
      },
    });

    await uploadAndReplace({
      file: files.agendaImage,
      folder: `${EVENT_FOLDER}/Agendas`,
      currentPublicId: oldAgenda.imagePublicId,
      onSuccess: (result) => {
        detailPage.agenda.imageUrl = result.url;
        detailPage.agenda.imagePublicId = result.publicId;
      },
    });

    const oldBlocks = oldDetailPage?.introduction?.blocks || [];

    detailPage.introduction.blocks = await Promise.all(
      (detailPage.introduction.blocks || []).map(
        async (block, index) => {
          const oldBlock = getOldBlock(oldBlocks, block, index);
          const file = files[`introductionBlockImage_${index}`];
          const nextBlock = { ...block };

          await uploadAndReplace({
            file,
            folder: `${EVENT_FOLDER}/Introduction`,
            currentPublicId: oldBlock.imagePublicId,
            onSuccess: (result) => {
              nextBlock.imageUrl = result.url;
              nextBlock.image = result.url;
              nextBlock.imagePublicId = result.publicId;
            },
          });

          if (!file) {
            nextBlock.imageUrl =
              nextBlock.imageUrl ||
              nextBlock.image ||
              oldBlock.imageUrl ||
              oldBlock.image ||
              "";

            nextBlock.imagePublicId =
              nextBlock.imagePublicId ||
              oldBlock.imagePublicId ||
              "";
          }

          return nextBlock;
        }
      )
    );

    const oldSections = oldDetailPage?.contentSections || [];

    detailPage.contentSections = await Promise.all(
      (detailPage.contentSections || []).map(
        async (section, index) => {
          const oldSection = oldSections[index] || {};
          const file = files[`contentSectionImage_${index}`];
          const nextSection = { ...section };

          await uploadAndReplace({
            file,
            folder: `${EVENT_FOLDER}/Content-Sections`,
            currentPublicId: oldSection.imagePublicId,
            onSuccess: (result) => {
              nextSection.imageUrl = result.url;
              nextSection.image = result.url;
              nextSection.imagePublicId = result.publicId;
            },
          });

          if (!file) {
            nextSection.imageUrl =
              nextSection.imageUrl ||
              nextSection.image ||
              oldSection.imageUrl ||
              oldSection.image ||
              "";

            nextSection.imagePublicId =
              nextSection.imagePublicId ||
              oldSection.imagePublicId ||
              "";
          }

          return nextSection;
        }
      )
    );

    const uploadPartnerLogos = async ({
      items = [],
      oldItems = [],
      fieldPrefix,
      folder,
    }) => {
      const usedOldIndexes = new Set();

      const nextItems = await Promise.all(
        items.map(async (item, index) => {
          let oldIndex = -1;

          if (item?._id) {
            oldIndex = oldItems.findIndex(
              (oldItem, oldItemIndex) =>
                !usedOldIndexes.has(oldItemIndex) &&
                String(oldItem?._id) === String(item._id)
            );
          }

          if (
            oldIndex === -1 &&
            oldItems[index] &&
            !usedOldIndexes.has(index)
          ) {
            oldIndex = index;
          }

          const oldItem = oldIndex >= 0
            ? oldItems[oldIndex]
            : {};

          if (oldIndex >= 0) {
            usedOldIndexes.add(oldIndex);
          }

          const file = files[`${fieldPrefix}_${index}`];
          const nextItem = { ...item };
          const oldPublicId = oldItem?.logoPublicId || "";

          if (file) {
            await uploadAndReplace({
              file,
              folder,
              currentPublicId: oldPublicId,
              onSuccess: (result) => {
                nextItem.logo = result.url;
                nextItem.logoPublicId = result.publicId;
              },
            });
          } else {
            if (nextItem.logo === undefined) {
              nextItem.logo = oldItem?.logo || "";
            }

            if (nextItem.logoPublicId === undefined) {
              nextItem.logoPublicId = oldPublicId;
            }

            if (
              oldPublicId &&
              nextItem.logoPublicId !== oldPublicId
            ) {
              oldImagesToDelete.push(oldPublicId);
            }
          }

          return nextItem;
        })
      );

      oldItems.forEach((oldItem, index) => {
        if (
          !usedOldIndexes.has(index) &&
          oldItem?.logoPublicId
        ) {
          oldImagesToDelete.push(oldItem.logoPublicId);
        }
      });

      return nextItems;
    };

    detailPage.introduction.partners =
      await uploadPartnerLogos({
        items: detailPage.introduction.partners || [],
        oldItems: oldDetailPage?.introduction?.partners || [],
        fieldPrefix: "partnerLogo",
        folder: `${EVENT_FOLDER}/Partners`,
      });

    detailPage.introduction.supporters =
      await uploadPartnerLogos({
        items: detailPage.introduction.supporters || [],
        oldItems: oldDetailPage?.introduction?.supporters || [],
        fieldPrefix: "supporterLogo",
        folder: `${EVENT_FOLDER}/Supporters`,
      });

    return { uploaded, oldImagesToDelete };
  } catch (error) {
    await Promise.all(
      uploaded.map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    throw error;
  }
};

// Speaker and gallery uploads
const imageType = /^image\/(jpeg|png|webp|avif|gif)$/;
const speakersFolder = `${EVENT_FOLDER}/Speakers`;
const galleryFolder = `${EVENT_FOLDER}/Gallery`;
const trim = (value) => typeof value === "string" ? value.trim() : "";
const invalid = (message) => Object.assign(new Error(message), { status: 400, statusCode: 400 });

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

function eventSectionImageIds(sections) {
  const galleryCards = (sections?.gallery || []).flatMap((group) => group.cards);
  return [...(sections?.speakers || []), ...galleryCards]
    .map((card) => card.imagePublicId)
    .filter(Boolean);
}

async function readEventSections(req, previous, uploadedIds) {
  const raw = req.body.eventSections;
  const sectionFiles = (req.files || []).filter((file) => isEventSectionImage(file.fieldname));
  if (raw === undefined) {
    if (sectionFiles.length) throw invalid("Event section images require matching card data.");
    return undefined;
  }

  let input;
  try {
    input = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw invalid("Invalid event sections.");
  }
  if (!Array.isArray(input?.speakers) || !Array.isArray(input?.gallery) ||
      !["", "conference", "workshop"].includes(input.format ?? "")) {
    throw invalid("Invalid event sections.");
  }

  const images = new Map();
  for (const file of sectionFiles) {
    if (images.has(file.fieldname) || !imageType.test(file.mimetype) || file.size > 5 * 1024 * 1024) {
      throw invalid("Each speaker or gallery image must be a supported image of up to 5 MB.");
    }
    images.set(file.fieldname, file);
  }

  const previousCards = [...(previous?.speakers || []), ...(previous?.gallery || []).flatMap((group) => group.cards)];
  const existingImages = new Map(previousCards.map((card) => [card.imageUrl, card.imagePublicId]));
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

  const speakers = input.speakers.map((card, index) => normalizeCard(card, `speakerImage_${index}`, speakersFolder));
  const gallery = input.gallery.map((group, index) => {
    if (!trim(group?.heading) || !Array.isArray(group.cards) || !group.cards.length) {
      throw invalid("Each gallery session needs a heading and at least one card.");
    }
    return {
      heading: trim(group.heading),
      description: trim(group.description),
      cards: group.cards.map((card, cardIndex) => normalizeCard(card, `galleryImage_${index}_${cardIndex}`, galleryFolder)),
    };
  });
  if (images.size) throw invalid("An uploaded image does not have a matching card.");

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

const resourceIds = (content) => (content?.resources || [])
  .map((item) => item.publicId)
  .filter(Boolean);

async function readEventContent(req, previous, uploadedIds) {
  const files = new Map();
  for (const file of (req.files || []).filter((entry) => isEventResource(entry.fieldname))) {
    if (files.has(file.fieldname) || !eventResourceType(file) || file.size > MAX_BROCHURE_SIZE) {
      throw invalid("Each event resource must be one PDF, PPT or PPTX file up to 20 MB.");
    }
    files.set(file.fieldname, file);
  }

  const raw = req.body.eventContent;
  if (raw === undefined && !files.size) return undefined;
  const input = parseJSON(raw, null);
  const keys = ["highlights", "takeaways", "videos"];
  if (!input || keys.some((key) => !Array.isArray(input[key]))) {
    throw invalid("Invalid event content.");
  }

  function summary(item) {
    const title = trim(item?.title);
    if (!title) throw invalid("Each event content entry needs a title.");
    return { title, description: trim(item.description) };
  }

  const highlights = input.highlights.map(summary);
  const takeaways = input.takeaways.map(summary);
  const videos = input.videos.map((item) => {
    const entry = summary(item);
    const url = asHttpUrl(item.url);
    const hosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];
    if (!url || !hosts.includes(new URL(url).hostname)) {
      throw invalid("Each recording needs a valid YouTube URL.");
    }
    return { ...entry, url };
  });

  const incremental = input.removedResourceIds !== undefined || input.removedLegacyPdfs !== undefined;
  if (input.resources === undefined) {
    if (files.size || incremental) throw invalid("Resource edits require matching entries.");
    return { highlights, takeaways, videos };
  }

  if (!Array.isArray(input.resources)) throw invalid("Invalid event resources.");

  const storedResources = previous?.resources || [];
  const previousResources = new Map(storedResources.map((item) => [String(item._id), item]));
  const removed = new Set();
  if (incremental) {
    const ids = input.removedResourceIds ?? [];
    const legacy = input.removedLegacyPdfs ?? [];
    if (!Array.isArray(ids) || !Array.isArray(legacy)) {
      throw invalid("Invalid resource removal list.");
    }

    for (const id of ids) {
      const index = typeof id === "string"
        ? storedResources.findIndex((item) => item.type === "pdf" && String(item._id) === id)
        : -1;
      if (index < 0) {
        throw invalid("A PDF selected for removal could not be found. Reopen the event and retry.");
      }
      removed.add(index);
    }

    for (const entry of legacy) {
      const publicId = trim(entry?.publicId);
      const fileName = trim(entry?.fileName);
      const title = trim(entry?.title);
      const matches = [];
      storedResources.forEach((item, index) => {
        if (item.type !== "pdf") return;
        const match = publicId
          ? item.publicId === publicId
          : fileName
            ? item.fileName === fileName && (!title || item.title === title)
            : Boolean(title) && item.title === title;
        if (match) matches.push(index);
      });

      if (matches.length !== 1) {
        throw invalid(`Cannot uniquely identify "${title || fileName || "the saved PDF"}". No PDFs were removed.`);
      }
      removed.add(matches[0]);
    }
  }
  const pending = [];
  const resources = input.resources.map((item, index) => {
    const entry = { ...summary(item), type: item.type };
    const field = `eventResource_${index}`;
    const file = files.get(field);
    if (incremental && (entry.type !== "pdf" || !file || item._id != null)) {
      throw invalid("Each newly added resource requires a PDF file.");
    }

    const old = previousResources.get(String(item._id ?? ""));

    if (entry.type === "link") {
      entry.url = asHttpUrl(item.url);
      if (!entry.url || file) throw invalid("External resources require a URL.");
    } else if (entry.type === "pdf" || entry.type === "presentation") {
      if (file) {
        if (eventResourceType(file) !== entry.type) {
          throw invalid("Uploaded file does not match the selected resource type.");
        }
        pending.push({ file, entry });
        files.delete(field);
      } else {
        if (old?.type !== entry.type) {
          throw invalid(`"${entry.title}" could not be matched to an existing resource. Reopen the event before editing its PDFs.`);
        }
        entry.publicId = old.publicId;
        entry.fileName = old.fileName;
      }
    } else {
      throw invalid("Invalid event resource type.");
    }
    if (old) entry._id = old._id;
    return entry;
  });
  if (files.size) throw invalid("An uploaded resource does not have a matching entry.");

  for (const { file, entry } of pending) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      type: "authenticated",
      folder: `${EVENT_FOLDER}/Resources`,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    uploadedIds.push(result.public_id);
    entry.publicId = result.public_id;
    entry.fileName = file.originalname;
  }

  return {
    highlights,
    takeaways,
    videos,
    resources: incremental
      ? [...storedResources.filter((item, index) => !removed.has(index)), ...resources]
      : resources,
  };
}

function publicEvent(event) {
  const { eventContent, ...data } = event;
  if (!eventContent) return data;

  const { resources, ...content } = eventContent;
  return {
    ...data,
    eventContent: {
      ...content,
      resources: (resources || []).map(({ publicId: _publicId, ...resource }) => resource),
    },
  };
}

const getAllPublicIds = (event) => {
  const detail = event.detailPage || {};
  const intro = detail.introduction || {};

  return [
    event.imagePublicId,
    detail.hero?.imagePublicId,
    detail.agenda?.imagePublicId,

    ...(intro.blocks || []).map((item) => item.imagePublicId),
    ...(detail.contentSections || []).map(
      (item) => item.imagePublicId
    ),

    ...(intro.partners || []).map((item) => item.logoPublicId),
    ...(intro.supporters || []).map((item) => item.logoPublicId),
    ...eventSectionImageIds(event.eventSections),
  ].filter(Boolean);
};

// =====================================================
// GET ALL PUBLIC EVENTS
// =====================================================

export const getEvents = async (_req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: events.map(publicEvent),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL EVENTS FOR ADMIN
// =====================================================

export const getAdminEvents = async (_req, res) => {
  try {
    const events = await Event.find()
      .select("+brochurePublicId")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET EVENT BY SLUG
// =====================================================

export const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.json({
      success: true,
      data: publicEvent(event),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE EVENT
// =====================================================

export const createEvent = async (req, res) => {
  let uploadedCard = null;
  let uploadedDetail = [];
  let uploadedBrochure = null;
  const uploadedSectionIds = [];
  const uploadedResourceIds = [];
  let saved = false;

  const files = getFilesByField(req.files);

  try {
    const title = String(
      req.body.title || req.body.heading || ""
    ).trim();

    const description = String(
      req.body.description || req.body.text || ""
    ).trim();

    const eventLink = String(
      req.body.eventLink || req.body.link || ""
    ).trim();

    const category = String(
      req.body.category || "Conference"
    ).trim();

    const orderValidation = validateOrder(req.body.order);

    if (!orderValidation.valid) {
      return res.status(400).json({
        success: false,
        message: "Event order must be a valid non-negative integer.",
      });
    }

    if (!title || title.length > 70) {
      return res.status(400).json({
        success: false,
        message: "Event heading is required and must be under 70 characters.",
      });
    }

    if (description.length > 220) {
      return res.status(400).json({
        success: false,
        message: "Event description cannot exceed 220 characters.",
      });
    }

    if (!eventLink) {
      return res.status(400).json({
        success: false,
        message: "Event redirect link is required.",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event category.",
      });
    }

    if (!files.image) {
      return res.status(400).json({
        success: false,
        message: "Event card image is required.",
      });
    }

    const detailPage = cleanDetailPage(req.body.detailPage);
    const eventSections = await readEventSections(req, undefined, uploadedSectionIds);
    const eventContent = await readEventContent(req, undefined, uploadedResourceIds);

    uploadedCard = await uploadFile(
      files.image,
      `${EVENT_FOLDER}/Event-Posters`
    );

    const detailResult = await uploadDetailImages(
      detailPage,
      files
    );

    uploadedDetail = detailResult.uploaded;

    if (files.brochurePdf) {
      uploadedBrochure = await uploadEventBrochure(
        files.brochurePdf
      );
    }

    const slug = await makeUniqueSlug(title);

    const eventOrder =
      orderValidation.value !== null
        ? orderValidation.value
        : await getNextEventOrder();

    const event = await Event.create({
      title,
      slug,
      description,
      eventLink,
      date: String(req.body.date || "").trim(),
      category,

      imageUrl: uploadedCard.url,
      imagePublicId: uploadedCard.publicId,

      detailPage,
      eventSections,
      eventContent,

      order: eventOrder,
      isActive: normalizeBoolean(req.body.isActive),

      brochurePublicId: uploadedBrochure?.publicId || "",
      brochureFileName: uploadedBrochure?.fileName || "",
      hasBrochure: Boolean(uploadedBrochure),
    });

    saved = true;

    return res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully.",
    });
  } catch (error) {
    if (!saved) {
      await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));
      await Promise.all(uploadedResourceIds.map(deleteEventBrochure));
    }

    if (!saved && uploadedCard?.publicId) {
      await deleteCloudinaryImage(uploadedCard.publicId);
    }

    await Promise.all(
      (saved ? [] : uploadedDetail).map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    if (!saved && uploadedBrochure?.publicId) {
      await deleteEventBrochure(uploadedBrochure.publicId);
    }

    console.error("Create event error:", error);

    return res.status(
      error.status === 400 || error.message?.includes("PDF") ||
      error.message?.includes("20 MB")
        ? 400
        : 500
    ).json({
      success: false,
      message: error.message,
    });
  } finally {
    await removeTemporaryFiles(req.files || files);
  }
};

// =====================================================
// UPDATE EVENT
// =====================================================

export const updateEvent = async (req, res) => {
  let uploadedCard = null;
  let uploadedDetail = [];
  let uploadedBrochure = null;
  const uploadedSectionIds = [];
  const uploadedResourceIds = [];
  let saved = false;

  const files = getFilesByField(req.files);

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await Event.findById(id).select(
      "+brochurePublicId"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const title = String(
      req.body.title ?? req.body.heading ?? event.title
    ).trim();

    const description = String(
      req.body.description ?? req.body.text ?? event.description
    ).trim();

    const eventLink = String(
      req.body.eventLink ?? req.body.link ?? event.eventLink
    ).trim();

    const category = String(
      req.body.category ?? event.category
    ).trim();

    const orderValidation = validateOrder(req.body.order);

    if (!orderValidation.valid) {
      return res.status(400).json({
        success: false,
        message: "Event order must be a valid non-negative integer.",
      });
    }

    if (!title || title.length > 70) {
      return res.status(400).json({
        success: false,
        message: "Event heading is required and must be under 70 characters.",
      });
    }

    if (description.length > 220) {
      return res.status(400).json({
        success: false,
        message: "Event description cannot exceed 220 characters.",
      });
    }

    if (!eventLink) {
      return res.status(400).json({
        success: false,
        message: "Event redirect link is required.",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event category.",
      });
    }

    const oldDetailPage = event.detailPage?.toObject
      ? event.detailPage.toObject()
      : event.detailPage || {};

    const detailPage =
      req.body.detailPage !== undefined
        ? cleanDetailPage(req.body.detailPage)
        : cleanDetailPage(oldDetailPage);

    const oldSectionImageIds = new Set(eventSectionImageIds(event.eventSections));
    const eventSections = await readEventSections(req, event.eventSections, uploadedSectionIds);
    const oldResourceIds = new Set(resourceIds(event.eventContent));
    const eventContent = await readEventContent(req, event.eventContent, uploadedResourceIds);

    if (files.image) {
      uploadedCard = await uploadFile(
        files.image,
        `${EVENT_FOLDER}/Event-Posters`
      );
    }

    const detailResult = await uploadDetailImages(
      detailPage,
      files,
      oldDetailPage
    );

    uploadedDetail = detailResult.uploaded;

    // Upload a replacement brochure, if provided.
    if (files.brochurePdf) {
      uploadedBrochure = await uploadEventBrochure(
        files.brochurePdf
      );
    }

    const oldCardPublicId = event.imagePublicId;
    const oldBrochurePublicId = event.brochurePublicId;

    const titleChanged = title !== event.title;

    if (titleChanged) {
      event.slug = await makeUniqueSlug(title, id);
    }

    event.title = title;
    event.description = description;
    event.eventLink = eventLink;
    event.category = category;

    if (req.body.date !== undefined) {
      event.date = String(req.body.date).trim();
    }

    // Preserve existing order unless a new order is submitted.
    if (orderValidation.value !== null) {
      event.order = orderValidation.value;
    }

    if (req.body.isActive !== undefined) {
      event.isActive = normalizeBoolean(req.body.isActive);
    }

    if (uploadedCard) {
      event.imageUrl = uploadedCard.url;
      event.imagePublicId = uploadedCard.publicId;
    }

    event.detailPage = detailPage;
    if (eventSections !== undefined || eventContent !== undefined) {
      // Reject concurrent edits based on an outdated image list.
      event.$where = {
        ...event.$where,
        __v: event.__v ?? { $exists: false },
      };
      event.increment();
      if (eventSections !== undefined) event.eventSections = eventSections;
      if (eventContent !== undefined) {
  const existingContent =
    event.eventContent?.toObject?.() ?? event.eventContent ?? {};

  event.eventContent = {
    ...existingContent,
    ...eventContent,
  };
}
    }

    // Replace existing brochure.
    if (uploadedBrochure) {
      event.brochurePublicId = uploadedBrochure.publicId;
      event.brochureFileName = uploadedBrochure.fileName;
      event.hasBrochure = true;
    }

    // A replacement brochure takes priority over the remove flag.
    if (!uploadedBrochure && req.body.removeBrochure === "true") {
      event.brochurePublicId = "";
      event.brochureFileName = "";
      event.hasBrochure = false;
    }

    await event.save();
    saved = true;

    if (eventSections !== undefined) {
      const retainedImageIds = new Set(getAllPublicIds(event));
      const removedSectionImageIds = [...oldSectionImageIds].filter(
        (publicId) => !retainedImageIds.has(publicId)
      );
      await Promise.all(removedSectionImageIds.map(deleteCloudinaryImage));
    }

    if (eventContent?.resources !== undefined) {
      const retained = new Set(resourceIds(event.eventContent));
      await Promise.all([...oldResourceIds].filter((id) => !retained.has(id)).map(deleteEventBrochure));
    }

    if (uploadedCard && oldCardPublicId) {
      await deleteCloudinaryImage(oldCardPublicId);
    }

    await Promise.all(
      detailResult.oldImagesToDelete.map(
        deleteCloudinaryImage
      )
    );

    if (
      (uploadedBrochure || req.body.removeBrochure === "true") &&
      oldBrochurePublicId
    ) {
      await deleteEventBrochure(oldBrochurePublicId);
    }

    return res.json({
      success: true,
      data: event,
      message: "Event updated successfully.",
    });
  } catch (error) {
    if (!saved) {
      await Promise.all(uploadedSectionIds.map(deleteCloudinaryImage));
      await Promise.all(uploadedResourceIds.map(deleteEventBrochure));
    }

    if (!saved && uploadedCard?.publicId) {
      await deleteCloudinaryImage(uploadedCard.publicId);
    }

    await Promise.all(
      (saved ? [] : uploadedDetail).map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    if (!saved && uploadedBrochure?.publicId) {
      await deleteEventBrochure(uploadedBrochure.publicId);
    }

    if (error.name === "VersionError" || error.name === "DocumentNotFoundError") {
      return res.status(409).json({
        success: false,
        message: "This event changed while you were editing it. Reopen it and retry.",
      });
    }

    console.error("Update event error:", error);

    return res.status(
      error.status === 400 || error.message?.includes("PDF") ||
      error.message?.includes("20 MB")
        ? 400
        : 500
    ).json({
      success: false,
      message: error.message,
    });
  } finally {
    await removeTemporaryFiles(req.files || files);
  }
};

// =====================================================
// DELETE EVENT
// =====================================================

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await Event.findById(id).select(
      "+brochurePublicId"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const publicIds = [
      ...new Set(getAllPublicIds(event)),
    ];

    const brochurePublicId = event.brochurePublicId;

    const resources = new Set(resourceIds(event.eventContent));
    await event.deleteOne();
    await Promise.all([...resources].map(deleteEventBrochure));

    await Promise.all(
      publicIds.map(deleteCloudinaryImage)
    );

    if (brochurePublicId) {
      await deleteEventBrochure(brochurePublicId);
    }

    return res.json({
      success: true,
      message: "Event and its Cloudinary assets deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DOWNLOAD EVENT BROCHURE
// =====================================================


export const downloadEventBrochure = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    // Check shared brochure access cookie
    if (!hasBrochureAccess(req)) {
      return res.status(401).json({
        success: false,
        requiresEnquiry: true,
        message: "Please submit an enquiry to download the brochure.",
      });
    }

    // Find active event
    const event = await Event.findOne({
      _id: id,
      isActive: true,
    }).select("+brochurePublicId");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!event.hasBrochure || !event.brochurePublicId) {
      return res.status(404).json({
        success: false,
        message: "Brochure not available for this event.",
      });
    }

    // Generate authenticated Cloudinary download URL
    const downloadUrl = cloudinary.utils.private_download_url(
      event.brochurePublicId,
      "pdf",
      {
        resource_type: "raw",
        type: "authenticated",
        attachment: true,
      }
    );

    // Fetch PDF from Cloudinary through backend
    const cloudinaryResponse = await fetch(downloadUrl);

    if (!cloudinaryResponse.ok) {
      console.error(
        "Cloudinary Event PDF Error:",
        cloudinaryResponse.status,
        await cloudinaryResponse.text()
      );

      return res.status(502).json({
        success: false,
        message: "Unable to retrieve event brochure from Cloudinary.",
      });
    }

    const pdfBuffer = Buffer.from(
      await cloudinaryResponse.arrayBuffer()
    );

    const fileName =
      event.brochureFileName || `event-${id}-brochure.pdf`;

    const safeFileName = fileName.replace(/["\r\n]/g, "_");

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}"`
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("Download Event Brochure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to download event brochure.",
    });
  }
};

function fetchEventResource(resource, signal) {
  const url = cloudinary.utils.private_download_url(resource.publicId, undefined, {
    resource_type: "raw",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 120,
  });
  return fetch(url, { signal });
}

async function sendAllEventPdfs(event, res) {
  const pdfs = (event.eventContent?.resources || []).filter(
    (item) => item.type === "pdf" && item.publicId
  );

  if (!pdfs.length) {
    return res.status(404).json({ success: false, message: "No PDFs are available for this event." });
  }

  const directory = await fs.mkdtemp(join(tmpdir(), "aia-event-pdfs-"));
  const abort = new AbortController();
  const onClose = () => {
    if (!res.writableFinished) abort.abort();
  };
  const zip = new JSZip();
  const inputStreams = [];
  res.once("close", onClose);

  try {
    for (const [index, resource] of pdfs.entries()) {
      const response = await fetchEventResource(resource, abort.signal);
      if (!response.ok || !response.body) {
        await response.body?.cancel();
        return res.status(502).json({ success: false, message: "Unable to retrieve all event PDFs." });
      }

      const path = join(directory, String(index));
      await pipeline(Readable.fromWeb(response.body), createWriteStream(path), {
        signal: abort.signal,
      });

      const title = (resource.fileName || resource.title || "presentation")
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9 ._-]/g, "_")
        .trim()
        .slice(0, 120) || "presentation";
      const input = createReadStream(path);
      inputStreams.push(input);
      zip.file(`${String(index + 1).padStart(2, "0")}-${title}.pdf`, input);
    }

    const slug = (event.slug || String(event._id)).replace(/[^a-zA-Z0-9-]/g, "-");
    res.type("application/zip");
    res.attachment(`${slug}-presentations.zip`);
    await pipeline(zip.generateNodeStream({ streamFiles: true, compression: "STORE" }), res, {
      signal: abort.signal,
    });
  } finally {
    res.removeListener("close", onClose);
    for (const input of inputStreams) input.destroy();
    await fs.rm(directory, { recursive: true, force: true }).catch((error) => {
      console.error("Event ZIP cleanup error:", error.message);
    });
  }
}

export function getEventDownloadAccess(req, res) {
  res.setHeader("Cache-Control", "no-store");
  return res.json({ hasAccess: Boolean(hasBrochureAccess(req)) });
}

export const downloadEventContent = async (req, res) => {
  const { id, document } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid event ID." });
  }

  try {
    const event = await Event.findOne({ _id: id, isActive: true }).lean();
    if (!event) return res.status(404).json({ success: false, message: "Event not found." });

    if (eventTemplate(event) === "upcoming") {
      return res.status(404).json({ success: false, message: "Resources are available after the event." });
    }
    res.setHeader("Cache-Control", "no-store");

    if (!hasBrochureAccess(req)) {
      return res.status(401).json({
        success: false,
        requiresEnquiry: true,
        message: "Please submit the brochure enquiry form to download event resources.",
      });
    }

    if (document === "all-pdfs") return await sendAllEventPdfs(event, res);

    const resource = event.eventContent?.resources?.find((item) => String(item._id) === document);
    if (!resource?.publicId || !["pdf", "presentation"].includes(resource.type)) {
      return res.status(404).json({ success: false, message: "Resource not found." });
    }

    
    const response = await fetchEventResource(resource);
    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Unable to retrieve the event resource." });
    }
    const safeFileName = (resource.fileName || "event-resource").replace(/[^a-zA-Z0-9 ._-]/g, "_");
    return res.attachment(safeFileName).send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    if (res.destroyed || res.headersSent) return;
    console.error("Download event content error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to download event content." });
  }
};
