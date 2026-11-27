
// import Member from "../models/Member.js";
// import cloudinary from "../config/cloudinary.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import fs from "node:fs/promises";

// const FOLDER = "AIA-Project-Assets/members/members-directory";

// // ==========================================
// // HELPER FUNCTIONS
// // ==========================================

// const parsePayload = (body = {}) => {
//   const rawPayload = body.payload || body.data;

//   if (typeof rawPayload === "string") {
//     return JSON.parse(rawPayload);
//   }

//   const {
//     payload,
//     data,
//     serviceImageIndexes,
//     ...rest
//   } = body;

//   return rest;
// };

// const removeTempFiles = async (files = []) => {
//   await Promise.all(
//     files.map((file) =>
//       file.path ? fs.unlink(file.path).catch(() => {}) : Promise.resolve()
//     )
//   );
// };

// const getImageIndexes = (value) => {
//   if (!value) return [];

//   try {
//     return typeof value === "string" ? JSON.parse(value) : value;
//   } catch {
//     return [];
//   }
// };

// const uploadFile = async (file) => {
//   if (!file) return null;
//   return uploadToCloudinary(file.path, FOLDER);
// };

// const deleteCloudinaryImage = async (publicId) => {
//   if (!publicId) return true;

//   try {
//     const result = await cloudinary.uploader.destroy(publicId);

//     return (
//       result.result === "ok" ||
//       result.result === "not found"
//     );
//   } catch (error) {
//     console.error("Cloudinary delete error:", publicId, error);
//     return false;
//   }
// };

// const escapeRegex = (value) =>
//   value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// const normalizeFamilyMember = (data = {}) => {
//   const family = data.familyMember;

//   if (family && typeof family === "object" && !Array.isArray(family)) {
//     return {
//       name: family.name || "",
//       designation: family.designation || "",
//       organization: family.organization || "",
//       email: family.email || "",
//       phone: family.phone || "",
//     };
//   }

//   return {
//     name: typeof family === "string" ? family : "",
//     designation: data.designation || "",
//     organization: data.organization || "",
//     email: data.email || "",
//     phone: data.phone || "",
//   };
// };

// const uploadServiceImages = async (services, req) => {
//   const imageIndexes = getImageIndexes(
//     req.body.serviceImageIndexes
//   );

//   const serviceFiles = req.files?.serviceImages || [];

//   for (let i = 0; i < serviceFiles.length; i++) {
//     const serviceIndex = Number(imageIndexes[i]);

//     if (
//       Number.isInteger(serviceIndex) &&
//       services[serviceIndex]
//     ) {
//       const uploaded = await uploadFile(serviceFiles[i]);
//       services[serviceIndex].image = uploaded || {};
//     }
//   }

//   return services;
// };

// // ==========================================
// // CREATE MEMBER
// // POST /api/members
// // ADMIN ONLY
// // ==========================================

// export const createMember = async (req, res) => {
//   const files = Object.values(req.files || {}).flat();

//   try {
//     const data = parsePayload(req.body);

//     const name = data.name?.trim();
//     const slug = data.slug?.trim().toLowerCase();

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Company name is required.",
//       });
//     }

//     if (!slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Slug is required.",
//       });
//     }

//     const existing = await Member.findOne({ slug });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "This member slug already exists.",
//       });
//     }

//     // Upload only one company logo
//     const logo = await uploadFile(
//       req.files?.cardLogo?.[0]
//     );

//     // Prepare services
//     let services = Array.isArray(data.services)
//       ? data.services.map((service) => ({
//           title: service.title || "",
//           description: service.description || "",
//           image: service.image || {},
//         }))
//       : [];

//     services = await uploadServiceImages(services, req);

//     const familyMember = normalizeFamilyMember(data);

//     const member = await Member.create({
//       ...data,
//       name,
//       slug,
//       familyMember,
//       logo: logo || data.logo || {},
//       services,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Member created successfully.",
//       member,
//     });
//   } catch (error) {
//     console.error("Create member error:", error);

//     return res.status(
//       error.code === 11000 ? 409 : 500
//     ).json({
//       success: false,
//       message:
//         error.code === 11000
//           ? "Member slug already exists."
//           : error.message || "Failed to create member.",
//     });
//   } finally {
//     await removeTempFiles(files);
//   }
// };

// // ==========================================
// // GET ALL ACTIVE MEMBERS
// // GET /api/members
// // PUBLIC WEBSITE
// // ==========================================

