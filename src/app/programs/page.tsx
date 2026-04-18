import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { ProgramsCalendar } from "@/components/programs-calendar";
import {
  pageVisuals,
  pillars,
  programApproach,
  programNarrative,
  programs,
} from "@/data/site";
import { getProgramEvents } from "@/lib/program-content";

export default async function ProgramsPage() {
  // Fetch program events from Supabase, falls back to hardcoded data
  const liveEvents = await getProgramEvents({ includePast: false });

  // Convert to format expected by ProgramsCalendar component
  const calendarEvents = liveEvents.map((event) => ({
    title: event.title,
    program: event.programType as "education" | "healthcare" | "sports",
    date: event.startDate.split("T")[0], // Extract YYYY-MM-DD from ISO date
    location: event.location,
    summary: event.summary,
  }));

  return (
    <>
      <PageIntro
        label="Programs"
        title="Programs that support learning, health, and growth."
        body="Our work is organized around three connected pillars that respond to the real needs children face in their daily lives."
        aside="Through education, healthcare, and sports development, Cheche Za Nuru seeks to create stronger pathways toward confidence, opportunity, and community transformation."
      />

      <section className="section-image-banner">
        <ContentImage
          src={pageVisuals.programs.src}
          alt={pageVisuals.programs.alt}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="Our Program Areas"
        title="Three pillars shape how the foundation supports children."
        body="The work is organized so that learning, wellbeing, and personal development reinforce one another instead of being treated as separate tracks."
      >
        <div className="reading-stack reading-panel programs-intro-panel">
          {programNarrative.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
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
        label="Calendar"
        title="Upcoming dates make the work feel tangible and close."
        body="These dates highlight moments when the foundation gathers around learning, outreach, and youth development. They help visitors see how the work unfolds across the year."
        tone="tint"
      >
        <ProgramsCalendar events={calendarEvents} />
      </PageSection>

      <PageSection
        label="Program Details"
        title="Each initiative responds to a different part of a child's journey."
        body="The details below show how each program area turns the broader mission into direct support, structured opportunity, and practical care."
      >
        <div className="stacked-grid">
          {programs.map((program) => (
            <article key={program.title} className="feature-row">
              <div>
                <p className="card-label">{program.eyebrow}</p>
                <h3>{program.title}</h3>
              </div>
              <p>{program.description}</p>
              <ul>
                {program.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Our Approach"
        title="The work is designed to open doors, stay present, and nurture potential."
        body="Across all three pillars, the foundation is trying to build continuity around children rather than isolated moments of support."
      >
        <div className="three-column-grid">
          {programApproach.map((item) => (
            <article key={item.title} className="content-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
