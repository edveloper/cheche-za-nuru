"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

function jumpToTop() {
  // Two-argument scrollTo works in every browser; the options form with
  // behavior: "instant" is ignored or rejected by some mobile Safari versions.
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

/**
 * Next.js scrolls to the top of the new page's first element, not the window, which
 * leaves a gap under the sticky header. Start each new page at the very top instead,
 * except for #anchor links and back/forward navigation (the browser restores those).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isHistoryNavigation = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }

    if (window.location.hash) {
      return;
    }

    jumpToTop();
    // Run once more after paint, in case Next.js or a closing menu scrolled afterwards.
    const frame = requestAnimationFrame(jumpToTop);
    const timeout = window.setTimeout(jumpToTop, 120);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
