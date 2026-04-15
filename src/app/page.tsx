import Link from "next/link";

import { ContentImage } from "@/components/content-image";
import { HeroImage } from "@/components/hero-image";
import { PageSection } from "@/components/page-section";
import {
  foundationOverview,
  heroStats,
  homepageVisuals,
  impactMetrics,
  pillars,
  storyThemes,
} from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="home-hero home-hero-warm">
        <div className="home-hero-copy">
          <p className="section-label">Cheche Za Nuru Foundation</p>
          <h1>We help children move toward brighter futures.</h1>
          <p className="hero-summary">
            Cheche Za Nuru Foundation exists to inspire hope and transform lives
            through education, healthcare, and sports development, while
            nurturing leadership and community empowerment.
          </p>
          <p className="hero-emphasis">
            Support children with better access to learning, care, and structured
            opportunity.
          </p>
          <div className="hero-actions">
            <Link className="primary-button hero-orange" href="/donate">
              Make a Donation
            </Link>
            <Link className="secondary-link" href="/about">
              Learn more about our work
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-shape hero-shape-yellow" aria-hidden="true" />
          <div className="hero-shape hero-shape-orange" aria-hidden="true" />
          <div className="hero-dashes" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <HeroImage
            src={homepageVisuals.hero.src}
            alt={homepageVisuals.hero.alt}
            preload
            sizes="(max-width: 900px) 100vw, 46vw"
            className="hero-image-frame"
            speed={34}
          />
        </div>
      </section>

      <section className="stats-ribbon">
        {heroStats.map((stat) => (
          <article key={stat.label} className="stats-ribbon-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <PageSection
        label="Who We Are"
        title="Cheche Za Nuru exists to walk with children toward brighter futures."
        body="Our work is rooted in the belief that every child deserves access to learning, care, encouragement, and the chance to grow into their full potential."
      >
        <div className="overview-and-images">
          <div className="homepage-editorial">
            <article className="editorial-intro">
              <p>
                Cheche Za Nuru brings education, healthcare, and youth
                development into one shared journey so children are supported in
                the places that shape their future most.
              </p>
            </article>

            <div className="editorial-columns">
              {foundationOverview.map((item, index) => (
                <article
                  key={item.title}
                  className={index === 0 ? "editorial-block editorial-block-featured" : "editorial-block"}
                >
                  <p className="card-label">{item.title}</p>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="spotlight-grid">
            {homepageVisuals.spotlight.map((image, index) => (
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

      <PageSection
        label="Our Focus"
        title="Education, healthcare, and sports remain the center of gravity."
      >
        <div className="service-grid">
          {pillars.map((pillar, index) => (
            <article key={pillar.title} className="service-card">
              <div className={`service-icon service-icon-${index + 1}`} aria-hidden="true" />
              <p className="card-label">{pillar.eyebrow}</p>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Impact Snapshot"
        title="Our impact reflects lives supported, opportunities opened, and hope restored."
        tone="dark"
      >
        <div className="impact-storyband">
          <div className="metric-grid">
            {impactMetrics.map((metric) => (
              <article key={metric.label} className="metric-panel">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>

          <div className="mini-gallery">
            {homepageVisuals.gallery.slice(0, 2).map((image) => (
              <div key={image.src} className="mini-gallery-card">
                <ContentImage
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 900px) 100vw, 22vw"
                />
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection
        label="Stories and Community"
        title="Our stories reflect the communities, children, and journeys at the heart of this work."
      >
        <div className="stories-feature">
          <div className="three-column-grid">
            {storyThemes.map((theme) => (
              <article key={theme.title} className="content-card">
                <h3>{theme.title}</h3>
                <p>{theme.body}</p>
              </article>
            ))}
          </div>

          <div className="photo-strip">
            {homepageVisuals.gallery.slice(2).map((image) => (
              <div key={image.src} className="photo-strip-card">
                <ContentImage
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}
