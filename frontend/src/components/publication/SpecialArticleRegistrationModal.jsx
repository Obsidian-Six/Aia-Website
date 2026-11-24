
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
    phone: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, company, phone } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !company.trim() ||
      !phone.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (
      !/^\+?[0-9\s()-]{10,20}$/.test(phone.trim()) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const result = await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim(),
        phone: phone.trim(),
      });

      if (result === false) return;

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
      });

      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-registration-title"
        className="relative my-auto w-full max-w-[500px] rounded-xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration form"
          disabled={isSubmitting}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-black disabled:opacity-50"
        >
          <X size={22} />
        </button>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#E87565]">
          Article Access
        </p>

        <h2
          id="article-registration-title"
          className="text-2xl font-bold text-[#263247]"
        >
          Register to Access
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Please provide your details to unlock the full article.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="registration-name"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Full Name *
            </label>

            <input
              id="registration-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="registration-email"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Email Address *
            </label>

            <input
              id="registration-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="registration-company"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Company *
            </label>

            <input
              id="registration-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter your company name"
              autoComplete="organization"
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="registration-phone"
              className="mb-1.5 block text-sm font-medium text-[#263247]"
            >
              Phone Number *
            </label>

            <input
              id="registration-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#315778] disabled:bg-gray-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#315778] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263247] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : "Submit & Access Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
