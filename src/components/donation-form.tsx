"use client";

import { useEffect, useState } from "react";

import type { DonationFundOption } from "@/lib/donation-funds";

const donationAmounts = [5, 10, 20, 50, 100, 200, 500, 1000];

const recurrenceOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

export function DonationForm() {
  const [funds, setFunds] = useState<DonationFundOption[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [selectedFund, setSelectedFund] = useState("support-where-needed-most");
  const [status, setStatus] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadFunds() {
      const response = await fetch("/api/donation-funds", { cache: "no-store" });
      const result = (await response.json()) as { funds?: DonationFundOption[] };

      if (!isActive || !result.funds?.length) {
        return;
      }

      const availableFunds = result.funds;
      setFunds(availableFunds);
      setSelectedFund((currentFund) => {
        const hasCurrentFund = availableFunds.some((fund) => fund.slug === currentFund);
        return hasCurrentFund ? currentFund : availableFunds[0]!.slug;
      });
    }

    void loadFunds();

    return () => {
      isActive = false;
    };
  }, []);

  const selectedFundDetails =
    funds.find((fund) => fund.slug === selectedFund) ?? null;

  async function submitDonation(formData: FormData) {
    setStatus(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(formData.get("amount")),
          fundId: selectedFundDetails?.id ?? null,
          fundSlug: selectedFund,
          purpose: selectedFundDetails?.name ?? "Support where it is needed most",
          donorName: formData.get("donorName"),
          donorEmail: formData.get("donorEmail"),
          donorPhone: formData.get("donorPhone"),
          donorMessage: formData.get("donorMessage"),
          isRecurring,
          recurrence: isRecurring ? formData.get("recurrence") : "one_time",
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(result.error ?? "Unable to submit donation intent.");
        return;
      }

      setStatus(
        "Thank you. We've got your pledge and will be in touch to complete it.",
      );
    } catch {
      setStatus("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="form-panel donation-panel"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void submitDonation(formData);
      }}
    >
      <p className="section-label">Pledge a Gift</p>
      <h3>How Much, Where and How Often</h3>
      <p className="panel-copy">
        Online payment isn&apos;t live yet. Pledge here and we&apos;ll get in touch
        to complete your gift.
      </p>

      <label className="field field-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

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
          required
        />
      </label>

      <label className="field">
        <span>Support Area</span>
        <select
          name="fundSlug"
          value={selectedFund}
          onChange={(event) => setSelectedFund(event.target.value)}
        >
          {funds.map((fund) => (
            <option key={fund.slug} value={fund.slug}>
              {fund.name}
            </option>
          ))}
        </select>
      </label>

      {selectedFundDetails ? (
        <p className="field-help">
          {selectedFundDetails.shortDescription} {selectedFundDetails.impactSummary}
        </p>
      ) : null}

      <label className="inline-toggle">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(event) => setIsRecurring(event.target.checked)}
        />
        <span>Make This a Recurring Gift</span>
      </label>

      {isRecurring ? (
        <label className="field">
          <span>Recurrence</span>
          <select name="recurrence" defaultValue="monthly">
            {recurrenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="form-row">
        <label className="field">
          <span>Your Name</span>
          <input name="donorName" type="text" placeholder="Full name" required />
        </label>

        <label className="field">
          <span>Email Address</span>
          <input name="donorEmail" type="email" placeholder="you@email.com" required />
        </label>
      </div>

      <label className="field">
        <span>Phone Number</span>
        <input name="donorPhone" type="tel" placeholder="+254 700 000 000" />
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="donorMessage"
          rows={5}
          placeholder="Anything we should know? In memory of someone, a specific need, a question."
        />
      </label>

      <button className="primary-button button-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Pledge My Gift"}
      </button>

      {status ? <p className="status-text">{status}</p> : null}
    </form>
  );
}
