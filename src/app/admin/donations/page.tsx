"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DonationFundOption } from "@/lib/donation-funds";

export default function AdminDonationsPage() {
  const [funds, setFunds] = useState<DonationFundOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFunds() {
      try {
        const response = await fetch("/api/donation-funds", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load funds");
        const data = (await response.json()) as { funds?: DonationFundOption[] };
        setFunds(data.funds || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load funds");
      } finally {
        setLoading(false);
      }
    }

    loadFunds();
  }, []);

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
              💚 Donation Funds
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              View and manage donation fund categories
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
            Loading funds...
          </div>
        ) : funds.length === 0 ? (
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
            <p style={{ margin: 0 }}>No funds configured. Manage funds via Supabase Studio.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {funds.map((fund) => (
              <div
                key={fund.slug}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: "0 0 0.5rem 0",
                    fontFamily: "var(--font-display), serif",
                  }}
                >
                  {fund.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--muted)",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  {fund.shortDescription}
                </p>
                <div
                  style={{
                    backgroundColor: "rgba(132, 184, 63, 0.08)",
                    border: "1px solid rgba(132, 184, 63, 0.2)",
                    borderRadius: "6px",
                    padding: "1rem",
                    fontSize: "13px",
                    color: "var(--ink)",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Impact summary:</strong> {fund.impactSummary}
                </div>
                {fund.id && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      margin: "0.75rem 0 0 0",
                    }}
                  >
                    ID: <code style={{ fontFamily: "monospace" }}>{fund.id}</code>
                  </p>
                )}
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
