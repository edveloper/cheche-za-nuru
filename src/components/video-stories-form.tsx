"use client";

import { useState, useEffect } from "react";
import { generateSlug } from "@/lib/slug-utils";

interface VideoStory {
  id: string;
  slug: string;
  title: string;
  summary: string;
  video_path: string;
  thumbnail_path: string;
  duration_seconds: number | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function VideoStoriesForm() {
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    summary: "",
    videoPath: "",
    thumbnailPath: "",
    durationSeconds: "",
    status: "draft" as const,
  });
  const [errors, setErrors] = useState<string | null>(null);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/admin/stories/videos");
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (error) {
        setErrors("Failed to load videos");
      }
    };
    fetchVideos();
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

  const handleEdit = (video: VideoStory) => {
    setEditingId(video.id);
    setFormData({
      slug: video.slug,
      title: video.title,
      summary: video.summary,
      videoPath: video.video_path,
      thumbnailPath: video.thumbnail_path,
      durationSeconds: video.duration_seconds?.toString() || "",
      status: video.status,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      title: "",
      summary: "",
      videoPath: "",
      thumbnailPath: "",
      durationSeconds: "",
      status: "draft",
    });
    setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      const payload = {
        ...formData,
        durationSeconds: formData.durationSeconds ? parseInt(formData.durationSeconds) : null,
      };

      if (editingId) {
        const res = await fetch("/api/admin/stories/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors(data.error || "Failed to update video");
          return;
        }
        setVideos((prev) =>
          prev.map((v) => (v.id === editingId ? data : v))
        );
      } else {
        const res = await fetch("/api/admin/stories/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors(data.error || "Failed to create video");
          return;
        }
        setVideos((prev) => [data, ...prev]);
      }
      handleCancel();
    } catch (error) {
      setErrors("An error occurred");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/admin/stories/videos?slug=${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setVideos((prev) => prev.filter((v) => v.slug !== slug));
    } catch (error) {
      setErrors("Failed to delete video");
    }
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <h3 style={{ marginBottom: "1.5rem", fontSize: "18px", fontWeight: "600" }}>
        {editingId ? "Edit Video Story" : "Create Video Story"}
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
            Summary
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", minHeight: "80px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Video Path *
          </label>
          <input
            type="text"
            name="videoPath"
            value={formData.videoPath}
            onChange={handleInputChange}
            required
            placeholder="e.g., videos/story-1.mp4"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Thumbnail Path
          </label>
          <input
            type="text"
            name="thumbnailPath"
            value={formData.thumbnailPath}
            onChange={handleInputChange}
            placeholder="e.g., thumbnails/story-1.jpg"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px" }}>
            Duration (seconds)
          </label>
          <input
            type="number"
            name="durationSeconds"
            value={formData.durationSeconds}
            onChange={handleInputChange}
            min="0"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
          />
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
            {editingId ? "Update Video" : "Create Video"}
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
        Video Stories ({videos.length})
      </h3>

      {videos.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>No videos yet</p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {videos.map((video) => (
            <div
              key={video.id}
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
                    {video.title}
                  </h4>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "12px", color: "var(--muted)" }}>
                    Slug: {video.slug}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "12px" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: video.status === "published" ? "var(--green)" : "var(--yellow)",
                        color: "white",
                        borderRadius: "2px",
                      }}
                    >
                      {video.status}
                    </span>
                    {video.duration_seconds && (
                      <span style={{ color: "var(--muted)" }}>
                        {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(video)}
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
                    onClick={() => handleDelete(video.slug)}
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
