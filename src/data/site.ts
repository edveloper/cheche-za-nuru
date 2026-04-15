export const navigation = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Stories", href: "/stories" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export const brandAssets = {
  logo: {
    src: "/logo/czn-logo.png",
    alt: "Cheche Za Nuru Foundation logo.",
    width: 1563,
    height: 1563,
  },
  wordmark: {
    title: "Cheche Za Nuru",
    subtitle: "Foundation",
  },
} as const;

const imageLibrary = {
  homeHero: {
    src: "/images/home-hero.jpg",
    alt: "Children smiling together in the home page hero image.",
  },
  aboutBanner: {
    src: "/images/about-banner.jpg",
    alt: "Children gathered together for the About page banner.",
  },
  programsBanner: {
    src: "/images/programs-banner.jpg",
    alt: "Children featured in the Programs page banner.",
  },
  impactBanner: {
    src: "/images/impact-banner.jpg",
    alt: "Children featured in the Impact page banner.",
  },
  storiesBanner: {
    src: "/images/stories-banner.jpg",
    alt: "Children featured in the Stories page banner.",
  },
  getInvolvedBanner: {
    src: "/images/get-involved-banner.jpg",
    alt: "Children featured in the Get Involved page banner.",
  },
  contactBanner: {
    src: "/images/contact-banner.jpg",
    alt: "Children featured in the Contact page banner.",
  },
  healthFeature: {
    src: "/images/health.jpg",
    alt: "Healthcare outreach image showing child wellbeing support.",
  },
  childrenWindow: {
    src: "/images/children-window.jpg",
    alt: "Children smiling through a window frame.",
  },
  classroomBoy: {
    src: "/images/classroom-boy.jpg",
    alt: "A child in a classroom.",
  },
  girlsBlue: {
    src: "/images/girls-blue.jpg",
    alt: "Schoolgirls gathered together.",
  },
  schoolBoys: {
    src: "/images/school-boys.jpg",
    alt: "Schoolchildren posing together.",
  },
  rainbowKids: {
    src: "/images/rainbow-kids.jpg",
    alt: "Silhouettes of children beneath a rainbow.",
  },
  runningChildren: {
    src: "/images/running-children.jpg",
    alt: "Children running across a field.",
  },
  smilingGirl: {
    src: "/images/smiling-girl.jpg",
    alt: "A smiling child leaning against a wall.",
  },
  greenUniformChildren: {
    src: "/images/green-uniform-children.jpg",
    alt: "Children in green and yellow uniforms.",
  },
} as const;

export const heroStats = [
  { value: "2,400+", label: "children directly supported" },
  { value: "580", label: "scholarships awarded" },
  { value: "12,000+", label: "health consultations delivered" },
];

export const homepageVisuals = {
  hero: imageLibrary.homeHero,
  spotlight: [
    imageLibrary.classroomBoy,
    imageLibrary.healthFeature,
    imageLibrary.greenUniformChildren,
  ],
  gallery: [
    imageLibrary.childrenWindow,
    imageLibrary.runningChildren,
    imageLibrary.smilingGirl,
    imageLibrary.rainbowKids,
  ],
};

export const pageVisuals = {
  aboutHero: imageLibrary.aboutBanner,
  aboutJourney: [
    imageLibrary.childrenWindow,
    imageLibrary.healthFeature,
    imageLibrary.greenUniformChildren,
  ],
  programs: imageLibrary.programsBanner,
  impact: imageLibrary.impactBanner,
  stories: imageLibrary.storiesBanner,
  involved: imageLibrary.getInvolvedBanner,
  contact: imageLibrary.contactBanner,
};

export const values = [
  "Hope",
  "Empowerment",
  "Leadership",
  "Community",
  "Excellence",
];

export const foundationOverview = [
  {
    title: "Grounded in one promise",
    body:
      "Cheche Za Nuru Foundation is centered on one integrated idea: children thrive when education, health, and sport are strengthened together rather than treated as separate needs.",
  },
  {
    title: "Built around dignity",
    body:
      "The foundation is rooted in a mission of access, dignity, and long-term opportunity for underserved children and young people, with support shaped around what helps them stay present, well, and encouraged.",
  },
  {
    title: "Focused on everyday progress",
    body:
      "That work includes helping children remain in school, widening access to healthcare, and creating structured spaces where confidence, discipline, and teamwork can grow over time.",
  },
  {
    title: "Aimed at lasting possibility",
    body:
      "By investing in children in the classroom, in their health, and in their development, Cheche Za Nuru seeks to help communities raise a generation ready to learn, lead, and thrive.",
  },
];

