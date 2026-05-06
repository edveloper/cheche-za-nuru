"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DonationsForm } from "@/components/donations-form";

type DonationFund = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  impact_summary: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type DonationIntent = {
  id: string;
  reference_code: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: string;
  currency: string;
  purpose: string;
  fund_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function AdminDonationsPage() {
  const [funds, setFunds] = useState<DonationFund[]>([]);
  const [intents, setIntents] = useState<DonationIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"funds" | "intents">("funds");

  useEffect(() => {
    async function loadData() {
      try {
        const [fundsRes, intentsRes] = await Promise.all([
          fetch("/api/admin/donation-funds", { cache: "no-store" }),
          fetch("/api/admin/donations", { cache: "no-store" }),
        ]);

        if (!fundsRes.ok) throw new Error("Failed to load funds");
        if (!intentsRes.ok) throw new Error("Failed to load intents");

        const fundsData = (await fundsRes.json()) as { funds?: DonationFund[] };
        const intentsData = (await intentsRes.json()) as { intents?: DonationIntent[] };

        setFunds(fundsData.funds || []);
        setIntents(intentsData.intents || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
            💚 Donations
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            Manage donation funds and track donor intents
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "1px solid var(--line)",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() => setActiveTab("funds")}
            style={{
              padding: "0.75rem 0",
              borderBottom: activeTab === "funds" ? "2px solid var(--orange)" : "none",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "funds" ? 600 : 400,
              color: activeTab === "funds" ? "var(--orange)" : "var(--muted)",
            }}
          >
            Donation Funds ({funds.length})
          </button>
          <button
            onClick={() => setActiveTab("intents")}
            style={{
              padding: "0.75rem 0",
              borderBottom: activeTab === "intents" ? "2px solid var(--orange)" : "none",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "intents" ? 600 : 400,
              color: activeTab === "intents" ? "var(--orange)" : "var(--muted)",
            }}
          >
            Donor Intents ({intents.length})
          </button>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--muted)",
            }}
          >
            Loading data...
          </div>
        ) : activeTab === "funds" ? (
          <DonationsForm funds={funds} />
        ) : (
          // Donor Intents Tab
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--ink)",
                margin: "0 0 1rem 0",
                fontFamily: "var(--font-display), serif",
              }}
            >
              Donor Intents ({intents.length})
            </h2>

            {intents.length === 0 ? (
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
                <p style={{ margin: 0 }}>No donation intents yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {intents.map((intent) => (
                  <div
                    key={intent.id}
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "1rem",
                        marginBottom: "1rem",
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
                          {intent.donor_name}
                        </h3>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--muted)",
                            margin: 0,
                          }}
                        >
                          {intent.donor_email}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--ink)",
                            margin: "0 0 0.25rem 0",
                          }}
                        >
                          {intent.currency} {parseFloat(intent.amount as any).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: intent.status === "paid" ? "rgba(34,197,94,0.1)" : intent.status === "pledged" ? "rgba(245,193,26,0.1)" : "rgba(107,114,128,0.1)",
                            color: intent.status === "paid" ? "var(--green)" : intent.status === "pledged" ? "var(--orange)" : "var(--muted)",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {intent.status}
                        </span>
                      </div>
                    </div>

                    {intent.donor_phone && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--muted)",
                          margin: "0 0 0.5rem 0",
                        }}
                      >
                        📞 {intent.donor_phone}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      <strong>Purpose:</strong> {intent.purpose}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        color: "var(--muted)",
                      }}
                    >
                      <span>Ref: {intent.reference_code}</span>
                      <span>{new Date(intent.created_at).toLocaleDateString("en-US")}</span>
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
