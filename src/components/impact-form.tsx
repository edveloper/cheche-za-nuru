"use client";

import { useActionState, useEffect, useState } from "react";
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
  { value: "cross_cutting", label: "Cross-cutting" },
];

const CATEGORY_COLORS: Record<string, string> = {
  education: "#2f3a8b",
  healthcare: "#84b83f",
  sports: "#f5821f",
  cross_cutting: "#5f5878",
};

type FormData = {
  slug: string;
  label: string;
  valueText: string;
  numericValue: string;
  unit: string;
  category: "education" | "healthcare" | "sports" | "cross_cutting";
  metricYear: string;
  summary: string;
  isFeatured: boolean;
  sortOrder: string;
};

const emptyForm: FormData = {
  slug: "",
  label: "",
  valueText: "",
  numericValue: "",
  unit: "",
  category: "education",
  metricYear: new Date().getFullYear().toString(),
  summary: "",
  isFeatured: false,
  sortOrder: "0",
};

// ── Shared input / label styles ───────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  fontSize: "14px",
  border: "1px solid var(--line)",
  borderRadius: "8px",
  boxSizing: "border-box",
  background: "white",
  color: "var(--ink)",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: "0.4rem",
};

const hintStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "var(--muted)",
  margin: "0.3rem 0 0",
};

// ── Mini preview card ─────────────────────────────────────────────
function MetricPreview({
  valueText,
  label,
  unit,
  category,
}: {
  valueText: string;
  label: string;
  unit: string;
  category: string;
}) {
  const color = CATEGORY_COLORS[category] ?? "var(--orange)";
  const catLabel = CATEGORIES.find((c) => c.value === category)?.label ?? category;

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "10px",
        padding: "1rem 1.15rem",
        background: "white",
        minHeight: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "0.25rem",
      }}
    >
      <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Preview
      </p>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--orange)", lineHeight: 1.1 }}>
        {valueText || <span style={{ opacity: 0.3 }}>–</span>}
        {unit && <span style={{ fontSize: "14px", fontWeight: 500, marginLeft: "0.35rem", color: "var(--muted)" }}>{unit}</span>}
      </div>
      <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>
        {label || <span style={{ opacity: 0.35 }}>Label will appear here</span>}
      </div>
      <div style={{ display: "inline-block", marginTop: "0.2rem", fontSize: "11px", fontWeight: 600, color, background: `${color}18`, borderRadius: "4px", padding: "0.15rem 0.55rem" }}>
        {catLabel}
      </div>
    </div>
  );
}

