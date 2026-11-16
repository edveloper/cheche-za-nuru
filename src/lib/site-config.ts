export const siteConfig = {
  name: "Cheche Za Nuru Foundation",
  shortName: "Cheche Za Nuru",
  url: "https://chechezanurufoundation.org",
  description:
    "Cheche Za Nuru Foundation helps children in Kibera, Nairobi stay in school, stay healthy and play sport, through scholarships, clinic care, a feeding programme and a youth football club.",
  email: "info@chechezanurufoundation.org",
  locale: "en_KE",
  address: {
    locality: "Nairobi",
    country: "KE",
  },
  logoPath: "/logo/czn-logo-512.png",
  sameAs: [
    "https://facebook.com/chechezanurufoundation",
    "https://instagram.com/chechezanurufoundation",
    "https://tiktok.com/@chechezanurufoundation",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/**
 * The foundation as one entity, on every page. Several other "Nuru" foundations exist,
 * so the alternate names, founder and place are spelled out for search engines.
 */
export const ngoSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": absoluteUrl("/#organization"),
  name: siteConfig.name,
  alternateName: [siteConfig.shortName, "CZN"],
  url: siteConfig.url,
  logo: absoluteUrl(siteConfig.logoPath),
  description: siteConfig.description,
  email: siteConfig.email,
  founder: { "@type": "Person", name: "Rene Roby" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kibera",
    addressRegion: "Nairobi",
    addressCountry: siteConfig.address.country,
  },
  areaServed: { "@type": "Place", name: "Kibera, Nairobi, Kenya" },
  knowsAbout: ["School scholarships", "Community health outreach", "Child nutrition", "Youth football"],
  potentialAction: {
    "@type": "DonateAction",
    target: absoluteUrl("/donate"),
    recipient: { "@id": absoluteUrl("/#organization") },
  },
  sameAs: siteConfig.sameAs,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/** Per-page metadata with a canonical URL and matching Open Graph fields. */
export function pageMetadata({ title, description, path }: PageMetadataInput) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website" as const,
    },
  };
}
