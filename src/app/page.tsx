import type { Metadata } from "next";
import Link from "next/link";

import { ContentImage } from "@/components/content-image";
import { CtaBand } from "@/components/cta-band";
import { ImpactMetrics } from "@/components/impact-metrics";
import { JsonLd } from "@/components/json-ld";
import { PageSection } from "@/components/page-section";
import {
  bootsAppeal,
  fieldPhotos,
  founderStory,
  givingTiers,
  involvementOptions,
  outOfSchoolStat,
  pageVisuals,
  photos,
  programs,
  scholarshipSteps,
  whyWeExist,
} from "@/data/site";
import { getImpactMetrics } from "@/lib/impact-content";
import { getProgramEvents } from "@/lib/program-content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getStoryPosts, getVoiceSnippets } from "@/lib/story-content";
import { toTitleCase } from "@/lib/title-case";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // Page-level openGraph replaces the layout's, so restate the shared fields.
  openGraph: {
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

const eventDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export default async function Home() {
  const [metrics, events, posts, voices] = await Promise.all([
    getImpactMetrics(),
    getProgramEvents({ limit: 3 }),
    getStoryPosts(),
    getVoiceSnippets(),
  ]);
  const latestPosts = posts.slice(0, 3);
  const featuredVoice = voices[0];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NGO",
          name: siteConfig.name,
          alternateName: siteConfig.shortName,
          url: siteConfig.url,
          logo: absoluteUrl(siteConfig.logoPath),
          description: siteConfig.description,
          email: siteConfig.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.address.locality,
            addressCountry: siteConfig.address.country,
          },
          areaServed: { "@type": "Place", name: "Kibera, Nairobi, Kenya" },
          sameAs: siteConfig.sameAs,
        }}
      />

      <section className="hero">
        <div className="hero-copy">
          <p className="section-label">Cheche Za Nuru Foundation</p>
          <h1>School, a Check-Up and a Game of Football</h1>
          <p className="hero-lede">
            Three things every child should be able to count on. In Kibera, too many
            can&apos;t. <em>Cheche za nuru</em>{" "}means &ldquo;sparks of light&rdquo;: we pay
            school fees, cover clinic bills, put food on the table and run a football club, so
            children stay in class, stay well and stay in the game.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/donate">
              Donate
            </Link>
            <Link className="secondary-link" href="/programs">
              See What We Do
            </Link>
          </div>
        </div>
        <ContentImage
          src={pageVisuals.home.src}
          alt={pageVisuals.home.alt}
          preload
          sizes="(max-width: 900px) 100vw, 52vw"
          className="hero-media"
        />
      </section>

      <ImpactMetrics metrics={metrics} />

      <section className="why">
        <div className="why-copy">
          <p className="section-label">Why We Exist</p>
          <h2>{whyWeExist.heading}</h2>
          {whyWeExist.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="why-stat">
          <strong data-count-up>{outOfSchoolStat.value}</strong>
          <span>{outOfSchoolStat.label}</span>
          <a href={outOfSchoolStat.sourceUrl} target="_blank" rel="noreferrer">
            Source: {outOfSchoolStat.sourceLabel}
          </a>
        </aside>
      </section>

      <PageSection label="What We Do" title="Classroom, Clinic and Pitch">
        <div className="programme-cards">
          {programs.map((programme) => (
            <Link
              key={programme.slug}
              href={`/programs#${programme.slug}`}
              className="programme-card"
            >
              <ContentImage
                src={programme.photo.src}
                alt={programme.photo.alt}
                sizes="(max-width: 900px) 100vw, 33vw"
                className="programme-card-photo"
              />
              <div className="programme-card-body">
                <p className="card-label">{programme.eyebrow}</p>
                <h3>
                  {programme.title}
                  {programme.translation ? (
                    <span className="programme-translation"> ({programme.translation})</span>
                  ) : null}
                </h3>
                <p>{programme.summary}</p>
                <span className="card-arrow" aria-hidden="true">
                  Read More <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>

      <section className="scholarship" aria-labelledby="scholarship-heading">
        <div className="scholarship-intro">
          <p className="section-label">Nuru Scholars</p>
          <h2 id="scholarship-heading">How a Scholarship Works</h2>
          <p>
            We call it a scholarship, not a sponsorship. Support comes with expectations on
            both sides, and that&apos;s the point.
          </p>
        </div>
        <ol className="step-list">
          {scholarshipSteps.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="tier-strip">
          <p className="tier-strip-label">What Your Gift Does</p>
          <ul className="tier-strip-list">
            {givingTiers.map((tier) => (
              <li key={tier.amount}>
                <strong>{tier.amount}</strong>
                <span>{tier.buys}</span>
              </li>
            ))}
          </ul>
          <Link className="primary-button" href="/donate">
            Fund a Scholarship
          </Link>
        </div>
      </section>

      <section className="appeal full-bleed" aria-labelledby="appeal-heading">
        <div className="appeal-inner">
        <ContentImage
          src={photos.sparkFc.src}
          alt={photos.sparkFc.alt}
          sizes="(max-width: 1000px) 100vw, 45vw"
          className="appeal-photo"
        />
        <div className="appeal-panel">
          <p className="appeal-label">{bootsAppeal.label}</p>
          <h2 id="appeal-heading">{bootsAppeal.heading}</h2>
          {bootsAppeal.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link className="primary-button" href="/donate">
            {bootsAppeal.cta}
          </Link>
        </div>
        </div>
      </section>

      <section className="story-feature" aria-labelledby="story-heading">
        <ContentImage
          src={photos.doctorChecksToddler.src}
          alt={photos.doctorChecksToddler.alt}
          sizes="(max-width: 1000px) 100vw, 45vw"
          className="story-feature-photo"
        />
        <div className="story-feature-copy">
          <p className="section-label">From Rene&apos;s Notebook</p>
          <h2 id="story-heading">725 Shillings</h2>
          <p>{founderStory.context}</p>
          <blockquote>&ldquo;{founderStory.quote}&rdquo;</blockquote>
          <p className="story-feature-attribution">{founderStory.attribution}</p>
          <p>
            That&apos;s why there&apos;s a medical budget. A few dollars, on the right day, is
            sometimes the whole difference.
          </p>
          <Link className="text-link" href="/about">
            Meet Rene <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {featuredVoice ? (
        <figure className="voice-feature">
          <blockquote>&ldquo;{featuredVoice.quote}&rdquo;</blockquote>
          <figcaption>
            <strong>{featuredVoice.displayName}</strong>
            <span>
              {[featuredVoice.roleLabel, featuredVoice.location].filter(Boolean).join(", ")}
            </span>
          </figcaption>
        </figure>
      ) : null}

      <PageSection label="In Kibera" title="Where the Work Happens">
        <ul className="field-strip">
          {fieldPhotos.map((photo) => (
            <li key={photo.src}>
              <figure>
                <ContentImage
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
                  className="field-strip-photo"
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </PageSection>

      {events.length ? (
        <PageSection label="Coming Up" title="Dates for the Diary">
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.slug} className="event-row">
                <time dateTime={event.startDate}>
                  {eventDate.format(new Date(event.startDate))}
                </time>
                <div>
                  <h3>{toTitleCase(event.title)}</h3>
                  <p>{[event.location, event.summary].filter(Boolean).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link className="text-link" href="/programs#calendar">
            Full Calendar <span className="arrow">→</span>
          </Link>
        </PageSection>
      ) : null}

      {latestPosts.length ? (
        <PageSection label="From the Field" title="Latest Stories">
          <div className="blog-grid">
            {latestPosts.map((story) => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className="story-post-card">
                {story.coverImagePath ? (
                  <div className="story-post-cover">
                    <ContentImage
                      src={story.coverImagePath}
                      alt=""
                      sizes="(max-width: 780px) 100vw, 30vw"
                    />
                  </div>
                ) : null}
                <small className="meta-line">{story.publishedAt}</small>
                <h3>{toTitleCase(story.title)}</h3>
                <p>{story.excerpt}</p>
              </Link>
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageSection label="Get Involved" title="Three Ways to Pitch In">
        <div className="help-grid">
          {involvementOptions.map((option) => (
            <Link key={option.title} href={option.href} className="help-card">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <span className="card-arrow" aria-hidden="true">
                {option.cta} <span className="arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </PageSection>

      <CtaBand
        heading="Keep a Child in Class This Term"
        body="Give once or every month, and choose the programme your gift goes to."
      />
    </>
  );
}
