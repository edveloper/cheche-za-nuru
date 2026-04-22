"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "./actions";

const adminSections = [
  {
    title: "Stories",
    description: "Create, edit, and manage impact stories and galleries",
    href: "/admin/stories",
    icon: "📖",
    color: "var(--orange)",
  },
  {
    title: "Programs & Events",
    description: "Manage programs and event calendar",
    href: "/admin/programs",
    icon: "📅",
    color: "var(--yellow)",
  },
  {
    title: "Impact Metrics",
    description: "Update impact statistics and metrics",
    href: "/admin/impact",
    icon: "📊",
    color: "var(--green)",
  },
  {
    title: "Donation Funds",
    description: "View and manage donation fund categories",
    href: "/admin/donations",
    icon: "💚",
    color: "var(--green)",
  },
  {
    title: "Submissions",
    description: "View contact and involvement form submissions",
    href: "/admin/submissions",
    icon: "📬",
    color: "var(--navy)",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push("/admin/login");
  }

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
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--ink)",
                margin: "0 0 0.5rem 0",
                fontFamily: "var(--font-display), serif",
              }}
            >
              Admin Dashboard
            </h1>
            <p
              style={{
                color: "var(--muted)",
                margin: 0,
                fontSize: "14px",
              }}
            >
              Manage all content and submissions for Cheche Za Nuru
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "var(--muted)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--orange)";
              e.currentTarget.style.color = "var(--orange)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              style={{
                display: "block",
                padding: "1rem",
                overflow: "hidden",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 16px rgba(42, 36, 94, 0.12)";
                el.style.borderColor = section.color;
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "var(--line)";
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "1rem",
                }}
              >
                {section.icon}
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
                {section.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {section.description}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "1rem",
                  color: section.color,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Access →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
