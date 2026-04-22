"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoryPost } from "@/lib/story-content";
import { deleteStoryAction } from "./form-actions";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  type Story = StoryPost;

  useEffect(() => {
    async function loadStories() {
      try {
        const response = await fetch("/api/stories", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load stories");
        const data = (await response.json()) as { stories?: Story[] };
        setStories(data.stories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stories");
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  async function handleDelete(slug: string) {
    try {
      await deleteStoryAction(slug);
      setStories(stories.filter((s) => s.slug !== slug));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete story");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                     radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                     linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
        padding: "1rem",
        overflow: "hidden",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--ink)",
                margin: "0 0 0.5rem 0",
                fontFamily: "var(--font-display), serif",
              }}
            >
              📖 Stories
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              Manage impact stories and photo galleries
            </p>
          </div>

          <Link
            href="/admin/stories/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.25rem",
              backgroundColor: "var(--orange)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            + New Story
          </Link>
        </div>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "6px",
              color: "#dc2626",
              marginBottom: "2rem",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
            Loading stories...
          </div>
        ) : stories.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px" }}>No stories yet</p>
            <Link
              href="/admin/stories/new"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--orange)",
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Create the first story →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            {stories.map((story) => (
              <div
                key={story.slug}
                style={{
                  padding: "1.5rem",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {story.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {story.excerpt}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/stories/${story.slug}/edit`}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "transparent",
                      border: "1px solid var(--line)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--ink)",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </Link>

                  {deleteConfirm === story.slug ? (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => handleDelete(story.slug)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor: "#dc2626",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor: "var(--line)",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--ink)",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(story.slug)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        border: "1px solid #fca5a5",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#dc2626",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/admin/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "2rem",
            color: "var(--muted)",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
