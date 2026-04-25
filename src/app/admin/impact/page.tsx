"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ImpactMetric } from "@/lib/impact-content";

export default function AdminImpactPage() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await fetch("/api/impact-metrics", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load metrics");
        const data = (await response.json()) as { metrics?: ImpactMetric[] };
        setMetrics(data.metrics || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education":
        return "var(--orange)";
      case "healthcare":
        return "var(--green)";
      case "sports":
        return "var(--yellow)";
      case "cross_cutting":
        return "var(--navy)";
      default:
        return "var(--muted)";
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
              📊 Impact Metrics
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              Manage impact statistics and metrics
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
            Loading metrics...
          </div>
        ) : metrics.length === 0 ? (
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
            <p style={{ margin: 0 }}>No metrics yet. Manage metrics via Supabase Studio.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {metrics.map((metric) => (
              <div
                key={metric.slug}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1.5rem",
                  alignItems: "center",
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
                        backgroundColor: getCategoryColor(metric.category),
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {metric.category.replace(/_/g, " ")}
                    </span>
                    {!metric.isFeatured && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                        }}
                      >
                        (not featured)
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      margin: "0",
                    }}
                  >
                    {metric.label}
                  </p>
                  {metric.summary && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        margin: "0.5rem 0 0 0",
                        fontStyle: "italic",
                      }}
                    >
                      {metric.summary}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "var(--ink)",
                      margin: "0",
                      fontFamily: "var(--font-display), serif",
                    }}
                  >
                    {metric.value}
                  </p>
                  {metric.metricYear && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      ({metric.metricYear})
                    </p>
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
