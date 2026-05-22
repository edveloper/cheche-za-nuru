"use client";

import Link from "next/link";
import { StoryForm } from "@/components/story-form";

export default function NewStoryPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                     radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                     linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
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
            📖 Create New Story
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            Add a new impact story to the platform
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <StoryForm />
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