export const aboutJourney = [
  {
    title: "It begins with hope",
    body:
      "Cheche Za Nuru was shaped around the belief that every child deserves the chance to learn, grow, and imagine a better future regardless of circumstance.",
  },
  {
    title: "It grows through support",
    body:
      "The foundation's work brings together education, healthcare, and sports because a child's journey is never one-dimensional. Real support must meet learning, wellbeing, and development together.",
  },
  {
    title: "It leads toward opportunity",
    body:
      "By investing in scholarships, outreach, and youth development, the foundation aims to help children move from vulnerability toward confidence, leadership, and possibility.",
  },
];

export const missionVision = {
  mission:
    "To inspire hope and transform lives by promoting education, health and sports development, while nurturing lifelong learning, leadership and community empowerment.",
  vision:
    "A world where every child has access to premium education, quality healthcare, and opportunities through sports to reach their full potential.",
};

export const operatingPrinciples = [
  {
    title: "Integrated support",
    body:
      "Cheche Za Nuru brings education, healthcare, and sports together so children receive support that reflects real life rather than isolated interventions.",
  },
  {
    title: "Community-rooted delivery",
    body:
      "The foundation works through outreach, local participation, and close engagement with underserved communities so support remains grounded and relevant.",
  },
  {
    title: "Long-term development",
    body:
      "The goal is not only immediate assistance, but steady progress into learning, wellness, discipline, confidence, and leadership over time.",
  },
];

export const pillars = [
  {
    eyebrow: "Education",
    title: "Nuru Scholars",
    description:
      "Scholarships, mentorship, digital literacy, and school resources that keep learners in class and moving toward long-term opportunity.",
  },
  {
    eyebrow: "Healthcare",
    title: "Afya Kwa Wote",
    description:
      "Outreach clinics, nutrition support, maternal health services, and wellness campaigns built around underserved families.",
  },
  {
    eyebrow: "Sports",
    title: "Rising Stars League",
    description:
      "Structured football, athletics, and netball programs that build confidence, discipline, teamwork, and future pathways.",
  },
];

export const programs = [
  {
    eyebrow: "Education",
    title: "Nuru Scholars Program",
    description:
      "Full and partial scholarships, mentorship pairing, digital skills training, and school supply drives for primary and secondary students in need.",
    bullets: [
      "Scholarship support for continued learning",
      "Mentorship pairing and learner guidance",
      "Digital skills exposure and school resources",
    ],
  },
  {
    eyebrow: "Healthcare",
    title: "Afya Kwa Wote Initiative",
    description:
      "Mobile clinics, immunisation drives, maternal health support, nutrition supplementation, and mental wellness programs across underserved areas.",
    bullets: [
      "Mobile outreach and consultations",
      "Maternal and family wellness support",
      "Nutrition and preventive care campaigns",
    ],
  },
  {
    eyebrow: "Sports",
    title: "Rising Stars League",
    description:
      "Football, athletics, and netball academies that nurture talent, build character, and open pathways to scholarships and sporting institutions.",
    bullets: [
      "Structured leagues and academy support",
      "Discipline, teamwork, and leadership building",
      "Pathways into wider opportunity through sport",
    ],
  },
];

export const programApproach = [
  {
    title: "Access",
    body:
      "Each program is designed to widen access for children who might otherwise be left out of school, healthcare, or structured development opportunities.",
  },
  {
    title: "Consistency",
    body:
      "Support is sustained through scholarships, outreach, mentoring, clinics, leagues, and recurring community engagement rather than one-off interventions.",
  },
  {
    title: "Potential",
    body:
      "Across all three pillars, the aim is to help children build confidence, strengthen their abilities, and move toward longer-term opportunity.",
  },
];

export const programNarrative = [
  "Our programs are built around three connected areas of work: education, healthcare, and sports development.",
  "Each area responds to a different part of a child's journey, from staying in school and accessing care to developing confidence, discipline, and teamwork.",
];

