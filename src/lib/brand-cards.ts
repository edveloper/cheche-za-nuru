/**
 * Brand card layouts shared by the site's Open Graph images (src/app/**\/opengraph-image.tsx)
 * and the brand kit generator (scripts/brand-kit/generate.mts).
 *
 * Keep this file free of path aliases and Node/Next imports: the generator runs it directly
 * with Node's TypeScript type stripping. Elements are built with createElement for the same
 * reason (no JSX in a .ts file).
 */
import { createElement as h, type ReactElement } from "react";

export const brand = {
  orange: "#f5821f",
  orangeDeep: "#d94716",
  orangeInk: "#b4460f",
  yellow: "#f5c11a",
  green: "#84b83f",
  navy: "#2a245e",
  paper: "#fffdf8",
  cream: "#fff4e0",
  ink: "#2a245e",
  muted: "#514a6b",
  url: "chechezanurufoundation.org",
} as const;

export type ShareCardPage = {
  slug: string;
  route: string;
  eyebrow: string;
  title: string;
  photo: string;
};

/** One share card per main page. `photo` is a path under /public. */
export const shareCardPages: ShareCardPage[] = [
  {
    slug: "home",
    route: "/",
    eyebrow: "Kibera, Nairobi",
    title: "School, a Check-Up and a Game of Football",
    photo: "/images/czn/kibera-children-laughing.jpg",
  },
  {
    slug: "about",
    route: "/about",
    eyebrow: "About Us",
    title: "About Cheche Za Nuru",
    photo: "/images/czn/rene-kibera-children.jpg",
  },
  {
    slug: "programs",
    route: "/programs",
    eyebrow: "Our Programmes",
    title: "Classroom, Clinic and Pitch",
    photo: "/images/czn/doctor-checks-toddler.jpg",
  },
  {
    slug: "impact",
    route: "/impact",
    eyebrow: "Our Impact",
    title: "The Numbers, Honestly",
    photo: "/images/czn/partner-clinic-team.jpg",
  },
  {
    slug: "stories",
    route: "/stories",
    eyebrow: "Stories",
    title: "From the Field",
    photo: "/images/czn/feeding-programme-meal.jpg",
  },
  {
    slug: "get-involved",
    route: "/get-involved",
    eyebrow: "Get Involved",
    title: "Pitch In",
    photo: "/images/czn/kibera-football-club.jpg",
  },
  {
    slug: "contact",
    route: "/contact",
    eyebrow: "Contact",
    title: "Get in Touch",
    photo: "/images/czn/rene-with-children.jpg",
  },
  {
    slug: "donate",
    route: "/donate",
    eyebrow: "Donate",
    title: "Keep a Child in Class, Well and Playing",
    photo: "/images/czn/kibera-children-laughing.jpg",
  },
];

export type CardAssets = {
  /** data: URL of the photo, ideally pre-resized to ~800px. */
  photo: string;
  /** data: URL of the icon mark (transparent PNG). */
  mark: string;
};

type Size = { width: number; height: number };

function markBadge(mark: string, size: number): ReactElement {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size,
        background: brand.paper,
        flexShrink: 0,
      },
    },
    h("img", { src: mark, width: size * 0.78, height: size * 0.75, alt: "" }),
  );
}

/**
 * Landscape share card: navy panel with headline on the left, rounded photo on the right
 * with the orange offset block used across the site. Works from 1200x630 up.
 */
export function shareCard(
  { eyebrow, title }: { eyebrow: string; title: string },
  assets: CardAssets,
  { width, height }: Size = { width: 1200, height: 630 },
): ReactElement {
  const pad = Math.round(height * 0.1);
  const photoWidth = Math.round(width * 0.4);
  const titleSize = title.length > 30 ? Math.round(height * 0.095) : Math.round(height * 0.12);

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background: brand.navy,
        fontFamily: "Figtree",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: pad,
          paddingRight: Math.round(pad * 0.6),
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              color: brand.yellow,
              fontSize: Math.round(height * 0.045),
              fontWeight: 700,
              marginBottom: Math.round(height * 0.035),
            },
          },
          eyebrow,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              color: "white",
              fontFamily: "Bricolage",
              fontWeight: 800,
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            },
          },
          title,
        ),
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: Math.round(height * 0.03) } },
        markBadge(assets.mark, Math.round(height * 0.15)),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          h(
            "div",
            {
              style: {
                display: "flex",
                color: "white",
                fontFamily: "Bricolage",
                fontWeight: 800,
                fontSize: Math.round(height * 0.045),
              },
            },
            "Cheche Za Nuru Foundation",
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                color: "rgba(255,255,255,0.7)",
                fontSize: Math.round(height * 0.036),
                fontWeight: 500,
              },
            },
            brand.url,
          ),
        ),
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          position: "relative",
          width: photoWidth,
          padding: `${pad}px ${pad}px ${pad}px 0`,
        },
      },
      h("div", {
        style: {
          position: "absolute",
          top: pad + Math.round(height * 0.04),
          right: pad - Math.round(height * 0.04),
          bottom: pad - Math.round(height * 0.04),
          left: Math.round(height * 0.04),
          borderRadius: Math.round(height * 0.05),
          background: brand.orange,
        },
      }),
      h("img", {
        src: assets.photo,
        width: photoWidth - pad,
        height: height - pad * 2,
        alt: "",
        style: {
          position: "relative",
          objectFit: "cover",
          borderRadius: Math.round(height * 0.05),
        },
      }),
    ),
  );
}

