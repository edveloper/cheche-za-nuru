import { ContentImage } from "@/components/content-image";
import { ImpactVisualizations } from "@/components/impact-visualizations";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import {
  impactFrames,
  impactCountyPressure,
  impactDomainViews,
  impactMilestones,
  impactResponseComparisons,
  pageVisuals,
} from "@/data/site";
import { getImpactMetrics } from "@/lib/impact-content";

export default async function ImpactPage() {
  // Fetch impact metrics from Supabase, falls back to hardcoded data
  const liveMetrics = await getImpactMetrics();

  return (
    <>
      <PageIntro
        label="Impact"
        title="Every number points back to a life, a family, and a future."
        body="We work in a country where too many children are still pushed back by poverty, interrupted learning, nutrition pressures, and fragile pathways into opportunity."
        aside="What matters most is whether support reaches children where strain is highest, stays present long enough to matter, and opens room for a different future."
      />

      <section className="section-image-banner">
        <ContentImage
          src={pageVisuals.impact.src}
          alt={pageVisuals.impact.alt}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="National Picture"
        title="Across Kenya, the pressures shaping childhood are visible and measurable."
        body="Education, health, and youth development are deeply connected. When one area is strained, the others feel it too."
      >
        <ImpactVisualizations
          domains={impactDomainViews}
          countyPressure={impactCountyPressure}
          comparisons={impactResponseComparisons}
        />
      </PageSection>

      <PageSection
        label="CZN Response"
        title="Our response is still growing, but it is already reaching real children and families."
        body="These figures do not claim to solve the wider national challenge on their own. They show the scale of support we have already been able to place around children, caregivers, and communities."
        tone="dark"
      >
        <div className="metric-grid">
          {liveMetrics.map((metric) => (
            <article key={metric.slug} className="metric-panel">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="What Response Looks Like"
        title="Education, health, and sports answer different parts of the same challenge."
        body="We are strongest when these areas move together and reinforce one another in a child's life."
      >
        <div className="three-column-grid">
          {impactFrames.map((frame) => (
            <article key={frame.title} className="content-card">
              <h3>{frame.title}</h3>
              <p>{frame.body}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Progress Over Time"
        title="Progress is built through steady support, not isolated moments."
        body="Beyond headline numbers, what matters is the way support keeps showing up around children over time."
      >
        <div className="stacked-grid">
          {impactMilestones.map((item) => (
            <article key={item.title} className="feature-row">
              <div>
                <p className="card-label">{item.year}</p>
                <h3>{item.title}</h3>
              </div>
              <p>{item.body}</p>
              <div className="impact-visual-bar">
                <span className="impact-visual-bar-fill" />
              </div>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
