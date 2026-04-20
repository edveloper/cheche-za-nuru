"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Authentication Error</h1>

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "left",
            display: "inline-block",
          }}
        >
          <strong>Error:</strong>
          <p style={{ marginTop: "10px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {error}
          </p>
        </div>
      )}

      <p style={{ marginTop: "20px", color: "#666" }}>
        {error && error.includes("expired")
          ? "Your authentication link has expired. Please request a new one."
          : "Something went wrong during authentication."}
      </p>

      <div style={{ marginTop: "30px" }}>
        <Link href="/" style={{ marginRight: "15px", textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
