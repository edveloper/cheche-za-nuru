import Link from "next/link";
import { getAllTeamMembers } from "@/lib/team-content";
import { TeamForm } from "@/components/team-form";

export default async function AdminTeamPage() {
  const members = await getAllTeamMembers();

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
            👥 Team Management
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            Add, edit, and manage team members for the About page
          </p>
        </div>

        <TeamForm members={members} />

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