// export const getAllMembers = async (req, res) => {
//   try {
//     const { search = "" } = req.query;

//     const filter = { isActive: true };

//     if (typeof search === "string" && search.trim()) {
//       const regex = new RegExp(escapeRegex(search.trim()), "i");

//       filter.$or = [
//         { name: regex },
//         { shortName: regex },
//         { category: regex },
//       ];
//     }

//     const members = await Member.find(filter).sort({
//       displayOrder: 1,
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       count: members.length,
//       members,
//     });
//   } catch (error) {
//     console.error("Get public members error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch members.",
//     });
//   }
// };

// // ==========================================
// // GET ALL MEMBERS FOR ADMIN CMS
// // GET /api/members/admin
// // ADMIN ONLY
// // ==========================================

// export const getAdminMembers = async (req, res) => {
//   try {
//     const {
//       search = "",
//       status = "all",
//     } = req.query;

//     const filter = {};

//     if (status === "active") filter.isActive = true;
//     if (status === "inactive") filter.isActive = false;

//     if (typeof search === "string" && search.trim()) {
//       const regex = new RegExp(escapeRegex(search.trim()), "i");

//       filter.$or = [
//         { name: regex },
//         { shortName: regex },
//         { category: regex },
//       ];
//     }

//     const members = await Member.find(filter).sort({
//       displayOrder: 1,
//       createdAt: -1,
//     });

//     const total = await Member.countDocuments();
//     const active = await Member.countDocuments({ isActive: true });
//     const inactive = await Member.countDocuments({ isActive: false });

//     return res.status(200).json({
//       success: true,
//       count: members.length,
//       total,
//       active,
//       inactive,
//       members,
//     });
//   } catch (error) {
//     console.error("Get admin members error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch admin members.",
//     });
//   }
// };

// // ==========================================
// // GET SINGLE MEMBER BY ID
// // GET /api/members/:id
// // ADMIN ONLY
// // ==========================================

// export const getMemberById = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       member,
//     });
//   } catch (error) {
//     console.error("Get member by ID error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch member.",
//     });
//   }
// };

// // ==========================================
// // GET MEMBER BY SLUG
// // GET /api/members/slug/:slug
// // PUBLIC WEBSITE
// // ==========================================

// export const getMemberBySlug = async (req, res) => {
//   try {
//     const member = await Member.findOne({
//       slug: req.params.slug.toLowerCase(),
//       isActive: true,
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }

//     const navigationMembers = await Member.find({
//       isActive: true,
//     })
//       .sort({
//         displayOrder: 1,
//         createdAt: -1,
//       })
//       .select("name slug category");

//     const currentIndex = navigationMembers.findIndex(
//       (item) => item.slug === member.slug
//     );

//     return res.status(200).json({
//       success: true,
//       member,
//       previousMember:
//         currentIndex > 0
//           ? navigationMembers[currentIndex - 1]
//           : null,
//       nextMember:
//         currentIndex >= 0 &&
//         currentIndex < navigationMembers.length - 1
//           ? navigationMembers[currentIndex + 1]
//           : null,
//     });
//   } catch (error) {
//     console.error("Get member by slug error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch member.",
//     });
//   }
// };

// // ==========================================
// // UPDATE MEMBER
// // PUT /api/members/:id
// // ADMIN ONLY
// // ==========================================

// export const updateMember = async (req, res) => {
//   const files = Object.values(req.files || {}).flat();

//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }

//     const data = parsePayload(req.body);

//     const slug = (
//       data.slug?.trim() || member.slug
//     ).toLowerCase();

//     const existing = await Member.findOne({
//       slug,
//       _id: { $ne: member._id },
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "This member slug already exists.",
//       });
//     }

//     // Keep old logo ID for cleanup after successful update
//     const oldLogo = member.logo?.publicId;

//     // Upload new logo only if admin selected a replacement
//     const newLogo = await uploadFile(
//       req.files?.cardLogo?.[0]
//     );

//     // Preserve old logo if no new logo was uploaded
//     const logo = newLogo || member.logo || {};

//     // Prepare services
//     let services = Array.isArray(data.services)
//       ? data.services.map((service) => ({
//           title: service.title || "",
//           description: service.description || "",
//           image: service.image || {},
//         }))
//       : (member.services || []).map((service) => ({
//           title: service.title || "",
//           description: service.description || "",
//           image: service.image || {},
//         }));

