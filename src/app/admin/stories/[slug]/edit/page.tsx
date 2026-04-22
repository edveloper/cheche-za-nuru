"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoryForm } from "@/components/story-form";
import type { StoryPost } from "@/lib/story-content";

type EditStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default function EditStoryPage({ params }: EditStoryPageProps) {
  const [story, setStory] = useState<StoryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);

      async function loadStory() {
        try {
          const response = await fetch("/api/stories", { cache: "no-store" });
          if (!response.ok) throw new Error("Failed to load stories");
          const data = (await response.json()) as { stories?: StoryPost[] };
          const foundStory = data.stories?.find((s) => s.slug === resolvedParams.slug);

          if (!foundStory) {
            setError("Story not found");
          } else {
            setStory(foundStory);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load story");
        } finally {
          setLoading(false);
        }
      }

      loadStory();
    });
  }, [params]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                       radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                       linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
          padding: "2rem",
        }}
      >
        <div style={{ color: "var(--muted)", fontSize: "14px" }}>Loading story...</div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                       radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                       linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "6px",
              color: "#dc2626",
              marginBottom: "2rem",
            }}
          >
            {error || "Story not found"}
          </div>

          <Link
            href="/admin/stories"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--muted)",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                     radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                     linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--ink)",
              margin: "0 0 0.5rem 0",
              fontFamily: "var(--font-display), serif",
            }}
          >
            📖 Edit Story
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            {story.title}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "2rem",
          }}
        >
          <StoryForm initialStory={story} isEditing={true} />
        </div>

        <Link
          href="/admin/stories"
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
          ← Back to Stories
        </Link>
      </div>
    </div>
  );
}
