import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/cta-band";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { contactDetails, givingTiers, photos, scholarshipSteps, whyWeExist } from "@/data/site";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Sponsor a Child's Education in Kibera",
  description:
    "Sponsor a child's education in Kibera. $25 a month covers a partial scholarship, $50 a full one with fees, books and uniform, and a progress card every quarter.",
  path: "/sponsor-a-child",
});

// Only the scholarship amounts; the boots appeal lives on the home and donate pages.
const scholarshipTiers = givingTiers.filter((tier) => /scholarship/i.test(tier.buys));

export default function SponsorAChildPage() {
  return (
    <>
      <PageIntro
        label="Sponsor a Child"
        title="Sponsor a Child's Education in Kibera"
        body="A full scholarship costs $50 a month, or $600 a year paid at once, and covers tuition, admission fees, assessment books, textbooks and uniform. A partial scholarship is $25 a month. Every supporter gets a progress card each quarter."
        photo={photos.reneWithChildren}
      />

      <section className="tiers" aria-labelledby="sponsor-tiers-heading">
        <h2 id="sponsor-tiers-heading">What a Year of School Costs</h2>
        <ul className="tier-list">
          {scholarshipTiers.map((tier) => (
            <li key={tier.amount} className="tier">
              <strong>{tier.amount}</strong>
              <span>{tier.buys}</span>
            </li>
          ))}
        </ul>
        <p className="tier-note">
          The money goes to the costs that keep a child in class, paid to the school the family has
          chosen.
        </p>
      </section>

      <PageSection label="How It Works" title="How a Nuru Scholars Scholarship Works">
        <div className="three-column-grid">
          {scholarshipSteps.map((step) => (
            <article key={step.title} className="content-card">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection label="Why a Scholarship" title="Why We Call It a Scholarship" tone="tint">
        <div className="section-heading">
          <p className="section-body">
            We call it a scholarship on purpose. Scholars attend school regularly and share their reports,
            and we keep showing up for them and their families. It&apos;s a relationship that both sides
            keep, which is what makes it last beyond a single term.
          </p>
          <p className="section-body">{whyWeExist.paragraphs[0]}</p>
          <p className="section-body">
            Scholarships are one of three programmes. The others pay for clinic visits and medicine, and
            run a youth football club. <Link href="/programs">See all three programmes</Link>.
          </p>
        </div>
      </PageSection>

      <PageSection label="Larger Gifts" title="Sponsoring More Than One Child">
        <div className="section-heading">
          <p className="section-body">
            For several scholarships, company giving or anything over a few hundred dollars, email{" "}
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>{" "}and we&apos;ll talk it
            through.
          </p>
        </div>
      </PageSection>

      <CtaBand
        heading="Keep a Child in Class This Term"
        body="Choose the education programme when you give, once or monthly."
        primaryText="Sponsor a Scholar"
        secondaryText="Other Ways to Support"
      />
    </>
  );
}