//     // Upload service image replacements
//     services = await uploadServiceImages(services, req);

//     const oldServiceImages = (member.services || [])
//       .map((service) => service.image?.publicId)
//       .filter(Boolean);

//     const familyMember =
//       data.familyMember !== undefined ||
//       data.email !== undefined ||
//       data.phone !== undefined ||
//       data.designation !== undefined ||
//       data.organization !== undefined
//         ? normalizeFamilyMember(data)
//         : member.familyMember;

//     const updatedData = {
//       ...data,
//       name: data.name?.trim() || member.name,
//       slug,
//       familyMember,
//       logo,
//       // Preserve existing coverLogo for older records.
//       // No new coverLogo is uploaded.
//       coverLogo: member.coverLogo || {},
//       services,
//       displayOrder:
//         data.displayOrder !== undefined
//           ? Number(data.displayOrder) || 0
//           : member.displayOrder,
//     };

//     const updatedMember = await Member.findByIdAndUpdate(
//       member._id,
//       updatedData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedMember) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found during update.",
//       });
//     }

//     // Delete old logo only after replacement is saved successfully
//     if (
//       newLogo &&
//       oldLogo &&
//       newLogo.publicId !== oldLogo
//     ) {
//       await deleteCloudinaryImage(oldLogo);
//     }

//     // Delete service images only if no longer retained
//     const retainedServiceIds = new Set(
//       services
//         .map((service) => service.image?.publicId)
//         .filter(Boolean)
//     );

//     for (const oldId of oldServiceImages) {
//       if (oldId && !retainedServiceIds.has(oldId)) {
//         await deleteCloudinaryImage(oldId);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Member updated successfully.",
//       member: updatedMember,
//     });
//   } catch (error) {
//     console.error("Update member error:", error);

//     return res.status(
//       error.code === 11000 ? 409 : 500
//     ).json({
//       success: false,
//       message:
//         error.code === 11000
//           ? "Member slug already exists."
//           : error.message || "Failed to update member.",
//     });
//   } finally {
//     await removeTempFiles(files);
//   }
// };

// // ==========================================
// // TOGGLE MEMBER STATUS
// // PATCH /api/members/:id/toggle-status
// // ADMIN ONLY
// // ==========================================

// export const toggleMemberStatus = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }

//     member.isActive = !member.isActive;
//     await member.save();

//     return res.status(200).json({
//       success: true,
//       message: member.isActive
//         ? "Member activated successfully."
//         : "Member deactivated successfully.",
//       member,
//     });
//   } catch (error) {
//     console.error("Toggle member status error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================
// // DELETE MEMBER
// // DELETE /api/members/:id
// // ADMIN ONLY
// // ==========================================

// export const deleteMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }

//     // Delete MongoDB record first
//     await Member.findByIdAndDelete(req.params.id);

//     // Include old coverLogo for cleanup of older records
//     const publicIds = [
//       member.logo?.publicId,
//       member.coverLogo?.publicId,
//       ...(member.services || []).map(
//         (service) => service.image?.publicId
//       ),
//     ].filter(Boolean);

//     const uniquePublicIds = [...new Set(publicIds)];

//     const results = await Promise.allSettled(
//       uniquePublicIds.map((publicId) =>
//         deleteCloudinaryImage(publicId)
//       )
//     );

//     const failedCleanup = results.filter(
//       (result) =>
//         result.status === "rejected" ||
//         result.value === false
//     ).length;

//     return res.status(200).json({
//       success: true,
//       message: "Member deleted successfully.",
//       imagesDeleted: uniquePublicIds.length - failedCleanup,
//       imagesPendingCleanup: failedCleanup,
//     });
//   } catch (error) {
//     console.error("Delete member error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete member.",
//     });
//   }
// };



import { memberFilterGroups, readMemberFilterOptions, saveMemberFilterOptions } from "../models/memberFilterOptions.js";
import Member from "../models/Member.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import fs from "node:fs/promises";

const FOLDER = "AIA-Project-Assets/members/members-directory";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const parsePayload = (body = {}) => {
  const rawPayload = body.payload || body.data;

  if (typeof rawPayload === "string") {
    return JSON.parse(rawPayload);
  }

  const {
    payload,
    data,
    serviceImageIndexes,
    ...rest
  } = body;

  return rest;
};

