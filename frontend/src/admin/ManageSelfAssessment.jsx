
import React, { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  ClipboardList,
  Settings2,
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  X,
  Check,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => sessionStorage.getItem("aia_admin_token");

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#E25238] focus:ring-2 focus:ring-[#E25238]/10";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";

const emptySection = () => ({
  sectionNumber: "",
  title: "",
  description: "",
  question: "",
  options: [],
  isActive: true,
  order: 1,
  _localId: `new-${Date.now()}-${Math.random()}`,
});

function ManageSelfAssessment() {
  const [config, setConfig] = useState({
    functionOptions: [],
    sections: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newFunction, setNewFunction] = useState("");
  const [newOptionInputs, setNewOptionInputs] = useState({});
  const [editingFunction, setEditingFunction] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await request("/self-assessment/admin/config");

      setConfig({
        functionOptions: result.data.functionOptions || [],
        sections: (result.data.sections || []).map((section) => ({
          ...section,
          _localId: section._id || `section-${Math.random()}`,
          options: section.options || [],
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateSection = (index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addFunction = () => {
    const value = newFunction.trim();

    if (!value) return;

    if (
      config.functionOptions.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      setError("This function option already exists.");
      return;
    }

    setConfig((prev) => ({
      ...prev,
      functionOptions: [...prev.functionOptions, value],
    }));

    setNewFunction("");
    setError("");
  };

  const updateFunction = (index, value) => {
    setConfig((prev) => ({
      ...prev,
      functionOptions: prev.functionOptions.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const deleteFunction = (index) => {
    if (!window.confirm("Delete this function option?")) return;

    setConfig((prev) => ({
      ...prev,
      functionOptions: prev.functionOptions.filter((_, i) => i !== index),
    }));
  };

  const moveFunction = (index, direction) => {
    setConfig((prev) => {
      const items = [...prev.functionOptions];
      const target = index + direction;

      if (target < 0 || target >= items.length) return prev;

      [items[index], items[target]] = [items[target], items[index]];

      return { ...prev, functionOptions: items };
    });
  };

  const addSection = () => {
    const section = emptySection();

    setConfig((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          ...section,
          sectionNumber: String(prev.sections.length + 1).padStart(2, "0"),
          order: prev.sections.length + 1,
        },
      ],
    }));

    setActiveSection(config.sections.length);
  };

  const deleteSection = (index) => {
    if (!window.confirm("Delete this assessment section?")) return;

    setConfig((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          order: i + 1,
        })),
    }));

    setActiveSection(0);
  };

  const moveSection = (index, direction) => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      const target = index + direction;

      if (target < 0 || target >= sections.length) return prev;

      [sections[index], sections[target]] = [
        sections[target],
        sections[index],
      ];

      return {
        ...prev,
        sections: sections.map((section, i) => ({
          ...section,
          order: i + 1,
        })),
      };
    });

    setActiveSection((current) => {
      if (current === index) return index + direction;
      if (current === index + direction) return index;
      return current;
    });
  };

  const addSectionOption = (sectionIndex) => {
    const value = (newOptionInputs[sectionIndex] || "").trim();

    if (!value) return;

    const section = config.sections[sectionIndex];

    if (
      section.options.some(
        (option) => option.toLowerCase() === value.toLowerCase()
      )
    ) {
      setError("This dropdown option already exists.");
      return;
    }

    updateSection(sectionIndex, "options", [...section.options, value]);

    setNewOptionInputs((prev) => ({
      ...prev,
      [sectionIndex]: "",
    }));

    setError("");
  };

  const updateSectionOption = (sectionIndex, optionIndex, value) => {
    const options = [...config.sections[sectionIndex].options];
    options[optionIndex] = value;

    updateSection(sectionIndex, "options", options);
  };

  const deleteSectionOption = (sectionIndex, optionIndex) => {
    const options = config.sections[sectionIndex].options.filter(
      (_, i) => i !== optionIndex
    );

    updateSection(sectionIndex, "options", options);
  };

  const moveSectionOption = (sectionIndex, optionIndex, direction) => {
    const options = [...config.sections[sectionIndex].options];
    const target = optionIndex + direction;

    if (target < 0 || target >= options.length) return;

    [options[optionIndex], options[target]] = [
      options[target],
      options[optionIndex],
    ];

    updateSection(sectionIndex, "options", options);
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        functionOptions: config.functionOptions,
        sections: config.sections.map((section, index) => ({
          ...(section._id ? { _id: section._id } : {}),
          sectionNumber:
            section.sectionNumber || String(index + 1).padStart(2, "0"),
          title: section.title,
          description: section.description,
          question: section.question,
          options: section.options,
          isActive: section.isActive,
          order: index + 1,
        })),
      };

      await request("/self-assessment/admin/config", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess("Self-assessment configuration saved successfully.");
      await loadConfig();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <LoaderCircle className="animate-spin text-[#E25238]" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#E25238]">
            <ClipboardList size={19} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">
              AIA CMS / Assessment
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#202938]">
            Manage Self-Assessment
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage participant functions, assessment sections and response options.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadConfig}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={saveConfig}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E25238] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c9432d] disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <Save size={17} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={17} />
          {success}
        </div>
      )}

      {/* Function Options */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="rounded-lg bg-orange-50 p-2 text-[#E25238]">
            <Settings2 size={19} />
          </div>
          <div>
            <h2 className="font-bold text-[#202938]">
              Participant Function Options
            </h2>
            <p className="text-xs text-gray-500">
              These options appear in Step 1 of the assessment.
            </p>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={newFunction}
              onChange={(e) => setNewFunction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFunction()}
              placeholder="Enter a new function option"
              className={inputClass}
            />
            <button
              onClick={addFunction}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#202938] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#303d50]"
            >
              <Plus size={17} />
              Add Function
            </button>
          </div>

          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {config.functionOptions.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex flex-wrap items-center gap-2 px-3 py-2.5"
              >
                <GripVertical size={16} className="text-gray-300" />

                {editingFunction === index ? (
                  <input
                    autoFocus
                    value={item}
                    onChange={(e) => updateFunction(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingFunction(null);
                    }}
                    className={`${inputClass} min-w-[150px] flex-1`}
                  />
                ) : (
                  <span className="min-w-[150px] flex-1 text-sm font-medium text-gray-700">
                    {item}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    title="Move up"
                    onClick={() => moveFunction(index, -1)}
                    disabled={index === 0}
                    className="rounded p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    title="Move down"
                    onClick={() => moveFunction(index, 1)}
                    disabled={index === config.functionOptions.length - 1}
                    className="rounded p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    title={editingFunction === index ? "Done" : "Edit"}
                    onClick={() =>
                      setEditingFunction(
                        editingFunction === index ? null : index
                      )
                    }
                    className="rounded p-2 text-blue-600 hover:bg-blue-50"
                  >
                    {editingFunction === index ? (
                      <Check size={16} />
                    ) : (
                      <Pencil size={16} />
                    )}
                  </button>
                  <button
                    title="Delete"
                    onClick={() => deleteFunction(index)}
                    className="rounded p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {config.functionOptions.length === 0 && (
              <p className="p-4 text-sm text-gray-400">
                No function options added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Assessment Sections */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#202938]">
              Assessment Sections
            </h2>
            <p className="text-xs text-gray-500">
              Add, edit, reorder or disable assessment questions.
            </p>
          </div>

          <button
            onClick={addSection}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E25238] px-4 py-2 text-sm font-semibold text-[#E25238] hover:bg-orange-50"
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          {/* Section List */}
          <div className="border-b border-gray-100 bg-gray-50/70 p-3 lg:border-b-0 lg:border-r">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Sections ({config.sections.length})
            </p>

            <div className="space-y-1">
              {config.sections.map((section, index) => (
                <button
                  key={section._localId}
                  onClick={() => setActiveSection(index)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    activeSection === index
                      ? "border-orange-200 bg-white shadow-sm"
                      : "border-transparent hover:bg-white"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      activeSection === index
                        ? "text-[#E25238]"
                        : "text-gray-400"
                    }`}
                  >
                    {section.sectionNumber || String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-700">
                      {section.title || "Untitled Section"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {section.options.length} dropdown options
                    </span>
                  </span>

                  {section.isActive ? (
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </button>
              ))}

              {config.sections.length === 0 && (
                <p className="px-2 py-4 text-sm text-gray-400">
                  No sections added.
                </p>
              )}
            </div>
          </div>

          {/* Selected Section Editor */}
          <div className="min-w-0 p-5">
            {config.sections[activeSection] ? (
              <div className="space-y-5">
                {(() => {
                  const section = config.sections[activeSection];
                  const index = activeSection;

                  return (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[#E25238]">
                            Section {section.sectionNumber}
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-[#202938]">
                            Edit Assessment Section
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            onClick={() => moveSection(index, -1)}
                            disabled={index === 0}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                            title="Move section up"
                          >
                            <ChevronUp size={17} />
                          </button>
                          <button
                            onClick={() => moveSection(index, 1)}
                            disabled={index === config.sections.length - 1}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                            title="Move section down"
                          >
                            <ChevronDown size={17} />
                          </button>
                          <button
                            onClick={() =>
                              updateSection(index, "isActive", !section.isActive)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                              section.isActive
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-gray-200 bg-gray-50 text-gray-500"
                            }`}
                          >
                            {section.isActive ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                            {section.isActive ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => deleteSection(index)}
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            title="Delete section"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                        <div>
                          <label className={labelClass}>Section Number</label>
                          <input
                            value={section.sectionNumber}
                            onChange={(e) =>
                              updateSection(index, "sectionNumber", e.target.value)
                            }
                            className={inputClass}
                            placeholder="01"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Section Title</label>
                          <input
                            value={section.title}
                            onChange={(e) =>
                              updateSection(index, "title", e.target.value)
                            }
                            className={inputClass}
                            placeholder="Enter section title"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Technology / Description
                        </label>
                        <textarea
                          rows={2}
                          value={section.description}
                          onChange={(e) =>
                            updateSection(index, "description", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Enter technologies or section description"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Assessment Question</label>
                        <textarea
                          rows={3}
                          value={section.question}
                          onChange={(e) =>
                            updateSection(index, "question", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Enter assessment question"
                        />
                      </div>

                      <div className="border-t border-gray-100 pt-5">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-800">
                            Dropdown Response Options
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            These options will appear in the user's response dropdown.
                          </p>
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                          <input
                            value={newOptionInputs[index] || ""}
                            onChange={(e) =>
                              setNewOptionInputs((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && addSectionOption(index)
                            }
                            className={inputClass}
                            placeholder="Enter dropdown option"
                          />
                          <button
                            onClick={() => addSectionOption(index)}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#202938] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#303d50]"
                          >
                            <Plus size={16} />
                            Add Option
                          </button>
                        </div>

                        <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                          {section.options.map((option, optionIndex) => (
                            <div
                              key={`${section._localId}-option-${optionIndex}`}
                              className="flex flex-wrap items-center gap-2 px-3 py-2"
                            >
                              <GripVertical
                                size={15}
                                className="text-gray-300"
                              />

                              {editingOption?.sectionIndex === index &&
                              editingOption?.optionIndex === optionIndex ? (
                                <input
                                  autoFocus
                                  value={option}
                                  onChange={(e) =>
                                    updateSectionOption(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingOption(null);
                                  }}
                                  className={`${inputClass} min-w-[120px] flex-1`}
                                />
                              ) : (
                                <span className="min-w-[120px] flex-1 text-sm text-gray-700">
                                  {option}
                                </span>
                              )}

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    moveSectionOption(index, optionIndex, -1)
                                  }
                                  disabled={optionIndex === 0}
                                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                                >
                                  <ChevronUp size={15} />
                                </button>
                                <button
                                  onClick={() =>
                                    moveSectionOption(index, optionIndex, 1)
                                  }
                                  disabled={
                                    optionIndex === section.options.length - 1
                                  }
                                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                                >
                                  <ChevronDown size={15} />
                                </button>
                                <button
                                  onClick={() =>
                                    setEditingOption(
                                      editingOption?.sectionIndex === index &&
                                        editingOption?.optionIndex === optionIndex
                                        ? null
                                        : { sectionIndex: index, optionIndex }
                                    )
                                  }
                                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                                >
                                  {editingOption?.sectionIndex === index &&
                                  editingOption?.optionIndex === optionIndex ? (
                                    <Check size={15} />
                                  ) : (
                                    <Pencil size={15} />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    deleteSectionOption(index, optionIndex)
                                  }
                                  className="rounded p-1.5 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {section.options.length === 0 && (
                            <p className="p-4 text-sm text-gray-400">
                              No dropdown options. Add at least one option.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <ClipboardList size={35} className="mb-3 text-gray-300" />
                <p className="font-semibold text-gray-600">
                  No assessment section selected
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Add a new section to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Save Footer */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Remember to save your changes
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Changes will appear on the public assessment page after saving.
          </p>
        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E25238] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c9432d] disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          Save Assessment
        </button>
      </div>
    </div>
  );
}

export default ManageSelfAssessment;
