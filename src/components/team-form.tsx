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
    sort_order: 0,
  });

  const [saveState, saveAction, isSaving] = useActionState(saveTeamMemberAction, null);
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteTeamMemberAction, null);

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      sort_order: member.sort_order,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      bio: "",
      sort_order: 0,
    });
  };

  return (
    <div className="admin-section">
      <h2>Team Members</h2>

      {/* Add/Edit Form */}
      <div className="admin-form-panel">
        <h3>{editingId ? "Edit Team Member" : "Add New Team Member"}</h3>
        
        <form action={saveAction} className="admin-form">
          {editingId && <input type="hidden" name="id" value={editingId} />}

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Team member name"
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <input
              id="role"
              type="text"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Executive Director"
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio (optional)"
              disabled={isSaving}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sort_order">Order</label>
            <input
              id="sort_order"
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              disabled={isSaving}
            />
          </div>

          {saveState?.error && (
            <div className="error-message">{saveState.error}</div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSaving || !formData.name || !formData.role}
              className="btn btn-primary"
            >
              {isSaving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Team Members List */}
      <div className="admin-list-panel">
        <h3>Current Team Members</h3>
        {members.length === 0 ? (
          <p className="empty-state">No team members yet.</p>
        ) : (
          <div className="admin-list">
            {members.map((member) => (
              <div key={member.id} className="admin-list-item">
                <div className="item-content">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  {member.bio && <p className="muted">{member.bio}</p>}
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleEdit(member)}
                    disabled={isSaving}
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <form
                    action={deleteAction}
                    style={{ display: "inline" }}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          `Are you sure you want to delete ${member.name}?`
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={member.id} />
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="btn btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