export const programEvents: Array<{
  title: string;
  program: "education" | "healthcare" | "sports";
  date: string;
  location: string;
  summary: string;
}> = [
  {
    title: "Scholarship Mentorship Forum",
    program: "education",
    date: "2026-02-14",
    location: "Nairobi",
    summary:
      "A guidance session for scholarship beneficiaries focused on academic planning, mentorship, and leadership growth.",
  },
  {
    title: "Community Health Outreach Day",
    program: "healthcare",
    date: "2026-02-21",
    location: "Kajiado",
    summary:
      "A field day centered on consultations, health education, and practical family wellbeing support.",
  },
  {
    title: "Rising Stars League Opening Weekend",
    program: "sports",
    date: "2026-03-07",
    location: "Nairobi",
    summary:
      "The opening weekend for youth sports activities, bringing together teams, coaches, and families around structured development through sport.",
  },
  {
    title: "School Supply Distribution Drive",
    program: "education",
    date: "2026-03-18",
    location: "Machakos",
    summary:
      "A focused distribution event supporting learners with practical materials needed for consistent participation in school.",
  },
  {
    title: "Maternal and Child Wellness Clinic",
    program: "healthcare",
    date: "2026-04-09",
    location: "Kibera",
    summary:
      "A wellness clinic offering preventive guidance, maternal support, and child-focused health engagement for families.",
  },
  {
    title: "Youth Talent Showcase",
    program: "sports",
    date: "2026-04-25",
    location: "Nairobi",
    summary:
      "A showcase event highlighting discipline, teamwork, and emerging youth talent developed through structured sporting activity.",
  },
];

export const impactMetrics = [
  { value: "2,400+", label: "Children directly supported" },
  { value: "580", label: "Scholarships awarded" },
  { value: "12,000+", label: "Health consultations given" },
  { value: "320", label: "Athletes in active leagues" },
];

