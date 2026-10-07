"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Small screens only: a Donate button that appears once the header has scrolled away. */
export function FloatingDonate() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/donate") {
    return null;
  }

  return (
    <Link
      href="/donate"
      className={isVisible ? "floating-donate floating-donate-visible" : "floating-donate"}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? undefined : -1}
    >
      Donate
    </Link>
  );
}
