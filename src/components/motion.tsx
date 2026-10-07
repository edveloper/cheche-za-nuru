"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Blocks that fade up as they scroll into view. Siblings stagger. */
const REVEAL_SELECTOR = [
  ".section-heading",
  ".why-copy",
  ".why-stat",
  ".programme-card",
  ".help-card",
  ".scholarship-intro",
  ".step",
  ".tier-strip",
  ".appeal-panel",
  ".story-feature-copy",
  ".voice-feature",
  ".field-strip li",
  ".event-row",
  ".story-post-card",
  ".programme-row",
  ".founder-copy",
  ".team-member-card",
  ".value-row",
  ".content-card",
  ".tier",
  ".impact-bar-card",
  ".impact-heat-card",
  ".cta-band",
  ".empty-state",
  ".form-panel",
].join(",");

/** Photo frames whose image drifts slightly slower than the page. */
const PARALLAX_SELECTOR = [
  ".hero-media",
  ".page-intro-photo",
  ".programme-row-photo",
  ".founder-photo",
  ".appeal-photo",
  ".story-feature-photo",
].join(",");

/** Numbers that count up from zero when they appear, e.g. "175", "2.5 million", "2,400+". */
const COUNT_SELECTOR = ".stat-band-item strong, [data-count-up]";

const PARALLAX_RANGE = 28;
const STAGGER_MS = 90;

function countUp(element: HTMLElement) {
  const original = element.textContent ?? "";
  const match = original.match(/^([\d,]*\.?\d+)(.*)$/);
  if (!match) {
    return;
  }

  const [, numberText, suffix] = match;
  const target = Number(numberText.replace(/,/g, ""));
  const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;
  const useCommas = numberText.includes(",");
  const format = (value: number) =>
    useCommas
      ? value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : value.toFixed(decimals);

  const duration = 1400;
  const start = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${format(target * eased)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = original;
    }
  };

  requestAnimationFrame(step);
}

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("motion-ready");

    // Reveal on scroll
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const finishReveal = (element: HTMLElement) => {
      element.classList.add("is-visible");
      // Hand the element back to its normal styles (hover lifts etc.) once it has landed.
      window.setTimeout(() => {
        element.removeAttribute("data-reveal");
        element.classList.remove("is-visible");
        element.style.removeProperty("--reveal-delay");
      }, 1100);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            finishReveal(entry.target as HTMLElement);
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    for (const element of revealTargets) {
      const rect = element.getBoundingClientRect();
      // Anything already on screen stays put, so there's no flash on load.
      if (rect.top < window.innerHeight * 0.9) {
        continue;
      }
      const siblings = element.parentElement
        ? Array.from(element.parentElement.children).filter((child) => child.matches(REVEAL_SELECTOR))
        : [];
      const index = Math.max(siblings.indexOf(element), 0);
      element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * STAGGER_MS}ms`);
      element.setAttribute("data-reveal", "");
      revealObserver.observe(element);
    }

    // Count-up numbers
    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            countUp(entry.target as HTMLElement);
            countObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll<HTMLElement>(COUNT_SELECTOR).forEach((element) => {
      countObserver.observe(element);
    });

    // Parallax
    const frames = Array.from(document.querySelectorAll<HTMLElement>(PARALLAX_SELECTOR));
    let frame = 0;
    const updateParallax = () => {
      const viewport = window.innerHeight;
      for (const element of frames) {
        const image = element.querySelector<HTMLElement>("img");
        if (!image) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) {
          continue;
        }
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const offset = Math.max(-1, Math.min(1, progress)) * -PARALLAX_RANGE;
        image.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
