"use client";

import { useActionState, useState } from "react";
import { generateSlug } from "@/lib/slug-utils";
import { saveImpactMetricAction, deleteImpactMetricAction } from "@/app/admin/impact/form-actions";

interface ImpactMetric {
  id: string;
  slug: string;
  label: string;
  value_text: string;
  numeric_value: number | null;
  unit: string;
  category: "education" | "healthcare" | "sports" | "cross_cutting";
  metric_year: number | null;
  summary: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ImpactFormProps {
  metrics: ImpactMetric[];
}

const CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "sports", label: "Sports" },
  { value: "cross_cutting", label: "Cross Cutting" },
];

export function ImpactForm({ metrics }: ImpactFormProps) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    slug: string;
    label: string;
    valueText: string;
    numericValue: string;
    unit: string;
    category: "education" | "healthcare" | "sports" | "cross_cutting";
    metricYear: string;
    summary: string;
    isFeatured: boolean;
    sortOrder: number;
  }>({
    slug: "",
    label: "",
    valueText: "",
    numericValue: "",
    unit: "",
    category: "education",
    metricYear: new Date().getFullYear().toString(),
    summary: "",
    isFeatured: false,
    sortOrder: 0,
  });

  const [saveState, saveAction, isSaving] = useActionState(saveImpactMetricAction, null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [localMetrics, setLocalMetrics] = useState<ImpactMetric[]>(metrics);

  const handleEdit = (metric: ImpactMetric) => {
    setEditingSlug(metric.slug);
    setFormData({
      slug: metric.slug,
      label: metric.label,
      valueText: metric.value_text,
      numericValue: metric.numeric_value?.toString() || "",
      unit: metric.unit,
      category: metric.category,
      metricYear: metric.metric_year?.toString() || new Date().getFullYear().toString(),
      summary: metric.summary,
      isFeatured: metric.is_featured,
      sortOrder: metric.sort_order,
    });
  };

  const handleReset = () => {
    setEditingSlug(null);
    setFormData({
      slug: "",
      label: "",
      valueText: "",
      numericValue: "",
      unit: "",
      category: "education",
      metricYear: new Date().getFullYear().toString(),
      summary: "",
      isFeatured: false,
      sortOrder: 0,
    });
    setDeleteError(null);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) return;

    setDeleting(slug);
    setDeleteError(null);
    try {
      await deleteImpactMetricAction(slug);
      setLocalMetrics((prev) => prev.filter((m) => m.slug !== slug));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete metric");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Form Section */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--ink)",
            margin: "0 0 1rem 0",
            fontFamily: "var(--font-display), serif",
          }}
        >
          {editingSlug ? "Edit Impact Metric" : "Add New Impact Metric"}
        </h2>

        <form action={saveAction} style={{ display: "grid", gap: "1rem" }}>
          <input type="hidden" name="isEditing" value={editingSlug ? "true" : "false"} />

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              Slug * (Auto-generated from label)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={(e) => {
                if (editingSlug) {
                  setFormData({ ...formData, slug: e.target.value });
                }
              }}
              placeholder="e.g., students-reached"
              disabled={!editingSlug}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
                opacity: editingSlug !== null ? 1 : 0.6,
                cursor: editingSlug !== null ? "text" : "default",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                margin: "0.25rem 0 0 0",
              }}
            >
              {editingSlug ? "You can edit when modifying" : "Updates automatically as you type the label"}
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              Label *
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={(e) => {
                const newLabel = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  label: newLabel,
                  // Auto-generate slug only when creating new (not editing)
                  slug: editingSlug === null ? generateSlug(newLabel) : prev.slug,
                }));
              }}
              placeholder="e.g., Children Reached"
              disabled={isSaving}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                }}
              >
                Display Value *
              </label>
              <input
                type="text"
                name="valueText"
                value={formData.valueText}
                onChange={(e) => setFormData({ ...formData, valueText: e.target.value })}
                placeholder="e.g., 50,000"
                disabled={isSaving}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                }}
              >
                Numeric Value
              </label>
              <input
                type="number"
                name="numericValue"
                value={formData.numericValue}
                onChange={(e) => setFormData({ ...formData, numericValue: e.target.value })}
                placeholder="50000"
                disabled={isSaving}
                step="0.01"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                }}
              >
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., children"
                disabled={isSaving}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                }}
              >
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                disabled={isSaving}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              Metric Year
            </label>
            <input
              type="number"
              name="metricYear"
              value={formData.metricYear}
              onChange={(e) => setFormData({ ...formData, metricYear: e.target.value })}
              disabled={isSaving}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief description of this metric"
              disabled={isSaving}
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                disabled={isSaving}
                style={{
                  cursor: "pointer",
                }}
              />
              Featured on Impact page
            </label>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              Display Order
            </label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              disabled={isSaving}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {saveState?.error && (
            <div
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "6px",
                padding: "0.75rem",
                color: "var(--ink)",
                fontSize: "13px",
              }}
            >
              <strong>Error:</strong> {saveState.error}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={isSaving || !formData.slug || !formData.label || !formData.valueText}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: isSaving || !formData.slug || !formData.label || !formData.valueText ? "var(--muted)" : "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSaving || !formData.slug || !formData.label || !formData.valueText ? "not-allowed" : "pointer",
                opacity: isSaving || !formData.slug || !formData.label || !formData.valueText ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : editingSlug ? "Update Metric" : "Add Metric"}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "var(--muted)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {deleteError && (
        <div
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "6px",
            padding: "1rem",
            marginBottom: "1.5rem",
            color: "var(--ink)",
            fontSize: "14px",
          }}
        >
          <strong>Error:</strong> {deleteError}
        </div>
      )}

      {/* Metrics List */}
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--ink)",
            margin: "0 0 1rem 0",
            fontFamily: "var(--font-display), serif",
          }}
        >
          Impact Metrics ({localMetrics.length})
        </h2>

        {localMetrics.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            <p style={{ margin: 0 }}>No impact metrics yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {localMetrics
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((metric) => (
                <div
                  key={metric.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "var(--ink)",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        {metric.label}
                      </h3>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                          color: "var(--orange)",
                          margin: "0.25rem 0",
                        }}
                      >
                        {metric.value_text}
                        {metric.unit && <span style={{ fontSize: "14px", marginLeft: "0.5rem" }}>{metric.unit}</span>}
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          margin: "0.5rem 0 0 0",
                        }}
                      >
                        <span style={{ textTransform: "capitalize" }}>{metric.category}</span>
                        {metric.metric_year && <span> • {metric.metric_year}</span>}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-end",
                      }}
                    >
                      {metric.is_featured && (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "rgba(245, 193, 26, 0.1)",
                            color: "var(--orange)",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {metric.summary && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: "0.75rem 0",
                      }}
                    >
                      {metric.summary}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(metric)}
                      disabled={isSaving}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        color: "var(--muted)",
                        border: "1px solid var(--line)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(metric.slug)}
                      disabled={deleting === metric.slug}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        color: "rgba(220, 38, 38, 0.7)",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        opacity: deleting === metric.slug ? 0.6 : 1,
                      }}
                    >
                      {deleting === metric.slug ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
