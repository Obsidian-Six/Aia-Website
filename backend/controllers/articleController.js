// import mongoose from "mongoose";
// import fs from "fs/promises";

// import { Article } from "../models/Article.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// const ARTICLE_FOLDER = "AIA-Project-Assets/Articles";

// // ------------------------------------------
// // COMMON HELPERS
// // ------------------------------------------

// const parsePayload = (body = {}) => {
//   if (body.data) {
//     try {
//       return typeof body.data === "string"
//         ? JSON.parse(body.data)
//         : body.data;
//     } catch {
//       throw new Error("Invalid publication form data.");
//     }
//   }

//   return body;
// };

// const parseArray = (value) => {
//   return Array.isArray(value) ? value : [];
// };

// const getFilesByField = (files = []) => {
//   const result = {};

//   for (const file of files) {
//     result[file.fieldname] = file;
//   }

//   return result;
// };

// const deleteTemporaryFiles = async (files = []) => {
//   await Promise.all(
//     files.map(async (file) => {
//       if (!file?.path) return;

//       try {
//         await fs.unlink(file.path);
//       } catch (error) {
//         if (error.code !== "ENOENT") {
//           console.error("Temporary file cleanup error:", error.message);
//         }
//       }
//     })
//   );
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

// const uniqueIds = (ids = []) => [
//   ...new Set(ids.filter(Boolean)),
// ];

// const collectArticlePublicIds = (article) => {
//   if (!article) return [];

//   const data = article.toObject
//     ? article.toObject()
//     : article;

//   return uniqueIds([
//     data.imagePublicId,
//     data.detailHeroImagePublicId,
//     ...(data.contentBlocks || []).map(
//       (block) => block.imagePublicId
//     ),
//     ...(data.sections || []).map(
//       (section) => section.imagePublicId
//     ),
//   ]);
// };

// const uploadImage = async (file, folder) => {
//   if (!file) return null;

//   return uploadToCloudinary(file.path, folder);
// };

// const uploadPublicationImages = async (
//   payload,
//   files,
//   uploaded
// ) => {
//   // Listing image
//   if (files.image) {
//     const result = await uploadImage(
//       files.image,
//       `${ARTICLE_FOLDER}/Listing`
//     );

//     uploaded.push(result);
//     payload.image = result.url;
//     payload.imagePublicId = result.publicId;
//   }

//   // Detail hero image
//   if (files.detailHeroImage) {
//     const result = await uploadImage(
//       files.detailHeroImage,
//       `${ARTICLE_FOLDER}/Detail-Heroes`
//     );

//     uploaded.push(result);
//     payload.detailHeroImage = result.url;
//     payload.detailHeroImagePublicId = result.publicId;
//   }

//   // Dynamic content block images
//   const blocks = parseArray(payload.contentBlocks);

//   for (let index = 0; index < blocks.length; index++) {
//     const file = files[`contentBlockImage_${index}`];

//     if (!file) continue;

//     const result = await uploadImage(
//       file,
//       `${ARTICLE_FOLDER}/Content-Blocks`
//     );

//     uploaded.push(result);

//     blocks[index].image = result.url;
//     blocks[index].imagePublicId = result.publicId;
//   }

//   payload.contentBlocks = blocks;

//   return payload;
// };

// const normalizePublicationPayload = (payload = {}) => {
//   return {
//     title: String(payload.title || "").trim(),
//     slug: String(payload.slug || "").trim().toLowerCase(),

//     image: payload.image || "",
//     imagePublicId: payload.imagePublicId || "",
//     imageAlt: payload.imageAlt || "",

//     category: payload.category || "",
//     categoryLink: payload.categoryLink || "",

//     detailHeroTitle: payload.detailHeroTitle || "",
//     detailHeroDescription: payload.detailHeroDescription || "",
//     detailHeroImage: payload.detailHeroImage || "",
//     detailHeroImagePublicId:
//       payload.detailHeroImagePublicId || "",
//     detailHeroImageAlt: payload.detailHeroImageAlt || "",

//     detailTitle: payload.detailTitle || "",
//     detailSubtitle: payload.detailSubtitle || "",

//     introductionTitle:
//       payload.introductionTitle || "Introduction",
//     introductionParagraphs: parseArray(
//       payload.introductionParagraphs
//     ),

//     contentBlocks: parseArray(payload.contentBlocks).map(
//       (block) => ({
//         _id: block._id,
//         type: block.type,
//         text: block.text || "",
//         items: parseArray(block.items),
//         image: block.image || "",
//         imagePublicId: block.imagePublicId || "",
//         imageAlt: block.imageAlt || "",
//         caption: block.caption || "",
//       })
//     ),

//     closingTitle: payload.closingTitle || "",
//     closingParagraphs: parseArray(payload.closingParagraphs),
//     closingBullets: parseArray(payload.closingBullets),

//     // Keep older fields compatible
//     introduction: payload.introduction || "",
//     detailCoverImage: payload.detailCoverImage || "",
//     sections: parseArray(payload.sections),

//     author: payload.author || "",
//     publishedAt: payload.publishedAt || "",
//     order:
//       payload.order !== undefined && payload.order !== ""
//         ? Number(payload.order)
//         : 0,
//     isActive:
//       payload.isActive === undefined
//         ? true
//         : payload.isActive === true ||
//           payload.isActive === "true",
//   };
// };

// const validateRequiredFields = (payload) => {
//   if (!payload.title || !payload.slug || !payload.image) {
//     return "Title, slug and listing image are required.";
//   }

//   return null;
// };

// // ------------------------------------------
// // GET ALL ARTICLES
// // ------------------------------------------

// // export const getArticles = async (req, res) => {
// //   try {
// //     const filter =
// //       req.query.admin === "true"
// //         ? {}
// //         : { isActive: true };

