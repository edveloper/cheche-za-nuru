"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SocialIcon } from "@/components/social-icon";
import { brandAssets, contactDetails, navigation } from "@/data/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  // Close the menu whenever the page changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
  }

  // Tighten the header once the page has scrolled (styles key off html[data-scrolled]).
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      if (window.scrollY > 24) {
        root.dataset.scrolled = "";
      } else {
        delete root.dataset.scrolled;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("menu-open");

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > 1080) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      root.classList.remove("menu-open");
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Image
            src={brandAssets.headerLogo.src}
            alt={brandAssets.headerLogo.alt}
            width={brandAssets.headerLogo.width}
            height={brandAssets.headerLogo.height}
            preload
            className="brand-logo"
            sizes="(max-width: 1080px) 200px, 240px"
          />
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="header-cta" href="/donate">
        Donate
      </Link>

      <button
        className={isMenuOpen ? "menu-toggle menu-toggle-open" : "menu-toggle"}
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={isMenuOpen ? "mobile-backdrop mobile-backdrop-open" : "mobile-backdrop"}
        aria-hidden="true"
        onPointerDown={() => setIsMenuOpen(false)}
      />

      <div
        id="mobile-menu"
        className={isMenuOpen ? "mobile-menu mobile-menu-open" : "mobile-menu"}
        hidden={!isMenuOpen}
      >
        <nav className="mobile-nav" aria-label="Mobile">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              style={{ "--item-index": index } as React.CSSProperties}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-actions">
          <Link className="primary-button" href="/donate" onClick={() => setIsMenuOpen(false)}>
            Donate
          </Link>
          <a
            className="mobile-menu-whatsapp"
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
        <p className="mobile-menu-email">
          <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
        </p>
      </div>
    </header>
  );
}
