
import React from "react";
import { membershipClasses } from "./membershipOptions";

export default function MembershipFeeTable({
  value,
  onChange,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#F4D7D3]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left text-xs text-[#263247]">
          <thead>
            <tr className="bg-white">
              <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                S no.
              </th>

              <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                Class of Membership (Primary)
              </th>

              <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                Annual Revenues of company / group (in INR, Crores)
              </th>

              <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                Non-Refundable Admission Fee (in INR)
              </th>

              <th className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                Annual Subscription Fee (in INR)*
              </th>

              <th className="border-b border-[#F4D7D3] px-3 py-4 text-center font-medium">
                Check as applicable
              </th>
            </tr>
          </thead>

          <tbody>
            {membershipClasses.map((item, index) => (
              <tr
                key={item.id}
                className={`transition-colors ${
                  value === item.id
                    ? "bg-[#FFF7F5]"
                    : "bg-white"
                }`}
              >
                <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
                  {index + 1}
                </td>

                <td className="border-b border-r border-[#F4D7D3] px-3 py-4 font-medium">
                  {item.id}
                </td>

                <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
                  {item.revenue}
                </td>

                <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
                  {item.admissionFee}
                </td>

                <td className="border-b border-r border-[#F4D7D3] px-3 py-4">
                  {item.subscriptionFee}
                </td>

                <td className="border-b border-[#F4D7D3] px-3 py-4 text-center">
                  <input
                    type="radio"
                    name="membershipClass"
                    value={item.id}
                    checked={value === item.id}
                    onChange={onChange}
                    required
                    aria-label={`Select ${item.id}`}
                    className="h-4 w-4 cursor-pointer accent-[#E87565]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="px-3 py-2 text-[10px] text-gray-500">
        * Applicable annual subscription fee as per selected membership class.
      </p>
    </div>
  );
}
