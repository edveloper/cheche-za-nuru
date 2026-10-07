"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SocialIcon } from "@/components/social-icon";
import { contactDetails } from "@/data/site";

/**
 * Desktop: a floating WhatsApp button, bottom right (Donate already lives in the header).
 * Mobile and tablet: a bar fixed to the bottom of the screen with WhatsApp and Donate.
 */
export function ActionBar() {
  const pathname = usePathname();
  const showDonate = pathname !== "/donate";

  return (
    <>
      <a
        className="whatsapp-float"
        href={contactDetails.whatsapp.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with us on WhatsApp, ${contactDetails.whatsapp.number}`}
        title="Chat with us on WhatsApp"
      >
        <SocialIcon platform="WhatsApp" />
      </a>

      <nav className="action-bar" aria-label="Quick actions">
        <a
          className="action-bar-whatsapp"
          href={contactDetails.whatsapp.href}
          target="_blank"
          rel="noreferrer"
        >
          <span className="action-bar-icon" aria-hidden="true">
            <SocialIcon platform="WhatsApp" />
          </span>
          WhatsApp
        </a>
        {showDonate ? (
          <Link className="action-bar-donate" href="/donate">
            Donate
          </Link>
        ) : null}
      </nav>
    </>
  );
}
