"use client";

import { useState } from "react";

interface FormState {
  display_name: string;
  role_label: string;
  location: string;
  quote: string;
  website: string; // honeypot
}

const empty: FormState = {
  display_name: "",
  role_label: "",
  location: "",
  quote: "",
  website: "",
};

export function VoiceSubmitForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/voices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm(empty);
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="reading-panel" style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
        <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>Thank you.</p>
        <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
          Your voice has been submitted and will appear here after a short review.
          We read every submission.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.4rem",
            backgroundColor: "transparent",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            fontSize: "14px",
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      {/* Honeypot — hidden from real users */}
      <input
        name="website"
        value={form.website}
        onChange={handleChange}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-row" style={{ marginBottom: "1rem" }}>
        <div>
          <label
            htmlFor="voice-name"
            style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "0.35rem" }}
          >
            Your name *
          </label>
          <input
            id="voice-name"
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            required
            placeholder="How you'd like to be named"
            style={{
              width: "100%",
              padding: "0.7rem 0.85rem",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="voice-role"
            style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "0.35rem" }}
          >
            Role or connection
          </label>
          <input
            id="voice-role"
            name="role_label"
            value={form.role_label}
            onChange={handleChange}
            placeholder="e.g. Scholarship recipient, volunteer"
            style={{
              width: "100%",
              padding: "0.7rem 0.85rem",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="voice-location"
          style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "0.35rem" }}
        >
          Where you&apos;re from
        </label>
        <input
          id="voice-location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="City, county, or region"
          style={{
            width: "100%",
            padding: "0.7rem 0.85rem",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label
          htmlFor="voice-quote"
          style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "0.35rem" }}
        >
          Your voice *{" "}
          <span style={{ fontWeight: 400, color: "var(--muted)" }}>
            ({form.quote.length}/600)
          </span>
        </label>
        <textarea
          id="voice-quote"
          name="quote"
          value={form.quote}
          onChange={handleChange}
          required
          maxLength={600}
          rows={4}
          placeholder="A sentence or two about what this work has meant to you, or what you hope for."
          style={{
            width: "100%",
            padding: "0.7rem 0.85rem",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            fontSize: "14px",
            lineHeight: 1.7,
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {status === "error" && (
        <p
          style={{
            fontSize: "13px",
            color: "#dc2626",
            marginBottom: "1rem",
            padding: "0.6rem 0.85rem",
            backgroundColor: "rgba(220,38,38,0.06)",
            borderRadius: "6px",
            border: "1px solid #fca5a5",
          }}
        >
          {errorMsg}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            padding: "0.75rem 1.75rem",
            backgroundColor: status === "submitting" ? "var(--line)" : "var(--orange)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: status === "submitting" ? "not-allowed" : "pointer",
          }}
        >
          {status === "submitting" ? "Submitting…" : "Share your voice"}
        </button>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
          All submissions are reviewed before appearing here.
        </p>
      </div>
    </form>
  );
}
