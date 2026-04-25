"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at top right, rgba(245, 193, 26, 0.18), transparent 24rem),
                     radial-gradient(circle at bottom left, rgba(132, 184, 63, 0.08), transparent 20rem),
                     linear-gradient(180deg, #fffdf8 0%, #fff6e7 100%)`,
        padding: "2rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "3rem",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(42, 36, 94, 0.08)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1rem",
            textAlign: "center",
            fontFamily: "var(--font-display), serif",
          }}
        >
          Admin Access
        </h1>

        <p
          style={{
            color: "var(--muted)",
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "14px",
          }}
        >
          Enter your admin password to continue
        </p>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              disabled={isPending}
              style={{
                padding: "0.75rem 1rem",
                fontSize: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                backgroundColor: "var(--background)",
                color: "var(--ink)",
                fontFamily: "inherit",
              }}
            />
          </div>

          {state?.error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                color: "#dc2626",
                fontSize: "13px",
              }}
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !password}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: "var(--orange)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending || !password ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          This is a restricted area for administrators only.
        </p>
      </div>
    </div>
  );
}