export const impactContextStats = [
  {
    title: "Children living in poverty",
    value: "42.4%",
    body:
      "UNICEF Kenya reports that 42.4 per cent of children in Kenya were living in poverty in 2022, with rural and ASAL areas facing the sharpest deprivation.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Children out of school",
    value: "2.5M",
    body:
      "The same UNICEF Kenya snapshot highlights 2.5 million out-of-school children, showing how many learners still remain outside stable access to education.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Child stunting",
    value: "18%",
    body:
      "UNICEF Kenya also notes that child stunting remains at 18 per cent, underlining how nutrition and child wellbeing continue to shape long-term development.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
  {
    title: "Youth outside learning or work",
    value: "~20%",
    body:
      "Generation Unlimited Kenya reports that nearly 20 per cent of youth are not in education, employment, or training, reinforcing the need for stronger transition pathways for young people.",
    sourceLabel: "Generation Unlimited Kenya, accessed 2026",
    sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
  },
];

export const impactFrames = [
  {
    title: "Education support in response",
    body:
      "We respond to educational barriers through scholarships, learning resources, and mentoring that help children remain present in school and continue progressing.",
  },
  {
    title: "Health outreach in response",
    body:
      "Our healthcare work meets wellbeing challenges through consultations, community outreach, nutrition-related support, and maternal and family-focused care.",
  },
  {
    title: "Youth development in response",
    body:
      "Our sports programs create structured spaces where children and young people can build discipline, teamwork, confidence, and a stronger sense of future possibility.",
  },
];

export const impactMilestones = [
  {
    year: "Foundation work",
    title: "A mission built around joined-up support",
    body:
      "We work from the understanding that education, health, and youth development must reinforce one another in practice.",
  },
  {
    year: "Scholarships",
    title: "Learning support reaches children who need continuity",
    body:
      "Scholarship and education support help reduce the risk of interrupted learning and create stronger pathways toward school retention.",
  },
  {
    year: "Outreach",
    title: "Health services move closer to communities",
    body:
      "Outreach activity brings practical care, consultation, and family-centered support closer to children whose needs are often shaped by location and affordability.",
  },
  {
    year: "Youth growth",
    title: "Structured sport becomes a development pathway",
    body:
      "By building leagues and organized activity, CZN turns sport into a place for teamwork, confidence, and disciplined growth rather than informal participation alone.",
  },
];

export const impactDomainViews = [
  {
    slug: "education",
    label: "Education",
    intro:
      "Educational exclusion remains one of the clearest barriers to long-term opportunity for children in Kenya.",
    stats: [
      {
        label: "Out-of-school children",
        value: 2.5,
        suffix: "M",
        detail:
          "UNICEF Kenya reports 2.5 million out-of-school children, reflecting the scale of interrupted access to learning.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
      {
        label: "Children in poverty",
        value: 42.4,
        suffix: "%",
        detail:
          "Child poverty continues to shape whether learners can stay in school and access the conditions needed to progress.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
    ],
    response:
      "We answer this pressure through scholarships, mentoring, school supplies, and stronger continuity in learning.",
  },
  {
    slug: "health",
    label: "Health",
    intro:
      "Health pressures remain deeply tied to nutrition, maternal wellbeing, and the uneven reach of family-centered care.",
    stats: [
      {
        label: "Children stunted",
        value: 18,
        suffix: "%",
        detail:
          "UNICEF Kenya identifies child stunting at 18 per cent nationally, showing the long-term development effects of undernutrition.",
        sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
        sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
      },
      {
        label: "Children under five with stunting",
        value: 25,
        suffix: "%+",
        detail:
          "UNICEF Kenya's nutrition overview notes that more than a quarter of children under five, roughly two million, have stunted growth.",
        sourceLabel: "UNICEF Kenya Nutrition",
        sourceUrl: "https://www.unicef.org/kenya/nutrition",
      },
    ],
    response:
      "We respond through outreach, consultations, family support, and practical wellbeing services closer to communities.",
  },
  {
    slug: "youth",
    label: "Youth",
    intro:
      "Young people across Kenya face difficult transitions from school into skills, work, and structured opportunity.",
    stats: [
      {
        label: "Youth not in education, employment or training",
        value: 20,
        suffix: "%~",
        detail:
          "Generation Unlimited Kenya reports that nearly one fifth of youth are not in education, employment, or training.",
        sourceLabel: "Generation Unlimited Kenya",
        sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
      },
      {
        label: "New jobs needed each year",
        value: 900000,
        suffix: "",
        detail:
          "GenU Kenya notes that about 900,000 new jobs are needed each year to absorb the growing working-age population.",
        sourceLabel: "Generation Unlimited Kenya",
        sourceUrl: "https://www.unicef.org/genunlimited/genu-kenya",
      },
    ],
    response:
      "We create structured spaces where discipline, teamwork, confidence, and visibility can grow.",
  },
] as const;

export const impactCountyPressure = [
  {
    area: "Kitui",
    value: 46,
    tone: "high",
    label: "Stunting rate",
    note:
      "UNICEF Kenya reports that child stunting is as high as 46 per cent in Kitui.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "West Pokot",
    value: 46,
    tone: "high",
    label: "Stunting rate",
    note:
      "West Pokot is also cited by UNICEF Kenya as reaching 46 per cent stunting among children.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "ASAL counties",
    value: 20,
    tone: "medium",
    label: "Wasting can exceed",
    note:
      "UNICEF Kenya notes that wasting rises above 20 per cent in many arid and semi-arid counties.",
    sourceLabel: "UNICEF Kenya Nutrition",
    sourceUrl: "https://www.unicef.org/kenya/nutrition",
  },
  {
    area: "Rural and ASAL regions",
    value: 42.4,
    tone: "medium",
    label: "National child poverty context",
    note:
      "The national child poverty rate is 42.4 per cent, with rural and ASAL regions identified as the most deprived.",
    sourceLabel: "UNICEF Kenya Child Sensitive Snapshot, December 2025",
    sourceUrl: "https://www.unicef.org/kenya/reports/child-sensitive-snapshot",
  },
] as const;

export const impactResponseComparisons = [
  {
    title: "Education",
    challengeLabel: "2.5M children out of school nationally",
    responseLabel: "580 scholarships awarded through our work",
    challengeValue: 100,
    responseValue: 23,
  },
  {
    title: "Healthcare",
    challengeLabel: "18% child stunting nationally",
    responseLabel: "12,000+ health consultations delivered",
    challengeValue: 100,
    responseValue: 67,
  },
  {
    title: "Youth Development",
    challengeLabel: "Nearly 20% of youth outside learning or work",
    responseLabel: "320 athletes active in our leagues",
    challengeValue: 100,
    responseValue: 31,
  },
] as const;

export const storiesIntro = [
  "Stories bring us closer to the children, families, and communities whose lives give meaning to the work.",
  "They help us share progress with warmth, honesty, and a clearer sense of what support looks like in everyday life.",
];

export const featuredStory = {
  category: "Community Story",
  title: "Small moments of support often become turning points in a child's life.",
  summary:
    "A scholarship, a clinic visit, a training session, or a team gathering may look small from the outside. For a child or family, that moment can change the way tomorrow feels.",
  detail:
    "What stays with us are the everyday signs of hope taking root in a classroom, during outreach, on a field, or in the steady encouragement of a family that feels less alone.",
};

export const stories = [
  {
    date: "March 15, 2025",
    category: "Education",
    title: "50 new scholarships awarded in Kibera and Mathare",
    summary:
      "A new scholarship intake opened the door for more learners to stay in school with greater stability, encouragement, and material support.",
  },
  {
    date: "February 28, 2025",
    category: "Healthcare",
    title: "Mobile clinic reaches 800 families in Turkana County",
    summary:
      "A two-week outreach mission brought consultations, immunisation support, and practical care closer to families who are often far from reliable services.",
  },
  {
    date: "January 10, 2025",
    category: "Sports",
    title: "Rising Stars League opens its biggest season yet",
    summary:
      "A record season opened with more young people stepping into structured sport, teamwork, and confidence-building activity.",
  },
];

export const storyThemes = [
  {
    title: "Program updates",
    body:
      "Follow the milestones, field days, and moments of progress that show how support is taking shape across our work.",
  },
  {
    title: "Voices from communities",
    body:
      "Listen to children, caregivers, volunteers, and partners whose words reflect what care, encouragement, and opportunity can feel like up close.",
  },
  {
    title: "Partner communication",
    body:
      "Stay close to the work through field notes, campaign highlights, and updates worth sharing with those who walk alongside us.",
  },
];

export const voiceSnippets = [
  {
    name: "Amina",
    role: "Nuru Scholar",
    quote:
      "For the first time, I felt like someone expected me to keep going and believed I could.",
  },
  {
    name: "Mary",
    role: "Parent",
    quote:
      "When support reached our home, school stopped feeling impossible and the future stopped feeling far away.",
  },
  {
    name: "Coach Daniel",
    role: "Youth Mentor",
    quote:
      "Sport gave the young people I work with more than a game. It gave them rhythm, discipline, and a sense of belonging.",
  },
  {
    name: "Nurse Ruth",
    role: "Outreach Volunteer",
    quote:
      "The strongest moments are often the simplest ones, when a family realizes they do not have to carry everything alone.",
  },
];

export const storyGalleries = [
  {
    title: "A day of learning and attention in the classroom",
    date: "April 2025",
    intro:
      "Some of the clearest signs of hope are visible in classrooms where children are focused, present, and engaged.",
    images: [
      {
        ...imageLibrary.classroomBoy,
        caption: "Concentration, curiosity, and classroom presence are small but important signs of continuity.",
      },
      {
        ...imageLibrary.girlsBlue,
        caption: "Shared learning spaces also create community, confidence, and encouragement among peers.",
      },
      {
        ...imageLibrary.schoolBoys,
        caption: "School life carries social belonging as well as academic possibility.",
      },
    ],
  },
  {
    title: "Children in motion, confidence in the making",
    date: "March 2025",
    intro:
      "Growth is not always quiet. It also appears in movement, play, teamwork, and the confidence children carry with one another.",
    images: [
      {
        ...imageLibrary.runningChildren,
        caption: "Movement and play create room for energy, joy, and healthy development.",
      },
      {
        ...imageLibrary.greenUniformChildren,
        caption: "Shared moments of confidence often become part of a child's deeper sense of possibility.",
      },
      {
        ...imageLibrary.smilingGirl,
        caption: "A single expression can say a great deal about safety, connection, and self-belief.",
      },
    ],
  },
];

export const videoHighlights = [
  {
    title: "Scholarship journeys and classroom confidence",
    duration: "02:18",
    summary:
      "A short video story can help show what educational support feels like from the perspective of learners and mentors.",
  },
  {
    title: "Outreach days that bring care closer to families",
    duration: "01:46",
    summary:
      "Video can also document the rhythm of outreach: arrival, consultation, conversation, and practical support.",
  },
];

export const involvementOptions = [
  {
    title: "Donate",
    description:
      "Fund scholarships, health outreach, and access to sports with one-time or recurring support.",
  },
  {
    title: "Volunteer",
    description:
      "Offer time and expertise as a teacher, mentor, clinician, coach, or operations volunteer.",
  },
  {
    title: "Partner",
    description:
      "Collaborate as a company, school, NGO, or community institution to scale sustainable impact.",
  },
];

export const involvementDetails = [
  {
    title: "For individual supporters",
    body:
      "Individuals can give, mentor, volunteer at events, or lend practical skills that help children stay in school, access care, and grow in confidence.",
  },
  {
    title: "For institutions",
    body:
      "Schools, companies, NGOs, and community groups can stand with us through sponsorship, outreach support, equipment, and long-term program collaboration.",
  },
  {
    title: "For advocates",
    body:
      "Advocates can open doors, amplify the work, bring the right people together, and help more families hear about the support available to them.",
  },
];

export const contactIntro = [
  "Whether you want to support a child's education, partner on outreach, volunteer your time, or simply learn more, this page is designed to make that first conversation easier.",
  "Every enquiry can become the start of practical support, a partnership, or a longer relationship with the foundation's mission.",
];

export const contactDetails = {
  email: "info@czn.org",
  phone: "+254 700 000 000",
  location: "Nairobi, Kenya",
};
