"use client";

import { useRef, useState, useEffect } from "react";
import { generateSlug } from "@/lib/slug-utils";

interface GalleryItem {
  id: string;
  image_path: string;
  caption: string;
  alt_text: string;
  sort_order: number;
}

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

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  storyDate: string;
  layoutStyle: "editorial" | "mosaic" | "stacked";
  status: "draft" | "published" | "archived";
  coverImagePath: string;
}

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  storyDate: "",
  layoutStyle: "editorial",
  status: "draft",
  coverImagePath: "",
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

export default function StoryGalleriesForm() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploadingItem, setUploadingItem] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  async function fetchGalleries() {
    try {
      const res = await fetch("/api/admin/stories/galleries", { cache: "no-store" });
      const data = await res.json();
      setGalleries(data.galleries || []);
    } catch {
      setError("Failed to load galleries");
    }
  }

  async function fetchItems(slug: string) {
    try {
      const res = await fetch(`/api/admin/stories/galleries/${slug}/items`, {
        cache: "no-store",
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }

  function startNew() {
    setActiveGallery(null);
    setForm(emptyForm);
    setCoverPreview(null);
    setItems([]);
    setError(null);
    setSuccess(null);
  }

  function startEdit(gallery: Gallery) {
    setActiveGallery(gallery);
    setForm({
      slug: gallery.slug,
      title: gallery.title,
      excerpt: gallery.excerpt,
      storyDate: gallery.story_date ?? "",
      layoutStyle: gallery.layout_style,
      status: gallery.status,
      coverImagePath: gallery.cover_image_path,
    });
    setCoverPreview(gallery.cover_image_path || null);
    setError(null);
    setSuccess(null);
    fetchItems(gallery.slug);
  }

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !activeGallery) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/stories/galleries/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((prev) => ({ ...prev, coverImagePath: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover upload failed");
      setCoverPreview(null);
    } finally {
      setUploadingCover(false);
    }
  }

  async function saveMeta() {
    if (!form.title || !form.slug) {
      setError("Title is required");
      return;
    }
    setSavingMeta(true);
    setError(null);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        storyDate: form.storyDate,
        coverImagePath: form.coverImagePath,
        layoutStyle: form.layoutStyle,
        status: form.status,
      };

      const method = activeGallery ? "PUT" : "POST";
      const res = await fetch("/api/admin/stories/galleries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!activeGallery) {
        setActiveGallery(data);
        setGalleries((prev) => [data, ...prev]);
        setSuccess("Gallery created. Now add images below.");
      } else {
        setGalleries((prev) =>
          prev.map((g) => (g.slug === activeGallery.slug ? { ...g, ...payload } : g))
        );
        setSuccess("Gallery updated.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingMeta(false);
    }
  }

  async function uploadItem(e: React.ChangeEvent<HTMLInputElement>) {
    if (!activeGallery) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingItem(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const upRes = await fetch("/api/admin/stories/galleries/upload", {
        method: "POST",
        body: fd,
      });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error);

      const addRes = await fetch(
        `/api/admin/stories/galleries/${activeGallery.slug}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_path: upData.url,
            caption: "",
            alt_text: file.name.replace(/\.[^.]+$/, ""),
            sort_order: items.length,
          }),
        }
      );
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error);
      setItems((prev) => [...prev, addData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingItem(false);
      if (itemRef.current) itemRef.current.value = "";
    }
  }

  async function updateItemField(id: string, field: "caption" | "alt_text", value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function saveItemField(id: string, field: "caption" | "alt_text", value: string) {
    if (!activeGallery) return;
    await fetch(`/api/admin/stories/galleries/${activeGallery.slug}/items?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function moveItem(id: string, direction: -1 | 1) {
    if (!activeGallery) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const updated = reordered.map((item, i) => ({ ...item, sort_order: i }));
    setItems(updated);
    await Promise.all(
      updated.map((item) =>
        fetch(
          `/api/admin/stories/galleries/${activeGallery.slug}/items?id=${item.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sort_order: item.sort_order }),
          }
        )
      )
    );
  }

  async function deleteItem(id: string) {
    if (!activeGallery) return;
    const res = await fetch(
      `/api/admin/stories/galleries/${activeGallery.slug}/items?id=${id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function deleteGallery(slug: string) {
    if (!confirm("Delete this gallery and all its images?")) return;
    const res = await fetch(`/api/admin/stories/galleries?slug=${slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setGalleries((prev) => prev.filter((g) => g.slug !== slug));
      if (activeGallery?.slug === slug) startNew();
    }
  }

  const previewImages = items.map((item) => ({
    src: item.image_path,
    alt: item.alt_text || form.title,
    caption: item.caption,
  }));

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* ── List of existing galleries ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
          Photo Galleries ({galleries.length})
        </h3>
        <button
          onClick={startNew}
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
          + New Gallery
        </button>
      </div>

      {galleries.length > 0 && (
        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "2rem" }}>
          {galleries.map((g) => (
            <div
              key={g.id}
              style={{
                padding: "0.75rem 1rem",
                border: `1px solid ${activeGallery?.id === g.id ? "var(--orange)" : "var(--line)"}`,
                borderRadius: "6px",
                backgroundColor: "var(--surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "14px" }}>{g.title}</strong>
                <span
                  style={{
                    marginLeft: "0.75rem",
                    fontSize: "11px",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "3px",
                    backgroundColor:
                      g.status === "published" ? "var(--green)" : "var(--line)",
                    color: g.status === "published" ? "white" : "var(--muted)",
                  }}
                >
                  {g.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => startEdit(g)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    backgroundColor:
                      activeGallery?.id === g.id ? "var(--orange)" : "transparent",
                    color: activeGallery?.id === g.id ? "white" : "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {activeGallery?.id === g.id ? "Editing" : "Edit"}
                </button>
                <button
                  onClick={() => deleteGallery(g.slug)}
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
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — form */}
        <div>
          <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "17px", fontWeight: 700 }}>
            {activeGallery ? `Editing: ${activeGallery.title}` : "New Photo Gallery"}
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
          {success && (
            <div
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                border: "1px solid #86efac",
                borderRadius: "6px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontSize: "13px",
                color: "#15803d",
              }}
            >
              {success}
            </div>
          )}

          {/* Metadata */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              name="title"
              value={form.title}
              onChange={handleField}
              placeholder="Gallery title"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Slug</label>
            <input
              style={{ ...inputStyle, opacity: 0.6 }}
              name="slug"
              value={form.slug}
              onChange={handleField}
              disabled={!activeGallery}
            />
            <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              {activeGallery ? "Editable" : "Auto-generated from title"}
            </p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
              name="excerpt"
              value={form.excerpt}
              onChange={handleField}
              placeholder="Short description of this gallery"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Story Date</label>
              <input
                type="date"
                style={inputStyle}
                name="storyDate"
                value={form.storyDate}
                onChange={handleField}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Layout Style</label>
              <select style={inputStyle} name="layoutStyle" value={form.layoutStyle} onChange={handleField}>
                <option value="editorial">Editorial (1 large + 2 small)</option>
                <option value="mosaic">Mosaic (equal grid)</option>
                <option value="stacked">Stacked (alternate sides)</option>
              </select>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} name="status" value={form.status} onChange={handleField}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Cover image upload */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Cover Image</label>
            {coverPreview ? (
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
                  src={coverPreview}
                  alt="Cover preview"
                  style={{ width: "100%", maxHeight: "180px", objectFit: "cover", display: "block" }}
                />
                <button
                  onClick={() => {
                    setCoverPreview(null);
                    setForm((p) => ({ ...p, coverImagePath: "" }));
                    if (coverRef.current) coverRef.current.value = "";
                  }}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverRef.current?.click()}
                style={{
                  border: "2px dashed var(--line)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: "13px",
                  marginBottom: "0.5rem",
                }}
              >
                {uploadingCover ? "Uploading…" : "Click to upload cover image"}
              </div>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={uploadCover}
            />
          </div>

          <button
            onClick={saveMeta}
            disabled={savingMeta || uploadingCover}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: savingMeta ? "var(--line)" : "var(--orange)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: savingMeta ? "not-allowed" : "pointer",
              marginBottom: "2rem",
            }}
          >
            {savingMeta
              ? "Saving…"
              : activeGallery
              ? "Update Gallery"
              : "Create Gallery"}
          </button>

          {/* ── Gallery Images (only when gallery exists) ── */}
          {activeGallery && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--line)",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
                  Gallery Images ({items.length})
                </h4>
                <button
                  onClick={() => itemRef.current?.click()}
                  disabled={uploadingItem}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: uploadingItem ? "var(--line)" : "var(--orange)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: uploadingItem ? "not-allowed" : "pointer",
                  }}
                >
                  {uploadingItem ? "Uploading…" : "+ Add Image"}
                </button>
                <input
                  ref={itemRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={uploadItem}
                />
              </div>

              <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "1rem" }}>
                First image is displayed largest. Use arrows to reorder. Caption and alt text are saved automatically on blur.
              </p>

              {items.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    border: "2px dashed var(--line)",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "var(--muted)",
                    fontSize: "13px",
                  }}
                >
                  No images yet — click &ldquo;+ Add Image&rdquo; to upload
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr auto",
                        gap: "0.75rem",
                        alignItems: "start",
                        padding: "0.75rem",
                        border: "1px solid var(--line)",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface)",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={item.image_path}
                          alt={item.alt_text}
                          style={{
                            width: "80px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            display: "block",
                          }}
                        />
                        {idx === 0 && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: "2px",
                              left: "2px",
                              fontSize: "9px",
                              backgroundColor: "var(--orange)",
                              color: "white",
                              padding: "1px 4px",
                              borderRadius: "2px",
                            }}
                          >
                            LEAD
                          </span>
                        )}
                      </div>

                      <div style={{ display: "grid", gap: "0.4rem" }}>
                        <input
                          style={{ ...inputStyle, fontSize: "12px", padding: "0.4rem 0.6rem" }}
                          placeholder="Caption"
                          value={item.caption}
                          onChange={(e) => updateItemField(item.id, "caption", e.target.value)}
                          onBlur={(e) => saveItemField(item.id, "caption", e.target.value)}
                        />
                        <input
                          style={{ ...inputStyle, fontSize: "12px", padding: "0.4rem 0.6rem" }}
                          placeholder="Alt text"
                          value={item.alt_text}
                          onChange={(e) => updateItemField(item.id, "alt_text", e.target.value)}
                          onBlur={(e) => saveItemField(item.id, "alt_text", e.target.value)}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <button
                          onClick={() => moveItem(item.id, -1)}
                          disabled={idx === 0}
                          style={{
                            padding: "0.25rem 0.5rem",
                            border: "1px solid var(--line)",
                            borderRadius: "3px",
                            backgroundColor: "transparent",
                            fontSize: "12px",
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                            opacity: idx === 0 ? 0.3 : 1,
                          }}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveItem(item.id, 1)}
                          disabled={idx === items.length - 1}
                          style={{
                            padding: "0.25rem 0.5rem",
                            border: "1px solid var(--line)",
                            borderRadius: "3px",
                            backgroundColor: "transparent",
                            fontSize: "12px",
                            cursor: idx === items.length - 1 ? "not-allowed" : "pointer",
                            opacity: idx === items.length - 1 ? 0.3 : 1,
                          }}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            border: "1px solid #fca5a5",
                            borderRadius: "3px",
                            backgroundColor: "transparent",
                            color: "#dc2626",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — live preview */}
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
            Live preview
          </p>
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "var(--surface)",
            }}
          >
            {/* Collage preview */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: "6px",
                padding: "10px",
                minHeight: "140px",
                backgroundColor: "#f5f0e8",
              }}
            >
              {previewImages.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted)",
                    fontSize: "12px",
                    fontStyle: "italic",
                  }}
                >
                  Images will appear here
                </div>
              ) : (
                <>
                  <div style={{ gridRow: "span 2", borderRadius: "8px", overflow: "hidden", minHeight: "140px" }}>
                    <img
                      src={previewImages[0].src}
                      alt={previewImages[0].alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  {previewImages.slice(1, 3).map((img, i) => (
                    <div
                      key={i}
                      style={{ borderRadius: "8px", overflow: "hidden", minHeight: "65px" }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  ))}
                  {previewImages.length < 2 && (
                    <div
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "var(--line)",
                        minHeight: "65px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      + image 2
                    </div>
                  )}
                  {previewImages.length < 3 && (
                    <div
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "var(--line)",
                        minHeight: "65px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      + image 3
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Text panel */}
            <div style={{ padding: "1rem 1.1rem" }}>
              {form.storyDate && (
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--orange)",
                    margin: "0 0 0.4rem",
                  }}
                >
                  {form.storyDate}
                </p>
              )}
              <h3
                style={{
                  margin: "0 0 0.4rem",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--navy)",
                  fontFamily: "var(--font-display), serif",
                }}
              >
                {form.title || "Gallery title"}
              </h3>
              <p style={{ margin: "0 0 0.75rem", fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
                {form.excerpt || "Gallery excerpt will appear here."}
              </p>
              <span style={{ fontSize: "13px", color: "var(--orange)", fontWeight: 600 }}>
                Open gallery →
              </span>
            </div>
          </div>

          <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "0.5rem" }}>
            {items.length} image{items.length !== 1 ? "s" : ""} · layout: {form.layoutStyle}
          </p>
        </div>
      </div>
    </div>
  );
}