// //     const articles = await Article.find(filter).sort({
// //       order: 1,
// //       createdAt: -1,
// //     });

// //     return res.json({
// //       success: true,
// //       data: articles,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };
// export const getArticles = async (req, res) => {
//   try {
//     const filter =
//       req.query.admin === "true"
//         ? {}
//         : { isActive: { $ne: false } };

//     const articles = await Article.find(filter).sort({
//       order: 1,
//       createdAt: -1,
//     });

//     return res.json({
//       success: true,
//       data: articles,
//     });
//   } catch (error) {
//     console.error("Get articles error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ------------------------------------------
// // GET ARTICLE BY SLUG
// // ------------------------------------------

// // export const getArticleBySlug = async (req, res) => {
// //   try {
// //     const article = await Article.findOne({
// //       slug: req.params.slug,
// //       isActive: true,
// //     });

// //     if (!article) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Article not found.",
// //       });
// //     }

// //     return res.json({
// //       success: true,
// //       data: article,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// export const getArticleBySlug = async (req, res) => {
//   try {
//     const article = await Article.findOne({
//       slug: req.params.slug,
//       isActive: { $ne: false },
//     });

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     return res.json({
//       success: true,
//       data: article,
//     });
//   } catch (error) {
//     console.error("Get article by slug error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ------------------------------------------
// // CREATE ARTICLE
// // ------------------------------------------

// export const createArticle = async (req, res) => {
//   const filesArray = req.files || [];
//   const uploaded = [];

//   try {
//     const files = getFilesByField(filesArray);
//     let payload = parsePayload(req.body);

//     payload = normalizePublicationPayload(payload);

//     if (!payload.title || !payload.slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and slug are required.",
//       });
//     }

//     const existing = await Article.findOne({
//       slug: payload.slug,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "This article slug already exists.",
//       });
//     }

//     await uploadPublicationImages(payload, files, uploaded);

//     const validationError = validateRequiredFields(payload);

//     if (validationError) {
//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     if (!Number.isFinite(payload.order) || payload.order < 0) {
//       payload.order = await Article.countDocuments();
//     }

//     const article = await Article.create(payload);

//     return res.status(201).json({
//       success: true,
//       message: "Article created successfully.",
//       data: article,
//     });
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Create article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ------------------------------------------
// // UPDATE ARTICLE
// // ------------------------------------------

// export const updateArticle = async (req, res) => {
//   const filesArray = req.files || [];
//   const uploaded = [];

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid article ID.",
//       });
//     }

//     const article = await Article.findById(id);

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     const files = getFilesByField(filesArray);
//     const incoming = parsePayload(req.body);

//     const oldPublicIds = collectArticlePublicIds(article);

//     // Merge incoming data with existing document.
//     const current = article.toObject();

//     const merged = {
//       ...current,
//       ...incoming,
//       image:
//         incoming.image !== undefined
//           ? incoming.image
//           : current.image,
//       imagePublicId:
//         incoming.imagePublicId !== undefined
//           ? incoming.imagePublicId
//           : current.imagePublicId,
//       detailHeroImage:
//         incoming.detailHeroImage !== undefined
//           ? incoming.detailHeroImage
//           : current.detailHeroImage,
//       detailHeroImagePublicId:
//         incoming.detailHeroImagePublicId !== undefined
//           ? incoming.detailHeroImagePublicId
//           : current.detailHeroImagePublicId,
//       contentBlocks:
//         incoming.contentBlocks !== undefined
//           ? incoming.contentBlocks
//           : current.contentBlocks,
//     };

//     let payload = normalizePublicationPayload(merged);

//     if (!payload.title || !payload.slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and slug are required.",
//       });
//     }

//     const duplicate = await Article.findOne({
//       slug: payload.slug,
//       _id: { $ne: id },
//     });

//     if (duplicate) {
//       return res.status(409).json({
//         success: false,
//         message: "This article slug already exists.",
//       });
//     }

//     await uploadPublicationImages(payload, files, uploaded);

//     const validationError = validateRequiredFields(payload);

//     if (validationError) {
//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     Object.assign(article, payload);
//     await article.save();

//     const newPublicIds = collectArticlePublicIds(article);

//     const obsoleteIds = oldPublicIds.filter(
//       (publicId) => !newPublicIds.includes(publicId)
//     );

//     await Promise.all(
//       uniqueIds(obsoleteIds).map(deleteCloudinaryImage)
//     );

//     return res.json({
//       success: true,
//       message: "Article updated successfully.",
//       data: article,
//     });
//   } catch (error) {
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Update article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ------------------------------------------
// // DELETE ARTICLE
// // ------------------------------------------

// export const deleteArticle = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid article ID.",
//       });
//     }

//     const article = await Article.findById(id);

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     const publicIds = collectArticlePublicIds(article);

//     await article.deleteOne();

//     await Promise.all(
//       publicIds.map(deleteCloudinaryImage)
//     );

//     return res.json({
//       success: true,
//       message: "Article deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// import mongoose from "mongoose";
// import fs from "fs/promises";

// import { Article } from "../models/Article.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// const ARTICLE_FOLDER = "AIA-Project-Assets/Articles";

// // ==========================================
// // COMMON HELPERS
// // ==========================================

// const parsePayload = (body = {}) => {
//   if (body.data) {
//     try {
//       return typeof body.data === "string"
//         ? JSON.parse(body.data)
//         : body.data;
//     } catch {
//       throw new Error("Invalid article form data.");
//     }
//   }

//   return body;
// };

// const parseArray = (value) => {
//   return Array.isArray(value) ? value : [];
// };

// const uniqueIds = (ids = []) => [
//   ...new Set(ids.filter(Boolean)),
// ];

// // ==========================================
// // GET FILES BY FIELD NAME
// // ==========================================

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

// // ==========================================
// // DELETE TEMPORARY MULTER FILES
// // ==========================================

// const deleteTemporaryFiles = async (files = []) => {
//   await Promise.all(
//     files.map(async (file) => {
//       if (!file?.path) return;

//       try {
//         await fs.unlink(file.path);
//       } catch (error) {
//         if (error.code !== "ENOENT") {
//           console.error(
//             "Temporary file cleanup error:",
//             error.message
//           );
//         }
//       }
//     })
//   );
// };

// // ==========================================
// // CLOUDINARY DELETE
// // ==========================================

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return;

//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//       invalidate: true,
//     });

//     // console.log(
//     //   "Cloudinary image deletion:",
//     //   publicId,
//     //   result.result
//     // );
//   } catch (error) {
//     console.error(
//       `Cloudinary deletion failed for ${publicId}:`,
//       error.message
//     );
//   }
// };

// // ==========================================
// // COLLECT ARTICLE CLOUDINARY IDS
// // ==========================================

// const collectArticlePublicIds = (article) => {
//   if (!article) return [];

//   const data = article.toObject
//     ? article.toObject()
//     : article;

//   return uniqueIds([
//     data.imagePublicId,
//     data.detailHeroImagePublicId,

//     ...(data.contentBlocks || []).map(
//       (block) => block.imagePublicId
//     ),

//     ...(data.sections || []).map(
//       (section) => section.imagePublicId
//     ),
//   ]);
// };

// // ==========================================
// // UPLOAD SINGLE IMAGE
// // ==========================================

// const uploadFile = async (file, folder) => {
//   if (!file) return null;

//   // console.log("=================================");
//   // console.log("ARTICLE CLOUDINARY UPLOAD");
//   // console.log("File:", file.originalname);
//   // console.log("Folder:", folder);
//   // console.log("=================================");

//   const result = await uploadToCloudinary(
//     file.path,
//     folder
//   );

//   // console.log("ARTICLE IMAGE UPLOADED:", result.url);
//   // console.log("ARTICLE PUBLIC ID:", result.publicId);

//   return result;
// };

// // ==========================================
// // UPLOAD AND REPLACE ARTICLE IMAGES
// // ==========================================

// const uploadPublicationImages = async (
//   payload,
//   files,
//   oldArticle = null
// ) => {
//   const uploaded = [];
//   const oldImagesToDelete = [];

//   const oldData = oldArticle
//     ? oldArticle.toObject
//       ? oldArticle.toObject()
//       : oldArticle
//     : {};

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
//     // --------------------------------------
//     // 1. ARTICLE LISTING / THUMBNAIL IMAGE
//     // --------------------------------------

//     await uploadAndReplace({
//       file: files.image,
//       folder: `${ARTICLE_FOLDER}/Listing`,
//       currentPublicId: oldData.imagePublicId,

//       onSuccess: (result) => {
//         payload.image = result.url;
//         payload.imagePublicId = result.publicId;
//       },
//     });

//     // --------------------------------------
//     // 2. ARTICLE DETAIL HERO IMAGE
//     // --------------------------------------

//     await uploadAndReplace({
//       file: files.detailHeroImage,
//       folder: `${ARTICLE_FOLDER}/Detail-Heroes`,
//       currentPublicId: oldData.detailHeroImagePublicId,

//       onSuccess: (result) => {
//         payload.detailHeroImage = result.url;
//         payload.detailHeroImagePublicId = result.publicId;
//       },
//     });

//     // --------------------------------------
//     // 3. CONTENT BLOCK IMAGES
//     // --------------------------------------

//     const oldBlocks = oldData.contentBlocks || [];
//     const blocks = parseArray(payload.contentBlocks);

//     payload.contentBlocks = await Promise.all(
//       blocks.map(async (block, index) => {
//         const nextBlock = { ...block };

//         const oldBlock =
//           oldBlocks.find(
//             (item) =>
//               block._id &&
//               item._id?.toString() === block._id.toString()
//           ) || oldBlocks[index] || {};

//         const file = files[`contentBlockImage_${index}`];

//         await uploadAndReplace({
//           file,
//           folder: `${ARTICLE_FOLDER}/Content-Blocks`,
//           currentPublicId:
//             block.imagePublicId || oldBlock.imagePublicId,

//           onSuccess: (result) => {
//             nextBlock.image = result.url;
//             nextBlock.imagePublicId = result.publicId;
//           },
//         });

//         // Preserve an existing image when no new file is selected.
//         if (!file) {
//           const sameImage =
//             nextBlock.image &&
//             nextBlock.image === oldBlock.image;

//           if (
//             !nextBlock.imagePublicId &&
//             sameImage
//           ) {
//             nextBlock.imagePublicId =
//               oldBlock.imagePublicId || "";
//           }

//           if (nextBlock.image === undefined) {
//             nextBlock.image = oldBlock.image || "";
//           }

//           if (nextBlock.imagePublicId === undefined) {
//             nextBlock.imagePublicId = "";
//           }
//         }

//         return nextBlock;
//       })
//     );

//     return {
//       uploaded,
//       oldImagesToDelete,
//     };
//   } catch (error) {
//     // Remove newly uploaded images if the operation fails.
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     throw error;
//   }
// };

// // ==========================================
// // NORMALIZE ARTICLE DATA
// // ==========================================

// const normalizePublicationPayload = (payload = {}) => {
//   return {
//     title: String(payload.title || "").trim(),

//     slug: String(payload.slug || "")
//       .trim()
//       .toLowerCase(),

//     image: payload.image || "",
//     imagePublicId: payload.imagePublicId || "",
//     imageAlt: payload.imageAlt || "",

//     category: payload.category || "",
//     categoryLink: payload.categoryLink || "",

//     detailHeroTitle: payload.detailHeroTitle || "",
//     detailHeroDescription:
//       payload.detailHeroDescription || "",

//     detailHeroImage: payload.detailHeroImage || "",

//     detailHeroImagePublicId:
//       payload.detailHeroImagePublicId || "",

//     detailHeroImageAlt:
//       payload.detailHeroImageAlt || "",

//     detailTitle: payload.detailTitle || "",
//     detailSubtitle: payload.detailSubtitle || "",

//     introductionTitle:
//       payload.introductionTitle || "Introduction",

//     introductionParagraphs: parseArray(
//       payload.introductionParagraphs
//     ),

//     contentBlocks: parseArray(
//       payload.contentBlocks
//     ).map((block) => ({
//       _id: block._id,
//       type: block.type,
//       text: block.text || "",
//       items: parseArray(block.items),
//       image: block.image || "",
//       imagePublicId: block.imagePublicId || "",
//       imageAlt: block.imageAlt || "",
//       caption: block.caption || "",
//     })),

//     closingTitle: payload.closingTitle || "",

//     closingParagraphs: parseArray(
//       payload.closingParagraphs
//     ),

//     closingBullets: parseArray(
//       payload.closingBullets
//     ),

//     // Legacy fields: preserve old article compatibility.
//     introduction: payload.introduction || "",
//     detailCoverImage: payload.detailCoverImage || "",
//     sections: parseArray(payload.sections),

//     author: payload.author || "",
//     publishedAt: payload.publishedAt || "",

//     order:
//       payload.order !== undefined &&
//       payload.order !== ""
//         ? Number(payload.order)
//         : 0,

//     isActive:
//       payload.isActive === undefined
//         ? true
//         : payload.isActive === true ||
//           payload.isActive === "true",
//   };
// };

// // ==========================================
// // VALIDATION
// // ==========================================

// const validateRequiredFields = (payload) => {
//   if (!payload.title) {
//     return "Article title is required.";
//   }

//   if (!payload.slug) {
//     return "Article slug is required.";
//   }

//   if (!payload.image) {
//     return "Article listing image is required.";
//   }

//   return null;
// };

// // ==========================================
// // GET ALL ARTICLES
// // ==========================================

// // export const getArticles = async (req, res) => {
// //   try {
// //     const filter =
// //       req.query.admin === "true"
// //         ? {}
// //         : { isActive: { $ne: false } };

// //     const articles = await Article.find(filter)
// //       .sort({
// //         order: 1,
// //         createdAt: -1,
// //       })
// //       .lean();

// //     return res.json({
// //       success: true,
// //       data: articles,
// //     });
// //   } catch (error) {
// //     console.error("Get articles error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// export const getArticles = async (req, res) => {
//   const startTime = Date.now();

//   try {
//     // console.log("\n========== GET ARTICLES ==========");
//     // console.log("MongoDB State:", mongoose.connection.readyState);
//     // console.log("Request Query:", req.query);

//     const filter =
//       req.query.admin === "true"
//         ? {}
//         : { isActive: { $ne: false } };

//     // console.log("MongoDB Filter:", filter);
//     // console.log("Starting Article.find()...");

//     const articles = await Article.find(filter)
//       .sort({
//         order: 1,
//         createdAt: -1,
//       })
//       .lean()
//       .maxTimeMS(15000);

//     // console.log("Articles fetched:", articles.length);
//     // console.log("Query duration:", Date.now() - startTime, "ms");
//     // console.log("==================================\n");

//     return res.json({
//       success: true,
//       data: articles,
//     });
//   } catch (error) {
//     console.error("\n========== GET ARTICLES ERROR ==========");
//     console.error("Error:", error.message);
//     console.error("MongoDB State:", mongoose.connection.readyState);
//     console.error("Duration:", Date.now() - startTime, "ms");
//     console.error("========================================\n");

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // GET ARTICLE BY SLUG
// // ==========================================

// export const getArticleBySlug = async (req, res) => {
//   try {
//     const article = await Article.findOne({
//       slug: req.params.slug,
//       isActive: { $ne: false },
//     }).lean();

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     return res.json({
//       success: true,
//       data: article,
//     });
//   } catch (error) {
//     console.error("Get article by slug error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // CREATE ARTICLE
// // ==========================================

// export const createArticle = async (req, res) => {
//   const filesArray = req.files || [];
//   const uploaded = [];

//   try {
//     const files = getFilesByField(filesArray);

//     let incoming = parsePayload(req.body);

//     let payload = normalizePublicationPayload(incoming);

//     if (!payload.title || !payload.slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and slug are required.",
//       });
//     }

//     // Check duplicate slug.
//     const existing = await Article.findOne({
//       slug: payload.slug,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "This article slug already exists.",
//       });
//     }

//     // Upload images to Cloudinary.
//     const uploadResult = await uploadPublicationImages(
//       payload,
//       files
//     );

//     uploaded.push(...uploadResult.uploaded);

//     const validationError =
//       validateRequiredFields(payload);

//     if (validationError) {
//       await Promise.all(
//         uploaded.map((item) =>
//           deleteCloudinaryImage(item.publicId)
//         )
//       );

//       uploaded.length = 0;

//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     if (
//       !Number.isFinite(payload.order) ||
//       payload.order < 0
//     ) {
//       payload.order = await Article.countDocuments();
//     }

//     const article = await Article.create(payload);

//     // console.log(
//     //   "Article created successfully:",
//     //   article._id
//     // );

//     return res.status(201).json({
//       success: true,
//       message: "Article created successfully.",
//       data: article,
//     });
//   } catch (error) {
//     // Rollback new Cloudinary uploads.
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Create article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ==========================================
// // UPDATE ARTICLE
// // ==========================================

// export const updateArticle = async (req, res) => {
//   const filesArray = req.files || [];
//   const uploaded = [];

//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid article ID.",
//       });
//     }

//     const article = await Article.findById(id);

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     const files = getFilesByField(filesArray);
//     const incoming = parsePayload(req.body);

//     const oldPublicIds =
//       collectArticlePublicIds(article);

//     const current = article.toObject();

//     // Merge existing and incoming content.
//     const merged = {
//       ...current,
//       ...incoming,

//       image:
//         incoming.image !== undefined
//           ? incoming.image
//           : current.image,

//       imagePublicId:
//         incoming.imagePublicId !== undefined
//           ? incoming.imagePublicId
//           : current.imagePublicId,

//       detailHeroImage:
//         incoming.detailHeroImage !== undefined
//           ? incoming.detailHeroImage
//           : current.detailHeroImage,

//       detailHeroImagePublicId:
//         incoming.detailHeroImagePublicId !== undefined
//           ? incoming.detailHeroImagePublicId
//           : current.detailHeroImagePublicId,

//       contentBlocks:
//         incoming.contentBlocks !== undefined
//           ? incoming.contentBlocks
//           : current.contentBlocks,
//     };

//     let payload =
//       normalizePublicationPayload(merged);

//     if (!payload.title || !payload.slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and slug are required.",
//       });
//     }

//     // Duplicate slug check.
//     const duplicate = await Article.findOne({
//       slug: payload.slug,
//       _id: { $ne: id },
//     });

//     if (duplicate) {
//       return res.status(409).json({
//         success: false,
//         message: "This article slug already exists.",
//       });
//     }

//     // Upload and replace images.
//     const uploadResult = await uploadPublicationImages(
//       payload,
//       files,
//       article
//     );

//     uploaded.push(...uploadResult.uploaded);

//     const validationError =
//       validateRequiredFields(payload);

//     if (validationError) {
//       await Promise.all(
//         uploaded.map((item) =>
//           deleteCloudinaryImage(item.publicId)
//         )
//       );

//       uploaded.length = 0;

//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     // Save updated article.
//     Object.assign(article, payload);

//     await article.save();

//     // Find remaining Cloudinary image references.
//     const newPublicIds =
//       collectArticlePublicIds(article);

//     // Delete only images no longer referenced.
//     const obsoleteIds = oldPublicIds.filter(
//       (publicId) => !newPublicIds.includes(publicId)
//     );

//     await Promise.all(
//       uniqueIds(obsoleteIds).map(
//         deleteCloudinaryImage
//       )
//     );

//     // console.log(
//     //   "Article updated successfully:",
//     //   article._id
//     // );

//     return res.json({
//       success: true,
//       message: "Article updated successfully.",
//       data: article,
//     });
//   } catch (error) {
//     // Remove newly uploaded files if database update fails.
//     await Promise.all(
//       uploaded.map((item) =>
//         deleteCloudinaryImage(item.publicId)
//       )
//     );

//     console.error("Update article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     await deleteTemporaryFiles(filesArray);
//   }
// };

// // ==========================================
// // DELETE ARTICLE
// // ==========================================

// export const deleteArticle = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid article ID.",
//       });
//     }

//     const article = await Article.findById(id);

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found.",
//       });
//     }

//     const publicIds =
//       collectArticlePublicIds(article);

//     await article.deleteOne();

//     await Promise.all(
//       publicIds.map(deleteCloudinaryImage)
//     );

//     return res.json({
//       success: true,
//       message: "Article and its Cloudinary images deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete article error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


import mongoose from "mongoose";
import fs from "fs/promises";
import jwt from "jsonwebtoken";

import { Article } from "../models/Article.js";
import { ArticleReader } from "../models/ArticleReader.js";
import { ArticleFeedback } from "../models/ArticleFeedback.js";

import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

import {
  getArticleSegment,
  getArticleWordCount,
  getPublicArticleMetadata,
} from "../utils/articleContent.js";
import FormSubmission from "../models/FormSubmission.js";

const ARTICLE_FOLDER = "AIA-Project-Assets/Articles";

const READER_COOKIE_NAME = "aia_article_reader";

// ==========================================
// READER ACCESS HELPERS
// ==========================================

const getReaderCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/articles",
    maxAge: 180 * 24 * 60 * 60 * 1000,
  };
};

const getCookieValue = (req, cookieName) => {
  const cookieHeader = req.headers.cookie || "";

  const cookies = cookieHeader.split(";");

  const cookie = cookies.find((item) =>
    item.trim().startsWith(`${cookieName}=`)
  );

  if (!cookie) return null;

  try {
    return decodeURIComponent(
      cookie.trim().substring(cookieName.length + 1)
    );
  } catch {
    return null;
  }
};

const getAuthenticatedReader = (req) => {
  const token = getCookieValue(req, READER_COOKIE_NAME);

  if (!token || !process.env.ARTICLE_ACCESS_JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ARTICLE_ACCESS_JWT_SECRET
    );

    if (decoded.type !== "article-reader" || !decoded.readerId) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

const setReaderCookie = (res, reader) => {
  const secret = process.env.ARTICLE_ACCESS_JWT_SECRET;

  if (!secret) {
    throw new Error("ARTICLE_ACCESS_JWT_SECRET is not configured.");
  }

  const token = jwt.sign(
    {
      readerId: reader._id.toString(),
      type: "article-reader",
    },
    secret,
    { expiresIn: "180d" }
  );

  res.cookie(
    READER_COOKIE_NAME,
    token,
    getReaderCookieOptions()
  );
};

// ==========================================
// COMMON HELPERS
// ==========================================

const parsePayload = (body = {}) => {
  if (body.data) {
    try {
      return typeof body.data === "string"
        ? JSON.parse(body.data)
        : body.data;
    } catch {
      throw new Error("Invalid article form data.");
    }
  }

  return body;
};

const parseArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const uniqueIds = (ids = []) => [
  ...new Set(ids.filter(Boolean)),
];

// ==========================================
// GET FILES BY FIELD NAME
// ==========================================

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

// ==========================================
// DELETE TEMPORARY MULTER FILES
// ==========================================

const deleteTemporaryFiles = async (files = []) => {
  await Promise.all(
    files.map(async (file) => {
      if (!file?.path) return;

      try {
        await fs.unlink(file.path);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error(
            "Temporary file cleanup error:",
            error.message
          );
        }
      }
    })
  );
};

// ==========================================
// CLOUDINARY DELETE
// ==========================================

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error) {
    console.error(
      `Cloudinary deletion failed for ${publicId}:`,
      error.message
    );
  }
};

