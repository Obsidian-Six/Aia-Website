import mongoose from "mongoose";

export const memberFilterGroups = {
  manufacturingSectors: [
    "Apparel", "Automotive", "Cement", "Chemical", "Defence Equipment Production",
    "Electrical", "Electronics", "Fiber & Textiles", "Food & Beverage", "Household & Personal Care",
    "Infrastructure Equipment", "Life Sciences", "Material Handling Equipment", "Metals", "Mining",
    "Oil & Gas", "Packaging Machinery", "Plastics", "Printing Machinery", "Process Equipment",
    "Production Machinery", "Pulp & Paper", "Railway Equipment", "Rubber", "Solar Energy Equipment",
    "Textile", "Wind Energy Equipment", "OTHER (Custom)",
  ],
  technologyStreams: [
    "3D Printing", "3D Simulation Software", "Advanced Logic Control", "Advanced Process Control",
    "Cloud Computing Systems", "Condition Monitoring", "Digital Twin Software", "Edge Computing Systems",
    "Electrical Sensing and Actuation", "Electro-Hydraulic Actuation", "Electro-Pneumatic Actuation",
    "Industrial IoT Software", "Industrial Networking Systems", "Intelligent Conveying Systems",
    "Intelligent Packaging Systems", "Intrusion Detection", "Level, Temp, Pressure, Flow Sensing",
    "Machine Learning Systems", "Manufacturing Execution Systems", "Material and Presence Sensing",
    "Position and Safety Sensing", "Precision Motion Control", "Smart HMIs", "Tracking and Tracing",
    "Vision Sensing and Inspection", "OTHER (Custom)",
  ],
  serviceStreams: [
    "Process Reengineering Services", "Automation Consulting Services", "Digital Deployment Services",
    "Automation Integration Services", "Automation Software Development", "Business Process App Development",
    "Commissioning Services", "Data Integration Services", "Education & Skilling Services",
    "Energy Audit Services", "Field Installation Services", "Maturity Assessment Services",
    "Project Management Services", "Quality Audit Services", "Safety Assessment Services",
    "Supply Chain Integration", "OTHER (Custom)",
  ],
};

const option = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { _id: false });

const schema = new mongoose.Schema({
  _id: String,
  groups: Object.fromEntries(Object.keys(memberFilterGroups).map((key) => [key, [option]])),
});

const MemberFilterOptions = mongoose.model("MemberFilterOptions", schema);

const presetGroups = Object.fromEntries(
  Object.entries(memberFilterGroups).map(([key, labels]) => [
    key, labels.map((label, index) => ({ id: `${key}-${index + 1}`, label, isActive: true })),
  ]),
);

export async function readMemberFilterOptions() {
  const record = await MemberFilterOptions.findById("directory").lean();
  return { groups: record?.groups || presetGroups, version: record?.__v ?? 0 };
}

export async function saveMemberFilterOptions(groups, version) {
  const result = await MemberFilterOptions.updateOne(
    { _id: "directory", __v: version },
    { $set: { groups }, $inc: { __v: 1 } },
    { upsert: version === 0, setDefaultsOnInsert: false, runValidators: true },
  );
  return Boolean(result.modifiedCount || result.upsertedCount);
}
