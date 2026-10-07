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
            <em>Cheche za nuru</em>{" "}is Swahili for &ldquo;sparks of light&rdquo;. We work in
            Kibera, Nairobi, keeping children in school, healthy and playing sport.
          </p>
          <Link className="footer-donate" href="/donate">
            Donate
          </Link>
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
          </ul>
        </div>

        <div>
          <h3>Contact Us</h3>
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
                aria-label={`Open directions to ${contactDetails.location}`}
              >
                <span className="footer-contact-icon" aria-hidden="true">
                  <SocialIcon platform="Location" />
                </span>
                <span>{contactDetails.location}</span>
              </a>
            </li>
            <li aria-label="Social links">
              <div className="social-link-row footer-social-row">
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
            </li>
          </ul>
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