/**
 * Tall card for WhatsApp status and Instagram/Facebook stories (1080x1920).
 */
export function storyCard(
  { eyebrow, title, footer }: { eyebrow: string; title: string; footer: string },
  assets: CardAssets,
): ReactElement {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: brand.navy,
        fontFamily: "Figtree",
        padding: 96,
      },
    },
    h(
      "div",
      { style: { display: "flex", position: "relative", height: 900, marginBottom: 90 } },
      h("div", {
        style: {
          position: "absolute",
          top: 36,
          left: 36,
          right: -36,
          bottom: -36,
          borderRadius: 64,
          background: brand.orange,
        },
      }),
      h("img", {
        src: assets.photo,
        width: 888,
        height: 900,
        alt: "",
        style: { position: "relative", objectFit: "cover", borderRadius: 64 },
      }),
    ),
    h(
      "div",
      { style: { display: "flex", color: brand.yellow, fontSize: 46, fontWeight: 700, marginBottom: 24 } },
      eyebrow,
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          color: "white",
          fontFamily: "Bricolage",
          fontWeight: 800,
          fontSize: title.length > 28 ? 96 : 120,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        },
      },
      title,
    ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 28, marginTop: "auto" } },
      markBadge(assets.mark, 140),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          { style: { display: "flex", color: "white", fontFamily: "Bricolage", fontWeight: 800, fontSize: 44 } },
          footer,
        ),
        h(
          "div",
          { style: { display: "flex", color: "rgba(255,255,255,0.7)", fontSize: 36, fontWeight: 500 } },
          brand.url,
        ),
      ),
    ),
  );
}

/**
 * Wide cover/banner: navy block with the line on one side, photo on the other.
 * `safeWidth`/`safeHeight` keep text inside the area platforms never crop (e.g. YouTube's
 * centre band). Use `textSide: "right"` where a profile picture overlaps the bottom-left
 * (LinkedIn, X).
 */
export function coverCard(
  { line, sub }: { line: string; sub: string },
  assets: CardAssets,
  {
    width,
    height,
    safeWidth = width,
    safeHeight = height,
    textSide = "left",
  }: Size & { safeWidth?: number; safeHeight?: number; textSide?: "left" | "right" },
): ReactElement {
  const safeLeft = Math.round((width - safeWidth) / 2);
  const safeTop = Math.round((height - safeHeight) / 2);
  const unit = safeHeight;
  const half = Math.round(width * 0.5);
  const stripe = Math.max(6, Math.round(unit * 0.06));
  const textLeft =
    textSide === "left"
      ? safeLeft + Math.round(unit * 0.12)
      : Math.max(half, safeLeft + Math.round(safeWidth * 0.5)) + Math.round(unit * 0.12);

  return h(
    "div",
    {
      style: {
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: brand.navy,
        fontFamily: "Figtree",
      },
    },
    h("img", {
      src: assets.photo,
      width: half,
      height,
      alt: "",
      style: {
        position: "absolute",
        top: 0,
        ...(textSide === "left" ? { right: 0 } : { left: 0 }),
        objectFit: "cover",
      },
    }),
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: textSide === "left" ? half - stripe : half,
        width: stripe,
        height,
        background: brand.orange,
      },
    }),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "absolute",
          top: safeTop,
          left: textLeft,
          width: Math.round(safeWidth * 0.5) - Math.round(unit * 0.2),
          height: safeHeight,
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            color: "white",
            fontFamily: "Bricolage",
            fontWeight: 800,
            fontSize: Math.round(unit * 0.17),
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          },
        },
        line,
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            color: brand.yellow,
            fontSize: Math.round(unit * 0.07),
            fontWeight: 700,
            marginTop: Math.round(unit * 0.05),
          },
        },
        sub,
      ),
    ),
  );
}
