
import React from "react";
import { FormField } from "../FormFields";

import MembershipMultiSelect from "./MembershipMultiSelect";

import {
  OTHER_OPTION,
  technologyStreamOptions,
  serviceStreamOptions,
} from "./membershipOptions";

export default function MembershipCategorySection({
  formData,
  onMembershipTypeChange,
  onMultiSelectChange,
  onFieldChange,
}) {
  const isTechnology =
    formData.membershipType === "Technology Provider";

  const isService =
    formData.membershipType === "Service Provider";

  return (
    <div className="space-y-5">
      {/* MEMBERSHIP TYPE */}

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold text-[#263247] sm:text-xs">
          Membership Type{" "}
          <span className="text-[#E87565]">*</span>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Technology Provider",
            "Service Provider",
          ].map((item) => (
            <label
              key={item}
              className={`flex min-h-[50px] cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-4 transition sm:px-5 ${
                formData.membershipType === item
                  ? "border-[#E87565] bg-[#FFF9F8]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="membershipType"
                value={item}
                checked={formData.membershipType === item}
                onChange={onMembershipTypeChange}
                className="h-5 w-5 shrink-0 accent-[#E87565]"
              />

              <span className="text-xs font-semibold text-[#263247] sm:text-xs">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* TECHNOLOGY PROVIDER */}

      {isTechnology && (
        <div className="space-y-4">
          <MembershipMultiSelect
            label="Select Technology Area"
            options={technologyStreamOptions}
            value={formData.technologyAreas}
            maxSelections={5}
            onChange={(values) =>
              onMultiSelectChange("technologyAreas", values)
            }
          />

          {formData.technologyAreas.includes(OTHER_OPTION) && (
            <FormField
              label="Please specify other technology area"
              name="technologyOther"
              value={formData.technologyOther}
              onChange={onFieldChange}
              required
              placeholder="Enter other technology area"
            />
          )}
        </div>
      )}

      {/* SERVICE PROVIDER */}

      {isService && (
        <div className="space-y-4">
          <MembershipMultiSelect
            label="Select Service Area"
            options={serviceStreamOptions}
            value={formData.serviceAreas}
            maxSelections={3}
            onChange={(values) =>
              onMultiSelectChange("serviceAreas", values)
            }
          />

          {formData.serviceAreas.includes(OTHER_OPTION) && (
            <FormField
              label="Please specify other service area"
              name="serviceOther"
              value={formData.serviceOther}
              onChange={onFieldChange}
              required
              placeholder="Enter other service area"
            />
          )}
        </div>
      )}
    </div>
  );
}
