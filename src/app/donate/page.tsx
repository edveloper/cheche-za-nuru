import { DonationForm } from "@/components/donation-form";
import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { contactDetails, pageVisuals, programs } from "@/data/site";

export default function DonatePage() {
  return (
    <>
      <PageIntro
        label="Donate"
        title="Give in a way that matches the impact you want to support."
        body="Use this page to share a one-time or recurring donation intent and tell us where you would like your contribution to go."
        aside="Every gift helps widen access to learning, healthcare, and structured opportunity for children and young people."
      />

      <section className="section-image-banner">
        <ContentImage
          src={pageVisuals.contact.src}
          alt={pageVisuals.contact.alt}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="Give Now"
        title="Choose a fund, amount, and support rhythm."
      >
        <div className="action-grid">
          <DonationForm />

          <div className="reading-stack reading-panel">
            <p className="card-label">Where your support can go</p>
            {programs.map((program) => (
              <article key={program.title} className="support-card">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </article>
            ))}

            <div className="support-card support-card-accent">
              <p className="card-label">Need a direct conversation?</p>
              <p>
                For larger gifts, sponsorship discussions, or institutional giving,
                you can also reach us directly at {contactDetails.email}.
              </p>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
