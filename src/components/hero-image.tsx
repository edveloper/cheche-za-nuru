"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import Image from "next/image";

type HeroImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  speed?: number;
  preload?: boolean;
  quality?: 75 | 90 | 100;
};

export function HeroImage({
  src,
  alt,
  sizes,
  className,
  speed = 24,
  preload = false,
  quality = 100,
}: HeroImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  const updateMotion = useEffectEvent(() => {
    const node = frameRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const offset = Math.max(-speed, Math.min(speed, progress * -speed));

    node.style.setProperty("--hero-image-y", `${offset}px`);
  });

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        updateMotion();
      });
    };

    updateMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={className ? `${className} hero-image-media` : "hero-image-media"}
    >
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        quality={quality}
        sizes={sizes}
        className="hero-image-motion"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
