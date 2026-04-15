"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import Image from "next/image";

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  speed?: number;
  preload?: boolean;
  quality?: 75 | 90 | 100;
};

export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  speed = 24,
  preload = false,
  quality = 100,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  const updateParallax = useEffectEvent(() => {
    const node = frameRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const offset = Math.max(-speed, Math.min(speed, progress * -speed));

    node.style.setProperty("--parallax-y", `${offset}px`);
  });

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        updateParallax();
      });
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={frameRef} className={className ? `${className} parallax-frame` : "parallax-frame"}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        quality={quality}
        sizes={sizes}
        className="parallax-image"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
