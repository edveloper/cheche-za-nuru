"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

const interestOptions = [
  "Volunteering",
  "Corporate Partnership",
  "Donating",
  "Media & Press",
  "General Enquiry",
];

export function ActionPanels() {
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [isContactPending, startContactTransition] = useTransition();

  async function submitContact(formData: FormData) {
    setContactStatus(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        interest: formData.get("interest"),
        message: formData.get("message"),
        website: formData.get("website"),
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setContactStatus(result.error ?? "Unable to send message right now.");
      return;
    }

    setContactStatus("Thank you. We've got your message and will reply by email.");
  }

  return (
    <div className="action-grid">
      <aside className="reading-panel side-note">
        <p className="card-label">Quicker Routes</p>
        <p>
          <strong>Want to give?</strong> The donate page takes a minute.
        </p>
        <Link className="text-link" href="/donate">
          Donate →
        </Link>
        <p>
          <strong>Want to volunteer or partner?</strong> The get involved form goes straight
          to the right person.
        </p>
        <Link className="text-link" href="/get-involved#involvement-form">
          Get Involved →
        </Link>
      </aside>

      <form
        className="form-panel"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          startContactTransition(() => {
            void submitContact(formData);
          });
        }}
      >
        <p className="section-label">Message</p>
        <h3>Say Hello</h3>

        <label className="field field-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>

        <div className="form-row">
          <label className="field">
            <span>First Name</span>
            <input name="firstName" type="text" placeholder="First name" required />
          </label>

          <label className="field">
            <span>Last Name</span>
            <input name="lastName" type="text" placeholder="Last name" />
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

        <label className="field">
          <span>Interest</span>
          <select name="interest" defaultValue={interestOptions[0]}>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Message</span>
          <textarea
            name="message"
            placeholder="What can we help with?"
            rows={6}
            required
          />
        </label>

        <button className="primary-button button-full" type="submit" disabled={isContactPending}>
          {isContactPending ? "Sending..." : "Send Message"}
        </button>

        {contactStatus ? <p className="status-text">{contactStatus}</p> : null}
      </form>
    </div>
  );
}
