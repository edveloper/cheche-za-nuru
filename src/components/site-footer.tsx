import Image from "next/image";
import Link from "next/link";

import { SocialIcon } from "@/components/social-icon";
import { brandAssets, contactDetails, navigation, programs } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-signoff">
        <p className="footer-signoff-line">
          <em>Cheche za nuru</em> means sparks of light.{" "}
          <span>Be one for a child in Kibera.</span>
        </p>
        <div className="footer-signoff-actions">
          <Link className="primary-button" href="/donate">
            Donate
          </Link>
          <a
            className="footer-whatsapp"
            href={contactDetails.whatsapp.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="action-bar-icon" aria-hidden="true">
              <SocialIcon platform="WhatsApp" />
            </span>
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link" aria-label="Cheche Za Nuru Foundation home">
            <Image
              src={brandAssets.logo.src}
              alt=""
              width={brandAssets.logo.width}
              height={brandAssets.logo.height}
              className="footer-logo"
              sizes="96px"
            />
          </Link>
          <p>
            Scholarships, clinic care, meals and a football club for children in Kibera,
            Nairobi.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Programmes</h3>
          <ul>
            {programs.map((program) => (
              <li key={program.slug}>
                <Link href={`/programs#${program.slug}`}>{program.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/get-involved">Volunteer or Partner</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Get in Touch</h3>
          <ul className="footer-contact-list">
            <li>
              <a className="footer-contact-link" href={`mailto:${contactDetails.email}`}>
                <span className="footer-contact-icon" aria-hidden="true">
                  <SocialIcon platform="Email" />
                </span>
                <span>{contactDetails.email}</span>
              </a>
            </li>
            <li>
              <a
                className="footer-contact-link"
                href={contactDetails.locationMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-contact-icon" aria-hidden="true">
                  <SocialIcon platform="Location" />
                </span>
                <span>{contactDetails.location}</span>
              </a>
            </li>
          </ul>
          <div className="footer-social-row" aria-label="Social media">
            {contactDetails.socials.map((social) => (
              <a
                key={social.label}
                className="social-link"
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                <span className="social-link-icon" aria-hidden="true">
                  <SocialIcon platform={social.label} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-base">
        <span>&copy; {new Date().getFullYear()} Cheche Za Nuru Foundation</span>
        <a href="https://www.eddie-ezekiel.com" target="_blank" rel="noreferrer">
          Site by Eddie Ezekiel
        </a>
      </div>
    </footer>
  );
}
