// import mongoose from "mongoose";

// const partnerSchema = new mongoose.Schema(
//   {
//     name: { type: String, trim: true, default: "" },
//     logo: { type: String, default: "" },
//     logoPublicId: { type: String, default: "" },
//   },
//   { _id: true }
// );

// const introductionSectionSchema = new mongoose.Schema(
//   {
//     heading: { type: String, trim: true, default: "" },
//     paragraphs: [{ type: String, trim: true }],
//     bullets: [{ type: String, trim: true }],
//   },
//   { _id: true }
// );

// const agendaItemSchema = new mongoose.Schema(
//   {
//     title: { type: String, trim: true, default: "" },
//     link: { type: String, trim: true, default: "" },
//     external: { type: Boolean, default: false },
//   },
//   { _id: true }
// );

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 70,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 220,
//     },

//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     imagePublicId: {
//       type: String,
//       default: "",
//     },

//     eventLink: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     date: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 50,
//     },

//     category: {
//       type: String,
//       default: "Conference",
//       enum: [
//         "Conference",
//         "Workshops",
//         "Webinars",
//         "Training Program",
//         "Exhibitions",
//       ],
//     },

//     detailPage: {
//       hero: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         description: { type: String, default: "" },
//         imageUrl: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//         imagePosition: {
//           type: String,
//           enum: ["left", "right"],
//           default: "right",
//         },
//         background: {
//           type: String,
//           enum: ["dark", "light"],
//           default: "dark",
//         },
//       },

//       introduction: {
//         title: { type: String, default: "Introduction" },

//         sections: [introductionSectionSchema],

//         eventInfo: {
//           date: { type: String, default: "" },
//           title: { type: String, default: "" },
//           venue: { type: String, default: "" },
//           time: { type: String, default: "" },
//           saveDateLink: { type: String, default: "" },
//           registrationLink: { type: String, default: "" },
//           locationLink: { type: String, default: "" },
//         },

//         partners: [partnerSchema],
//         supporters: [partnerSchema],

//         contact: {
//           email: { type: String, default: "" },
//           phone: { type: String, default: "" },
//           website: { type: String, default: "" },
//         },
//       },

//       agenda: {
//         title: { type: String, default: "" },
//         imageUrl: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//         items: [agendaItemSchema],
//       },

//       // DynamicContentSection is kept untouched.
//       contentSections: {
//         type: mongoose.Schema.Types.Mixed,
//         default: [],
//       },
//     },

//     order: {
//       type: Number,
//       default: 0,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// eventSchema.pre("validate", function () {
//   if (this.title && !this.slug) {
//     this.slug = this.title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-|-$/g, "");
//   }
// });

// export const Event =
//   mongoose.models.Event || mongoose.model("Event", eventSchema);


// import mongoose from "mongoose";

// const partnerSchema = new mongoose.Schema(
//   {
//     name: { type: String, trim: true, default: "" },
//     logo: { type: String, default: "" },
//     logoPublicId: { type: String, default: "" },
//   },
//   { _id: true }
// );

// const introductionSectionSchema = new mongoose.Schema(
//   {
//     heading: { type: String, trim: true, default: "" },
//     paragraphs: [{ type: String, trim: true }],
//     bullets: [{ type: String, trim: true }],
//   },
//   { _id: true }
// );

// const agendaItemSchema = new mongoose.Schema(
//   {
//     time: { type: String, default: "" },
//     title: { type: String, trim: true, default: "" },
//     description: { type: String, default: "" },
//     link: { type: String, trim: true, default: "" },
//     external: { type: Boolean, default: false },
//   },
//   { _id: true }
// );

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 70,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 220,
//     },

//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     imagePublicId: {
//       type: String,
//       default: "",
//     },

//     eventLink: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     date: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 50,
//     },

//     category: {
//       type: String,
//       default: "Conference",
//       enum: [
//         "Conference",
//         "Workshops",
//         "Webinars",
//         "Training Program",
//         "Exhibitions",
//       ],
//     },

//     detailPage: {
//       hero: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         subtitle: { type: String, default: "" },
//         description: { type: String, default: "" },
//         imageUrl: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//         imagePosition: {
//           type: String,
//           enum: ["left", "right"],
//           default: "right",
//         },
//         background: {
//           type: String,
//           enum: ["dark", "light"],
//           default: "dark",
//         },
//       },

//       introduction: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "Introduction" },
//         description: { type: String, default: "" },

//         // Supports paragraph, heading, list and image blocks.
//         blocks: {
//           type: [mongoose.Schema.Types.Mixed],
//           default: [],
//         },

