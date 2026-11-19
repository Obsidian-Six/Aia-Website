// import React, { useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { CheckCircle2, ArrowLeft } from "lucide-react";

// import StickyFormCard from "../../components/RequestForms/StickyFormCard";
// import {
//   FormField,
//   FormSelect,
//   FormTextarea,
// } from "../../components/RequestForms/FormFields";
// import { submitFormSubmission } from "../../services/formSubmissionApi";

// // const API_URL = (
// //   import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// // ).replace(/\/$/, "");

// const membershipClasses = [
//   {
//     id: "PM-06",
//     revenue: "Above 500",
//     admissionFee: "2,00,000/- + GST",
//     subscriptionFee: "1,00,000/- + GST",
//   },
//   {
//     id: "PM-05",
//     revenue: "Above 250 upto 500",
//     admissionFee: "1,00,000/- + GST",
//     subscriptionFee: "1,00,000/- + GST",
//   },
//   {
//     id: "PM-04",
//     revenue: "Above 100 upto 250",
//     admissionFee: "75,000/- + GST",
//     subscriptionFee: "75,000/- + GST",
//   },
//   {
//     id: "PM-03",
//     revenue: "Above 50 upto 100",
//     admissionFee: "50,000/- + GST",
//     subscriptionFee: "50,000/- + GST",
//   },
//   {
//     id: "PM-02",
//     revenue: "Above 25 upto 50",
//     admissionFee: "25,000/- + GST",
//     subscriptionFee: "25,000/- + GST",
//   },
//   {
//     id: "PM-01",
//     revenue: "Upto 25",
//     admissionFee: "10,000/- + GST",
//     subscriptionFee: "10,000/- + GST",
//   },
// ];

// const initialValues = {
//   // Card 1 - General Information
//   companyName: "",
//   principalAddress: "",
//   city: "",
//   pincode: "",
//   businessPhone1: "",
//   businessPhone2: "",
//   website: "",
//   gstNumber: "",

//   // Card 2 - Principal Company
//   capitalEmployed: "",
//   numberOfEmployees: "",
//   annualRevenue: "",
//   incorporationYear: "",
//   revenueStream: "",
//   legalStructure: "",
//   foreignCollaborations: "",
//   industryFocus: "",

//   // Card 3 - Benefits and Contributions
//   expectedBenefits: "",
//   contributions: "",

//   // Card 4 - Membership
//   membershipClass: "",

//   // Card 5 - CEO
//   ceoName: "",
//   ceoDesignation: "",
//   ceoAddress: "",
//   ceoPhone: "",
//   ceoEmail: "",

//   // Card 6 - Representative
//   representativeName: "",
//   representativeDesignation: "",
//   representativeAddress: "",
//   representativePhone: "",
//   representativeEmail: "",

//   // Card 7 - Alternate Nominee
//   nomineeName: "",
//   nomineeDesignation: "",
//   nomineeAddress: "",
//   nomineePhone: "",
//   nomineeEmail: "",

//   // Card 8 - Submitted By
//   submittedByName: "",
//   submittedByDesignation: "",
//   submittedByPhone: "",
//   submittedByEmail: "",

//   agree: false,
// };

// const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2";

// function CardHeading({ children, description }) {
//   return (
//     <div className="mb-7">
//       <h2 className="text-lg font-bold leading-[1.4] text-[#263247] sm:text-xl lg:text-[22px]">
//         {children}
//       </h2>

//       {description && (
//         <p className="mt-3 max-w-[850px] text-xs leading-[1.7] text-[#263247] sm:text-sm">
//           {description}
//         </p>
//       )}
//     </div>
//   );
// }