// ==========================================
// COLLECT ARTICLE CLOUDINARY IDS
// ==========================================

const collectArticlePublicIds = (article) => {
  if (!article) return [];

  const data = article.toObject
    ? article.toObject()
    : article;

  return uniqueIds([
    data.imagePublicId,
    data.detailHeroImagePublicId,

    ...(data.contentBlocks || []).map(
      (block) => block.imagePublicId
    ),

    ...(data.sections || []).map(
      (section) => section.imagePublicId
    ),
  ]);
};

// ==========================================
// UPLOAD SINGLE IMAGE
// ==========================================

const uploadFile = async (file, folder) => {
  if (!file) return null;

  const result = await uploadToCloudinary(
    file.path,
    folder
  );

  return result;
};

// ==========================================
// UPLOAD AND REPLACE ARTICLE IMAGES
// ==========================================

const uploadPublicationImages = async (
  payload,
  files,
  oldArticle = null
) => {
  const uploaded = [];
  const oldImagesToDelete = [];

  const oldData = oldArticle
    ? oldArticle.toObject
      ? oldArticle.toObject()
      : oldArticle
    : {};

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
    // 1. ARTICLE LISTING IMAGE

    await uploadAndReplace({
      file: files.image,
      folder: `${ARTICLE_FOLDER}/Listing`,
      currentPublicId: oldData.imagePublicId,

      onSuccess: (result) => {
        payload.image = result.url;
        payload.imagePublicId = result.publicId;
      },
    });

    // 2. ARTICLE DETAIL HERO IMAGE

    await uploadAndReplace({
      file: files.detailHeroImage,
      folder: `${ARTICLE_FOLDER}/Detail-Heroes`,
      currentPublicId: oldData.detailHeroImagePublicId,

      onSuccess: (result) => {
        payload.detailHeroImage = result.url;
        payload.detailHeroImagePublicId = result.publicId;
      },
    });

    // 3. CONTENT BLOCK IMAGES

    const oldBlocks = oldData.contentBlocks || [];
    const blocks = parseArray(payload.contentBlocks);

    payload.contentBlocks = await Promise.all(
      blocks.map(async (block, index) => {
        const nextBlock = { ...block };

        const oldBlock =
          oldBlocks.find(
            (item) =>
              block._id &&
              item._id?.toString() === block._id.toString()
          ) || oldBlocks[index] || {};

        const file = files[`contentBlockImage_${index}`];

        await uploadAndReplace({
          file,
          folder: `${ARTICLE_FOLDER}/Content-Blocks`,
          currentPublicId:
            block.imagePublicId || oldBlock.imagePublicId,

          onSuccess: (result) => {
            nextBlock.image = result.url;
            nextBlock.imagePublicId = result.publicId;
          },
        });

        if (!file) {
          const sameImage =
            nextBlock.image &&
            nextBlock.image === oldBlock.image;

          if (!nextBlock.imagePublicId && sameImage) {
            nextBlock.imagePublicId =
              oldBlock.imagePublicId || "";
          }

          if (nextBlock.image === undefined) {
            nextBlock.image = oldBlock.image || "";
          }

          if (nextBlock.imagePublicId === undefined) {
            nextBlock.imagePublicId = "";
          }
        }

        return nextBlock;
      })
    );

    return {
      uploaded,
      oldImagesToDelete,
    };
  } catch (error) {
    await Promise.all(
      uploaded.map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    throw error;
  }
};

