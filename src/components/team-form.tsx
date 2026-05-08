"use client";

import { useActionState, useState } from "react";
import { saveTeamMemberAction, deleteTeamMemberAction } from "@/app/admin/team/form-actions";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  profile_photo_path: string;
  sort_order: number;
  is_active: boolean;
}

interface TeamFormProps {
  members: TeamMember[];
}

export function TeamForm({ members }: TeamFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    profilePhotoPath: "",
    sortOrder: 0,
  });

  const [saveState, saveAction, isSaving] = useActionState(saveTeamMemberAction, null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [localMembers, setLocalMembers] = useState<TeamMember[]>(members);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      profilePhotoPath: member.profile_photo_path,
      sortOrder: member.sort_order,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      bio: "",
      profilePhotoPath: "",
      sortOrder: 0,
    });
    setDeleteError(null);
    setPhotoError(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingPhoto(true);
    setPhotoError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/team/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        setPhotoError(error.error || "Failed to upload photo");
        setPhotoPreview(null);
        return;
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, profilePhotoPath: url }));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Failed to upload photo");
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeleting(id);
    setDeleteError(null);
    try {
      await deleteTeamMemberAction(id, name);
      setLocalMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete member");
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
          {editingId ? "Edit Team Member" : "Add New Team Member"}
        </h2>

        <form action={saveAction} style={{ display: "grid", gap: "1rem" }}>
          {editingId && <input type="hidden" name="id" value={editingId} />}
          <input type="hidden" name="profilePhotoPath" value={formData.profilePhotoPath} />

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
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Team member name"
              required
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
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Executive Director"
              required
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
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio (optional)"
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
              Profile Photo
            </label>
            <div
              style={{
                display: "grid",
                gap: "1rem",
              }}
            >
              {/* Photo Preview or Placeholder */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  backgroundColor: "var(--line)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : formData.profilePhotoPath ? (
                  <img
                    src={formData.profilePhotoPath}
                    alt="Current"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: "32px",
                      color: "var(--muted)",
                    }}
                  >
                    📷
                  </div>
                )}
              </div>

              {/* File Input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <label
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "var(--orange)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: uploadingPhoto ? 0.6 : 1,
                  }}
                >
                  {uploadingPhoto ? "Uploading..." : "Choose Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={isSaving || uploadingPhoto}
                    style={{
                      display: "none",
                    }}
                  />
                </label>
                {formData.profilePhotoPath && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, profilePhotoPath: "" }));
                      setPhotoPreview(null);
                    }}
                    disabled={isSaving}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "transparent",
                      color: "rgba(220, 38, 38, 0.7)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              {photoError && (
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
                  <strong>Error:</strong> {photoError}
                </div>
              )}

              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Max 5MB, JPG/PNG/WebP
              </p>
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
              disabled={isSaving || !formData.name || !formData.role}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: isSaving || !formData.name || !formData.role ? "var(--muted)" : "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSaving || !formData.name || !formData.role ? "not-allowed" : "pointer",
                opacity: isSaving || !formData.name || !formData.role ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
            </button>
            {editingId && (
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

      {/* Team Members List */}
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
          Current Team Members ({localMembers.length})
        </h2>

        {localMembers.length === 0 ? (
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
            <p style={{ margin: 0 }}>No team members yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {localMembers
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((member) => (
                <div
                  key={member.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "1rem",
                    alignItems: "start",
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      backgroundColor: "var(--line)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {member.profile_photo_path ? (
                      <img
                        src={member.profile_photo_path}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "var(--line)",
                          color: "var(--muted)",
                          fontSize: "24px",
                        }}
                      >
                        👤
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--ink)",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      {member.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--orange)",
                        fontWeight: 500,
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {member.role}
                    </p>
                    {member.bio && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--muted)",
                          margin: 0,
                        }}
                      >
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(member)}
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
                      onClick={() => handleDelete(member.id, member.name)}
                      disabled={deleting === member.id}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        color: "rgba(220, 38, 38, 0.7)",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        opacity: deleting === member.id ? 0.6 : 1,
                      }}
                    >
                      {deleting === member.id ? "Deleting..." : "Delete"}
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
