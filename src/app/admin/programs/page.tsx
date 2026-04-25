"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProgramEvent } from "@/lib/program-content";

export default function AdminProgramsPage() {
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/program-events", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load events");
        const data = (await response.json()) as { events?: ProgramEvent[] };
        setEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getProgramColor = (type: string) => {
    switch (type) {
      case "education":
        return "var(--orange)";
      case "healthcare":
        return "var(--green)";
      case "sports":
        return "var(--yellow)";
      default:
        return "var(--navy)";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                     radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                     linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
        padding: "1rem",
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
              📅 Programs & Events
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              Manage program events and calendar
            </p>
          </div>
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

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--muted)",
            }}
          >
            Loading events...
          </div>
        ) : events.length === 0 ? (
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
            <p style={{ margin: 0 }}>No events yet. Manage events via Supabase Studio.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {events.map((event) => (
              <div
                key={event.slug}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1.5rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: getProgramColor(event.programType),
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {event.programType}
                    </span>
                    {event.status !== "scheduled" && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "var(--muted)",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "0 0 0.5rem 0",
                      fontFamily: "var(--font-display), serif",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    📍 {event.location}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--ink)",
                      margin: "0",
                      lineHeight: 1.5,
                    }}
                  >
                    {event.summary}
                  </p>
                </div>
                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {formatDate(event.startDate)}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    Edit via Supabase
                  </p>
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
