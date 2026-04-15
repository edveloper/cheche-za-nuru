export type DonationFundOption = {
  id: string | null;
  slug: string;
  name: string;
  shortDescription: string;
  impactSummary: string;
};

export const fallbackDonationFunds: DonationFundOption[] = [
  {
    id: null,
    slug: "support-where-needed-most",
    name: "Support where it is needed most",
    shortDescription:
      "Give flexible support across education, healthcare, sports, and urgent community needs.",
    impactSummary:
      "Allows the foundation to respond where support is most needed at any given moment.",
  },
  {
    id: null,
    slug: "nuru-scholars-program",
    name: "Education - Nuru Scholars Program",
    shortDescription:
      "Help keep children learning through scholarships, school supplies, and learner support.",
    impactSummary:
      "Supports access to school, mentorship, and learning continuity for children in need.",
  },
  {
    id: null,
    slug: "afya-kwa-wote",
    name: "Healthcare - Afya Kwa Wote",
    shortDescription:
      "Support outreach clinics, maternal health, nutrition, and preventive wellness campaigns.",
    impactSummary:
      "Helps families access care, preventive services, and stronger community health outcomes.",
  },
  {
    id: null,
    slug: "rising-stars-league",
    name: "Sports - Rising Stars League",
    shortDescription:
      "Back football, athletics, basketball, and rugby opportunities for children and young people.",
    impactSummary:
      "Creates structured spaces for confidence, discipline, teamwork, and talent development.",
  },
];