export function ImpactForm({ metrics }: ImpactFormProps) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [localMetrics, setLocalMetrics] = useState<ImpactMetric[]>(metrics);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [saveState, saveAction, isSaving] = useActionState(saveImpactMetricAction, null);

  // After a successful save: show success banner, reset form, re-fetch metrics
  useEffect(() => {
    if (!saveState?.success) return;

    const verb = editingSlug ? "updated" : "added";
    setSuccessMsg(`Metric ${verb} successfully.`);
    handleReset();

    fetch("/api/admin/impact-metrics", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setLocalMetrics(data.metrics || []))
      .catch(() => {});

    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState]);

  const handleEdit = (metric: ImpactMetric) => {
    setEditingSlug(metric.slug);
    setSuccessMsg(null);
    setFormData({
      slug: metric.slug,
      label: metric.label,
      valueText: metric.value_text,
      numericValue: metric.numeric_value?.toString() ?? "",
      unit: metric.unit,
      category: metric.category,
      metricYear: metric.metric_year?.toString() ?? new Date().getFullYear().toString(),
      summary: metric.summary,
      isFeatured: metric.is_featured,
      sortOrder: metric.sort_order.toString(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setEditingSlug(null);
    setFormData(emptyForm);
    setDeleteError(null);
  };

  const handleDelete = async (slug: string, label: string) => {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeleting(slug);
    setDeleteError(null);
    try {
      await deleteImpactMetricAction(slug);
      setLocalMetrics((prev) => prev.filter((m) => m.slug !== slug));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete metric.");
    } finally {
      setDeleting(null);
    }
  };

  const isFormValid = !!formData.slug && !!formData.label && !!formData.valueText;

  return (
    <div>
      {/* ── Success banner ───────────────────────────────── */}
      {successMsg && (
        <div style={{ background: "rgba(132, 184, 63, 0.12)", border: "1px solid rgba(132, 184, 63, 0.4)", borderRadius: "8px", padding: "0.85rem 1rem", marginBottom: "1.5rem", fontSize: "14px", color: "#3a5e10", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* ── Form ─────────────────────────────────────────── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", padding: "1.75rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", margin: "0 0 0.35rem", fontFamily: "var(--font-display), serif" }}>
          {editingSlug ? "Edit Metric" : "Add Impact Metric"}
        </h2>
        {editingSlug && (
          <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 1.25rem", fontFamily: "monospace" }}>
            ID: {editingSlug}
          </p>
        )}
        {!editingSlug && (
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 1.5rem" }}>
            These numbers appear on the public Impact page and the homepage snapshot.
          </p>
        )}

        <form action={saveAction} style={{ display: "grid", gap: "1.25rem" }}>
          <input type="hidden" name="isEditing" value={editingSlug ? "true" : "false"} />
          <input type="hidden" name="slug" value={formData.slug} />

          {/* Label + preview side-by-side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {/* Label */}
              <div>
                <label style={labelStyle}>Label *</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      label: newLabel,
                      slug: editingSlug === null ? generateSlug(newLabel) : prev.slug,
                    }));
                  }}
                  placeholder="e.g., Children Reached"
                  disabled={isSaving}
                  required
                  style={inputStyle}
                />
                <p style={hintStyle}>The short description shown below the number.</p>
              </div>

              {/* Display value + unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 0.55fr", gap: "0.75rem" }}>
                <div>
                  <label style={labelStyle}>Display Value *</label>
                  <input
                    type="text"
                    name="valueText"
                    value={formData.valueText}
                    onChange={(e) => setFormData({ ...formData, valueText: e.target.value })}
                    placeholder="e.g., 1,200+"
                    disabled={isSaving}
                    required
                    style={inputStyle}
                  />
                  <p style={hintStyle}>Exactly what shows on the site.</p>
                </div>
                <div>
                  <label style={labelStyle}>Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="children"
                    disabled={isSaving}
                    style={inputStyle}
                  />
                  <p style={hintStyle}>Optional suffix.</p>
                </div>
              </div>
            </div>

            {/* Live preview */}
            <MetricPreview
              valueText={formData.valueText}
              label={formData.label}
              unit={formData.unit}
              category={formData.category}
            />
          </div>

          {/* Category + Year */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof formData.category })}
                disabled={isSaving}
                required
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="number"
                name="metricYear"
                value={formData.metricYear}
                onChange={(e) => setFormData({ ...formData, metricYear: e.target.value })}
                placeholder={new Date().getFullYear().toString()}
                min="2000"
                max="2100"
                disabled={isSaving}
                style={inputStyle}
              />
              <p style={hintStyle}>The year this figure relates to.</p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label style={labelStyle}>Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="One or two sentences giving context for this number."
              disabled={isSaving}
              rows={2}
              style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          {/* Featured + Position */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "14px", fontWeight: 500, color: "var(--ink)", cursor: "pointer", paddingTop: "0.35rem" }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                disabled={isSaving}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--orange)" }}
              />
              Featured on Impact page
            </label>
            <div>
              <label style={labelStyle}>Position</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                min="0"
                disabled={isSaving}
                style={{ ...inputStyle, width: "100%" }}
              />
              <p style={hintStyle}>Lower numbers appear first. 0 = top.</p>
            </div>
          </div>

          {/* Advanced: numeric value for sorting */}
          <details style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
            <summary style={{ fontSize: "13px", color: "var(--muted)", cursor: "pointer", fontWeight: 500 }}>
              Advanced
            </summary>
            <div style={{ marginTop: "0.85rem" }}>
              <label style={labelStyle}>Numeric equivalent</label>
              <input
                type="number"
                name="numericValue"
                value={formData.numericValue}
                onChange={(e) => setFormData({ ...formData, numericValue: e.target.value })}
                placeholder="e.g., 1200"
                disabled={isSaving}
                step="0.01"
                style={inputStyle}
              />
              <p style={hintStyle}>
                Used for sorting and charts only. If your display value is "1,200+" enter 1200 here. Leave blank if not needed.
              </p>
            </div>
          </details>

          {/* Error */}
          {saveState?.error && (
            <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#7f1d1d", fontSize: "13px" }}>
              <strong>Error:</strong> {saveState.error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <button
              type="submit"
              disabled={isSaving || !isFormValid}
              style={{
                padding: "0.7rem 1.5rem",
                background: isSaving || !isFormValid ? "var(--muted)" : "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSaving || !isFormValid ? "not-allowed" : "pointer",
                opacity: isSaving || !isFormValid ? 0.55 : 1,
                transition: "opacity 150ms ease",
              }}
            >
              {isSaving ? "Saving…" : editingSlug ? "Save Changes" : "Add Metric"}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                style={{ padding: "0.7rem 1.25rem", background: "transparent", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Delete error ─────────────────────────────────── */}
      {deleteError && (
        <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "8px", padding: "0.85rem 1rem", marginBottom: "1.5rem", color: "#7f1d1d", fontSize: "13px" }}>
          <strong>Error:</strong> {deleteError}
        </div>
      )}

      {/* ── Metrics list ─────────────────────────────────── */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", margin: "0 0 1rem", fontFamily: "var(--font-display), serif" }}>
          Impact Metrics ({localMetrics.length})
        </h2>

        {localMetrics.length === 0 ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "2.5rem", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
            No impact metrics yet. Add your first one above.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {[...localMetrics]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((metric) => (
                <div
                  key={metric.id}
                  style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--orange)" }}>
                        {metric.value_text}
                      </span>
                      {metric.unit && <span style={{ fontSize: "13px", color: "var(--muted)" }}>{metric.unit}</span>}
                    </div>
                    <p style={{ margin: "0.2rem 0 0.5rem", fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                      {metric.label}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: CATEGORY_COLORS[metric.category] ?? "var(--muted)", background: `${CATEGORY_COLORS[metric.category] ?? "#888"}18`, borderRadius: "4px", padding: "0.15rem 0.55rem", textTransform: "capitalize" }}>
                        {CATEGORIES.find((c) => c.value === metric.category)?.label ?? metric.category}
                      </span>
                      {metric.metric_year && <span style={{ fontSize: "11px", color: "var(--muted)" }}>{metric.metric_year}</span>}
                      {metric.is_featured && <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--orange)", background: "rgba(245,193,26,0.12)", borderRadius: "4px", padding: "0.15rem 0.55rem" }}>Featured</span>}
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>Position {metric.sort_order}</span>
                    </div>
                    {metric.summary && (
                      <p style={{ margin: "0.6rem 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
                        {metric.summary}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                    <button
                      onClick={() => handleEdit(metric)}
                      disabled={isSaving}
                      style={{ padding: "0.45rem 1rem", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(metric.slug, metric.label)}
                      disabled={deleting === metric.slug}
                      style={{ padding: "0.45rem 1rem", background: "transparent", color: "rgba(220,38,38,0.75)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: deleting === metric.slug ? 0.5 : 1 }}
                    >
                      {deleting === metric.slug ? "Deleting…" : "Delete"}
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
