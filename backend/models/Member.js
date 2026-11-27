
// import mongoose from "mongoose";

// // ==========================================
// // IMAGE SCHEMA
// // ==========================================

// const imageSchema = new mongoose.Schema(
//   {
//     url: {
//       type: String,
//       default: "",
//     },
//     publicId: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false }
// );

// // ==========================================
// // SERVICE SCHEMA
// // ==========================================

// const serviceSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     trim: true,
//     default: "",
//   },

//   description: {
//     type: String,
//     default: "",
//   },

//   image: {
//     type: imageSchema,
//     default: () => ({}),
//   },
// });

// // ==========================================
// // AIA FAMILY MEMBER SCHEMA
// // ==========================================

// const familyMemberSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     designation: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     organization: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     email: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     phone: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   { _id: false }
// );

// // ==========================================
// // MEMBER SCHEMA
// // ==========================================

// const memberSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     shortName: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     category: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     logo: {
//       type: imageSchema,
//       default: () => ({}),
//     },

//     coverLogo: {
//       type: imageSchema,
//       default: () => ({}),
//     },

//     about: {
//       type: String,
//       default: "",
//     },

//     services: {
//       type: [serviceSchema],
//       default: [],
//     },

//     mission: {
//       type: String,
//       default: "",
//     },

//     vision: {
//       type: String,
//       default: "",
//     },

//     qualityPolicy: {
//       type: String,
//       default: "",
//     },

//     qualityObjectives: {
//       type: [String],
//       default: [],
//     },

//     commitment: {
//       type: String,
//       default: "",
//     },

//     // AIA Family Member details
//     familyMember: {
//       type: familyMemberSchema,
//       default: () => ({}),
//     },

//     website: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     displayOrder: {
//       type: Number,
//       default: 0,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ==========================================
// // TEXT INDEX
// // ==========================================

// memberSchema.index({
//   name: "text",
//   shortName: "text",
//   category: "text",
// });

// // ==========================================
// // EXPORT MODEL
// // ==========================================

// const Member = mongoose.model("Member", memberSchema);

// export default Member;


import mongoose from "mongoose";

const { Schema } = mongoose;
const text = { type: String, default: "" };
const trimmed = { ...text, trim: true };
const imageSchema = new Schema({ url: text, publicId: text }, { _id: false });
const image = { type: imageSchema, default: () => ({}) };

const serviceSchema = new Schema({
  title: trimmed,
  description: text,
  image,
});

const familyMemberSchema = new Schema({
  name: trimmed,
  designation: trimmed,
  organization: trimmed,
  email: trimmed,
  phone: trimmed,
}, { _id: false });

const memberSchema = new Schema({
  name: { type: String, required: true, trim: true },
  shortName: trimmed,
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: trimmed,
  logo: image,
  coverLogo: image,
  about: text,
  services: { type: [serviceSchema], default: [] },
  mission: text,
  vision: text,
  qualityPolicy: text,
  qualityObjectives: { type: [String], default: [] },
  commitment: text,
  familyMember: { type: familyMemberSchema, default: () => ({}) },
  website: trimmed,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  manufacturingSectors: { type: [String], default: [] },
  technologyStreams: { type: [String], default: [] },
  serviceStreams: { type: [String], default: [] },
  directoryKeywords: { type: [String], default: [] },
}, { timestamps: true });

memberSchema.index({ name: "text", shortName: "text", category: "text" });

export default mongoose.model("Member", memberSchema);
