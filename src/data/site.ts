export const navigation = [
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Stories", href: "/stories" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export const brandAssets = {
  logo: {
    src: "/logo/czn-logo-512.png",
    alt: "Cheche Za Nuru Foundation",
    width: 512,
    height: 512,
  },
  headerLogo: {
    src: "/logo/czn-header-logo-trimmed.png",
    alt: "Cheche Za Nuru Foundation home",
    width: 800,
    height: 247,
  },
  wordmark: {
    title: "Cheche Za Nuru",
    subtitle: "Foundation",
  },
} as const;

export type Photo = {
  src: string;
  alt: string;
};

/**
 * The foundation's own photographs, carried over from sparkofopportunity.org (the site
 * of Spark of Opportunity International, CZN's US affiliate). Alt text describes only
 * what is visible; don't caption a photo as a specific programme or event unless the
 * foundation confirms it.
 */
export const photos = {
  kiberaChildren: {
    src: "/images/czn/kibera-children-laughing.jpg",
    alt: "A crowd of children laughing together in a Kibera lane, one holding a football.",
  },
  reneWithChildren: {
    src: "/images/czn/rene-with-children.jpg",
    alt: "Founder Rene Roby standing with a group of smiling boys.",
  },
  reneInKibera: {
    src: "/images/czn/rene-kibera-children.jpg",
    alt: "Rene Roby taking a selfie with three grinning children in Kibera.",
  },
  doctorChecksToddler: {
    src: "/images/czn/doctor-checks-toddler.jpg",
    alt: "A doctor listens to a toddler's chest with a stethoscope.",
  },
  partnerClinic: {
    src: "/images/czn/partner-clinic-team.jpg",
    alt: "Clinicians in white coats with Rene Roby at a local clinic and pharmacy counter.",
  },
  feedingMeal: {
    src: "/images/czn/feeding-programme-meal.jpg",
    alt: "Young people holding plates of chapati and beans at a shared meal.",
  },
  sparkFc: {
    src: "/images/czn/spark-generation-fc.jpg",
    alt: "Spark Generation Football Club players in blue kits posing with Rene Roby on a dirt pitch in Kibera.",
  },
  wornBoots: {
    src: "/images/czn/worn-football-boots.jpg",
    alt: "A pair of worn-out football boots on rocky ground.",
  },
} satisfies Record<string, Photo>;

export const pageVisuals = {
  home: photos.kiberaChildren,
  about: photos.reneInKibera,
  programs: photos.feedingMeal,
  impact: photos.partnerClinic,
  stories: photos.kiberaChildren,
  involved: photos.wornBoots,
  contact: photos.sparkFc,
  donate: photos.reneWithChildren,
};

export type Programme = {
  slug: "education" | "healthcare" | "sports";
  eyebrow: string;
  title: string;
  translation?: string;
  summary: string;
  description: string;
  bullets: string[];
  photo: Photo;
};

export const programs: Programme[] = [
  {
    slug: "education",
    eyebrow: "Education",
    title: "Nuru Scholars",
    summary:
      "Fees, books and uniform covered, so children in Kibera stay in class.",
    description:
      "School isn't free in Kenya. Nuru Scholars covers tuition, admission fees, assessment books, textbooks and uniform, and we work directly with each family and the school they choose. We call it a scholarship, not a sponsorship, on purpose: scholars attend regularly and share their reports, and we keep showing up. It's a relationship, not a lottery win.",
    bullets: [
      "Full and partial scholarships",
      "Tuition, books, admission fees and uniform",
      "A progress card every quarter",
      "Mentors who know the family",
    ],
    photo: photos.reneWithChildren,
  },
  {
    slug: "healthcare",
    eyebrow: "Healthcare",
    title: "Afya Kwa Wote",
    translation: "Health for All",
    summary:
      "Clinic visits, medicine and meals for families who'd otherwise go without.",
    description:
      "Malaria, typhoid and pneumonia are everyday threats in Kibera, and the medicine often costs more than a family has that week. Working with a local partner clinic, we pay for prescriptions and hospital tests, support people living with HIV, and run a feeding programme, because a child who hasn't eaten in two days can't concentrate in class.",
    bullets: [
      "Prescriptions and hospital tests paid for",
      "A local partner clinic",
      "Counselling for people living with HIV",
      "Meals for children and food staples for families",
    ],
    photo: photos.doctorChecksToddler,
  },
  {
    slug: "sports",
    eyebrow: "Sport",
    title: "Rising Stars League",
    summary:
      "Coached football and more. Discipline, teammates and a route to scholarships.",
    description:
      "Our football started with Spark Generation Football Club in Kibera, on a pitch of hard soil and loose rock where boys played in Crocs and street shoes. Good players get noticed, and that's leverage: we use it to argue for sports scholarships and further education. Boots are kept at the office so they can't be stolen or sold.",
    bullets: [
      "Spark Generation Football Club",
      "Coaching and regular fixtures",
      "Boots and kit kept safe at the office",
      "Advocacy for sports scholarships",
    ],
    photo: photos.sparkFc,
  },
];