const removeTempFiles = async (files = []) => {
  await Promise.all(
    files.map((file) =>
      file.path ? fs.unlink(file.path).catch(() => {}) : Promise.resolve()
    )
  );
};

const getImageIndexes = (value) => {
  if (!value) return [];

  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const uploadFile = async (file) => {
  if (!file) return null;
  return uploadToCloudinary(file.path, FOLDER);
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return true;

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return (
      result.result === "ok" ||
      result.result === "not found"
    );
  } catch (error) {
    console.error("Cloudinary delete error:", publicId, error);
    return false;
  }
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeFamilyMember = (data = {}) => {
  const family = data.familyMember;

  if (family && typeof family === "object" && !Array.isArray(family)) {
    return {
      name: family.name || "",
      designation: family.designation || "",
      organization: family.organization || "",
      email: family.email || "",
      phone: family.phone || "",
    };
  }

  return {
    name: typeof family === "string" ? family : "",
    designation: data.designation || "",
    organization: data.organization || "",
    email: data.email || "",
    phone: data.phone || "",
  };
};

const uploadServiceImages = async (services, req) => {
  const imageIndexes = getImageIndexes(
    req.body.serviceImageIndexes
  );

  const serviceFiles = req.files?.serviceImages || [];

  for (let i = 0; i < serviceFiles.length; i++) {
    const serviceIndex = Number(imageIndexes[i]);

    if (
      Number.isInteger(serviceIndex) &&
      services[serviceIndex]
    ) {
      const uploaded = await uploadFile(serviceFiles[i]);
      services[serviceIndex].image = uploaded || {};
    }
  }

  return services;
};

// ==========================================
// CREATE MEMBER
// POST /api/members
// ADMIN ONLY
// ==========================================

const groupKeys = Object.keys(memberFilterGroups);

async function validateMemberTags(data, member) {
  const changedGroups = groupKeys.filter((key) => data[key] !== undefined);
  if (changedGroups.length) {
    const { groups } = await readMemberFilterOptions();
    for (const key of changedGroups) {
      const known = new Set((groups[key] || []).filter((item) => item.isActive).map((item) => item.id));
      for (const id of member?.[key] || []) known.add(id);
      if (!Array.isArray(data[key]) || data[key].some((id) => typeof id !== "string" || !known.has(id))) {
        return "Select valid directory filter options.";
      }
      data[key] = [...new Set(data[key])];
    }
  }
  if (data.directoryKeywords !== undefined) {
    if (!Array.isArray(data.directoryKeywords) || data.directoryKeywords.some((item) => typeof item !== "string")) {
      return "Directory keywords must be a list of text values.";
    }
    data.directoryKeywords = [...new Set(data.directoryKeywords.map((item) => item.trim()).filter(Boolean))];
  }
  return "";
}

export const getMemberFilterOptions = async (_req, res, next) => {
  try {
    const { groups } = await readMemberFilterOptions();
    res.json({ groups: Object.fromEntries(groupKeys.map((key) => [
      key, (groups[key] || []).filter((item) => item.isActive),
    ])) });
  } catch (error) {
    next(error);
  }
};

export const getAdminMemberFilterOptions = async (_req, res, next) => {
  try {
    res.json(await readMemberFilterOptions());
  } catch (error) {
    next(error);
  }
};

export const updateMemberFilterOptions = async (req, res, next) => {
  try {
    const { groups, version } = req.body || {};
    if (!groups || !Number.isInteger(version) || version < 0) {
      return res.status(400).json({ message: "Invalid options or version." });
    }

    const current = await readMemberFilterOptions();
    if (version !== current.version) {
      return res.status(409).json({ message: "Options changed. Reload them before saving." });
    }

    const sanitized = {};
    for (const key of groupKeys) {
      const items = groups[key];
      if (!Array.isArray(items) || items.some((item) =>
        !item || typeof item.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(item.id)
        || typeof item.label !== "string" || !item.label.trim() || item.label.trim().length > 150
        || typeof item.isActive !== "boolean"
      )) return res.status(400).json({ message: "Each option needs a valid label and ID." });

      const ids = new Set(items.map((item) => item.id));
      const labels = new Set(items.filter((item) => item.isActive).map((item) => item.label.trim().toLowerCase()));
      if (ids.size !== items.length || labels.size !== items.filter((item) => item.isActive).length ||
          current.groups[key].some((item) => !ids.has(item.id))) {
        return res.status(400).json({ message: "Use unique labels and deactivate options you want to hide." });
      }
      sanitized[key] = items.map(({ id, label, isActive }) => ({ id, label: label.trim(), isActive }));
    }

    const optionIds = Object.values(sanitized).flat().map((item) => item.id);
    if (new Set(optionIds).size !== optionIds.length) {
      return res.status(400).json({ message: "Filter option IDs must be unique across groups." });
    }

    if (!(await saveMemberFilterOptions(sanitized, version))) {
      return res.status(409).json({ message: "Options changed. Reload them before saving." });
    }
    return res.json({ groups: sanitized, version: version + 1 });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Options changed. Reload them before saving." });
    next(error);
  }
};

export const createMember = async (req, res) => {
  const files = Object.values(req.files || {}).flat();

  try {
    const data = parsePayload(req.body);
    const tagError = await validateMemberTags(data);
    if (tagError) return res.status(400).json({ success: false, message: tagError });

    const name = data.name?.trim();
    const slug = data.slug?.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required.",
      });
    }

    const existing = await Member.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This member slug already exists.",
      });
    }

    // Upload only one company logo
    const logo = await uploadFile(
      req.files?.cardLogo?.[0]
    );

    // Prepare services
    let services = Array.isArray(data.services)
      ? data.services.map((service) => ({
          title: service.title || "",
          description: service.description || "",
          image: service.image || {},
        }))
      : [];

    services = await uploadServiceImages(services, req);

    const familyMember = normalizeFamilyMember(data);

    const member = await Member.create({
      ...data,
      name,
      slug,
      familyMember,
      logo: logo || data.logo || {},
      services,
    });

    return res.status(201).json({
      success: true,
      message: "Member created successfully.",
      member,
    });
  } catch (error) {
    console.error("Create member error:", error);

    return res.status(
      error.code === 11000 ? 409 : 500
    ).json({
      success: false,
      message:
        error.code === 11000
          ? "Member slug already exists."
          : error.message || "Failed to create member.",
    });
  } finally {
    await removeTempFiles(files);
  }
};

