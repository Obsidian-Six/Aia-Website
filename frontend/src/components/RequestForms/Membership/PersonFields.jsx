// import React from "react";
// import { FormField } from "../FormFields";

// const PersonFields = ({
//   fields = [],
//   formData = {},
//   handleChange,
// }) => {
//   return (
//     <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//       {fields.map((field) => (
//         <FormField
//           key={field.name}
//           label={field.label}
//           name={field.name}
//           type={field.type || "text"}
//           value={formData[field.name] || ""}
//           onChange={handleChange}
//           placeholder={
//             field.placeholder || `Enter ${field.label.toLowerCase()}`
//           }
//           required={Boolean(field.required)}
//         />
//       ))}
//     </div>
//   );
// };

// export default PersonFields;



import React from "react";
import { FormField } from "../FormFields";

const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2";

export default function PersonFields({
  prefix,
  values,
  onChange,
  requiredAddress = true,
}) {
  return (
    <div className="space-y-5">
      <div className={inputGrid}>
        <FormField
          label="Name"
          name={`${prefix}Name`}
          value={values[`${prefix}Name`] || ""}
          onChange={onChange}
          required
          placeholder="Enter name"
        />

        <FormField
          label="Designation"
          name={`${prefix}Designation`}
          value={values[`${prefix}Designation`] || ""}
          onChange={onChange}
          placeholder="Enter designation"
        />
      </div>

      <FormField
        label="Address"
        name={`${prefix}Address`}
        value={values[`${prefix}Address`] || ""}
        onChange={onChange}
        required={requiredAddress}
        placeholder="Enter address"
      />

      <div className={inputGrid}>
        <FormField
          label="Landline / Mobile"
          name={`${prefix}Phone`}
          type="tel"
          value={values[`${prefix}Phone`] || ""}
          onChange={onChange}
          placeholder="Enter mobile number"
        />

        <FormField
          label="E-mail"
          name={`${prefix}Email`}
          type="email"
          value={values[`${prefix}Email`] || ""}
          onChange={onChange}
          placeholder="Enter email address"
        />
      </div>
    </div>
  );
}