// ==========================================
// NORMALIZE ARTICLE DATA
// ==========================================

const normalizePublicationPayload = (payload = {}) => {
  return {
    title: String(payload.title || "").trim(),

    slug: String(payload.slug || "")
      .trim()
      .toLowerCase(),

    image: payload.image || "",
    imagePublicId: payload.imagePublicId || "",
    imageAlt: payload.imageAlt || "",

    category: payload.category || "",
    categoryLink: payload.categoryLink || "",

 

    detailHeroTitle: payload.detailHeroTitle || "",
    detailHeroDescription:
      payload.detailHeroDescription || "",

    detailHeroImage: payload.detailHeroImage || "",

    detailHeroImagePublicId:
      payload.detailHeroImagePublicId || "",

    detailHeroImageAlt:
      payload.detailHeroImageAlt || "",

    detailTitle: payload.detailTitle || "",
    detailSubtitle: payload.detailSubtitle || "",

    introductionTitle:
      payload.introductionTitle || "Introduction",

    introductionParagraphs: parseArray(
      payload.introductionParagraphs
    ),

    contentBlocks: parseArray(
      payload.contentBlocks
    ).map((block) => ({
      _id: block._id,
      type: block.type,
      text: block.text || "",
      items: parseArray(block.items),
      image: block.image || "",
      imagePublicId: block.imagePublicId || "",
      imageAlt: block.imageAlt || "",
      caption: block.caption || "",
    })),

    closingTitle: payload.closingTitle || "",

    closingParagraphs: parseArray(
      payload.closingParagraphs
    ),

    closingBullets: parseArray(
      payload.closingBullets
    ),

    // Legacy fields
    introduction: payload.introduction || "",
    detailCoverImage: payload.detailCoverImage || "",
    sections: parseArray(payload.sections),

    author: payload.author || "",
    publishedAt: payload.publishedAt || "",

    order:
      payload.order !== undefined &&
      payload.order !== ""
        ? Number(payload.order)
        : 0,

    isActive:
      payload.isActive === undefined
        ? true
        : payload.isActive === true ||
          payload.isActive === "true",
  };
};

