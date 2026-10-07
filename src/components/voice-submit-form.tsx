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
      <div className="form-panel voice-form">
        <h3>Thank You</h3>
        <p className="panel-copy">
          We&apos;ve got your story. Once it&apos;s been reviewed, it may appear on this page.
        </p>
        <button className="secondary-link" type="button" onClick={() => setStatus("idle")}>
          Share Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-panel voice-form">
      {/* Honeypot — hidden from real users */}
      <label className="field field-honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <div className="form-row">
        <label className="field">
          <span>Your Name *</span>
          <input
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            required
            placeholder="How you'd like to be named"
          />
        </label>
        <label className="field">
          <span>Role or Connection</span>
          <input
            name="role_label"
            value={form.role_label}
            onChange={handleChange}
            placeholder="e.g. Scholar, parent, volunteer"
          />
        </label>
      </div>

      <label className="field">
        <span>Where You&apos;re From</span>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Town or county"
        />
      </label>

      <label className="field">
        <span>
          Your Story * <small className="field-count">({form.quote.length}/600)</small>
        </span>
        <textarea
          name="quote"
          value={form.quote}
          onChange={handleChange}
          required
          maxLength={600}
          rows={4}
          placeholder="A sentence or two is plenty."
        />
      </label>

      {status === "error" ? <p className="status-text status-error">{errorMsg}</p> : null}

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Share My Story"}
        </button>
        <p className="field-help">Every submission is reviewed before it appears here.</p>
      </div>
    </form>
  );
}
