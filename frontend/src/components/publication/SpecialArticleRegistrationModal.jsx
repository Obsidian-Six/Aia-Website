
import React, { useState } from "react";
import { X } from "lucide-react";

export default function SpecialArticleRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    designation: "",
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, company, designation } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !company.trim() ||
      !designation.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    onSubmit(formData);

    setFormData({
      name: "",
      email: "",
      company: "",
      designation: "",
    });

    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="special-article-title"
        className="relative my-auto w-full max-w-[500px] rounded-xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration form"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-black"
        >
          <X size={22} />
        </button>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#E87565]">
          Special Article
        </p>

        <h2
          id="special-article-title"
          className="text-2xl font-bold text-[#263247]"
        >
          Register to Access
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Please provide your details to access this special article.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="registration-name"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Full Name
            </label>

            <input
              id="registration-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778]"
            />
          </div>

          <div>
            <label
              htmlFor="registration-email"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Email Address
            </label>

            <input
              id="registration-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778]"
            />
          </div>

          <div>
            <label
              htmlFor="registration-company"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Company Name
            </label>

            <input
              id="registration-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778]"
            />
          </div>

          <div>
            <label
              htmlFor="registration-designation"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Designation
            </label>

            <input
              id="registration-designation"
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter your designation"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-[#315778] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263247]"
          >
            Submit & Access Article
          </button>
        </form>
      </div>
    </div>
  );
}
