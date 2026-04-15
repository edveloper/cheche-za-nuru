"use client";

import { useState, useTransition } from "react";

const donationAmounts = [5, 10, 20, 50, 100, 200, 500, 1000];

const interestOptions = [
  "Volunteering",
  "Corporate Partnership",
  "Donating",
  "Media & Press",
  "General Enquiry",
];

const programOptions = [
  "Support where it's needed most",
  "Education - Nuru Scholars Program",
  "Healthcare - Afya Kwa Wote",
  "Sports - Rising Stars League",
];

export function ActionPanels() {
  const [donationStatus, setDonationStatus] = useState<string | null>(null);
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [isDonationPending, startDonationTransition] = useTransition();
  const [isContactPending, startContactTransition] = useTransition();

  async function submitDonation(formData: FormData) {
    setDonationStatus(null);

    const amount = Number(formData.get("amount"));

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        purpose: formData.get("purpose"),
        donorName: formData.get("donorName"),
        donorEmail: formData.get("donorEmail"),
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setDonationStatus(result.error ?? "Unable to submit donation intent.");
      return;
    }

    setDonationStatus("Thank you. Your donation enquiry has been received and we will follow up with the next step.");
  }

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
      <form
        className="form-panel donation-panel"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          startDonationTransition(() => {
            void submitDonation(formData);
          });
        }}
      >
        <p className="section-label">Donation</p>
        <h3>Make a contribution</h3>
        <p className="panel-copy">
          Choose a contribution amount, tell us where you would like your support to
          go, and leave your details so we can follow up with the next step.
        </p>

        <div className="amount-grid">
          {donationAmounts.map((amount) => (
            <button
              key={amount}
              className={selectedAmount === amount ? "amount-button active" : "amount-button"}
              type="button"
              onClick={() => setSelectedAmount(amount)}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Amount (USD)</span>
          <input
            name="amount"
            type="number"
            min="1"
            value={selectedAmount}
            onChange={(event) => setSelectedAmount(Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Purpose</span>
          <select name="purpose" defaultValue={programOptions[0]}>
            {programOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Your name</span>
          <input name="donorName" type="text" placeholder="Full name" required />
        </label>

        <label className="field">
          <span>Email address</span>
          <input name="donorEmail" type="email" placeholder="you@email.com" required />
        </label>

        <button className="primary-button button-full" type="submit" disabled={isDonationPending}>
          {isDonationPending ? "Sending..." : "Share Donation Intent"}
        </button>

        {donationStatus ? <p className="status-text">{donationStatus}</p> : null}
      </form>

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
