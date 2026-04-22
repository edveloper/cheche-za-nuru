import Image from "next/image";
import Link from "next/link";

import { SocialIcon } from "@/components/social-icon";
import { brandAssets, contactDetails, navigation, programs } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-lockup">
            <Link href="/" aria-label="Go to the Cheche Za Nuru homepage">
              <Image
                src={brandAssets.logo.src}
                alt={brandAssets.logo.alt}
                width={brandAssets.logo.width}
                height={brandAssets.logo.height}
                quality={100}
                className="footer-logo"
                sizes="64px"
              />
            </Link>
            <div>
              <span className="footer-kicker">{brandAssets.wordmark.title}</span>
              <strong className="footer-brand-subtitle">
                {brandAssets.wordmark.subtitle}
              </strong>
            </div>
          </div>
          <p>
            A mission-led foundation focused on education, healthcare, sports,
            and community empowerment for children and young people.
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
          <h3>Programs</h3>
          <ul>
            {programs.map((program) => (
              <li key={program.title}>
                <Link href="/programs">{program.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-contact-list">
            <li>
              <a className="footer-contact-link" href={`mailto:${contactDetails.email}`}>
                <span className="footer-contact-icon" aria-hidden="true">
                  <SocialIcon platform="Email" />
                </span>
                <span>{contactDetails.email}</span>
              </a>
            </li>
            {contactDetails.phones.map((phone) => (
              <li key={phone}>
                <a className="footer-contact-link" href={`tel:${phone.replaceAll(" ", "")}`}>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <SocialIcon platform="Phone" />
                  </span>
                  <span>{phone}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                className="footer-contact-link"
                href={contactDetails.locationMapUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open directions to ${contactDetails.location}`}
              >
                <span className="footer-contact-icon" aria-hidden="true">
                  <SocialIcon platform="Location" />
                </span>
                <span>{contactDetails.location}</span>
              </a>
            </li>
          </ul>
          <div className="social-link-row" aria-label="Social links">
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
        <span>&copy; 2026 Cheche Za Nuru Foundation</span>
        <span>
          Website by{" "}
          <a
            href="https://www.eddie-ezekiel.com"
            target="_blank"
            rel="noreferrer"
          >
            Eddie Ezekiel
          </a>
        </span>
      </div>
    </footer>
  );
}
