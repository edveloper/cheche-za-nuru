"use client";

import { useActionState, useState } from "react";
import { generateSlug } from "@/lib/slug-utils";
import { saveDonationFundAction, deleteDonationFundAction } from "@/app/admin/donations/form-actions";

interface DonationFund {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  impact_summary: string;
  is_active: boolean;
  sort_order: number;
}

interface DonationsFormProps {
  funds: DonationFund[];
}

export function DonationsForm({ funds }: DonationsFormProps) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    shortDescription: "",
    impactSummary: "",
    isActive: true,
    sortOrder: 0,
  });

  const [saveState, saveAction, isSaving] = useActionState(saveDonationFundAction, null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [localFunds, setLocalFunds] = useState<DonationFund[]>(funds);

  const handleEdit = (fund: DonationFund) => {
    setEditingSlug(fund.slug);
    setFormData({
      slug: fund.slug,
      name: fund.name,
      shortDescription: fund.short_description,
      impactSummary: fund.impact_summary,
      isActive: fund.is_active,
      sortOrder: fund.sort_order,
    });
  };

  const handleReset = () => {
    setEditingSlug(null);
    setFormData({
      slug: "",
      name: "",
      shortDescription: "",
      impactSummary: "",
      isActive: true,
      sortOrder: 0,
    });
    setDeleteError(null);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) return;

    setDeleting(slug);
    setDeleteError(null);
    try {
      await deleteDonationFundAction(slug);
      setLocalFunds((prev) => prev.filter((f) => f.slug !== slug));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete fund");
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
          {editingSlug ? "Edit Donation Fund" : "Add New Donation Fund"}
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
              Slug * (Auto-generated from fund name)
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
              placeholder="e.g., education-support"
              disabled={isSaving || !editingSlug}
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
              {editingSlug ? "You can edit when modifying" : "Updates automatically as you type the fund name"}
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
              Fund Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  name: newName,
                  // Auto-generate slug only when creating new (not editing)
                  slug: editingSlug === null ? generateSlug(newName) : prev.slug,
                }));
              }}
              placeholder="e.g., Education Support Fund"
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
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description (shown on donate page)"
              disabled={isSaving}
              rows={2}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
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
              Impact Summary
            </label>
            <textarea
              name="impactSummary"
              value={formData.impactSummary}
              onChange={(e) => setFormData({ ...formData, impactSummary: e.target.value })}
              placeholder="Explain the impact of this fund"
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
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
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
                Active
              </label>
              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                disabled={isSaving}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
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
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
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
          </div>

          {saveState?.error && (
            <div
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "6px",
                padding: "0.75rem",
                fontSize: "13px",
                color: "var(--ink)",
              }}
            >
              <strong>Error:</strong> {saveState.error}
            </div>
          )}

          {saveState?.success && (
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "6px",
                padding: "0.75rem",
                fontSize: "13px",
                color: "var(--ink)",
              }}
            >
              ✓ {editingSlug ? "Fund updated" : "Fund created"} successfully!
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="submit"
              disabled={isSaving || !formData.slug || !formData.name}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                backgroundColor: "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : editingSlug ? "Update Fund" : "Create Fund"}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--muted)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Funds List */}
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
          Current Donation Funds ({localFunds.length})
        </h2>

        {deleteError && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "6px",
              padding: "1rem",
              marginBottom: "1rem",
              fontSize: "13px",
              color: "var(--ink)",
            }}
          >
            <strong>Error:</strong> {deleteError}
          </div>
        )}

        {localFunds.length === 0 ? (
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
            <p style={{ margin: 0 }}>No funds yet. Create one above!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {localFunds.map((fund) => (
              <div
                key={fund.slug}
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
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--ink)",
                        margin: "0 0 0.25rem 0",
                        fontFamily: "var(--font-display), serif",
                      }}
                    >
                      {fund.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        margin: 0,
                      }}
                    >
                      {fund.slug}
                      {!fund.is_active && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "rgba(156, 163, 175, 0.2)",
                            borderRadius: "3px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(fund)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "var(--orange)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fund.slug)}
                      disabled={deleting === fund.slug}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        color: "var(--ink)",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: deleting === fund.slug ? "not-allowed" : "pointer",
                        opacity: deleting === fund.slug ? 0.6 : 1,
                      }}
                    >
                      {deleting === fund.slug ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {fund.short_description && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    {fund.short_description}
                  </p>
                )}

                {fund.impact_summary && (
                  <div
                    style={{
                      backgroundColor: "rgba(132, 184, 63, 0.08)",
                      border: "1px solid rgba(132, 184, 63, 0.2)",
                      borderRadius: "6px",
                      padding: "1rem",
                      fontSize: "13px",
                      color: "var(--ink)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Impact:</strong> {fund.impact_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