//         // Legacy fields retained for existing event records.
//         sections: [introductionSectionSchema],

//         eventInfo: {
//           date: { type: String, default: "" },
//           title: { type: String, default: "" },
//           venue: { type: String, default: "" },
//           time: { type: String, default: "" },

//           // Calendar fields
//   startDateTime: { type: String, default: "" },
//   endDateTime: { type: String, default: "" },

//           saveDateLink: { type: String, default: "" },
//           registrationLink: { type: String, default: "" },
//           locationLink: { type: String, default: "" },
//         },

//         partners: [partnerSchema],
//         supporters: [partnerSchema],

//         contact: {
//           email: { type: String, default: "" },
//           phone: { type: String, default: "" },
//           website: { type: String, default: "" },
//         },
//       },

//       agenda: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         description: { type: String, default: "" },
//         imageUrl: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//         items: {
//           type: [agendaItemSchema],
//           default: [],
//         },
//       },

//       contentSections: {
//         type: [mongoose.Schema.Types.Mixed],
//         default: [],
//       },
//     },

//     order: {
//       type: Number,
//       default: 0,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// eventSchema.pre("validate", function () {
//   if (this.title && !this.slug) {
//     this.slug = this.title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-|-$/g, "");
//   }
// });

// export const Event =
//   mongoose.models.Event || mongoose.model("Event", eventSchema);



// import mongoose from "mongoose";

// const partnerSchema = new mongoose.Schema(
//   {
//     name: { type: String, trim: true, default: "" },
//     logo: { type: String, default: "" },
//     logoPublicId: { type: String, default: "" },
//   },
//   { _id: true }
// );

// const introductionSectionSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ["paragraph", "list", "image", "heading"],
//       default: "paragraph",
//     },
//     heading: { type: String, default: "" },
//     text: { type: String, default: "" },
//     content: { type: String, default: "" },
//     items: { type: [String], default: [] },
//     image: { type: String, default: "" },
//     imagePublicId: { type: String, default: "" },
//     imageAlt: { type: String, default: "" },
//     order: { type: Number, default: 0 },
//   },
//   { _id: true }
// );

// const agendaItemSchema = new mongoose.Schema(
//   {
//     time: { type: String, default: "" },
//     title: { type: String, default: "" },
//     description: { type: String, default: "" },
//     link: { type: String, default: "" },
//     external: { type: Boolean, default: false },
//   },
//   { _id: true }
// );

