import { ActionPanels } from "@/components/action-panels";
import { ParallaxImage } from "@/components/parallax-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { contactDetails, contactIntro, pageVisuals } from "@/data/site";

export default function ContactPage() {
  return (
    <>
      <PageIntro
        label="Contact"
        title="Start a conversation with Cheche Za Nuru."
        body="If you would like to donate, volunteer, partner, or learn more about our work, we would be glad to hear from you."
        aside="Every message is a chance to begin something meaningful for children, families, and communities."
      />

      <section className="overview-and-images">
        <div className="reading-stack reading-panel">
          {contactIntro.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <ParallaxImage
          src={pageVisuals.contact.src}
          alt={pageVisuals.contact.alt}
          sizes="(max-width: 900px) 100vw, 40vw"
          className="section-image-banner-card section-image-short"
          speed={16}
        />
      </section>

      <PageSection
        label="Reach Out"
        title="Choose the path that best fits how you want to support the work."
      >
        <ActionPanels />
      </PageSection>

      <PageSection label="Direct Contact" title="You can also reach us directly using the details below.">
        <div className="contact-line-grid">
          <a className="contact-detail-card" href={`mailto:${contactDetails.email}`}>
            <span className="contact-detail-label">Email</span>
            <strong>{contactDetails.email}</strong>
          </a>
          <a className="contact-detail-card" href={`tel:${contactDetails.phone.replaceAll(" ", "")}`}>
            <span className="contact-detail-label">Phone</span>
            <strong>{contactDetails.phone}</strong>
          </a>
          <div className="contact-detail-card">
            <span className="contact-detail-label">Location</span>
            <strong>{contactDetails.location}</strong>
          </div>
        </div>

        <div className="contact-map-shell">
          <div className="contact-map-copy reading-panel">
            <p className="card-label">Find Us</p>
            <h3>Nairobi, Kenya</h3>
            <p>
              If you are planning a visit, partnership meeting, or programme conversation,
              you can use the map below as a general guide and then contact us for the exact
              meeting details.
            </p>
          </div>
          <div className="contact-map-card">
            <iframe
              title="Map showing Nairobi, Kenya"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.744%2C-1.380%2C37.030%2C-1.180&layer=mapnik&marker=-1.286389%2C36.817223"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </PageSection>
    </>
  );
}
