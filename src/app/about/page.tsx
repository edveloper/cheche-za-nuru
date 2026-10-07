import type { Metadata } from "next";

import { ContentImage } from "@/components/content-image";
import { CtaBand } from "@/components/cta-band";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { TeamGrid } from "@/components/team-grid";
import {
  founderProfile,
  founderStory,
  foundingStory,
  missionVision,
  pageVisuals,
  values,
} from "@/data/site";
import { pageMetadata } from "@/lib/site-config";
import { getTeamMembers } from "@/lib/team-content";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Cheche za nuru is Swahili for 'sparks of light'. Founded by Rene Roby, the foundation grew out of Spark of Opportunity's work with families in Kibera, Nairobi.",
  path: "/about",
});

export default async function AboutPage() {
  const teamMembers = await getTeamMembers();
  // The founder has her own section above, so the grid shows the rest of the team.
  const team = teamMembers.filter((member) => member.name !== founderProfile.name);

  return (
    <>
      <PageIntro
        label="About Us"
        title="Sparks of Light"
        body="That's what cheche za nuru means in Swahili. It suits the small things that change a child's direction: a paid fee, a plate of food, the right medicine on the right day, a coach who expects you at training."
        photo={pageVisuals.about}
      />

      <section className="why why-plain">
        <div className="why-copy">
          <p className="section-label">Our Story</p>
          <h2>{foundingStory.heading}</h2>
          {foundingStory.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="founder" aria-labelledby="founder-heading">
        <ContentImage
          src={founderProfile.photo.src}
          alt={founderProfile.photo.alt}
          sizes="(max-width: 1000px) 100vw, 40vw"
          className="founder-photo"
        />
        <div className="founder-copy">
          <p className="section-label">Our Founder</p>
          <h2 id="founder-heading">{founderProfile.name}</h2>
          <p className="founder-role">{founderProfile.role}</p>
          {founderProfile.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <figure className="founder-quote">
            <p className="founder-quote-context">{founderStory.context}</p>
            <blockquote>&ldquo;{founderStory.quote}&rdquo;</blockquote>
            <figcaption>{founderStory.attribution}</figcaption>
          </figure>
        </div>
      </section>

      <PageSection label="Mission and Vision" title="What We're Here to Do">
        <div className="two-column-grid">
          <article className="content-card">
            <p className="card-label">Mission</p>
            <p className="statement">{missionVision.mission}</p>
          </article>
          <article className="content-card">
            <p className="card-label">Vision</p>
            <p className="statement">{missionVision.vision}</p>
          </article>
        </div>
      </PageSection>

      <PageSection label="Our Values" title="What We Hold Ourselves To">
        <dl className="value-list">
          {values.map((value) => (
            <div key={value.title} className="value-row">
              <dt>{value.title}</dt>
              <dd>{value.body}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      {team.length ? (
        <PageSection label="Our Team" title="The People Doing the Work">
          <TeamGrid members={team} />
        </PageSection>
      ) : null}

      <CtaBand
        heading="Be One of the Sparks"
        body="Every gift, of any size, keeps a programme running for another term."
        secondaryText="See How to Get Involved"
      />
    </>
  );
}
