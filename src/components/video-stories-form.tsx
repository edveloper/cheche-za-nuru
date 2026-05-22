"use client";

import { useRef, useState, useEffect } from "react";
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

interface FormState {
  slug: string;
  title: string;
  summary: string;
  videoPath: string;
  thumbnailPath: string;
  durationSeconds: string;
  status: "draft" | "published" | "archived";
}

const emptyForm: FormState = {
  slug: "",
  title: "",
  summary: "",
  videoPath: "",
  thumbnailPath: "",
  durationSeconds: "",
  status: "draft",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  border: "1px solid var(--line)",
  borderRadius: "6px",
  fontSize: "14px",
  backgroundColor: "var(--surface)",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.35rem",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--ink)",
};

const fieldStyle: React.CSSProperties = { marginBottom: "1rem" };

function formatDuration(seconds: string | number): string {
  const s = typeof seconds === "string" ? parseInt(seconds) : seconds;
  if (!s || s <= 0) return "";
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export default function VideoStoriesForm() {
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/stories/videos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setVideos(d.videos || []))
      .catch(() => setError("Failed to load videos"));
  }, []);

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !editingId) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  }

  function startEdit(video: VideoStory) {
    setEditingId(video.id);
    setForm({
      slug: video.slug,
      title: video.title,
      summary: video.summary,
      videoPath: video.video_path,
      thumbnailPath: video.thumbnail_path,
      durationSeconds: video.duration_seconds?.toString() ?? "",
      status: video.status,
    });
    setThumbPreview(video.thumbnail_path || null);
    setError(null);
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
    setThumbPreview(null);
    setVideoProgress(0);
    setError(null);
  }

  async function uploadThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbPreview(URL.createObjectURL(file));
    setUploadingThumb(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "thumbnail");
      const res = await fetch("/api/admin/stories/videos/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((p) => ({ ...p, thumbnailPath: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thumbnail upload failed");
      setThumbPreview(null);
    } finally {
      setUploadingThumb(false);
    }
  }

  function uploadVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setVideoProgress(0);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "video");

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setVideoProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploadingVideo(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setForm((p) => ({ ...p, videoPath: data.url }));
          setVideoProgress(100);
        } else {
          setError(data.error || "Video upload failed");
          setVideoProgress(0);
        }
      } catch {
        setError("Video upload failed");
        setVideoProgress(0);
      }
    };

    xhr.onerror = () => {
      setUploadingVideo(false);
      setVideoProgress(0);
      setError("Video upload failed — network error");
    };

    xhr.open("POST", "/api/admin/stories/videos/upload");
    xhr.send(fd);
  }

  async function handleSave() {
    if (!form.slug || !form.title || !form.videoPath) {
      setError("Title and video file are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        summary: form.summary,
        videoPath: form.videoPath,
        thumbnailPath: form.thumbnailPath,
        durationSeconds: form.durationSeconds ? parseInt(form.durationSeconds) : null,
        status: form.status,
      };

      if (editingId) {
        const res = await fetch("/api/admin/stories/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setVideos((prev) => prev.map((v) => (v.id === editingId ? { ...v, ...data } : v)));
      } else {
        const res = await fetch("/api/admin/stories/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setVideos((prev) => [data, ...prev]);
      }
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this video story?")) return;
    const res = await fetch(`/api/admin/stories/videos?slug=${slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setVideos((prev) => prev.filter((v) => v.slug !== slug));
      if (editingId && videos.find((v) => v.slug === slug)?.id === editingId) cancel();
    }
  }

  const durationLabel = form.durationSeconds
    ? formatDuration(form.durationSeconds)
    : "00:00";

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* ── Existing videos list ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
          Video Stories ({videos.length})
        </h3>
        <button
          onClick={cancel}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--orange)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + New Video
        </button>
      </div>

      {videos.length > 0 && (
        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "2rem" }}>
          {videos.map((v) => (
            <div
              key={v.id ?? v.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                border: `1px solid ${editingId === v.id ? "var(--orange)" : "var(--line)"}`,
                borderRadius: "6px",
                backgroundColor: "var(--surface)",
              }}
            >
              {v.thumbnail_path && (
                <img
                  src={v.thumbnail_path}
                  alt={v.title}
                  style={{
                    width: "56px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: "14px", display: "block" }}>{v.title}</strong>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "3px",
                    backgroundColor:
                      v.status === "published" ? "var(--green)" : "var(--line)",
                    color: v.status === "published" ? "white" : "var(--muted)",
                  }}
                >
                  {v.status}
                </span>
                {v.duration_seconds && (
                  <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "0.5rem" }}>
                    {formatDuration(v.duration_seconds)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(v)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    backgroundColor: editingId === v.id ? "var(--orange)" : "transparent",
                    color: editingId === v.id ? "white" : "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {editingId === v.id ? "Editing" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(v.slug)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    backgroundColor: "transparent",
                    color: "#dc2626",
                    border: "1px solid #fca5a5",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Editor + Preview ── */}
      <div
        className="admin-editor-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — form */}
        <div>
          <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "17px", fontWeight: 700 }}>
            {editingId ? "Edit Video Story" : "New Video Story"}
          </h3>

          {error && (
            <div
              style={{
                backgroundColor: "rgba(220,38,38,0.08)",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontSize: "13px",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              name="title"
              value={form.title}
              onChange={handleField}
              placeholder="Video title"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Slug</label>
            <input
              style={{ ...inputStyle, opacity: editingId ? 1 : 0.6 }}
              name="slug"
              value={form.slug}
              onChange={handleField}
              disabled={!editingId}
            />
            <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              {editingId ? "Editable" : "Auto-generated from title"}
            </p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Summary</label>
            <textarea
              style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
              name="summary"
              value={form.summary}
              onChange={handleField}
              placeholder="Short description of the video"
            />
          </div>

          {/* Video upload */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Video File *</label>
            {form.videoPath ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  border: "1px solid #86efac",
                  borderRadius: "6px",
                  backgroundColor: "rgba(34,197,94,0.06)",
                }}
              >
                <span style={{ fontSize: "20px" }}>🎬</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#15803d", fontWeight: 600 }}>
                    Video uploaded
                  </p>
                  <a
                    href={form.videoPath}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "11px", color: "var(--muted)", wordBreak: "break-all" }}
                  >
                    Preview ↗
                  </a>
                </div>
                <button
                  onClick={() => {
                    setForm((p) => ({ ...p, videoPath: "" }));
                    setVideoProgress(0);
                    if (videoRef.current) videoRef.current.value = "";
                  }}
                  style={{
                    padding: "0.3rem 0.6rem",
                    border: "1px solid var(--line)",
                    borderRadius: "4px",
                    backgroundColor: "transparent",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div
                  onClick={() => !uploadingVideo && videoRef.current?.click()}
                  style={{
                    border: "2px dashed var(--line)",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: uploadingVideo ? "default" : "pointer",
                    color: "var(--muted)",
                    fontSize: "13px",
                  }}
                >
                  {uploadingVideo ? `Uploading… ${videoProgress}%` : "Click to upload video file"}
                </div>
                {uploadingVideo && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      height: "4px",
                      backgroundColor: "var(--line)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${videoProgress}%`,
                        height: "100%",
                        backgroundColor: "var(--orange)",
                        transition: "width 0.2s",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={uploadVideo}
            />
            <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              MP4, MOV, WebM — max 200MB
            </p>
          </div>

          {/* Thumbnail upload */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Thumbnail Image</label>
            {thumbPreview ? (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                }}
              >
                <img
                  src={thumbPreview}
                  alt="Thumbnail preview"
                  style={{ width: "180px", height: "110px", objectFit: "cover", display: "block" }}
                />
                {uploadingThumb && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    Uploading…
                  </div>
                )}
                <button
                  onClick={() => {
                    setThumbPreview(null);
                    setForm((p) => ({ ...p, thumbnailPath: "" }));
                    if (thumbRef.current) thumbRef.current.value = "";
                  }}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    padding: "0.2rem 0.4rem",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => thumbRef.current?.click()}
                style={{
                  border: "2px dashed var(--line)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                Click to upload thumbnail
              </div>
            )}
            <input
              ref={thumbRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={uploadThumbnail}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Duration (seconds)</label>
              <input
                type="number"
                style={inputStyle}
                name="durationSeconds"
                value={form.durationSeconds}
                onChange={handleField}
                min="0"
                placeholder="e.g. 138"
              />
              {form.durationSeconds && (
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0.25rem 0 0" }}>
                  Displays as: {formatDuration(form.durationSeconds)}
                </p>
              )}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} name="status" value={form.status} onChange={handleField}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleSave}
              disabled={saving || uploadingVideo || uploadingThumb}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: saving ? "var(--line)" : "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : editingId ? "Update Video" : "Create Video"}
            </button>
            {editingId && (
              <button
                onClick={cancel}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "transparent",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — card preview matching video-story-card */}
        <div style={{ position: "sticky", top: "1rem" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.75rem",
            }}
          >
            Card preview
          </p>

          {/* Mirrors .video-story-card layout with inline styles */}
          <article
            style={{
              display: "grid",
              gap: "0.9rem",
              padding: "1.55rem",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "1.2rem",
              boxShadow: "0 16px 34px rgba(37, 36, 95, 0.05)",
            }}
          >
            {/* .video-story-screen */}
            <div
              style={{
                position: "relative",
                minHeight: "13rem",
                borderRadius: "1.2rem",
                background: thumbPreview
                  ? "transparent"
                  : "radial-gradient(ellipse at 60% 40%, rgba(245,193,26,0.35) 0%, transparent 60%), linear-gradient(135deg, #25245f 0%, #3948a4 100%)",
                overflow: "hidden",
              }}
            >
              {thumbPreview && (
                <img
                  src={thumbPreview}
                  alt="thumbnail"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              {/* .video-story-play */}
              <span
                style={{
                  position: "absolute",
                  left: "1.1rem",
                  bottom: "1.1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.9rem",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "2rem",
                  color: "white",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                ▶ Play
              </span>
            </div>

            {/* .card-label */}
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--orange)",
              }}
            >
              {durationLabel || "Duration"}
            </p>

            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-display), serif",
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--navy)",
              }}
            >
              {form.title || "Video title"}
            </h3>

            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              {form.summary || "Video summary will appear here."}
            </p>

            {form.videoPath && (
              <span style={{ fontSize: "0.9rem", color: "var(--orange)", fontWeight: 600 }}>
                Watch video →
              </span>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