/** What a gift buys. Figures from the Spark of Opportunity programme pages. */
export const givingTiers = [
  { amount: "$25 a month", buys: "A partial scholarship" },
  { amount: "$50 a month", buys: "A full scholarship: fees, books and uniform" },
  { amount: "$600 a year", buys: "A full scholarship, paid once" },
  { amount: "$32", buys: "A pair of football boots for a Spark Generation player" },
];

export const founderStory = {
  quote:
    "The parents didn't have 725 shillings for the medication as that is a week's salary in a community with 80% unemployment. I asked the doctor to put the $7.25 on my bill for the parents.",
  context:
    "Rene was at a Kibera clinic with a sick young person when a six-year-old boy was carried in, limp in his mother's arms. He had malaria.",
  attribution: "Rene Roby, Founder",
};

export const programApproach = [
  {
    title: "Access",
    body: "We go to the children most likely to miss out, not the ones easiest to reach.",
  },
  {
    title: "Relationship",
    body: "We know the families and the schools by name. Support comes with expectations on both sides.",
  },
  {
    title: "Consistency",
    body: "A one-off visit doesn't keep a child in school. Scholarships, clinics and the football club run term after term.",
  },
];

export const whyWeExist = {
  heading: "Free School Isn't Free",
  paragraphs: [
    "Free primary education got millions of Kenyan children through the school gate. It didn't buy the uniform, the books or the exam fee. It never promised a meal, a nurse when a child falls sick, or a pitch to play on after class.",
    "In Kibera, with no running water, unreliable power and most adults out of work, those gaps decide who stays in school. So that's where we work.",
  ],
};

export const foundingStory = {
  heading: "From Spark to Cheche",
  paragraphs: [
    "Cheche Za Nuru began as Spark of Opportunity International, a US charity working in Kibera, the largest informal settlement in East Africa, and in rural Western Kenya. It started with street outreach, trips to the clinic and a football club.",
    "In 2024 the work put down Kenyan roots as Cheche Za Nuru Foundation. The name is the original idea in Swahili: cheche za nuru, sparks of light.",
  ],
};

export const founderProfile = {
  name: "Rene Roby",
  role: "Founder and Executive Director",
  photo: {
    src: "/images/czn/rene-roby.jpg",
    alt: "Portrait of Rene Roby, founder of Cheche Za Nuru Foundation.",
  },
  paragraphs: [
    "Rene has spent the past seven years alongside children and families in Kibera and the communities around it, through a ministry rooted in faith. She founded Spark of Opportunity International in the United States, then Cheche Za Nuru Foundation as its Kenyan affiliate in 2024.",
    "Her gifts are the unglamorous ones: administration, service and encouragement. She moves between Kibera and rural Western Kenya to organise and oversee the work, and she still takes young people and adults to the clinic herself when pneumonia, typhoid or malaria strike.",
    "For Rene, it isn't about programmes or projects. It's about showing up, day after day, for the families who need it most.",
  ],
};

export const missionVision = {
  mission:
    "To inspire hope and transform lives by promoting education, health and sports development, while nurturing lifelong learning, leadership and community empowerment.",
  vision:
    "A world where every child has access to premium education, quality healthcare, and opportunities through sports to reach their full potential.",
};

export const values = [
  {
    title: "Hope",
    body: "Every child deserves a future worth working towards. We start from there.",
  },
  {
    title: "Empowerment",
    body: "Children and families shape their own futures. We back them. We don't take over.",
  },
  {
    title: "Leadership",
    body: "We expect young people to lead, and we give them room to try.",
  },
  {
    title: "Community",
    body: "The work belongs to the communities it serves. We listen before we act.",
  },
  {
    title: "Excellence",
    body: "A child in an informal settlement deserves the same standard of teaching, care and coaching as anyone else.",
  },
];

export const involvementOptions = [
  {
    title: "Donate",
    description: "Give once or every month, and choose which programme it goes to.",
    href: "/donate",
    cta: "Donate",
  },
  {
    title: "Volunteer",
    description:
      "Teachers, clinicians, coaches, mentors, people who can keep a spreadsheet tidy. If you can show up, we can use you.",
    href: "/get-involved#involvement-form",
    cta: "Offer Your Time",
  },
  {
    title: "Partner",
    description:
      "Schools, companies and NGOs: sponsorship, equipment, outreach support or a longer partnership.",
    href: "/get-involved#involvement-form",
    cta: "Start a Conversation",
  },
];

export const involvementDetails = [
  {
    title: "Individuals",
    body: "Give, mentor a scholar, help at an outreach day, or lend a skill you already have.",
  },
  {
    title: "Organisations",
    body: "Sponsor a team, fund a clinic day, donate equipment, or build a programme with us over several years.",
  },
  {
    title: "Advocates",
    body: "Open a door, make an introduction, share our work. Some of the most useful help costs nothing.",
  },
];

