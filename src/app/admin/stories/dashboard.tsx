"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoryPost } from "@/lib/story-content";
import { deleteStoryAction } from "./form-actions";
import StoryGalleriesForm from "@/components/story-galleries-form";
import VideoStoriesForm from "@/components/video-stories-form";

type TabType = "blog" | "photos" | "videos" | "voices";

type VoiceSubmission = {
  id: string;
  display_name: string;
  role_label: string;
  quote: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type StoryGallery = {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  published_at: string | null;
};

type VideoStory = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  published_at: string | null;
};

export function StoriesDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("blog");
  const [stories, setStories] = useState<StoryPost[]>([]);
  const [galleries, setGalleries] = useState<StoryGallery[]>([]);
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [voices, setVoices] = useState<VoiceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    async function loadAllContent() {
      try {
        const [storiesRes, voicesRes, galleriesRes, videosRes] = await Promise.all([
          fetch("/api/admin/stories", { cache: "no-store" }),
          fetch("/api/admin/stories/voices", { cache: "no-store" }).catch(() => ({ ok: true, json: async () => ({ voices: [] }) })),
          fetch("/api/admin/stories/galleries", { cache: "no-store" }).catch(() => ({ ok: true, json: async () => ({ galleries: [] }) })),
          fetch("/api/admin/stories/videos", { cache: "no-store" }).catch(() => ({ ok: true, json: async () => ({ videos: [] }) })),
        ]);

        const storiesData = (await storiesRes.json()) as { stories?: StoryPost[] };
        const voicesData = (await voicesRes.json()) as { voices?: VoiceSubmission[] };
        const galleriesData = (await galleriesRes.json()) as { galleries?: StoryGallery[] };
        const videosData = (await videosRes.json()) as { videos?: VideoStory[] };

        setStories(storiesData.stories || []);
        setVoices(voicesData.voices || []);
        setGalleries(galleriesData.galleries || []);
        setVideos(videosData.videos || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    loadAllContent();
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

  async function handleVoiceAction(voiceId: string, newStatus: "approved" | "rejected") {
    try {
      const response = await fetch(`/api/admin/stories/voices/${voiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update voice");
      
      setVoices(voices.map((v) => (v.id === voiceId ? { ...v, status: newStatus } : v)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update voice");
    }
  }

  const tabConfig = [
    { id: "blog" as const, label: "Blog Posts", icon: "📝", count: stories.length },
    { id: "photos" as const, label: "Photo Stories", icon: "📷", count: galleries.length },
    { id: "videos" as const, label: "Video Stories", icon: "🎬", count: videos.length },
    { id: "voices" as const, label: "Voices", icon: "💬", count: voices.filter((v) => v.status === "pending").length },
  ];

  const TabButton = ({ tab }: { tab: (typeof tabConfig)[0] }) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      style={{
        padding: "0.75rem 1rem",
        borderBottom: activeTab === tab.id ? "2px solid var(--orange)" : "none",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: activeTab === tab.id ? 600 : 400,
        color: activeTab === tab.id ? "var(--orange)" : "var(--muted)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {tab.icon} {tab.label}
      {tab.count > 0 && (
        <span
          style={{
            display: "flex",
            minWidth: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: tab.count > 0 && tab.id === "voices" ? "var(--orange)" : "var(--line)",
            color: tab.count > 0 && tab.id === "voices" ? "white" : "var(--muted)",
            fontSize: "11px",
            fontWeight: 600,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {tab.count}
        </span>
      )}
    </button>
  );

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
              📖 Stories Management
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              Manage blog posts, photo stories, video stories, and visitor testimonies
            </p>
          </div>

          {activeTab === "blog" && (
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
              + New Blog Post
            </Link>
          )}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "6px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "var(--ink)",
              fontSize: "14px",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "1px solid var(--line)",
            marginBottom: "1.5rem",
            overflowX: "auto",
          }}
        >
          {tabConfig.map((tab) => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
            Loading content...
          </div>
        ) : activeTab === "blog" ? (
          // BLOG POSTS TAB
          stories.length === 0 ? (
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
              <p style={{ margin: 0, fontSize: "14px" }}>No blog posts yet</p>
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
                Create the first post →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {stories.map((story) => (
                <div
                  key={story.slug}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1rem",
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
                        margin: 0,
                      }}
                    >
                      {story.excerpt}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", whiteSpace: "nowrap" }}>
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
          )
        ) : activeTab === "photos" ? (
          // PHOTO STORIES TAB
          <StoryGalleriesForm />
        ) : activeTab === "videos" ? (
          // VIDEO STORIES TAB
          <VideoStoriesForm />
        ) : (
          // VOICES TAB
          <div>
            {voices.filter((v) => v.status === "pending").length === 0 ? (
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                <p style={{ margin: 0 }}>No pending voices to review</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {voices
                  .filter((v) => v.status === "pending")
                  .map((voice) => (
                    <div
                      key={voice.id}
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line)",
                        borderRadius: "12px",
                        padding: "1.5rem",
                      }}
                    >
                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            fontSize: "15px",
                            fontStyle: "italic",
                            color: "var(--ink)",
                            margin: "0 0 0.75rem 0",
                            lineHeight: 1.6,
                          }}
                        >
                          &ldquo;{voice.quote}&rdquo;
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            alignItems: "center",
                            fontSize: "13px",
                            color: "var(--muted)",
                          }}
                        >
                          <strong>{voice.display_name}</strong>
                          {voice.role_label && <span>—{voice.role_label}</span>}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleVoiceAction(voice.id, "approved")}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "var(--green)",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVoiceAction(voice.id, "rejected")}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#dc2626",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
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
          ← Back to Admin
        </Link>
      </div>
    </div>
  );
}