// function MembershipFeeTable({ value, onChange }) {
//   return (
//     <div className="overflow-hidden rounded-lg border border-[#F4D7D3]">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[650px] border-collapse text-left text-xs text-[#263247]">
//           <thead>
//             <tr className="bg-white">
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 S no.
//               </th>
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Class of Membership (Primary)
//               </th>
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Annual Revenues of company / group (in INR, Crores)
//               </th>
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Non-Refundable Admission Fee (in INR)
//               </th>
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Annual Subscription Fee (in INR)*
//               </th>
//               <th className="border-b border-[#F4D7D3] px-3 py-4 text-center font-medium">
//                 Check as applicable
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {membershipClasses.map((item, index) => (
//               <tr
//                 key={item.id}
//                 className={`transition-colors ${
//                   value === item.id ? "bg-[#FFF7F5]" : "bg-white"
//                 }`}
//               >
//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {index + 1}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                   {item.id}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.revenue}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.admissionFee}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.subscriptionFee}
//                 </td>

//                 <td className="border-b border-[#F4D7D3] px-3 py-4 text-center">
//                   <input
//                     type="radio"
//                     name="membershipClass"
//                     value={item.id}
//                     checked={value === item.id}
//                     onChange={onChange}
//                     required
//                     aria-label={`Select ${item.id}`}
//                     className="h-4 w-4 cursor-pointer accent-[#E87565]"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <p className="px-3 py-2 text-[10px] text-gray-500">
//         * Applicable annual subscription fee as per selected membership class.
//       </p>
//     </div>
//   );
// }

// function PersonFields({ prefix, values, onChange, requiredAddress = true }) {
//   return (
//     <div className="space-y-5">
//       <div className={inputGrid}>
//         <FormField
//           label="Name"
//           name={`${prefix}Name`}
//           value={values[`${prefix}Name`]}
//           onChange={onChange}
//           required
//           placeholder="Enter name"
//         />

//         <FormField
//           label="Designation"
//           name={`${prefix}Designation`}
//           value={values[`${prefix}Designation`]}
//           onChange={onChange}
//           placeholder="Enter designation"
//         />
//       </div>

//       <FormField
//         label="Address"
//         name={`${prefix}Address`}
//         value={values[`${prefix}Address`]}
//         onChange={onChange}
//         required={requiredAddress}
//         placeholder="Enter address"
//       />

//       <div className={inputGrid}>
//         <FormField
//           label="Landline / Mobile"
//           name={`${prefix}Phone`}
//           type="tel"
//           value={values[`${prefix}Phone`]}
//           onChange={onChange}
//           placeholder="Enter phone number"
//         />

//         <FormField
//           label="E-mail"
//           name={`${prefix}Email`}
//           type="email"
//           value={values[`${prefix}Email`]}
//           onChange={onChange}
//           placeholder="Enter email address"
//         />
//       </div>
//     </div>
//   );
// }

// export default function RequestFormPage() {
//   const { type } = useParams();

//   const [formData, setFormData] = useState(initialValues);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   const isMembership = type === "membership";

//   const pageTitle = {
//     membership: "Application Form for Primary Membership of AIA",
//     automation: "Automation Product & Services Request",
//     partnership: "Partnership Request with AIA",
//   }[type];

//   const handleChange = (event) => {
//     const { name, value, checked, type: inputType } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: inputType === "checkbox" ? checked : value,
//     }));
//   };

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setError("");

//   if (!formData.membershipClass) {
//     setError("Please select a membership class.");
//     return;
//   }

//   try {
//     setSubmitting(true);

//     const payload = {
//       requestType: type,
//       ...formData,
//     };

//     const result = await submitFormSubmission({
//       formType: "aia-membership",
//       data: payload,
//     });

//     console.log("Membership submission successful:", result);

//     setSubmitted(true);
//   } catch (err) {
//     console.error("Request submission error:", err);

//     setError(
//       err.message || "Something went wrong. Please try again."
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };

//   if (!pageTitle) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="rounded-lg bg-white p-8 text-center">
//           <h1 className="text-xl font-bold text-[#263247]">
//             Request form not found
//           </h1>
//           <Link to="/" className="mt-4 inline-block text-sm text-[#E87565]">
//             Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   if (!isMembership) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="max-w-md rounded-lg bg-white p-8 text-center">
//           <h1 className="text-xl font-bold text-[#263247]">
//             {pageTitle}
//           </h1>
//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             This request form needs its own field configuration.
//             The screenshots provided are for Primary Membership of AIA.
//           </p>
//           <Link
//             to="/"
//             className="mt-5 inline-flex items-center gap-2 text-sm text-[#E87565]"
//           >
//             <ArrowLeft size={15} /> Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   if (submitted) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
//           <CheckCircle2 size={48} className="mx-auto text-green-600" />

//           <h1 className="mt-4 text-xl font-bold text-[#263247]">
//             Application Submitted
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-gray-500">
//             Thank you for applying for AIA membership.
//             Your application has been received.
//           </p>

//           <Link
//             to="/"
//             className="mt-6 inline-block rounded-md bg-[#E87565] px-6 py-3 text-sm font-semibold text-white"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen w-full touch-pan-y bg-[#31577C] px-3 py-6 font-sans sm:px-5 sm:py-10">
//       <div className="mx-auto max-w-[760px]">

//         {/* Header */}
//         <header className="sticky top-0 z-[100] mb-4 flex min-h-[65px] items-center justify-between gap-4 bg-white px-5 py-3 shadow-sm sm:px-7">
//           <Link to="/" aria-label="AIA Home">
//             <img
//               src="/aia-logo-blue.png"
//               alt="AIA Logo"
//               className="h-20 w-auto object-contain"
//             />
//           </Link>

//           <p className="max-w-[230px] text-left text-[9px] font-semibold leading-relaxed text-[#263247] sm:text-[16px]">
//             {pageTitle}
//           </p>
//         </header>

//         <form onSubmit={handleSubmit} className="space-y-3">

//           {/* CARD 1 - GENERAL INFORMATION */}
//           <StickyFormCard number={1} index={0}>
//             <CardHeading description="We have gone through the aims and objectives of AIA and wish to apply for Primary Membership. The application details are duly completed as below:">
//               General Information
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Name of the Company / Group of Companies"
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//                 required
//                 placeholder="Company name"
//               />

//               <FormField
//                 label="Principal Address"
//                 name="principalAddress"
//                 value={formData.principalAddress}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="City"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Pin code"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 pattern="[0-9]{6}"
//                 maxLength={6}
//                 placeholder="6-digit PIN code"
//               />

//               <FormField
//                 label="Business Phone 1"
//                 name="businessPhone1"
//                 type="tel"
//                 value={formData.businessPhone1}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Phone 2"
//                 name="businessPhone2"
//                 type="tel"
//                 value={formData.businessPhone2}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Website"
//                 name="website"
//                 type="url"
//                 value={formData.website}
//                 onChange={handleChange}
//                 placeholder="https://"
//               />

//               <FormField
//                 label="GST Registration No"
//                 name="gstNumber"
//                 value={formData.gstNumber}
//                 onChange={handleChange}
//               />
//             </div>
//           </StickyFormCard>

//           {/* CARD 2 - ABOUT PRINCIPAL COMPANY */}
//           <StickyFormCard number={2} index={1}>
//             <CardHeading description="If any other companies belonging to the same group are to be included, furnish additional information through separate sheets.">
//               About the Principal Company
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Capital Employed (Rs. crore)"
//                 name="capitalEmployed"
//                 value={formData.capitalEmployed}
//                 onChange={handleChange}
//                 placeholder="Enter amount"
//               />

//               <FormField
//                 label="Number of Employees"
//                 name="numberOfEmployees"
//                 type="number"
//                 value={formData.numberOfEmployees}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Annual Revenue (Rs. crore)"
//                 name="annualRevenue"
//                 type="number"
//                 value={formData.annualRevenue}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Year of incorporation"
//                 name="incorporationYear"
//                 type="number"
//                 value={formData.incorporationYear}
//                 onChange={handleChange}
//                 placeholder="YYYY"
//               />

//               <div className="sm:col-span-2">
//                 <FormSelect
//                   label="Revenue stream (indicate ranking 1-4, against each)"
//                   name="revenueStream"
//                   value={formData.revenueStream}
//                   onChange={handleChange}
//                   options={[
//                     "Manufacturing - Rank 1",
//                     "Manufacturing - Rank 2",
//                     "Manufacturing - Rank 3",
//                     "Manufacturing - Rank 4",
//                     "Services - Rank 1",
//                     "Services - Rank 2",
//                     "Services - Rank 3",
//                     "Services - Rank 4",
//                     "Other",
//                   ]}
//                 />
//               </div>

//               <FormSelect
//                 label="Legal/Tax Structure of Company"
//                 name="legalStructure"
//                 value={formData.legalStructure}
//                 onChange={handleChange}
//                 options={[
//                   "Private Limited",
//                   "Public Limited",
//                   "Partnership",
//                   "Proprietorship",
//                   "LLP",
//                   "Other",
//                 ]}
//               />

//               <FormField
//                 label="Foreign collaborations if any"
//                 name="foreignCollaborations"
//                 value={formData.foreignCollaborations}
//                 onChange={handleChange}
//               />

//               <div className="sm:col-span-2">
//                 <FormTextarea
//                   label="Industry and applications focus"
//                   name="industryFocus"
//                   value={formData.industryFocus}
//                   onChange={handleChange}
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </StickyFormCard>

//           {/* CARD 3 - BENEFITS AND CONTRIBUTIONS */}
//           <StickyFormCard number={3} index={2}>
//             <CardHeading>
//               How does the company expect to benefit from the AIA membership and contribute to the growth of AIA objectives?
//             </CardHeading>

//             <div className="space-y-5">
//               <FormTextarea
//                 label="Expected Benefits from AIA Membership"
//                 name="expectedBenefits"
//                 value={formData.expectedBenefits}
//                 onChange={handleChange}
//                 rows={3}
//               />

//               <FormTextarea
//                 label="Ways of Contributions to AIA Objective"
//                 name="contributions"
//                 value={formData.contributions}
//                 onChange={handleChange}
//                 rows={4}
//               />
//             </div>
//           </StickyFormCard>

//           {/* CARD 4 - MEMBERSHIP CLASS */}
//           <StickyFormCard number={4} index={3}>
//             <CardHeading>
//               Current Membership class and fee details
//             </CardHeading>

//             <MembershipFeeTable
//               value={formData.membershipClass}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* CARD 5 - CEO */}
//           <StickyFormCard number={5} index={4}>
//             <CardHeading>
//               Chief Executive Officer of the Principal Company or Group
//             </CardHeading>

//             <PersonFields
//               prefix="ceo"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* CARD 6 - PRINCIPAL REPRESENTATIVE */}
//           <StickyFormCard number={6} index={5}>
//             <CardHeading description="(if different from Chief Executive Officer)">
//               Principal Representative for attending Annual Body & Special Meetings:
//             </CardHeading>

//             <PersonFields
//               prefix="representative"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* CARD 7 - ALTERNATE NOMINEE */}
//           <StickyFormCard number={7} index={6}>
//             <CardHeading>
//               Alternate Nominee for attending Annual Body & Special Meetings:
//             </CardHeading>

//             <PersonFields
//               prefix="nominee"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* CARD 8 - SUBMITTED BY */}
//           <StickyFormCard number={8} index={7}>
//             <CardHeading>
//               Submitted by
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Name"
//                 name="submittedByName"
//                 value={formData.submittedByName}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Designation"
//                 name="submittedByDesignation"
//                 value={formData.submittedByDesignation}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Mobile Number"
//                 name="submittedByPhone"
//                 type="tel"
//                 value={formData.submittedByPhone}
//                 onChange={handleChange}
//                 required
//                 pattern="[6-9][0-9]{9}"
//                 maxLength={10}
//               />

//               <FormField
//                 label="Email"
//                 name="submittedByEmail"
//                 type="email"
//                 value={formData.submittedByEmail}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <p className="mt-5 text-[10px] leading-[1.7] text-[#263247] sm:text-xs">
//               Note: AIA does not provide individual membership. Any firm or
//               company in India engaged in manufacturing activities or
//               providing services shall be eligible to apply for membership
//               of the Confederation of Indian Industry.
//             </p>

//             <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-600">
//               <input
//                 type="checkbox"
//                 name="agree"
//                 checked={formData.agree}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 h-4 w-4 shrink-0 accent-[#E87565]"
//               />

//               <span>
//                 I confirm that the information provided in this application
//                 is accurate and complete.
//               </span>
//             </label>
//           </StickyFormCard>

//           {/* FORM ERROR */}
//           {error && (
//             <p
//               role="alert"
//               className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600"
//             >
//               {error}
//             </p>
//           )}

//           {/* FINAL SUBMIT BUTTON */}
//           <div className="relative z-[110] flex justify-center py-6 bg-white px-5">
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full rounded-md bg-gradient-to-r from-[#D72C1D] to-[#F27D70] px-8 py-3.5 text-lg font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {submitting ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { CheckCircle2, ArrowLeft, X } from "lucide-react";

// import StickyFormCard from "../../components/RequestForms/StickyFormCard";
// import {
//   FormField,
//   FormSelect,
//   FormTextarea,
// } from "../../components/RequestForms/FormFields";
// import { submitFormSubmission } from "../../services/formSubmissionApi";

// // ============================================
// // MEMBERSHIP CATEGORY OPTIONS
// // ============================================

// const OTHER_OPTION = "OTHER (Custom)";

// const technologyStreamOptions = [
//   "3D Printing",
//   "3D Simulation Software",
//   "Advanced Logic Control",
//   "Advanced Process Control",
//   "Cloud Computing Systems",
//   "Condition Monitoring",
//   "Digital Twin Software",
//   "Edge Computing Systems",
//   "Electrical Sensing and Actuation",
//   "Electro-Hydraulic Actuation",
//   "Electro-Pneumatic Actuation",
//   "Industrial IoT Software",
//   "Industrial Networking Systems",
//   "Intelligent Conveying Systems",
//   "Intelligent Packaging Systems",
//   "Intrusion Detection",
//   "Level, Temp, Pressure, Flow Sensing",
//   "Machine Learning Systems",
//   "Manufacturing Execution Systems",
//   "Material and Presence Sensing",
//   "Position and Safety Sensing",
//   "Precision Motion Control",
//   "Smart HMIs",
//   "Tracking and Tracing",
//   "Vision Sensing and Inspection",
//   OTHER_OPTION,
// ];

// const serviceStreamOptions = [
//   "Process Reengineering Services",
//   "Automation Consulting Services",
//   "Digital Deployment Services",
//   "Automation Integration Services",
//   "Automation Software Development",
//   "Business Process App Development",
//   "Commissioning Services",
//   "Data Integration Services",
//   "Education & Skilling Services",
//   "Energy Audit Services",
//   "Field Installation Services",
//   "Maturity Assessment Services",
//   "Project Management Services",
//   "Quality Audit Services",
//   "Safety Assessment Services",
//   "Supply Chain Integration",
//   OTHER_OPTION,
// ];

// // ============================================
// // MEMBERSHIP FEE DATA
// // ============================================

// const membershipClasses = [
//   {
//     id: "PM-06",
//     revenue: "Above 500",
//     admissionFee: "2,00,000/- + GST",
//     subscriptionFee: "1,00,000/- + GST",
//   },
//   {
//     id: "PM-05",
//     revenue: "Above 250 upto 500",
//     admissionFee: "1,00,000/- + GST",
//     subscriptionFee: "1,00,000/- + GST",
//   },
//   {
//     id: "PM-04",
//     revenue: "Above 100 upto 250",
//     admissionFee: "75,000/- + GST",
//     subscriptionFee: "75,000/- + GST",
//   },
//   {
//     id: "PM-03",
//     revenue: "Above 50 upto 100",
//     admissionFee: "50,000/- + GST",
//     subscriptionFee: "50,000/- + GST",
//   },
//   {
//     id: "PM-02",
//     revenue: "Above 25 upto 50",
//     admissionFee: "25,000/- + GST",
//     subscriptionFee: "25,000/- + GST",
//   },
//   {
//     id: "PM-01",
//     revenue: "Upto 25",
//     admissionFee: "10,000/- + GST",
//     subscriptionFee: "10,000/- + GST",
//   },
// ];

// // ============================================
// // INITIAL FORM VALUES
// // ============================================

// const initialValues = {
//   // Card 1 - General Information
//   companyName: "",
//   principalAddress: "",
//   city: "",
//   pincode: "",
//   businessPhone1: "",
//   businessPhone2: "",
//   website: "",
//   gstNumber: "",

//   // Card 2 - Principal Company
//   capitalEmployed: "",
//   numberOfEmployees: "",
//   annualRevenue: "",
//   incorporationYear: "",
//   revenueStream: "",
//   legalStructure: "",
//   foreignCollaborations: "",
//   industryFocus: "",

//   // Card 3 - Membership Category
//   membershipType: "Technology Provider",
//   technologyAreas: [],
//   technologyOther: "",
//   serviceAreas: [],
//   serviceOther: "",

//   // Card 4 - Benefits and Contributions
//   expectedBenefits: "",
//   contributions: "",

//   // Card 5 - Membership Class
//   membershipClass: "",

//   // Card 6 - CEO
//   ceoName: "",
//   ceoDesignation: "",
//   ceoAddress: "",
//   ceoPhone: "",
//   ceoEmail: "",

//   // Card 7 - Representative
//   representativeName: "",
//   representativeDesignation: "",
//   representativeAddress: "",
//   representativePhone: "",
//   representativeEmail: "",

//   // Card 8 - Alternate Nominee
//   nomineeName: "",
//   nomineeDesignation: "",
//   nomineeAddress: "",
//   nomineePhone: "",
//   nomineeEmail: "",

//   // Card 9 - Submitted By
//   submittedByName: "",
//   submittedByDesignation: "",
//   submittedByPhone: "",
//   submittedByEmail: "",

//   agree: false,
// };

// const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2";

// // ============================================
// // GSTIN VALIDATION
// // ============================================

// const GSTIN_REGEX =
//   /^(0[1-9]|[1-2][0-9]|3[0-8]|97|99)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

// const GSTIN_CHAR_VALUES = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// function isValidGSTIN(value) {
//   const gstin = String(value || "").trim().toUpperCase();

//   if (!GSTIN_REGEX.test(gstin)) {
//     return false;
//   }

//   // GSTIN checksum validation
//   const chars = gstin.slice(0, 14).split("").reverse();

//   let factor = 2;
//   let sum = 0;

//   for (const char of chars) {
//     const product = GSTIN_CHAR_VALUES.indexOf(char) * factor;

//     sum += Math.floor(product / 36) + (product % 36);

//     factor = factor === 2 ? 1 : 2;
//   }

//   const checksumValue = (36 - (sum % 36)) % 36;

//   return GSTIN_CHAR_VALUES[checksumValue] === gstin[14];
// }

// // ============================================
// // REUSABLE CARD HEADING
// // ============================================

// function CardHeading({ children, description }) {
//   return (
//     <div className="mb-7">
//       <h2 className="text-lg font-bold leading-[1.4] text-[#263247] sm:text-xl lg:text-[22px]">
//         {children}
//       </h2>

//       {description && (
//         <p className="mt-3 max-w-[850px] text-xs leading-[1.7] text-[#263247] sm:text-sm">
//           {description}
//         </p>
//       )}
//     </div>
//   );
// }

// // ============================================
// // MEMBERSHIP FEE TABLE
// // ============================================

// function MembershipFeeTable({ value, onChange }) {
//   return (
//     <div className="overflow-hidden rounded-lg border border-[#F4D7D3]">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[650px] border-collapse text-left text-xs text-[#263247]">
//           <thead>
//             <tr className="bg-white">
//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 S no.
//               </th>

//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Class of Membership (Primary)
//               </th>

//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Annual Revenues of company / group (in INR, Crores)
//               </th>

//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Non-Refundable Admission Fee (in INR)
//               </th>

//               <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                 Annual Subscription Fee (in INR)*
//               </th>

//               <th className="border-b border-[#F4D7D3] px-3 py-4 text-center font-medium">
//                 Check as applicable
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {membershipClasses.map((item, index) => (
//               <tr
//                 key={item.id}
//                 className={`transition-colors ${
//                   value === item.id ? "bg-[#FFF7F5]" : "bg-white"
//                 }`}
//               >
//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {index + 1}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
//                   {item.id}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.revenue}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.admissionFee}
//                 </td>

//                 <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
//                   {item.subscriptionFee}
//                 </td>

//                 <td className="border-b border-[#F4D7D3] px-3 py-4 text-center">
//                   <input
//                     type="radio"
//                     name="membershipClass"
//                     value={item.id}
//                     checked={value === item.id}
//                     onChange={onChange}
//                     required
//                     aria-label={`Select ${item.id}`}
//                     className="h-4 w-4 cursor-pointer accent-[#E87565]"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <p className="px-3 py-2 text-[10px] text-gray-500">
//         * Applicable annual subscription fee as per selected membership class.
//       </p>
//     </div>
//   );
// }

// // ============================================
// // REUSABLE PERSON FIELDS
// // ============================================

// function PersonFields({
//   prefix,
//   values,
//   onChange,
//   requiredAddress = true,
// }) {
//   return (
//     <div className="space-y-5">
//       <div className={inputGrid}>
//         <FormField
//           label="Name"
//           name={`${prefix}Name`}
//           value={values[`${prefix}Name`]}
//           onChange={onChange}
//           required
//           placeholder="Enter name"
//         />

//         <FormField
//           label="Designation"
//           name={`${prefix}Designation`}
//           value={values[`${prefix}Designation`]}
//           onChange={onChange}
//           placeholder="Enter designation"
//         />
//       </div>

//       <FormField
//         label="Address"
//         name={`${prefix}Address`}
//         value={values[`${prefix}Address`]}
//         onChange={onChange}
//         required={requiredAddress}
//         placeholder="Enter address"
//       />

//       <div className={inputGrid}>
//         <FormField
//           label="Landline / Mobile"
//           name={`${prefix}Phone`}
//           type="tel"
//           value={values[`${prefix}Phone`]}
//           onChange={onChange}
//           placeholder="Enter phone number"
//         />

//         <FormField
//           label="E-mail"
//           name={`${prefix}Email`}
//           type="email"
//           value={values[`${prefix}Email`]}
//           onChange={onChange}
//           placeholder="Enter email address"
//         />
//       </div>
//     </div>
//   );
// }

// // ============================================
// // REUSABLE MULTI SELECT DROPDOWN
// // ============================================

// function MembershipMultiSelect({
//   label,
//   options,
//   value = [],
//   onChange,
//   maxSelections,
// }) {
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         dropdownRef.current.removeAttribute("open");
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     document.addEventListener("touchstart", handleOutsideClick);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//       document.removeEventListener("touchstart", handleOutsideClick);
//     };
//   }, []);

//   const toggleOption = (option) => {
//     if (value.includes(option)) {
//       onChange(value.filter((item) => item !== option));
//       return;
//     }

//     if (value.length >= maxSelections) {
//       return;
//     }

//     onChange([...value, option]);
//   };

//   return (
//     <div className="w-full">
//       <label className="mb-3 block text-sm font-semibold text-[#263247] sm:text-base">
//         {label} <span className="text-[#E87565]">*</span>
//       </label>

//       <details
//         ref={dropdownRef}
//         className="group relative w-full"
//       >
//         <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 transition hover:border-[#E87565] sm:min-h-[60px] sm:px-5 sm:text-base">
//           <span className="truncate">
//             {value.length > 0
//               ? `${value.length} categor${
//                   value.length === 1 ? "y" : "ies"
//                 } selected`
//               : "Select applicable categories"}
//           </span>

//           <svg
//             className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             aria-hidden="true"
//           >
//             <path d="m6 9 6 6 6-6" />
//           </svg>
//         </summary>

//         <div className="absolute left-0 top-full z-[120] mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
//           {options.map((option) => {
//             const checked = value.includes(option);
//             const limitReached = value.length >= maxSelections;

//             return (
//               <label
//                 key={option}
//                 className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm transition ${
//                   checked
//                     ? "bg-[#FFF5F3] text-[#263247]"
//                     : "text-gray-700 hover:bg-gray-50"
//                 } ${
//                   !checked && limitReached
//                     ? "cursor-not-allowed opacity-50"
//                     : ""
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   disabled={!checked && limitReached}
//                   onChange={() => toggleOption(option)}
//                   className="h-4 w-4 shrink-0 accent-[#E87565]"
//                 />

//                 <span>{option}</span>
//               </label>
//             );
//           })}
//         </div>
//       </details>

//       <p className="mt-2 text-xs text-gray-500">
//         You can select up to {maxSelections} categories.
//         {value.length > 0 &&
//           ` ${value.length}/${maxSelections} selected.`}
//       </p>
//     </div>
//   );
// }

// // ============================================
// // THANK YOU SUCCESS MODAL
// // ============================================

// function ThankYouModal({ onClose }) {
//   return (
//     <div
//       className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 py-6"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="membership-success-title"
//     >
//       <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center shadow-2xl sm:px-9">
//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close success message"
//           className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
//         >
//           <X size={20} />
//         </button>

//         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
//           <CheckCircle2 size={38} className="text-green-600" />
//         </div>

//         <h2
//           id="membership-success-title"
//           className="mt-5 text-xl font-bold text-[#263247] sm:text-2xl"
//         >
//           Thank You for Applying to AIA!
//         </h2>

//         <p className="mt-3 text-sm leading-7 text-gray-600">
//           Your membership application has been successfully submitted.
//           Our team will review your details and get in touch with you
//           regarding the next steps.
//         </p>

//         <button
//           type="button"
//           onClick={onClose}
//           className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#D72C1D] to-[#F27D70] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg sm:w-auto"
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // MAIN REQUEST FORM PAGE
// // ============================================

// export default function RequestFormPage() {
//   const { type } = useParams();

//   const [formData, setFormData] = useState(initialValues);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [error, setError] = useState("");
//   const [gstTouched, setGstTouched] = useState(false);

//   const isMembership = type === "membership";

//   const pageTitle = {
//     membership: "Application Form for Primary Membership of AIA",
//     automation: "Automation Product & Services Request",
//     partnership: "Partnership Request with AIA",
//   }[type];

//   const gstValue = formData.gstNumber.trim().toUpperCase();

//   const gstInvalid =
//     Boolean(gstValue) && !isValidGSTIN(gstValue);

//   // ==========================================
//   // GENERAL INPUT CHANGE
//   // ==========================================

//   const handleChange = (event) => {
//     const {
//       name,
//       value,
//       checked,
//       type: inputType,
//     } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]:
//         inputType === "checkbox"
//           ? checked
//           : name === "gstNumber"
//             ? value.toUpperCase().replace(/\s/g, "").slice(0, 15)
//             : value,
//     }));
//   };

//   // ==========================================
//   // MEMBERSHIP TYPE CHANGE
//   // ==========================================

//   const handleMembershipTypeChange = (event) => {
//     const value = event.target.value;

//     setFormData((previous) => ({
//       ...previous,
//       membershipType: value,

//       // Reset previous provider selections
//       technologyAreas: [],
//       technologyOther: "",
//       serviceAreas: [],
//       serviceOther: "",
//     }));
//   };

//   // ==========================================
//   // MEMBERSHIP MULTI SELECT CHANGE
//   // ==========================================

//   const handleMembershipMultiSelect = (
//     field,
//     selectedValues
//   ) => {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: selectedValues,

//       ...(field === "technologyAreas" &&
//       !selectedValues.includes(OTHER_OPTION)
//         ? { technologyOther: "" }
//         : {}),

//       ...(field === "serviceAreas" &&
//       !selectedValues.includes(OTHER_OPTION)
//         ? { serviceOther: "" }
//         : {}),
//     }));
//   };

//   // ==========================================
//   // FORM SUBMISSION
//   // ==========================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     // GST validation
//     if (gstValue && !isValidGSTIN(gstValue)) {
//       setGstTouched(true);

//       setError(
//         "Please enter a valid 15-character GSTIN, or leave the GST field blank if your company is not GST registered."
//       );

//       return;
//     }

//     // Membership type validation
//     if (!formData.membershipType) {
//       setError("Please select a membership type.");
//       return;
//     }

//     // Technology Provider validation
//     if (
//       formData.membershipType === "Technology Provider" &&
//       formData.technologyAreas.length === 0
//     ) {
//       setError("Please select at least one technology area.");
//       return;
//     }

//     if (
//       formData.membershipType === "Technology Provider" &&
//       formData.technologyAreas.includes(OTHER_OPTION) &&
//       !formData.technologyOther.trim()
//     ) {
//       setError("Please specify the other technology area.");
//       return;
//     }

//     // Service Provider validation
//     if (
//       formData.membershipType === "Service Provider" &&
//       formData.serviceAreas.length === 0
//     ) {
//       setError("Please select at least one service area.");
//       return;
//     }

//     if (
//       formData.membershipType === "Service Provider" &&
//       formData.serviceAreas.includes(OTHER_OPTION) &&
//       !formData.serviceOther.trim()
//     ) {
//       setError("Please specify the other service area.");
//       return;
//     }

//     // Membership class validation
//     if (!formData.membershipClass) {
//       setError("Please select a membership class.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         requestType: type,
//         ...formData,
//         gstNumber: gstValue,
//       };

//       const result = await submitFormSubmission({
//         formType: "aia-membership",
//         data: payload,
//       });

//       console.log(
//         "Membership submission successful:",
//         result
//       );

//       setSubmitted(true);
//       setShowSuccessModal(true);
//     } catch (err) {
//       console.error("Request submission error:", err);

//       setError(
//         err.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ==========================================
//   // SUCCESS MODAL CLOSE
//   // ==========================================

//   const closeSuccessModal = () => {
//     setShowSuccessModal(false);
//     setSubmitted(false);
//     window.location.assign("/");
//   };

//   // ==========================================
//   // INVALID PAGE
//   // ==========================================

//   if (!pageTitle) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="rounded-lg bg-white p-8 text-center">
//           <h1 className="text-xl font-bold text-[#263247]">
//             Request form not found
//           </h1>

//           <Link
//             to="/"
//             className="mt-4 inline-block text-sm text-[#E87565]"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // OTHER REQUEST FORMS
//   // ==========================================

//   if (!isMembership) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="max-w-md rounded-lg bg-white p-8 text-center">
//           <h1 className="text-xl font-bold text-[#263247]">
//             {pageTitle}
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-gray-500">
//             This request form needs its own field configuration.
//             The screenshots provided are for Primary Membership of AIA.
//           </p>

//           <Link
//             to="/"
//             className="mt-5 inline-flex items-center gap-2 text-sm text-[#E87565]"
//           >
//             <ArrowLeft size={15} />
//             Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // SUBMITTED FALLBACK
//   // ==========================================

//   if (submitted && !showSuccessModal) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
//         <div className="rounded-lg bg-white p-8 text-center shadow-xl">
//           <CheckCircle2
//             size={48}
//             className="mx-auto text-green-600"
//           />

//           <h1 className="mt-4 text-xl font-bold text-[#263247]">
//             Application Submitted
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-gray-500">
//             Thank you for applying for AIA membership.
//             Your application has been received.
//           </p>

//           <Link
//             to="/"
//             className="mt-6 inline-block rounded-md bg-[#E87565] px-6 py-3 text-sm font-semibold text-white"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // MAIN FORM UI
//   // ==========================================

//   return (
//     <main className="min-h-screen w-full touch-pan-y bg-[#31577C] px-3 py-6 font-sans sm:px-5 sm:py-10">
//       <div className="mx-auto max-w-[760px]">

//         {/* HEADER */}

//         <header className="sticky top-0 z-[100] mb-4 flex min-h-[65px] items-center justify-between gap-4 bg-white px-5 py-3 shadow-sm sm:px-7">
//           <Link to="/" aria-label="AIA Home">
//             <img
//               src="/aia-logo-blue.png"
//               alt="AIA Logo"
//               className="h-20 w-auto object-contain"
//             />
//           </Link>

//           <p className="max-w-[230px] text-left text-[9px] font-semibold leading-relaxed text-[#263247] sm:text-[16px]">
//             {pageTitle}
//           </p>
//         </header>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-3"
//         >

//           {/* ================================== */}
//           {/* CARD 1 - GENERAL INFORMATION       */}
//           {/* ================================== */}

//           <StickyFormCard number={1} index={0}>
//             <CardHeading
//               description="We have gone through the aims and objectives of AIA and wish to apply for Primary Membership. The application details are duly completed as below:"
//             >
//               General Information
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Name of the Company / Group of Companies"
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//                 required
//                 placeholder="Company name"
//               />

//               <FormField
//                 label="Principal Address"
//                 name="principalAddress"
//                 value={formData.principalAddress}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="City"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Pin code"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 pattern="[0-9]{6}"
//                 maxLength={6}
//                 placeholder="6-digit PIN code"
//               />

//               <FormField
//                 label="Business Phone 1"
//                 name="businessPhone1"
//                 type="tel"
//                 value={formData.businessPhone1}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Phone 2"
//                 name="businessPhone2"
//                 type="tel"
//                 value={formData.businessPhone2}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Website"
//                 name="website"
//                 type="url"
//                 value={formData.website}
//                 onChange={handleChange}
//                 placeholder="https://"
//               />

//               {/* GST FIELD */}

//               <div>
//                 <FormField
//                   label="GST Registration No"
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                   placeholder="e.g. 22AAAAA0000A1Z5"
//                   maxLength={15}
//                 />

//                 {gstTouched && gstInvalid && (
//                   <p
//                     className="mt-1.5 text-xs leading-5 text-red-600"
//                     role="alert"
//                   >
//                     Enter a valid GSTIN. It must contain 15
//                     characters and pass GSTIN checksum validation.
//                   </p>
//                 )}

//                 <p className="mt-1.5 text-[11px] leading-5 text-gray-500">
//                   Enter your 15-character GSTIN in uppercase.
//                   Leave blank if not applicable.
//                 </p>
//               </div>
//             </div>
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 2 - ABOUT PRINCIPAL COMPANY  */}
//           {/* ================================== */}

//           <StickyFormCard number={2} index={1}>
//             <CardHeading
//               description="If any other companies belonging to the same group are to be included, furnish additional information through separate sheets."
//             >
//               About the Principal Company
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Capital Employed (Rs. crore)"
//                 name="capitalEmployed"
//                 value={formData.capitalEmployed}
//                 onChange={handleChange}
//                 placeholder="Enter amount"
//               />

//               <FormField
//                 label="Number of Employees"
//                 name="numberOfEmployees"
//                 type="number"
//                 value={formData.numberOfEmployees}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Annual Revenue (Rs. crore)"
//                 name="annualRevenue"
//                 type="number"
//                 value={formData.annualRevenue}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Year of incorporation"
//                 name="incorporationYear"
//                 type="number"
//                 value={formData.incorporationYear}
//                 onChange={handleChange}
//                 placeholder="YYYY"
//               />

//               <div className="sm:col-span-2">
//                 <FormSelect
//                   label="Revenue stream (indicate ranking 1-4, against each)"
//                   name="revenueStream"
//                   value={formData.revenueStream}
//                   onChange={handleChange}
//                   options={[
//                     "Manufacturing - Rank 1",
//                     "Manufacturing - Rank 2",
//                     "Manufacturing - Rank 3",
//                     "Manufacturing - Rank 4",
//                     "Services - Rank 1",
//                     "Services - Rank 2",
//                     "Services - Rank 3",
//                     "Services - Rank 4",
//                     "Other",
//                   ]}
//                 />
//               </div>

//               <FormSelect
//                 label="Legal/Tax Structure of Company"
//                 name="legalStructure"
//                 value={formData.legalStructure}
//                 onChange={handleChange}
//                 options={[
//                   "Private Limited",
//                   "Public Limited",
//                   "Partnership",
//                   "Proprietorship",
//                   "LLP",
//                   "Other",
//                 ]}
//               />

//               <FormField
//                 label="Foreign collaborations if any"
//                 name="foreignCollaborations"
//                 value={formData.foreignCollaborations}
//                 onChange={handleChange}
//               />

//               <div className="sm:col-span-2">
//                 <FormTextarea
//                   label="Industry and applications focus"
//                   name="industryFocus"
//                   value={formData.industryFocus}
//                   onChange={handleChange}
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 3 - MEMBERSHIP CATEGORY      */}
//           {/* ================================== */}

//           <StickyFormCard number={3} index={2}>
//             <div className="mb-7">
//               <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-[#E87565]">
//                 Section 03
//               </p>

//               <h2 className="text-xl font-bold text-[#263247] sm:text-2xl lg:text-[28px]">
//                 Membership Category
//               </h2>

//               <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
//                 Please select the category applicable to your organisation.
//               </p>
//             </div>

//             <div className="space-y-5">

//               {/* MEMBERSHIP TYPE */}

//               <div>
//                 <label className="mb-4 block text-base font-semibold text-[#263247] sm:text-lg">
//                   Membership Type{" "}
//                   <span className="text-[#E87565]">*</span>
//                 </label>

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   {[
//                     "Technology Provider",
//                     "Service Provider",
//                   ].map((item) => (
//                     <label
//                       key={item}
//                       className={`flex min-h-[65px] cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-4 transition sm:px-5 ${
//                         formData.membershipType === item
//                           ? "border-[#E87565] bg-[#FFF9F8]"
//                           : "border-gray-200 bg-white hover:border-gray-300"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="membershipType"
//                         value={item}
//                         checked={formData.membershipType === item}
//                         onChange={handleMembershipTypeChange}
//                         className="h-5 w-5 shrink-0 accent-[#E87565]"
//                       />

//                       <span className="text-sm font-semibold text-[#263247] sm:text-base">
//                         {item}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* TECHNOLOGY PROVIDER */}

//               {formData.membershipType === "Technology Provider" && (
//                 <div className="space-y-4">
//                   <MembershipMultiSelect
//                     label="Select Technology Area"
//                     options={technologyStreamOptions}
//                     value={formData.technologyAreas}
//                     maxSelections={5}
//                     onChange={(values) =>
//                       handleMembershipMultiSelect(
//                         "technologyAreas",
//                         values
//                       )
//                     }
//                   />

//                   {formData.technologyAreas.includes(OTHER_OPTION) && (
//                     <FormField
//                       label="Please specify other technology area"
//                       name="technologyOther"
//                       value={formData.technologyOther}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter other technology area"
//                     />
//                   )}
//                 </div>
//               )}

//               {/* SERVICE PROVIDER */}

//               {formData.membershipType === "Service Provider" && (
//                 <div className="space-y-4">
//                   <MembershipMultiSelect
//                     label="Select Service Area"
//                     options={serviceStreamOptions}
//                     value={formData.serviceAreas}
//                     maxSelections={3}
//                     onChange={(values) =>
//                       handleMembershipMultiSelect(
//                         "serviceAreas",
//                         values
//                       )
//                     }
//                   />

//                   {formData.serviceAreas.includes(OTHER_OPTION) && (
//                     <FormField
//                       label="Please specify other service area"
//                       name="serviceOther"
//                       value={formData.serviceOther}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter other service area"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 4 - BENEFITS AND CONTRIBUTIONS */}
//           {/* ================================== */}

//           <StickyFormCard number={4} index={3}>
//             <CardHeading>
//               How does the company expect to benefit from the AIA membership
//               and contribute to the growth of AIA objectives?
//             </CardHeading>

//             <div className="space-y-5">
//               <FormTextarea
//                 label="Expected Benefits from AIA Membership"
//                 name="expectedBenefits"
//                 value={formData.expectedBenefits}
//                 onChange={handleChange}
//                 rows={3}
//               />

//               <FormTextarea
//                 label="Ways of Contributions to AIA Objective"
//                 name="contributions"
//                 value={formData.contributions}
//                 onChange={handleChange}
//                 rows={4}
//               />
//             </div>
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 5 - MEMBERSHIP CLASS         */}
//           {/* ================================== */}

//           <StickyFormCard number={5} index={4}>
//             <CardHeading>
//               Current Membership class and fee details
//             </CardHeading>

//             <MembershipFeeTable
//               value={formData.membershipClass}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 6 - CEO                      */}
//           {/* ================================== */}

//           <StickyFormCard number={6} index={5}>
//             <CardHeading>
//               Chief Executive Officer of the Principal Company or Group
//             </CardHeading>

//             <PersonFields
//               prefix="ceo"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 7 - PRINCIPAL REPRESENTATIVE */}
//           {/* ================================== */}

//           <StickyFormCard number={7} index={6}>
//             <CardHeading description="(if different from Chief Executive Officer)">
//               Principal Representative for attending Annual Body & Special Meetings:
//             </CardHeading>

//             <PersonFields
//               prefix="representative"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 8 - ALTERNATE NOMINEE        */}
//           {/* ================================== */}

//           <StickyFormCard number={8} index={7}>
//             <CardHeading>
//               Alternate Nominee for attending Annual Body & Special Meetings:
//             </CardHeading>

//             <PersonFields
//               prefix="nominee"
//               values={formData}
//               onChange={handleChange}
//             />
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* CARD 9 - SUBMITTED BY             */}
//           {/* ================================== */}

//           <StickyFormCard number={9} index={8}>
//             <CardHeading>
//               Submitted by
//             </CardHeading>

//             <div className={inputGrid}>
//               <FormField
//                 label="Name"
//                 name="submittedByName"
//                 value={formData.submittedByName}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Designation"
//                 name="submittedByDesignation"
//                 value={formData.submittedByDesignation}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Mobile Number"
//                 name="submittedByPhone"
//                 type="tel"
//                 value={formData.submittedByPhone}
//                 onChange={handleChange}
//                 required
//                 pattern="[6-9][0-9]{9}"
//                 maxLength={10}
//               />

//               <FormField
//                 label="Email"
//                 name="submittedByEmail"
//                 type="email"
//                 value={formData.submittedByEmail}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <p className="mt-5 text-[10px] leading-[1.7] text-[#263247] sm:text-xs">
//               Note: AIA does not provide individual membership. Any firm or
//               company in India engaged in manufacturing activities or
//               providing services shall be eligible to apply for membership
//               of the Confederation of Indian Industry.
//             </p>

//             <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-600">
//               <input
//                 type="checkbox"
//                 name="agree"
//                 checked={formData.agree}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 h-4 w-4 shrink-0 accent-[#E87565]"
//               />

//               <span>
//                 I confirm that the information provided in this application
//                 is accurate and complete.
//               </span>
//             </label>
//           </StickyFormCard>

//           {/* ================================== */}
//           {/* FORM ERROR                        */}
//           {/* ================================== */}

//           {error && (
//             <p
//               role="alert"
//               className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600"
//             >
//               {error}
//             </p>
//           )}

//           {/* ================================== */}
//           {/* FINAL SUBMIT BUTTON               */}
//           {/* ================================== */}

//           <div className="relative z-[110] flex justify-center bg-white px-5 py-6">
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full rounded-md bg-gradient-to-r from-[#D72C1D] to-[#F27D70] px-8 py-3.5 text-lg font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {submitting ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* SUCCESS POPUP */}

//       {showSuccessModal && (
//         <ThankYouModal onClose={closeSuccessModal} />
//       )}
//     </main>
//   );
// }

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";

import StickyFormCard from "../../components/RequestForms/StickyFormCard";

import {
  FormField,
  FormSelect,
  FormTextarea,
} from "../../components/RequestForms/FormFields";

import { submitFormSubmission } from "../../services/formSubmissionApi";

import {
  CardHeading,
  PersonFields,
  MembershipFeeTable,
  MembershipCategorySection,
  ThankYouModal,
  OTHER_OPTION,
} from "../../components/RequestForms/Membership";

import { isValidGSTIN, normalizeGSTIN } from "../../utils/gstin";

const initialValues = {
  companyName: "",
  principalAddress: "",
  city: "",
  pincode: "",
  businessPhone1: "",
  businessPhone2: "",
  website: "",
  gstNumber: "",

  capitalEmployed: "",
  numberOfEmployees: "",
  annualRevenue: "",
  incorporationYear: "",
  revenueStream: "",
  legalStructure: "",
  foreignCollaborations: "",
  industryFocus: "",

  membershipType: "Technology Provider",
  technologyAreas: [],
  technologyOther: "",
  serviceAreas: [],
  serviceOther: "",

  expectedBenefits: "",
  contributions: "",

  membershipClass: "",

  ceoName: "",
  ceoDesignation: "",
  ceoAddress: "",
  ceoPhone: "",
  ceoEmail: "",

  representativeName: "",
  representativeDesignation: "",
  representativeAddress: "",
  representativePhone: "",
  representativeEmail: "",

  nomineeName: "",
  nomineeDesignation: "",
  nomineeAddress: "",
  nomineePhone: "",
  nomineeEmail: "",

  submittedByName: "",
  submittedByDesignation: "",
  submittedByPhone: "",
  submittedByEmail: "",

  agree: false,
};

const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2";

export default function RequestFormPage() {
  const { type } = useParams();

  const [formData, setFormData] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [gstTouched, setGstTouched] = useState(false);

  const isMembership = type === "membership";

  const pageTitle = {
    membership: "Application Form for Primary Membership of AIA",
    automation: "Automation Product & Services Request",
    partnership: "Partnership Request with AIA",
  }[type];

  const gstValue = normalizeGSTIN(formData.gstNumber);
  const gstInvalid = Boolean(gstValue) && !isValidGSTIN(gstValue);

  // GENERAL INPUT CHANGE

  const handleChange = (event) => {
    const { name, value, checked, type: inputType } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        inputType === "checkbox"
          ? checked
          : name === "gstNumber"
            ? normalizeGSTIN(value).slice(0, 15)
            : value,
    }));

    if (name === "gstNumber") {
      setGstTouched(true);
    }
  };

  // MEMBERSHIP TYPE CHANGE

  const handleMembershipTypeChange = (event) => {
    const selectedType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      membershipType: selectedType,
      technologyAreas: [],
      technologyOther: "",
      serviceAreas: [],
      serviceOther: "",
    }));
  };

  // MEMBERSHIP MULTI SELECT CHANGE

  const handleMembershipMultiSelect = (field, selectedValues) => {
    setFormData((previous) => ({
      ...previous,
      [field]: selectedValues,

      ...(field === "technologyAreas" && !selectedValues.includes(OTHER_OPTION)
        ? { technologyOther: "" }
        : {}),

      ...(field === "serviceAreas" && !selectedValues.includes(OTHER_OPTION)
        ? { serviceOther: "" }
        : {}),
    }));
  };

  // FORM SUBMISSION

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (gstValue && !isValidGSTIN(gstValue)) {
      setGstTouched(true);
      setError(
        "Please enter a valid 15-character GSTIN, or leave the GST field blank if your company is not GST registered.",
      );
      return;
    }

    if (!formData.membershipType) {
      setError("Please select a membership type.");
      return;
    }

    if (
      formData.membershipType === "Technology Provider" &&
      formData.technologyAreas.length === 0
    ) {
      setError("Please select at least one technology area.");
      return;
    }

    if (
      formData.membershipType === "Technology Provider" &&
      formData.technologyAreas.includes(OTHER_OPTION) &&
      !formData.technologyOther.trim()
    ) {
      setError("Please specify the other technology area.");
      return;
    }

    if (
      formData.membershipType === "Service Provider" &&
      formData.serviceAreas.length === 0
    ) {
      setError("Please select at least one service area.");
      return;
    }

    if (
      formData.membershipType === "Service Provider" &&
      formData.serviceAreas.includes(OTHER_OPTION) &&
      !formData.serviceOther.trim()
    ) {
      setError("Please specify the other service area.");
      return;
    }

    if (!formData.membershipClass) {
      setError("Please select a membership class.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        requestType: type,
        ...formData,
        gstNumber: gstValue,
      };

      const result = await submitFormSubmission({
        formType: "aia-membership",
        data: payload,
      });

      console.log("Membership submission successful:", result);

      setSubmitted(true);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Request submission error:", err);

      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSubmitted(false);
    window.location.assign("/");
  };

  // INVALID PAGE

  if (!pageTitle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
        <div className="rounded-lg bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#263247]">
            Request form not found
          </h1>

          <Link to="/" className="mt-4 inline-block text-sm text-[#E87565]">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // OTHER REQUEST FORMS

  if (!isMembership) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
        <div className="max-w-md rounded-lg bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#263247]">{pageTitle}</h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            This request form needs its own field configuration. The screenshots
            provided are for Primary Membership of AIA.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#E87565]"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (submitted && !showSuccessModal) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#31577C] px-5">
        <div className="rounded-lg bg-white p-8 text-center shadow-xl">
          <CheckCircle2 size={48} className="mx-auto text-green-600" />

          <h1 className="mt-4 text-xl font-bold text-[#263247]">
            Application Submitted
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Thank you for applying for AIA membership. Your application has been
            received.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-[#E87565] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full touch-pan-y bg-[#31577C] px-3 py-6 font-sans sm:px-5 sm:py-10">
      <div className="mx-auto max-w-[760px]">
        {/* HEADER */}

        <header className="sticky top-0 z-[100] mb-4 flex min-h-[50px] items-center justify-between gap-4 bg-white px-5 py-3 shadow-sm sm:px-7">
          <Link to="/" aria-label="AIA Home">
            <img
              src="/aia-logo-blue.png"
              alt="AIA Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <p className="max-w-[230px] text-left text-[9px] font-semibold leading-relaxed text-[#263247] sm:text-[16px]">
            {pageTitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* CARD 1 - GENERAL INFORMATION */}

          <StickyFormCard number={1} index={0}>
            <CardHeading description="We have gone through the aims and objectives of AIA and wish to apply for Primary Membership. The application details are duly completed as below:">
              General Information
            </CardHeading>

            <div className={inputGrid}>
              <FormField
                label="Name of the Company / Group of Companies"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Company name"
              />

              <FormField
                label="Principal Address"
                name="principalAddress"
                value={formData.principalAddress}
                onChange={handleChange}
                required
              />

              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />

              <FormField
                label="Pin code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit PIN code"
              />

              <FormField
                label="Business Phone 1"
                name="businessPhone1"
                type="tel"
                value={formData.businessPhone1}
                onChange={handleChange}
              />

              <FormField
                label="Phone 2"
                name="businessPhone2"
                type="tel"
                value={formData.businessPhone2}
                onChange={handleChange}
              />

              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
              />

              <div>
                <FormField
                  label="GST Registration No"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  maxLength={15}
                />

                {gstTouched && gstInvalid && (
                  <p
                    className="mt-1.5 text-xs leading-5 text-red-600"
                    role="alert"
                  >
                    Enter a valid GSTIN. It must contain 15 characters and pass
                    GSTIN checksum validation.
                  </p>
                )}

                <p className="mt-1.5 text-[11px] leading-5 text-gray-500">
                  Enter your 15-character GSTIN in uppercase. Leave blank if not
                  applicable.
                </p>
              </div>
            </div>
          </StickyFormCard>

          {/* CARD 2 - ABOUT PRINCIPAL COMPANY */}

          <StickyFormCard number={2} index={1}>
            <CardHeading description="If any other companies belonging to the same group are to be included, furnish additional information through separate sheets.">
              About the Principal Company
            </CardHeading>

            <div className={inputGrid}>
              <FormField
                label="Capital Employed (Rs. crore)"
                name="capitalEmployed"
                value={formData.capitalEmployed}
                onChange={handleChange}
                placeholder="Enter amount"
              />

              <FormField
                label="Number of Employees"
                name="numberOfEmployees"
                type="number"
                value={formData.numberOfEmployees}
                onChange={handleChange}
              />

              <FormField
                label="Annual Revenue (Rs. crore)"
                name="annualRevenue"
                type="number"
                value={formData.annualRevenue}
                onChange={handleChange}
              />

              <FormField
                label="Year of incorporation"
                name="incorporationYear"
                type="number"
                value={formData.incorporationYear}
                onChange={handleChange}
                placeholder="YYYY"
              />

              <div className="sm:col-span-2">
                <FormSelect
                  label="Revenue stream (indicate ranking 1-4, against each)"
                  name="revenueStream"
                  value={formData.revenueStream}
                  onChange={handleChange}
                  options={[
                    "Manufacturing - Rank 1",
                    "Manufacturing - Rank 2",
                    "Manufacturing - Rank 3",
                    "Manufacturing - Rank 4",
                    "Services - Rank 1",
                    "Services - Rank 2",
                    "Services - Rank 3",
                    "Services - Rank 4",
                    "Other",
                  ]}
                />
              </div>

              <FormSelect
                label="Legal/Tax Structure of Company"
                name="legalStructure"
                value={formData.legalStructure}
                onChange={handleChange}
                options={[
                  "Private Limited",
                  "Public Limited",
                  "Partnership",
                  "Proprietorship",
                  "LLP",
                  "Other",
                ]}
              />

              <FormField
                label="Foreign collaborations if any"
                name="foreignCollaborations"
                value={formData.foreignCollaborations}
                onChange={handleChange}
              />

              <div className="sm:col-span-2">
                <FormTextarea
                  label="Industry and applications focus"
                  name="industryFocus"
                  value={formData.industryFocus}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </StickyFormCard>

          {/* CARD 3 - MEMBERSHIP CATEGORY */}

          <StickyFormCard number={3} index={2}>
            <div className="mb-5">
              <CardHeading description="Select your membership type and choose the relevant technology or service areas that best describe your company's business activities.">
                Membership Category
              </CardHeading>

              <p className="mt-2 text-xs leading-7 text-gray-500 sm:text-xs">
                Please select the category applicable to your organisation.
              </p>
            </div>

            <MembershipCategorySection
              formData={formData}
              onMembershipTypeChange={handleMembershipTypeChange}
              onMultiSelectChange={handleMembershipMultiSelect}
              onFieldChange={handleChange}
            />
          </StickyFormCard>

          {/* CARD 4 - BENEFITS AND CONTRIBUTIONS */}

          <StickyFormCard number={4} index={3}>
            <CardHeading>
              How does the company expect to benefit from the AIA membership and
              contribute to the growth of AIA objectives?
            </CardHeading>

            <div className="space-y-5">
              <FormTextarea
                label="Expected Benefits from AIA Membership"
                name="expectedBenefits"
                value={formData.expectedBenefits}
                onChange={handleChange}
                rows={3}
              />

              <FormTextarea
                label="Ways of Contributions to AIA Objective"
                name="contributions"
                value={formData.contributions}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </StickyFormCard>

          {/* CARD 5 - MEMBERSHIP CLASS */}

          <StickyFormCard number={5} index={4}>
            <CardHeading>Current Membership class and fee details</CardHeading>

            <MembershipFeeTable
              value={formData.membershipClass}
              onChange={handleChange}
            />
          </StickyFormCard>

          {/* CARD 6 - CEO */}

          <StickyFormCard number={6} index={5}>
            <CardHeading>
              Chief Executive Officer of the Principal Company or Group
            </CardHeading>

            <PersonFields
              prefix="ceo"
              values={formData}
              onChange={handleChange}
            />
          </StickyFormCard>

          {/* CARD 7 - PRINCIPAL REPRESENTATIVE */}

          <StickyFormCard number={7} index={6}>
            <CardHeading description="(if different from Chief Executive Officer)">
              Principal Representative for attending Annual Body & Special
              Meetings:
            </CardHeading>

            <PersonFields
              prefix="representative"
              values={formData}
              onChange={handleChange}
            />
          </StickyFormCard>

          {/* CARD 8 - ALTERNATE NOMINEE */}

          <StickyFormCard number={8} index={7}>
            <CardHeading>
              Alternate Nominee for attending Annual Body & Special Meetings:
            </CardHeading>

            <PersonFields
              prefix="nominee"
              values={formData}
              onChange={handleChange}
            />
          </StickyFormCard>

          {/* CARD 9 - SUBMITTED BY */}

          <StickyFormCard number={9} index={8}>
            <CardHeading>Submitted by</CardHeading>

            <div className={inputGrid}>
              <FormField
                label="Name"
                name="submittedByName"
                value={formData.submittedByName}
                onChange={handleChange}
                required
              />

              <FormField
                label="Designation"
                name="submittedByDesignation"
                value={formData.submittedByDesignation}
                onChange={handleChange}
                required
              />

              <FormField
                label="Mobile Number"
                name="submittedByPhone"
                type="tel"
                value={formData.submittedByPhone}
                onChange={handleChange}
                required
                pattern="[6-9][0-9]{9}"
                maxLength={10}
              />

              <FormField
                label="Email"
                name="submittedByEmail"
                type="email"
                value={formData.submittedByEmail}
                onChange={handleChange}
                required
              />
            </div>

            <p className="mt-5 text-[10px] leading-[1.7] text-[#263247] sm:text-xs">
              Note: AIA does not provide individual membership. Any firm or
              company in India engaged in manufacturing activities or providing
              services shall be eligible to apply for membership of the
              Confederation of Indian Industry.
            </p>

            <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-600">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 shrink-0 accent-[#E87565]"
              />

              <span>
                I confirm that the information provided in this application is
                accurate and complete.
              </span>
            </label>
          </StickyFormCard>

          {/* FORM ERROR */}

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}

          <div className="relative z-[110] flex justify-center bg-white px-5 py-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-gradient-to-r from-[#D72C1D] to-[#F27D70] px-8 py-3.5 text-lg font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && <ThankYouModal onClose={closeSuccessModal} />}
    </main>
  );
}
