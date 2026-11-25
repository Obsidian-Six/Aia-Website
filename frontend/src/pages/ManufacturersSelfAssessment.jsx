
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import SelfAssessmentStepOne from "../components/self-assessment/SelfAssessmentStepOne";
import SelfAssessmentStepTwo from "../components/self-assessment/SelfAssessmentStepTwo";
import SelfAssessmentThankYou from "../components/self-assessment/SelfAssessmentThankYou";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ManufacturersSelfAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const videoId = searchParams.get("videoId") || "";
  const videoTitle = searchParams.get("videoTitle") || "";

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [participant, setParticipant] = useState({
    name: "",
    function: "",
    company: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    website: "",
  });

  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/self-assessment/config`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load assessment."
          );
        }

        setConfig(result.data);
      } catch (err) {
        setError(
          err.message || "Something went wrong while loading the assessment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleParticipantChange = (field, value) => {
    setParticipant((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleResponseChange = (sectionId, selectedOption) => {
    setResponses((previous) => ({
      ...previous,
      [sectionId]: selectedOption,
    }));
  };

  const handleStepOneContinue = () => {
    setError("");

    const requiredFields = [
      ["name", "Name"],
      ["function", "Function"],
      ["company", "Company"],
      ["email", "Email"],
      ["countryCode", "Country code"],
      ["mobile", "Mobile number"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(participant[field] || "").trim()) {
        setError(`${label} is required.`);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(participant.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{6,15}$/.test(participant.mobile.trim())) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (participant.website.trim()) {
      try {
        const website = participant.website.trim();
        new URL(
          website.startsWith("http://") || website.startsWith("https://")
            ? website
            : `https://${website}`
        );
      } catch {
        setError("Please enter a valid website URL.");
        return;
      }
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setError("");

    const sections = config?.sections || [];

    const unansweredSection = sections.find(
      (section) => !responses[section._id]
    );

    if (unansweredSection) {
      setError(`Please answer: ${unansweredSection.title}`);
      return;
    }

    const formattedResponses = sections.map((section) => ({
      sectionId: section._id,
      selectedOption: responses[section._id],
    }));

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/self-assessment/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participant: {
              ...participant,
              name: participant.name.trim(),
              company: participant.company.trim(),
              email: participant.email.trim(),
              mobile: participant.mobile.trim(),
              website: participant.website.trim(),
            },
            responses: formattedResponses,
            sourceVideo: {
              videoId,
              videoTitle,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your assessment."
        );
      }

      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setError("");

    if (step === 2) {
      setStep(1);
    } else {
      navigate("/");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="Go to home"
          >
            <span className="text-2xl font-extrabold tracking-tight text-[#E25238]">
              AIA
            </span>
            <span className="hidden border-l border-gray-300 pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 sm:inline">
              Smart Manufacturing
            </span>
          </button>

          {step !== 3 && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B5563] transition hover:text-[#E25238]"
            >
              <ArrowLeft size={17} />
              {step === 1 ? "Back to Home" : "Previous Step"}
            </button>
          )}
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        {loading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <LoaderCircle
              className="animate-spin text-[#E25238]"
              size={36}
            />
            <p className="text-sm font-medium text-gray-500">
              Loading assessment...
            </p>
          </div>
        ) : error && !config ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-md bg-[#E25238] px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : step === 1 ? (
          <SelfAssessmentStepOne
            participant={participant}
            functionOptions={config?.functionOptions || []}
            onChange={handleParticipantChange}
            onContinue={handleStepOneContinue}
            error={error}
          />
        ) : step === 2 ? (
          <SelfAssessmentStepTwo
            sections={config?.sections || []}
            responses={responses}
            onResponseChange={handleResponseChange}
            onBack={goBack}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        ) : (
          <SelfAssessmentThankYou onBackHome={() => navigate("/")} />
        )}
      </section>

      <footer className="border-t border-[#E8EAF0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AIA. All rights reserved.
          </p>
          <p className="text-xs font-medium text-gray-500">
            Advancing Smart Manufacturing in India
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ManufacturersSelfAssessment;
