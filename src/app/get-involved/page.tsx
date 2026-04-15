import Link from "next/link";

import { ParallaxImage } from "@/components/parallax-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { involvementDetails, involvementOptions, pageVisuals } from "@/data/site";

export default function GetInvolvedPage() {
  return (
    <>
      <PageIntro
        label="Get Involved"
        title="Stand with children and families in practical ways."
        body="There are many ways to support the work of Cheche Za Nuru, from giving and volunteering to building partnerships that strengthen programs over time."
        aside="Every act of support helps create more room for children to learn, stay healthy, and grow into their potential."
      />

      <section className="section-image-banner">
        <ParallaxImage
          src={pageVisuals.involved.src}
          alt={pageVisuals.involved.alt}
          sizes="100vw"
          className="section-image-banner-card"
          speed={20}
        />
      </section>

      <PageSection
        label="Ways to Support"
        title="Give, volunteer, or partner with us."
      >
        <div className="three-column-grid">
          {involvementOptions.map((option) => (
            <article key={option.title} className="content-card">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <Link className="text-link" href="/contact">
                Start the conversation
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Who Can Be Part of This"
        title="Support can come from individuals, institutions, and advocates."
      >
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
