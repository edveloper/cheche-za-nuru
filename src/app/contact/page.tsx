import type { Metadata } from "next";

import { ActionPanels } from "@/components/action-panels";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { SocialIcon } from "@/components/social-icon";
import { contactDetails, pageVisuals } from "@/data/site";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Email Cheche Za Nuru Foundation in Nairobi about volunteering, partnerships, donations or press, or send us a message through the form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        label="Contact"
        title="Get in Touch"
        body="Questions, partnerships, press, or just curious. Email us or use the form below."
        photo={pageVisuals.contact}
      />

      <section className="contact-line-grid" aria-label="Contact details">
        <a className="contact-detail-card" href={`mailto:${contactDetails.email}`}>
          <span className="contact-detail-label">Email</span>
          <strong>{contactDetails.email}</strong>
        </a>
        <a
          className="contact-detail-card"
          href={contactDetails.locationMapUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-detail-label">Office</span>
          <strong>{contactDetails.location}</strong>
        </a>
        <div className="contact-detail-card">
          <span className="contact-detail-label">Follow Us</span>
          <div className="social-chip-row">
            {contactDetails.socials.map((social) => (
              <a
                key={social.label}
                className="social-chip"
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                <span className="social-chip-icon" aria-hidden="true">
                  <SocialIcon platform={social.label} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PageSection label="Send a Message" title="Write to Us">
        <ActionPanels />
      </PageSection>
    </>
  );
}