// ==========================================
// GET ALL ACTIVE MEMBERS
// GET /api/members
// PUBLIC WEBSITE
// ==========================================

export const getAllMembers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = { isActive: true };

    if (typeof search === "string" && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { name: regex },
        { shortName: regex },
        { category: regex },
      ];
    }

    const members = await Member.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get public members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch members.",
    });
  }
};

// ==========================================
// GET ALL MEMBERS FOR ADMIN CMS
// GET /api/members/admin
// ADMIN ONLY
// ==========================================

export const getAdminMembers = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
    } = req.query;

    const filter = {};

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (typeof search === "string" && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { name: regex },
        { shortName: regex },
        { category: regex },
      ];
    }

    const members = await Member.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    const total = await Member.countDocuments();
    const active = await Member.countDocuments({ isActive: true });
    const inactive = await Member.countDocuments({ isActive: false });

    return res.status(200).json({
      success: true,
      count: members.length,
      total,
      active,
      inactive,
      members,
    });
  } catch (error) {
    console.error("Get admin members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin members.",
    });
  }
};

// ==========================================
// GET SINGLE MEMBER BY ID
// GET /api/members/:id
// ADMIN ONLY
// ==========================================

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get member by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch member.",
    });
  }
};

// ==========================================
// GET MEMBER BY SLUG
// GET /api/members/slug/:slug
// PUBLIC WEBSITE
// ==========================================

