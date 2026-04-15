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

    setContactStatus("Thank you. Your message has been received and we will get back to you soon.");
  }

  return (
    <div className="action-grid">
      <article className="form-panel donation-panel">
        <p className="section-label">Donation</p>
        <h3>Use the dedicated donation flow</h3>
        <p className="panel-copy">
          Donation intent now has its own route so supporters can choose a fund,
          set an amount, and tell us whether support is one-time or recurring.
        </p>
        <div className="support-stack">
          <p className="field-help">
            Choose support for education, healthcare, sports, or wherever the
            need is greatest.
          </p>
          <p className="field-help">
            Leave contact details so the team can follow up with the right next
            payment or partnership step.
          </p>
        </div>
        <div className="panel-actions">
          <Link className="primary-button" href="/donate">
            Go to Donate
          </Link>
          <Link className="text-link" href="/get-involved">
            Explore other ways to help
          </Link>
        </div>
      </article>

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
        <p className="section-label">Contact</p>
        <h3>Start a conversation</h3>
        <p className="panel-copy">
          Reach out about volunteering, partnerships, donations, media requests, or
          any other way you would like to be involved.
        </p>

        <label className="field field-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>

        <div className="form-row">
          <label className="field">
            <span>First name</span>
            <input name="firstName" type="text" placeholder="First name" required />
          </label>

          <label className="field">
            <span>Last name</span>
            <input name="lastName" type="text" placeholder="Last name" />
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            <span>Email address</span>
            <input name="email" type="email" placeholder="you@email.com" required />
          </label>

          <label className="field">
            <span>Phone number</span>
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
            placeholder="Tell us how you'd like to get involved."
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
