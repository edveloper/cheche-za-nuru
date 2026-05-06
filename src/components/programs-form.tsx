"use client";

import { useActionState, useState } from "react";
import { saveProgramEventAction, deleteProgramEventAction } from "@/app/admin/programs/form-actions";

type ProgramEvent = {
  id?: string;
  slug: string;
  title: string;
  program_type: string;
  summary?: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  is_featured?: boolean;
  status?: string;
};

export function ProgramsForm({ events }: { events: ProgramEvent[] }) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProgramEvent>({
    slug: "",
    title: "",
    program_type: "education",
    summary: "",
    description: "",
    location: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    is_featured: false,
    status: "draft",
  });

  const [saveState, saveAction, isSaving] = useActionState(saveProgramEventAction, null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [localEvents, setLocalEvents] = useState<ProgramEvent[]>(events || []);

  const handleEdit = (ev: ProgramEvent) => {
    setEditingSlug(ev.slug);
    setFormData({ ...ev });
  };

  const handleReset = () => {
    setEditingSlug(null);
    setFormData({
      slug: "",
      title: "",
      program_type: "education",
      summary: "",
      description: "",
      location: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: null,
      is_featured: false,
      status: "draft",
    });
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete event "${slug}"?`)) return;
    setDeleting(slug);
    try {
      await deleteProgramEventAction(slug);
      setLocalEvents((prev) => prev.filter((e) => e.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}> {editingSlug ? "Edit Event" : "Add New Event"}</h2>
        <form action={saveAction} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <input type="hidden" name="isEditing" value={editingSlug ? "true" : "false"} />

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Slug *</label>
            <input name="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }} disabled={!!editingSlug} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Title *</label>
            <input name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Program Type</label>
              <select name="programType" value={formData.program_type} onChange={(e) => setFormData({ ...formData, program_type: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }}>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="sports">Sports</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Start Date</label>
              <input type="date" name="startDate" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Location</label>
            <input name="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Summary</label>
            <textarea name="summary" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} rows={2} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--line)" }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={isSaving} style={{ flex: 1, padding: 10, backgroundColor: "var(--orange)", color: "white", border: "none", borderRadius: 6 }}>{isSaving ? "Saving..." : editingSlug ? "Update Event" : "Create Event"}</button>
            {editingSlug && <button type="button" onClick={handleReset} style={{ padding: 10, backgroundColor: "var(--muted)", color: "white", border: "none", borderRadius: 6 }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px 0" }}>Existing Events ({localEvents.length})</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {localEvents.map((ev) => (
            <div key={ev.slug} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ display: "block", fontSize: 16 }}>{ev.title}</strong>
                  <small style={{ color: "var(--muted)" }}>{ev.slug} — {ev.program_type} — {ev.start_date}</small>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(ev)} style={{ padding: "6px 10px", backgroundColor: "var(--orange)", color: "white", border: "none", borderRadius: 6 }}>Edit</button>
                  <button onClick={() => handleDelete(ev.slug)} disabled={deleting === ev.slug} style={{ padding: "6px 10px", backgroundColor: "rgba(220,38,38,0.1)", color: "var(--ink)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 6 }}>{deleting === ev.slug ? "Deleting..." : "Delete"}</button>
                </div>
              </div>
              {ev.summary && <p style={{ marginTop: 8 }}>{ev.summary}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
