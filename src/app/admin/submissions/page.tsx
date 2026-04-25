"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ContactSubmission = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  submitted_at: string;
};

type InvolvementLead = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  interest: string;
  message?: string;
  submitted_at: string;
};

export default function AdminSubmissionsPage() {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [involvementLeads, setInvolvementLeads] = useState<InvolvementLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"contact" | "involvement">("contact");

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const [contactRes, involvementRes] = await Promise.all([
          fetch("/api/admin/submissions/contact", { cache: "no-store" }),
          fetch("/api/admin/submissions/involvement", { cache: "no-store" }),
        ]);

        if (!contactRes.ok) throw new Error("Failed to load contact submissions");
        if (!involvementRes.ok) throw new Error("Failed to load involvement leads");

        const contactData = (await contactRes.json()) as { submissions?: ContactSubmission[] };
        const involvementData = (await involvementRes.json()) as { leads?: InvolvementLead[] };

        setContactSubmissions(contactData.submissions || []);
        setInvolvementLeads(involvementData.leads || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
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
            📬 Submissions
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            View contact and involvement form submissions
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
            onClick={() => setActiveTab("contact")}
            style={{
              padding: "0.75rem 0",
              borderBottom: activeTab === "contact" ? "2px solid var(--orange)" : "none",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "contact" ? 600 : 400,
              color: activeTab === "contact" ? "var(--orange)" : "var(--muted)",
            }}
          >
            Contact Submissions ({contactSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab("involvement")}
            style={{
              padding: "0.75rem 0",
              borderBottom: activeTab === "involvement" ? "2px solid var(--orange)" : "none",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "involvement" ? 600 : 400,
              color: activeTab === "involvement" ? "var(--orange)" : "var(--muted)",
            }}
          >
            Involvement Leads ({involvementLeads.length})
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
            Loading submissions...
          </div>
        ) : activeTab === "contact" ? (
          contactSubmissions.length === 0 ? (
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
              <p style={{ margin: 0 }}>No contact submissions yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {contactSubmissions.map((submission) => (
                <div
                  key={submission.id}
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
                        {submission.first_name} {submission.last_name || ""}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--muted)",
                          margin: 0,
                        }}
                      >
                        {submission.email}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        margin: 0,
                        textAlign: "right",
                      }}
                    >
                      {formatDate(submission.submitted_at)}
                    </p>
                  </div>

                  {submission.phone && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      📞 {submission.phone}
                    </p>
                  )}

                  {submission.interest && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      <strong>Interest:</strong> {submission.interest}
                    </p>
                  )}

                  <div
                    style={{
                      backgroundColor: "rgba(245, 193, 26, 0.08)",
                      border: "1px solid rgba(245, 193, 26, 0.2)",
                      borderRadius: "6px",
                      padding: "1rem",
                      fontSize: "13px",
                      color: "var(--ink)",
                      lineHeight: 1.6,
                    }}
                  >
                    {submission.message}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : involvementLeads.length === 0 ? (
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
            <p style={{ margin: 0 }}>No involvement leads yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {involvementLeads.map((lead) => (
              <div
                key={lead.id}
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
                      {lead.first_name} {lead.last_name || ""}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: 0,
                      }}
                    >
                      {lead.email}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    {formatDate(lead.submitted_at)}
                  </p>
                </div>

                {lead.phone && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    📞 {lead.phone}
                  </p>
                )}

                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--ink)",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  <strong>Interest:</strong>
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "var(--orange)",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.interest.replace(/_/g, " ")}
                  </span>
                </p>

                {lead.message && (
                  <div
                    style={{
                      backgroundColor: "rgba(245, 193, 26, 0.08)",
                      border: "1px solid rgba(245, 193, 26, 0.2)",
                      borderRadius: "6px",
                      padding: "1rem",
                      fontSize: "13px",
                      color: "var(--ink)",
                      lineHeight: 1.6,
                    }}
                  >
                    {lead.message}
                  </div>
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
