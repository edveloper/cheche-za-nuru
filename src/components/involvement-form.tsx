"use client";

import { useState, useTransition } from "react";

const interestOptions = [
  { value: "volunteer", label: "Volunteer" },
  { value: "partner", label: "Partner" },
  { value: "sponsor", label: "Sponsor" },
  { value: "in_kind", label: "In-Kind Support" },
  { value: "media", label: "Media or Press" },
  { value: "other", label: "Other" },
];

const supportAreas = [
  "Education",
  "Healthcare",
  "Sports",
  "Community support",
  "Operations and logistics",
  "Flexible support",
];

const budgetRanges = [
  "Not sure yet",
  "Under $250",
  "$250 - $1,000",
  "$1,000 - $5,000",
  "$5,000+",
  "Non-financial support",
];

export function InvolvementForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, startSubmission] = useTransition();

  async function submitLead(formData: FormData) {
    setStatus(null);

    const response = await fetch("/api/involvement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interestType: formData.get("interestType"),
        organizationName: formData.get("organizationName"),
        contactName: formData.get("contactName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
        supportArea: formData.get("supportArea"),
        budgetRange: formData.get("budgetRange"),
        message: formData.get("message"),
        website: formData.get("website"),
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Unable to submit involvement request right now.");
      return;
    }

    setStatus(
      "Thank you. We've got your message and will be in touch.",
    );
  }

  return (
    <form
      className="form-panel"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startSubmission(() => {
          void submitLead(formData);
        });
      }}
    >
      <p className="section-label">Get Involved</p>
      <h3>Tell Us How You&apos;d Like to Help</h3>
      <p className="panel-copy">
        A few lines is plenty. We&apos;ll pass it to the right person on the team.
      </p>

      <label className="field field-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="field">
        <span>Type of Support</span>
        <select name="interestType" defaultValue="volunteer" required>
          {interestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label className="field">
          <span>Contact Name</span>
          <input name="contactName" type="text" placeholder="Full name" required />
        </label>

        <label className="field">
          <span>Organisation</span>
          <input name="organizationName" type="text" placeholder="Optional" />
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span>Email Address</span>
          <input name="email" type="email" placeholder="you@email.com" required />
        </label>

        <label className="field">
          <span>Phone Number</span>
          <input name="phone" type="tel" placeholder="+254 700 000 000" />
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span>Location</span>
          <input name="location" type="text" placeholder="City, country" />
        </label>

        <label className="field">
          <span>Primary Support Area</span>
          <select name="supportArea" defaultValue={supportAreas[0]}>
            {supportAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Budget or Support Range</span>
        <select name="budgetRange" defaultValue={budgetRanges[0]}>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={6}
          placeholder="What you have in mind, and roughly when you could start."
        />
      </label>

      <button className="primary-button button-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Submit Involvement Request"}
      </button>

      {status ? <p className="status-text">{status}</p> : null}
    </form>
  );
}
