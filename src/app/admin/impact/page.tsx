"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImpactForm } from "@/components/impact-form";

interface ImpactMetric {
  id: string;
  slug: string;
  label: string;
  value_text: string;
  numeric_value: number | null;
  unit: string;
  category: "education" | "healthcare" | "sports" | "cross_cutting";
  metric_year: number | null;
  summary: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminImpactPage() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await fetch("/api/admin/impact-metrics", { cache: "no-store" });
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
            marginBottom: "2rem",
          }}
        >
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
        ) : (
          <ImpactForm metrics={metrics} />
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

