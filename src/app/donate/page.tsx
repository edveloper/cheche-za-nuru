import type { Metadata } from "next";

import { DonationForm } from "@/components/donation-form";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { contactDetails, givingTiers, pageVisuals, programs } from "@/data/site";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description:
    "Give once or monthly to Cheche Za Nuru and choose where it goes: school scholarships, community health outreach or youth sport for children in Kenya.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <>
      <PageIntro
        label="Donate"
        title="Keep a Child in Class, Well and Playing"
        body="Choose an amount, a programme and how often. Once or monthly, it all goes to the work."
        photo={pageVisuals.donate}
      />

      <section className="tiers" aria-labelledby="tiers-heading">
        <h2 id="tiers-heading">What Your Gift Does</h2>
        <ul className="tier-list">
          {givingTiers.map((tier) => (
            <li key={tier.amount} className="tier">
              <strong>{tier.amount}</strong>
              <span>{tier.buys}</span>
            </li>
          ))}
        </ul>
        <p className="tier-note">
          A scholarship covers tuition, admission fees, assessment books, textbooks and
          uniform. Scholarship supporters get a progress card every quarter.
        </p>
      </section>

      <PageSection label="Give" title="Your Gift">
        <div className="action-grid">
          <DonationForm />

          <aside className="reading-panel side-note">
            <p className="card-label">Where It Can Go</p>
            {programs.map((programme) => (
              <div key={programme.slug} className="support-card">
                <h3>{programme.title}</h3>
                <p>{programme.summary}</p>
              </div>
            ))}

            <div className="support-card support-card-accent">
              <p className="card-label">Giving a Larger Amount?</p>
              <p>
                For sponsorships, company giving or anything over a few hundred dollars, email{" "}
                <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a> and
                we&apos;ll talk it through.
              </p>
            </div>
          </aside>
        </div>
      </PageSection>
    </>
  );
}
