import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { ImpactMetrics } from "@/components/impact-metrics";
import { ImpactVisualizations } from "@/components/impact-visualizations";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { impactCountyPressure, impactDomainViews, pageVisuals } from "@/data/site";
import { getImpactMetrics } from "@/lib/impact-content";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Our Impact",
  description:
    "Children reached by Cheche Za Nuru's education, health and sport programmes, set against UNICEF figures on child poverty, schooling and nutrition in Kenya.",
  path: "/impact",
});

export default async function ImpactPage() {
  const metrics = await getImpactMetrics();

  return (
    <>
      <PageIntro
        label="Impact"
        title="The Numbers, Honestly"
        body="Kenya's problems are big. Our work is still small. Both are true, and you'll find both on this page."
        photo={pageVisuals.impact}
      />

      <ImpactMetrics metrics={metrics} heading="Our Work So Far" />

      <PageSection
        label="The National Picture"
        title="What Children in Kenya Are Up Against"
        body="Figures from UNICEF Kenya and Generation Unlimited. Each one links to its source."
      >
        <ImpactVisualizations domains={impactDomainViews} countyPressure={impactCountyPressure} />
      </PageSection>

      <CtaBand
        heading="Help Us Move Our Numbers"
        body="Every scholarship, clinic day and season of football starts with someone choosing to give."
      />
    </>
  );
}
