
// import mongoose from "mongoose";

// const pillarFootprintSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 60,
//     },

//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 300,
//     },

//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     imagePublicId: {
//       type: String,
//       default: "",
//     },

//     // Legacy field retained for existing records.
//     // Do not use this field for new protected PDF uploads.
//     brochureUrl: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     brochurePublicId: {
//       type: String,
//       default: "",
//     },

//     brochureFileName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     hasBrochure: {
//       type: Boolean,
//       default: false,
//     },

//     isHighlighted: {
//       type: Boolean,
//       default: false,
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
//   }
// );

// export const PillarFootprint =
//   mongoose.models.PillarFootprint ||
//   mongoose.model("PillarFootprint", pillarFootprintSchema);



import mongoose from "mongoose";

const pillarFootprintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    brochureUrl: {
      type: String,
      default: "",
      trim: true,
    },

    brochurePublicId: {
      type: String,
      default: "",
    },

    brochureFileName: {
      type: String,
      default: "",
      trim: true,
    },

    hasBrochure: {
      type: Boolean,
      default: false,
    },

    isHighlighted: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PillarFootprint =
  mongoose.models.PillarFootprint ||
  mongoose.model("PillarFootprint", pillarFootprintSchema);

export { PillarFootprint };
export default PillarFootprint;
