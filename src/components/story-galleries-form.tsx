"use client";

import { useActionState, useState, useEffect } from "react";
import { generateSlug } from "@/lib/slug-utils";
import { savePhotoGalleryAction, deletePhotoGalleryAction } from "@/app/admin/stories/galleries/form-actions";

interface Gallery {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  story_date: string | null;
  cover_image_path: string;
  layout_style: "editorial" | "mosaic" | "stacked";
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function StoryGalleriesForm() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    slug: string;
    title: string;
    excerpt: string;
    storyDate: string;
    coverImagePath: string;
    layoutStyle: "editorial" | "mosaic" | "stacked";
    status: "draft" | "published" | "archived";
  }>({
    slug: "",
    title: "",
    excerpt: "",
    storyDate: "",
    coverImagePath: "",
    layoutStyle: "editorial",
    status: "draft",
  });
  const [errors, setErrors] = useState<string | null>(null);

  // Fetch galleries on mount
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch("/api/admin/stories/galleries");
        const data = await res.json();
        setGalleries(data.galleries || []);
      } catch (error) {
        setErrors("Failed to load galleries");
      }
    };
    fetchGalleries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "title" && !editingId) {
      // Auto-generate slug from title when creating new
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingId(gallery.id);
    setFormData({
      slug: gallery.slug,
      title: gallery.title,
      excerpt: gallery.excerpt,
      storyDate: gallery.story_date || "",
      coverImagePath: gallery.cover_image_path,
      layoutStyle: gallery.layout_style,
      status: gallery.status,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      storyDate: "",
      coverImagePath: "",
      layoutStyle: "editorial",
      status: "draft",
    });
    setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      if (editingId) {
        const res = await fetch("/api/admin/stories/galleries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors(data.error || "Failed to update gallery");
          return;
        }
        setGalleries((prev) =>
          prev.map((g) => (g.id === editingId ? data : g))
        );
      } else {
        const res = await fetch("/api/admin/stories/galleries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors(data.error || "Failed to create gallery");
          return;
        }
        setGalleries((prev) => [data, ...prev]);
      }
      handleCancel();
    } catch (error) {
      setErrors("An error occurred");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;

    try {
      const res = await fetch(`/api/admin/stories/galleries?slug=${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setGalleries((prev) => prev.filter((g) => g.slug !== slug));
    } catch (error) {
      setErrors("Failed to delete gallery");
    }
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <h3 style={{ marginBottom: "1.5rem", fontSize: "18px", fontWeight: "600" }}>
        {editingId ? "Edit Photo Gallery" : "Create Photo Gallery"}
      </h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        {errors && (
          <div style={{ color: "var(--orange)", marginBottom: "1rem", fontSize: "14px" }}>
            {errors}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Slug * (Auto-generated from title)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            disabled={!editingId}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: !editingId ? "var(--muted)" : "transparent",
              opacity: !editingId ? 0.6 : 1,
            }}
          />
          <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0.25rem 0 0 0" }}>
            {editingId ? "You can edit when modifying" : "Updates automatically as you type the title"}
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", minHeight: "80px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Story Date
          </label>
          <input
            type="date"
            name="storyDate"
            value={formData.storyDate}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Cover Image Path
          </label>
          <input
            type="text"
            name="coverImagePath"
            value={formData.coverImagePath}
            onChange={handleInputChange}
            placeholder="e.g., photos/gallery-1.jpg"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Layout Style
          </label>
          <select
            name="layoutStyle"
            value={formData.layoutStyle}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          >
            <option value="editorial">Editorial</option>
            <option value="mosaic">Mosaic</option>
            <option value="stacked">Stacked</option>
          </select>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--orange)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {editingId ? "Update Gallery" : "Create Gallery"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginBottom: "1rem", fontSize: "16px", fontWeight: "600" }}>
        Photo Galleries ({galleries.length})
      </h3>

      {galleries.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>No galleries yet</p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              style={{
                padding: "1rem",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                backgroundColor: "var(--surface)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "14px", fontWeight: "600" }}>
                    {gallery.title}
                  </h4>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "12px", color: "var(--muted)" }}>
                    Slug: {gallery.slug}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "12px" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: gallery.status === "published" ? "var(--green)" : "var(--yellow)",
                        color: "white",
                        borderRadius: "2px",
                      }}
                    >
                      {gallery.status}
                    </span>
                    {gallery.layout_style && (
                      <span style={{ color: "var(--muted)" }}>
                        {gallery.layout_style}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(gallery)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "var(--orange)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.slug)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "transparent",
                      color: "var(--orange)",
                      border: "1px solid var(--orange)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