// ==========================================
// VALIDATION
// ==========================================

const validateRequiredFields = (payload) => {
  if (!payload.title) {
    return "Article title is required.";
  }

  if (!payload.slug) {
    return "Article slug is required.";
  }

  if (!payload.image) {
    return "Article listing image is required.";
  }

  return null;
};

// ==========================================
// GET ALL ARTICLES
// ==========================================


export const getArticles = async (req, res) => {
  const startTime = Date.now();

  try {
   const isAdmin = req.adminAuthenticated === true;

    const filter = isAdmin
      ? {}
      : { isActive: { $ne: false } };

    const articles = await Article.find(filter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean()
      .maxTimeMS(15000);

    return res.json({
      success: true,
      data: isAdmin
        ? articles
        : articles.map(getPublicArticleMetadata),
    });
  } catch (error) {
    console.error("Get articles error:", error.message);
    console.error(
      "MongoDB State:",
      mongoose.connection.readyState
    );
    console.error(
      "Duration:",
      Date.now() - startTime,
      "ms"
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// GET ARTICLE BY SLUG - AUTOMATIC WORD ACCESS
// ==========================================

export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      isActive: { $ne: false },
    }).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const totalWords = getArticleWordCount(article);

    // Articles up to 500 words are fully public.
    if (totalWords <= 500) {
      return res.json({
        success: true,
        data: {
          article,
          accessGranted: true,
          totalWords,
          hasMore: false,
          currentSegment: "full",
        },
      });
    }

    // A registered reader can access every article.
    const reader = getAuthenticatedReader(req);

    if (reader) {
      return res.json({
        success: true,
        data: {
          article,
          accessGranted: true,
          totalWords,
          hasMore: false,
          currentSegment: "full",
        },
      });
    }

    // First 500 words are public.
    const segment = getArticleSegment(article, 1);

    return res.json({
      success: true,
      data: {
        article: segment.article,
        accessGranted: false,
        totalWords,
        hasMore: totalWords > 500,
        currentSegment: 1,
      },
    });
  } catch (error) {
    console.error("Get article by slug error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET NEXT ARTICLE SEGMENT - AUTOMATIC WORD ACCESS
// ==========================================

export const getNextArticleSegment = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      isActive: { $ne: false },
    }).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const totalWords = getArticleWordCount(article);

    // If the article has no more than 1000 words,
    // return its complete content without registration.
    if (totalWords <= 1000) {
      return res.json({
        success: true,
        data: {
          article,
          accessGranted: true,
          totalWords,
          hasMore: false,
          currentSegment: "full",
        },
      });
    }

    // Registered readers always get the full article.
    const reader = getAuthenticatedReader(req);

    if (reader) {
      return res.json({
        success: true,
        data: {
          article,
          accessGranted: true,
          totalWords,
          hasMore: false,
          currentSegment: "full",
        },
      });
    }

    // Return cumulative content: words 1–1000.
    const segment = getArticleSegment(article, 2);

    return res.json({
      success: true,
      data: {
        article: segment.article,
        accessGranted: false,
        totalWords,
        hasMore: totalWords > 1000,
        currentSegment: 2,
      },
    });
  } catch (error) {
    console.error("Get next article segment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// REGISTER ARTICLE READER
// ==========================================




export const registerArticleReader = async (req, res) => {
  let reader = null;

  try {
    if (!process.env.ARTICLE_ACCESS_JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Article access secret is not configured.",
      });
    }

    // Already authenticated reader
    const existingReader = getAuthenticatedReader(req);

    if (existingReader) {
      return res.json({
        success: true,
        accessGranted: true,
        message: "Article access is already unlocked.",
      });
    }

    // Required fields
    const name = String(req.body.name || "").trim();

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const company = String(req.body.company || "").trim();

    const phone = String(req.body.phone || "").trim();

    if (!name || !email || !company || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, company and phone number are required.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, "");

    if (
      !/^\+?[0-9\s()-]{10,20}$/.test(phone) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    // Save reader information
    reader = await ArticleReader.create({
      name,
      email,
      company,
      phone,
    });

    // Save registration in CMS + Google Sheets queue
    await FormSubmission.create({
      formType: "article-reader",
      sourcePage: String(
        req.body.sourcePage || "article-reader-registration"
      ).trim(),
      data: {
        name,
        email,
        company,
        phone,
      },
      googleSheetsSync: {
        status: "pending",
        attempts: 0,
        nextRetryAt: new Date(),
      },
    });

    // Generate access cookie only after both saves succeed
    setReaderCookie(res, reader);

    return res.status(201).json({
      success: true,
      accessGranted: true,
      message:
        "Registration successful. All restricted articles are unlocked.",
    });
  } catch (error) {
    // Roll back reader if CMS submission fails
    if (reader?._id) {
      try {
        await ArticleReader.deleteOne({
          _id: reader._id,
        });
      } catch (rollbackError) {
        console.error(
          "Article reader rollback error:",
          rollbackError.message
        );
      }
    }

    if (error.code === 11000) {
      console.error("Duplicate ArticleReader index:", error.keyPattern);

      return res.status(409).json({
        success: false,
        message:
          "Registration conflict. Please try again.",
      });
    }

    console.error(
      "Article reader registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};



// ==========================================
// SUBMIT ARTICLE FEEDBACK
// ==========================================



export const submitArticleFeedback = async (req, res) => {
  try {
    const {
      articleId,
      helpful,
      comment = "",
    } = req.body;

    // Validate article ID
    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({
        success: false,
        message: "Valid article ID is required.",
      });
    }

    // Validate helpful selection
    if (typeof helpful !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Please select Yes or No.",
      });
    }

    // Fetch both title and slug
    const article = await Article.findOne({
      _id: articleId,
      isActive: { $ne: false },
    }).select("title slug");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const frontendUrl = (
      process.env.FRONTEND_URL ||
      "http://localhost:3000"
    ).replace(/\/+$/, "");

    const articleSlug = article.slug || "";

    if (!articleSlug) {
      return res.status(500).json({
        success: false,
        message: "Article slug is missing.",
      });
    }

    const articleUrl =
      `${frontendUrl}/publication/articles/${articleSlug}`;

    // Save feedback and queue Google Sheets sync
    await ArticleFeedback.create({
      article: article._id,
      articleTitle: article.title,
      articleSlug,
      articleUrl,
      helpful,
      comment: String(comment || "").trim(),
      wantsToContribute: null,
      googleSheetsSync: {
        status: "pending",
        attempts: 0,
        nextRetryAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for your feedback.",
    });
  } catch (error) {
    console.error("Submit article feedback error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// CREATE ARTICLE
// ==========================================

export const createArticle = async (req, res) => {
  const filesArray = req.files || [];
  const uploaded = [];

  try {
    const files = getFilesByField(filesArray);

    const incoming = parsePayload(req.body);

    const payload = normalizePublicationPayload(incoming);

    if (!payload.title || !payload.slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required.",
      });
    }

    const existing = await Article.findOne({
      slug: payload.slug,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This article slug already exists.",
      });
    }

    const uploadResult = await uploadPublicationImages(
      payload,
      files
    );

    uploaded.push(...uploadResult.uploaded);

    const validationError =
      validateRequiredFields(payload);

    if (validationError) {
      await Promise.all(
        uploaded.map((item) =>
          deleteCloudinaryImage(item.publicId)
        )
      );

      uploaded.length = 0;

      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (
      !Number.isFinite(payload.order) ||
      payload.order < 0
    ) {
      payload.order = await Article.countDocuments();
    }

    const article = await Article.create(payload);

    return res.status(201).json({
      success: true,
      message: "Article created successfully.",
      data: article,
    });
  } catch (error) {
    await Promise.all(
      uploaded.map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    console.error("Create article error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await deleteTemporaryFiles(filesArray);
  }
};

// ==========================================
// UPDATE ARTICLE
// ==========================================

export const updateArticle = async (req, res) => {
  const filesArray = req.files || [];
  const uploaded = [];

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const files = getFilesByField(filesArray);
    const incoming = parsePayload(req.body);

    const oldPublicIds =
      collectArticlePublicIds(article);

    const current = article.toObject();

    const merged = {
      ...current,
      ...incoming,

      image:
        incoming.image !== undefined
          ? incoming.image
          : current.image,

      imagePublicId:
        incoming.imagePublicId !== undefined
          ? incoming.imagePublicId
          : current.imagePublicId,

      detailHeroImage:
        incoming.detailHeroImage !== undefined
          ? incoming.detailHeroImage
          : current.detailHeroImage,

      detailHeroImagePublicId:
        incoming.detailHeroImagePublicId !== undefined
          ? incoming.detailHeroImagePublicId
          : current.detailHeroImagePublicId,

      contentBlocks:
        incoming.contentBlocks !== undefined
          ? incoming.contentBlocks
          : current.contentBlocks,
    };

    const payload =
      normalizePublicationPayload(merged);

    if (!payload.title || !payload.slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required.",
      });
    }

    const duplicate = await Article.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This article slug already exists.",
      });
    }

    const uploadResult = await uploadPublicationImages(
      payload,
      files,
      article
    );

    uploaded.push(...uploadResult.uploaded);

    const validationError =
      validateRequiredFields(payload);

    if (validationError) {
      await Promise.all(
        uploaded.map((item) =>
          deleteCloudinaryImage(item.publicId)
        )
      );

      uploaded.length = 0;

      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    Object.assign(article, payload);

    await article.save();

    const newPublicIds =
      collectArticlePublicIds(article);

    const obsoleteIds = oldPublicIds.filter(
      (publicId) => !newPublicIds.includes(publicId)
    );

    await Promise.all(
      uniqueIds(obsoleteIds).map(
        deleteCloudinaryImage
      )
    );

    return res.json({
      success: true,
      message: "Article updated successfully.",
      data: article,
    });
  } catch (error) {
    await Promise.all(
      uploaded.map((item) =>
        deleteCloudinaryImage(item.publicId)
      )
    );

    console.error("Update article error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await deleteTemporaryFiles(filesArray);
  }
};

// ==========================================
// DELETE ARTICLE
// ==========================================

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const publicIds =
      collectArticlePublicIds(article);

    await article.deleteOne();

    await Promise.all(
      publicIds.map(deleteCloudinaryImage)
    );

    return res.json({
      success: true,
      message:
        "Article and its Cloudinary images deleted successfully.",
    });
  } catch (error) {
    console.error("Delete article error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
