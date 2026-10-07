"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { brandAssets, navigation } from "@/data/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="site-header">
      <Link className="brand" href="/" onClick={() => setIsMenuOpen(false)}>
        <span className="brand-mark">
          <Image
            src={brandAssets.headerLogo.src}
            alt={brandAssets.headerLogo.alt}
            width={brandAssets.headerLogo.width}
            height={brandAssets.headerLogo.height}
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
        aria-label="Toggle navigation menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {isMenuOpen ? (
        <div className="mobile-menu">
          <nav className="mobile-nav" aria-label="Mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="mobile-menu-cta" href="/donate" onClick={() => setIsMenuOpen(false)}>
              Donate
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
