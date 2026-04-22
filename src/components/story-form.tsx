"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StoryPost } from "@/lib/story-content";
import { saveStoryAction } from "@/app/admin/stories/form-actions";

type StoryFormProps = {
  initialStory?: StoryPost;
  isEditing?: boolean;
};

export function StoryForm({ initialStory, isEditing = false }: StoryFormProps) {
  const [formData, setFormData] = useState({
    title: initialStory?.title || "",
    excerpt: initialStory?.excerpt || "",
    body: initialStory?.body || "",
    category: initialStory?.category || "Impact",
    authorName: initialStory?.authorName || "Cheche Za Nuru",
    coverImage: initialStory?.coverImagePath || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialStory?.coverImagePath || null
  );
  const [state, formAction, isPending] = useActionState(saveStoryAction, null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <input type="hidden" name="isEditing" value={isEditing ? "true" : "false"} />
      <input type="hidden" name="slug" value={initialStory?.slug || ""} />

      {state?.error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {state.error}
        </div>
      )}

      {state?.success && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            borderRadius: "6px",
            color: "#166534",
            fontSize: "14px",
          }}
        >
          Story {isEditing ? "updated" : "created"} successfully!
        </div>
      )}

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="title"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Story Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isPending}
          placeholder="e.g., 50 new scholarships awarded in Kibera"
          style={{
            padding: "0.75rem 1rem",
            fontSize: "14px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Excerpt */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="excerpt"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Excerpt (Summary) *
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
          disabled={isPending}
          placeholder="Brief summary that appears in story listings"
          rows={3}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "14px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            color: "var(--ink)",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="body"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Story Content *
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          disabled={isPending}
          placeholder="Full story content. Use line breaks for paragraphs."
          rows={10}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "14px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            color: "var(--ink)",
            fontFamily: "monospace",
            resize: "vertical",
          }}
        />
      </div>

      {/* Cover Image */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="coverImage"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Cover Image *
        </label>

        {imagePreview && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid var(--line)",
              marginBottom: "1rem",
            }}
          >
            <Image
              src={imagePreview}
              alt="Cover preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <input
          id="coverImage"
          name="coverImageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isPending}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "13px",
            border: "1px dashed var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            cursor: "pointer",
          }}
        />
        <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0.5rem 0 0 0" }}>
          Recommended: 1200x600px for best quality
        </p>
      </div>

      {/* Category */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="category"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isPending}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "14px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            color: "var(--ink)",
          }}
        >
          <option value="Impact">Impact</option>
          <option value="Community">Community</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Sports">Sports</option>
          <option value="Feature">Feature</option>
        </select>
      </div>

      {/* Author */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="authorName"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Author Name
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          value={formData.authorName}
          onChange={handleChange}
          disabled={isPending}
          placeholder="Author name"
          style={{
            padding: "0.75rem 1rem",
            fontSize: "14px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--background)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            flex: 1,
            padding: "0.75rem 1.5rem",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "var(--orange)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? "Saving..." : isEditing ? "Update Story" : "Create Story"}
        </button>

        <Link
          href="/admin/stories"
          style={{
            flex: 1,
            padding: "0.75rem 1.5rem",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "transparent",
            color: "var(--ink)",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            textAlign: "center",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
