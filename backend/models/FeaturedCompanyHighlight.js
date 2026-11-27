import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    headline: { type: String, trim: true, maxlength: 160, default: "" },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    bannerUrl: { type: String, required: true },
    bannerPublicId: { type: String, required: true, select: false },
    bannerAlt: { type: String, trim: true, maxlength: 180, default: "" },
    linkUrl: { type: String, default: "" },
    lane: { type: String, enum: ["left", "right"], default: "left" },
    order: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, optimisticConcurrency: true });

export default mongoose.model("FeaturedCompanyHighlight", schema);