export const contactDetails = {
  email: "info@chechezanurufoundation.org",
  location: "Mbagathi View, B10, Nairobi",
  locationMapUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Mbagathi%20View%20Apartment%2C%20B10",
  socialHandle: "@chechezanurufoundation",
  socials: [
    {
      label: "Facebook",
      href: "https://facebook.com/chechezanurufoundation",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/chechezanurufoundation",
    },
    {
      label: "TikTok",
      href: "https://tiktok.com/@chechezanurufoundation",
    },
  ] as const,
};

/** National context, all from published UNICEF / Generation Unlimited sources. */
export const outOfSchoolStat = {
  value: "2.5 million",
  label: "children in Kenya are out of school.",
  sourceLabel: "UNICEF Kenya, Child Sensitive Snapshot, December 2025",
  sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
};

export const impactContextStats = [
  {
    title: "Children Living in Poverty",
    value: "42.4%",
    body:
      "UNICEF Kenya reports that 42.4 per cent of children in Kenya were living in poverty in 2022, with rural and ASAL areas facing the sharpest deprivation.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Children Out of School",
    value: "2.5M",
    body:
      "The same UNICEF Kenya snapshot counts 2.5 million out-of-school children.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Child Stunting",
    value: "18%",
    body:
      "UNICEF Kenya puts child stunting at 18 per cent nationally.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Youth Outside Learning or Work",
    value: "~20%",
    body:
      "Generation Unlimited Kenya reports that nearly 20 per cent of young people are not in education, employment or training.",
    sourceLabel: "Generation Unlimited Kenya, accessed 2026",
    sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
  },
];

export const impactDomainViews = [
  {
    slug: "education",
    label: "Education",
    intro:
      "Millions of Kenyan children are either out of school or one unpaid bill away from it.",
    stats: [
      {
        label: "Out-of-School Children",
        value: 2.5,
        suffix: "M",
        detail:
          "UNICEF Kenya counts 2.5 million children out of school.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
      {
        label: "Children in Poverty",
        value: 42.4,
        suffix: "%",
        detail:
          "Poverty decides whether a learner can afford to stay in school at all.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
    ],
    response:
      "Nuru Scholars pays fees and buys the supplies that keep children in class, and pairs them with mentors.",
  },
  {
    slug: "health",
    label: "Health",
    intro:
      "Hunger and illness quietly undo schooling. Nutrition is the big one.",
    stats: [
      {
        label: "Children Stunted",
        value: 18,
        suffix: "%",
        detail:
          "UNICEF Kenya puts child stunting at 18 per cent nationally, a lasting effect of undernutrition.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
      {
        label: "Children Under Five With Stunting",
        value: 25,
        suffix: "%+",
        detail:
          "More than a quarter of children under five, roughly two million, have stunted growth.",
        sourceLabel: "UNICEF Kenya Nutrition",
        sourceUrl: "https://www.unicef.org/kenya/nutrition",
      },
    ],
    response:
      "Afya Kwa Wote takes consultations, nutrition screening and family health support to the neighbourhood.",
  },
  {
    slug: "youth",
    label: "Youth",
    intro:
      "Finishing school is only half of it. The step from school to work is where many young people stall.",
    stats: [
      {
        label: "Youth Not in Education, Employment or Training",
        value: 20,
        suffix: "%",
        detail:
          "Generation Unlimited Kenya reports that nearly one in five young people are not in education, employment or training.",
        sourceLabel: "Generation Unlimited Kenya",
        sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
      },
      {
        label: "New Jobs Needed Each Year",
        value: 900000,
        suffix: "",
        detail:
          "Kenya needs about 900,000 new jobs a year to absorb its growing working-age population.",
        sourceLabel: "Generation Unlimited Kenya",
        sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
      },
    ],
    response:
      "The Rising Stars League builds discipline, teamwork and visibility, and opens routes to sports scholarships.",
  },
] as const;

export const impactCountyPressure = [
  {
    area: "Kitui",
    value: 46,
    tone: "high",
    label: "Stunting Rate",
    note:
      "UNICEF Kenya reports child stunting as high as 46 per cent in Kitui.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "West Pokot",
    value: 46,
    tone: "high",
    label: "Stunting Rate",
    note:
      "West Pokot also reaches 46 per cent stunting among children.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "ASAL Counties",
    value: 20,
    tone: "medium",
    label: "Wasting Can Exceed",
    note:
      "Wasting rises above 20 per cent in many arid and semi-arid counties.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "Rural and ASAL Regions",
    value: 42.4,
    tone: "medium",
    label: "National Child Poverty Rate",
    note:
      "Child poverty sits at 42.4 per cent nationally, with rural and ASAL regions the most deprived.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
] as const;