export const getMemberBySlug = async (req, res) => {
  try {
    const member = await Member.findOne({
      slug: req.params.slug.toLowerCase(),
      isActive: true,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    const navigationMembers = await Member.find({
      isActive: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .select("name slug category");

    const currentIndex = navigationMembers.findIndex(
      (item) => item.slug === member.slug
    );

    return res.status(200).json({
      success: true,
      member,
      previousMember:
        currentIndex > 0
          ? navigationMembers[currentIndex - 1]
          : null,
      nextMember:
        currentIndex >= 0 &&
        currentIndex < navigationMembers.length - 1
          ? navigationMembers[currentIndex + 1]
          : null,
    });
  } catch (error) {
    console.error("Get member by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch member.",
    });
  }
};

// ==========================================
// UPDATE MEMBER
// PUT /api/members/:id
// ADMIN ONLY
// ==========================================

export const updateMember = async (req, res) => {
  const files = Object.values(req.files || {}).flat();

  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    const data = parsePayload(req.body);
    const tagError = await validateMemberTags(data, member);
    if (tagError) return res.status(400).json({ success: false, message: tagError });

    const slug = (
      data.slug?.trim() || member.slug
    ).toLowerCase();

    const existing = await Member.findOne({
      slug,
      _id: { $ne: member._id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This member slug already exists.",
      });
    }

    // Keep old logo ID for cleanup after successful update
    const oldLogo = member.logo?.publicId;

    // Upload new logo only if admin selected a replacement
    const newLogo = await uploadFile(
      req.files?.cardLogo?.[0]
    );

    // Preserve old logo if no new logo was uploaded
    const logo = newLogo || member.logo || {};

    // Prepare services
    let services = Array.isArray(data.services)
      ? data.services.map((service) => ({
          title: service.title || "",
          description: service.description || "",
          image: service.image || {},
        }))
      : (member.services || []).map((service) => ({
          title: service.title || "",
          description: service.description || "",
          image: service.image || {},
        }));

    // Upload service image replacements
    services = await uploadServiceImages(services, req);

    const oldServiceImages = (member.services || [])
      .map((service) => service.image?.publicId)
      .filter(Boolean);

    const familyMember =
      data.familyMember !== undefined ||
      data.email !== undefined ||
      data.phone !== undefined ||
      data.designation !== undefined ||
      data.organization !== undefined
        ? normalizeFamilyMember(data)
        : member.familyMember;

    const updatedData = {
      ...data,
      name: data.name?.trim() || member.name,
      slug,
      familyMember,
      logo,
      // Preserve existing coverLogo for older records.
      // No new coverLogo is uploaded.
      coverLogo: member.coverLogo || {},
      services,
      displayOrder:
        data.displayOrder !== undefined
          ? Number(data.displayOrder) || 0
          : member.displayOrder,
    };

    const updatedMember = await Member.findByIdAndUpdate(
      member._id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found during update.",
      });
    }

    // Delete old logo only after replacement is saved successfully
    if (
      newLogo &&
      oldLogo &&
      newLogo.publicId !== oldLogo
    ) {
      await deleteCloudinaryImage(oldLogo);
    }

    // Delete service images only if no longer retained
    const retainedServiceIds = new Set(
      services
        .map((service) => service.image?.publicId)
        .filter(Boolean)
    );

    for (const oldId of oldServiceImages) {
      if (oldId && !retainedServiceIds.has(oldId)) {
        await deleteCloudinaryImage(oldId);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Member updated successfully.",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update member error:", error);

    return res.status(
      error.code === 11000 ? 409 : 500
    ).json({
      success: false,
      message:
        error.code === 11000
          ? "Member slug already exists."
          : error.message || "Failed to update member.",
    });
  } finally {
    await removeTempFiles(files);
  }
};

// ==========================================
// TOGGLE MEMBER STATUS
// PATCH /api/members/:id/toggle-status
// ADMIN ONLY
// ==========================================

export const toggleMemberStatus = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    member.isActive = !member.isActive;
    await member.save();

    return res.status(200).json({
      success: true,
      message: member.isActive
        ? "Member activated successfully."
        : "Member deactivated successfully.",
      member,
    });
  } catch (error) {
    console.error("Toggle member status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE MEMBER
// DELETE /api/members/:id
// ADMIN ONLY
// ==========================================

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Delete MongoDB record first
    await Member.findByIdAndDelete(req.params.id);

    // Include old coverLogo for cleanup of older records
    const publicIds = [
      member.logo?.publicId,
      member.coverLogo?.publicId,
      ...(member.services || []).map(
        (service) => service.image?.publicId
      ),
    ].filter(Boolean);

    const uniquePublicIds = [...new Set(publicIds)];

    const results = await Promise.allSettled(
      uniquePublicIds.map((publicId) =>
        deleteCloudinaryImage(publicId)
      )
    );

    const failedCleanup = results.filter(
      (result) =>
        result.status === "rejected" ||
        result.value === false
    ).length;

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
      imagesDeleted: uniquePublicIds.length - failedCleanup,
      imagesPendingCleanup: failedCleanup,
    });
  } catch (error) {
    console.error("Delete member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete member.",
    });
  }
};
