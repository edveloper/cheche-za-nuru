import type { Metadata } from "next";

import { ContentImage } from "@/components/content-image";
import { CtaBand } from "@/components/cta-band";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { ProgramsCalendar } from "@/components/programs-calendar";
import { contactDetails, pageVisuals, programApproach, programs } from "@/data/site";
import { getProgramEvents } from "@/lib/program-content";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Programmes for Children in Kibera",
  description:
    "How Cheche Za Nuru Foundation helps children in Kibera stay in school, stay healthy and keep playing, through Nuru Scholars, Afya Kwa Wote and the Rising Stars League.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const liveEvents = await getProgramEvents({ includePast: false });

  const calendarEvents = liveEvents.map((event) => ({
    title: event.title,
    program: event.programType as "education" | "healthcare" | "sports",
    date: event.startDate.split("T")[0],
    location: event.location,
    summary: event.summary,
  }));

  return (
    <>
      <PageIntro
        label="Programmes"
        title="Classroom, Clinic and Pitch"
        body="Our work with children in Kibera runs through three programmes. Each one covers a gap that free schooling and public services leave open."
        photo={pageVisuals.programs}
      />

      <PageSection label="Why It Matters" title="Growing Up in Kibera">
        <div className="section-heading">
          <p className="section-body">
            Kibera is the largest informal settlement in East Africa. Free primary education gets its children
            through the school gate, but it doesn&apos;t buy the uniform, the books or the exam fee, and with most
            adults out of work there is seldom money for the clinic when malaria comes. A week&apos;s medicine can
            cost a week&apos;s wages.
          </p>
          <p className="section-body">
            Each programme below closes one of those gaps, for the same children, so that a child who is in class
            is also well enough to learn and has somewhere to play after the bell.
          </p>
        </div>
      </PageSection>

      <section className="programme-rows" aria-label="Our programmes">
        {programs.map((programme, index) => (
          <article
            key={programme.slug}
            id={programme.slug}
            className={index % 2 ? "programme-row programme-row-reverse" : "programme-row"}
          >
            <ContentImage
              src={programme.photo.src}
              alt={programme.photo.alt}
              sizes="(max-width: 900px) 100vw, 45vw"
              className="programme-row-photo"
            />
            <div className="programme-row-copy">
              <p className="card-label">{programme.eyebrow}</p>
              <h2>
                {programme.title}
                {programme.translation ? (
                  <span className="programme-translation"> ({programme.translation})</span>
                ) : null}
              </h2>
              <p>{programme.description}</p>
              <ul className="tick-list">
                {programme.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <PageSection
        id="calendar"
        label="What's On"
        title="Dates for the Diary"
        body="Outreach days, mentorship forums and match days."
        tone="tint"
      >
        {calendarEvents.length ? (
          <ProgramsCalendar events={calendarEvents} />
        ) : (
          <p className="empty-note">
            Nothing public on the calendar right now. New dates go up here and on our{" "}
            <a href={contactDetails.socials[1].href} target="_blank" rel="noreferrer">
              Instagram
            </a>
            .
          </p>
        )}
      </PageSection>

      <PageSection label="How We Work" title="Three Rules We Keep">
        <div className="three-column-grid">
          {programApproach.map((item) => (
            <article key={item.title} className="content-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <CtaBand
        heading="Fund a Programme"
        body="Choose education, healthcare or sport when you give, or let us put it where it's needed most."
        secondaryText="Other Ways to Support"
      />
    </>
  );
}
