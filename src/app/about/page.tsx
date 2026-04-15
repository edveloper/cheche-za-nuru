import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import {
  aboutJourney,
  foundationOverview,
  missionVision,
  operatingPrinciples,
  pageVisuals,
  values,
} from "@/data/site";

export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About Us"
        title="A journey of hope, support, and possibility."
        body="Cheche Za Nuru Foundation works to inspire hope and transform lives by expanding access to education, healthcare, and sports development for children and young people."
        aside="We believe that when children are supported in the classroom, in their health, and in their personal growth, they are better placed to build brighter futures for themselves and their communities."
      />

      <section className="page-photo-hero">
        <ContentImage
          src={pageVisuals.aboutHero.src}
          alt={pageVisuals.aboutHero.alt}
          sizes="100vw"
          className="page-photo-hero-image"
        />
      </section>

      <PageSection
        label="Our Story"
        title="Cheche Za Nuru exists to walk with children on the journey toward a better future."
      >
        <div className="journey-grid journey-grid-featured">
          {aboutJourney.map((step) => (
            <article key={step.title} className="journey-card">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Who We Are"
        title="Our work is grounded in dignity, access, and long-term growth."
      >
        <div className="overview-and-images">
          <div className="reading-stack reading-panel">
            {foundationOverview.map((item) => (
              <div key={item.title} className="reading-item">
                <p className="card-label">{item.title}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="spotlight-grid">
            {pageVisuals.aboutJourney.map((image, index) => (
              <div
                key={image.src}
                className={index === 0 ? "spotlight-card spotlight-card-large" : "spotlight-card"}
              >
                <ContentImage
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 900px) 100vw, 24vw"
                />
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection label="Mission and Vision" title="Our mission guides the work we do every day.">
        <div className="two-column-grid">
          <article className="content-card">
            <p className="card-label">Mission</p>
            <h3>What we are called to do</h3>
            <p>{missionVision.mission}</p>
          </article>
          <article className="content-card">
            <p className="card-label">Vision</p>
            <h3>The future we are working toward</h3>
            <p>{missionVision.vision}</p>
          </article>
        </div>
      </PageSection>

      <PageSection label="Our Values" title="Our work is shaped by the values we carry into every community.">
        <div className="value-grid">
          {values.map((value) => (
            <article key={value} className="value-card">
              <h3>{value}</h3>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="How We Work"
        title="We bring education, healthcare, and sports together because children need whole support."
      >
        <div className="three-column-grid">
          {operatingPrinciples.map((principle) => (
            <article key={principle.title} className="content-card">
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