// const contentSectionSchema = new mongoose.Schema(
//   {
//     eyebrow: { type: String, default: "" },
//     title: { type: String, default: "" },
//     description: { type: String, default: "" },
//     paragraphs: { type: [String], default: [] },
//     image: { type: String, default: "" },
//     imagePublicId: { type: String, default: "" },
//     imageAlt: { type: String, default: "" },
//     imagePosition: {
//       type: String,
//       enum: ["left", "right"],
//       default: "right",
//     },
//     order: { type: Number, default: 0 },
//   },
//   { _id: true }
// );

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     imagePublicId: {
//       type: String,
//       default: "",
//     },

//     eventLink: {
//       type: String,
//       default: "",
//     },

//     date: {
//       type: String,
//       default: "",
//     },

//     category: {
//       type: String,
//       default: "",
//     },

//     // Private Cloudinary brochure metadata.
//     // Never return brochurePublicId in public API responses.
//     brochurePublicId: {
//       type: String,
//       default: "",
//       select: false,
//     },

//     brochureFileName: {
//       type: String,
//       default: "",
//     },

//     hasBrochure: {
//       type: Boolean,
//       default: false,
//     },

//     detailPage: {
//       hero: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         description: { type: String, default: "" },
//         image: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//       },

//       introduction: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         description: { type: String, default: "" },
//         paragraphs: { type: [String], default: [] },
//         blocks: {
//           type: [introductionSectionSchema],
//           default: [],
//         },
//       },

//       eventInfo: {
//         date: { type: String, default: "" },
//         time: { type: String, default: "" },
//         location: { type: String, default: "" },
//         registrationLink: { type: String, default: "" },
//         mapLink: { type: String, default: "" },
//       },

//       partners: {
//         type: [partnerSchema],
//         default: [],
//       },

//       supporters: {
//         type: [partnerSchema],
//         default: [],
//       },

//       contact: {
//         name: { type: String, default: "" },
//         email: { type: String, default: "" },
//         phone: { type: String, default: "" },
//         description: { type: String, default: "" },
//       },

//       agenda: {
//         eyebrow: { type: String, default: "" },
//         title: { type: String, default: "" },
//         description: { type: String, default: "" },
//         image: { type: String, default: "" },
//         imagePublicId: { type: String, default: "" },
//         imageAlt: { type: String, default: "" },
//         items: {
//           type: [agendaItemSchema],
//           default: [],
//         },
//       },

//       contentSections: {
//         type: [contentSectionSchema],
//         default: [],
//       },
//     },

//     order: {
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
//     minimize: false,
//   }
// );

// export const Event = mongoose.model("Event", eventSchema);




// import mongoose from "mongoose";
// import { eventSectionsSchema } from "../utils/eventSections.js";

// const { Schema } = mongoose;

// const partnerSchema = new Schema({
//   name: { type: String, trim: true, default: "" },
//   logo: { type: String, default: "" },
//   logoPublicId: { type: String, default: "" },
// });

// const introductionSectionSchema = new Schema({
//   type: { type: String, enum: ["paragraph", "list", "image", "heading"], default: "paragraph" },
//   heading: { type: String, default: "" },
//   text: { type: String, default: "" },
//   content: { type: String, default: "" },
//   items: { type: [String], default: [] },
//   image: { type: String, default: "" },
//   imageUrl: { type: String, default: "" },
//   imagePublicId: { type: String, default: "" },
//   imageAlt: { type: String, default: "" },
//   order: { type: Number, default: 0 },
// });

// const agendaItemSchema = new Schema({
//   time: { type: String, default: "" },
//   title: { type: String, default: "" },
//   description: { type: String, default: "" },
//   link: { type: String, default: "" },
//   external: { type: Boolean, default: false },
// });

// const contentSectionSchema = new Schema({
//   eyebrow: { type: String, default: "" },
//   title: { type: String, default: "" },
//   description: { type: String, default: "" },
//   paragraphs: { type: [String], default: [] },
//   image: { type: String, default: "" },
//   imageUrl: { type: String, default: "" },
//   imagePublicId: { type: String, default: "" },
//   imageAlt: { type: String, default: "" },
//   imagePosition: { type: String, enum: ["left", "right"], default: "right" },
//   order: { type: Number, default: 0 },
// });

// const eventSchema = new Schema({
//   title: { type: String, required: true, trim: true, maxlength: 70 },
//   slug: { type: String, required: true, unique: true, trim: true },
//   description: { type: String, default: "", trim: true, maxlength: 220 },
//   imageUrl: { type: String, required: true },
//   imagePublicId: { type: String, default: "" },
//   eventLink: { type: String, default: "" },
//   date: { type: String, default: "" },
//   category: { type: String, default: "" },

//   brochurePublicId: { type: String, default: "", select: false },
//   brochureFileName: { type: String, default: "" },
//   hasBrochure: { type: Boolean, default: false },

//   eventSections: { type: eventSectionsSchema, default: undefined },

//   detailPage: {
//     hero: {
//       eyebrow: { type: String, default: "" },
//       title: { type: String, default: "" },
//       subtitle: { type: String, default: "" },
//       description: { type: String, default: "" },
//       image: { type: String, default: "" },
//       imageUrl: { type: String, default: "" },
//       imagePublicId: { type: String, default: "" },
//       imageAlt: { type: String, default: "" },
//       imagePosition: { type: String, default: "right" },
//       background: { type: String, default: "dark" },
//     },
//     introduction: {
//       eyebrow: { type: String, default: "" },
//       title: { type: String, default: "" },
//       description: { type: String, default: "" },
//       paragraphs: { type: [String], default: [] },
//       blocks: { type: [introductionSectionSchema], default: [] },
//       sections: { type: [introductionSectionSchema], default: [] },
//       eventInfo: {
//         date: { type: String, default: "" },
//         title: { type: String, default: "" },
//         time: { type: String, default: "" },
//         location: { type: String, default: "" },
//         venue: { type: String, default: "" },
//         startDateTime: { type: String, default: "" },
//         endDateTime: { type: String, default: "" },
//         registrationLink: { type: String, default: "" },
//         mapLink: { type: String, default: "" },
//         locationLink: { type: String, default: "" },
//         saveDateLink: { type: String, default: "" },
//       },
//       partners: { type: [partnerSchema], default: [] },
//       supporters: { type: [partnerSchema], default: [] },
//       contact: {
//         name: { type: String, default: "" },
//         email: { type: String, default: "" },
//         phone: { type: String, default: "" },
//         website: { type: String, default: "" },
//         description: { type: String, default: "" },
//       },
//     },
//     agenda: {
//       eyebrow: { type: String, default: "" },
//       title: { type: String, default: "" },
//       description: { type: String, default: "" },
//       image: { type: String, default: "" },
//       imageUrl: { type: String, default: "" },
//       imagePublicId: { type: String, default: "" },
//       imageAlt: { type: String, default: "" },
//       items: { type: [agendaItemSchema], default: [] },
//     },
//     contentSections: { type: [contentSectionSchema], default: [] },
//   },

//   order: {
//     type: Number,
//     default: 0,
//     min: 0,
//     validate: {
//       validator: Number.isInteger,
//       message: "Event order must be a non-negative integer.",
//     },
//   },
//   isActive: { type: Boolean, default: true },
// }, {
//   timestamps: true,
//   minimize: false,
// });

// eventSchema.index({ isActive: 1, order: 1, createdAt: -1 });

// export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);


import mongoose from "mongoose";

const { Schema } = mongoose;

const partnerSchema = new Schema({
  name: { type: String, trim: true, default: "" },
  logo: { type: String, default: "" },
  logoPublicId: { type: String, default: "" },
});

const introductionSectionSchema = new Schema({
  type: { type: String, enum: ["paragraph", "list", "image", "heading"], default: "paragraph" },
  heading: { type: String, default: "" },
  text: { type: String, default: "" },
  content: { type: String, default: "" },
  items: { type: [String], default: [] },
  image: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const agendaItemSchema = new Schema({
  time: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  link: { type: String, default: "" },
  external: { type: Boolean, default: false },
});

const contentSectionSchema = new Schema({
  eyebrow: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  paragraphs: { type: [String], default: [] },
  image: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  imagePosition: { type: String, enum: ["left", "right"], default: "right" },
  order: { type: Number, default: 0 },
});

const cardSchema = new Schema({
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, trim: true },
  imageAlt: { type: String, trim: true },
  url: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  imagePublicId: String,
});
const eventSectionsSchema = new Schema({
  format: { type: String, enum: ["", "conference", "workshop"], default: "" },
  speakers: { type: [cardSchema], default: [] },
  gallery: [{
    heading: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    cards: { type: [cardSchema], default: [] },
  }],
}, { _id: false });

const summarySchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
});

