

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
                label="Business Mobile 1"
                name="businessPhone1"
                type="tel"
                value={formData.businessPhone1}
                onChange={handleChange}
              />

              <FormField
                label="Mobile 2"
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
