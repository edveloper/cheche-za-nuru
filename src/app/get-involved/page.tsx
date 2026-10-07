import type { Metadata } from "next";
import Link from "next/link";

import { InvolvementForm } from "@/components/involvement-form";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { involvementDetails, involvementOptions, pageVisuals } from "@/data/site";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Get Involved",
  description:
    "Donate, volunteer as a mentor, clinician or coach, or partner with Cheche Za Nuru to support children's education, health and sport in Kenya.",
  path: "/get-involved",
});

export default function GetInvolvedPage() {
  return (
    <>
      <PageIntro
        label="Get Involved"
        title="Pitch In"
        body="Give, volunteer or partner. Pick whichever suits you, or all three."
        photo={pageVisuals.involved}
      />

      <section className="help-grid" aria-label="Ways to help">
        {involvementOptions.map((option) => (
          <Link key={option.title} href={option.href} className="help-card">
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <span className="card-arrow" aria-hidden="true">
              {option.cta} →
            </span>
          </Link>
        ))}
      </section>

      <PageSection id="involvement-form" label="Start Here" title="Tell Us What You Have in Mind">
        <div className="action-grid">
          <InvolvementForm />

          <aside className="reading-panel side-note">
            <p className="card-label">Good to Know</p>
            <p>
              Volunteering, sponsorship, partnerships, donated equipment, press: this form
              covers all of it.
            </p>
            <p>If it&apos;s money you&apos;d like to give, the donate page is quicker.</p>
            <Link className="text-link" href="/donate">
              Go to Donate →
            </Link>
          </aside>
        </div>
      </PageSection>

      <PageSection label="Who Helps" title="Anyone Can">
        <div className="three-column-grid">
          {involvementDetails.map((detail) => (
            <article key={detail.title} className="content-card">
              <h3>{detail.title}</h3>
              <p>{detail.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