const eventContentSchema = new Schema({
  highlights: { type: [summarySchema], default: [] },
  takeaways: { type: [summarySchema], default: [] },
  videos: [{
    title: { type: String, required: true, trim: true },
    description: String,
    url: { type: String, required: true },
  }],
  resources: [{
    title: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ["pdf", "presentation", "link"], required: true },
    url: String,
    publicId: String,
    fileName: String,
  }],
}, { _id: false });

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 70 },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "", trim: true, maxlength: 220 },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, default: "" },
  eventLink: { type: String, default: "" },
  date: { type: String, default: "" },
  category: { type: String, default: "" },

  brochurePublicId: { type: String, default: "", select: false },
  brochureFileName: { type: String, default: "" },
  hasBrochure: { type: Boolean, default: false },

  eventContent: { type: eventContentSchema, default: undefined },
  eventSections: { type: eventSectionsSchema, default: undefined },

  detailPage: {
    hero: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      imagePublicId: { type: String, default: "" },
      imageAlt: { type: String, default: "" },
      imagePosition: { type: String, default: "right" },
      background: { type: String, default: "dark" },
    },
    introduction: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      paragraphs: { type: [String], default: [] },
      blocks: { type: [introductionSectionSchema], default: [] },
      sections: { type: [introductionSectionSchema], default: [] },
      eventInfo: {
        date: { type: String, default: "" },
        title: { type: String, default: "" },
        time: { type: String, default: "" },
        location: { type: String, default: "" },
        venue: { type: String, default: "" },
        startDateTime: { type: String, default: "" },
        endDateTime: { type: String, default: "" },
        registrationLink: { type: String, default: "" },
        mapLink: { type: String, default: "" },
        locationLink: { type: String, default: "" },
        saveDateLink: { type: String, default: "" },
      },
      partners: { type: [partnerSchema], default: [] },
      supporters: { type: [partnerSchema], default: [] },
      contact: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    },
    agenda: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      imagePublicId: { type: String, default: "" },
      imageAlt: { type: String, default: "" },
      items: { type: [agendaItemSchema], default: [] },
    },
    contentSections: { type: [contentSectionSchema], default: [] },
  },

  order: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "Event order must be a non-negative integer.",
    },
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  minimize: false,
});

eventSchema.index({ isActive: 1, order: 1, createdAt: -1 });

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
