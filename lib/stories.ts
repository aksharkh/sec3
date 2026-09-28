/**
 * PLACEHOLDER, sample customer stories with fictional company names.
 * Replace with approved client case studies (names, logos, figures, quotes) before launch.
 */

export type Story = {
  slug: string;
  company: string;
  mark: string; // short wordmark glyph
  industry: string;
  size: string;
  hq: string;
  frameworks: string[];
  services: string[];
  headline: string;
  summary: string;
  metrics: { v: string; l: string }[];
  quote: { text: string; name: string; role: string };
  challenge: string[];
  approach: { t: string; d: string }[];
  results: string[];
  weeks: number;
  tone: "brand" | "ink" | "accent" | "paper";
  featured?: boolean;
};

export const stories: Story[] = [
  {
    slug: "parallax-health",
    company: "Parallax Health",
    mark: "PH",
    industry: "Healthcare",
    size: "180 employees",
    hq: "Boston, US",
    frameworks: ["SOC 2", "ISO 27001", "HIPAA"],
    services: ["Unified Audit", "Audit Readiness"],
    headline: "Three frameworks, one fieldwork window, zero engineering fire drills.",
    summary: "A Series B digital-health platform needed SOC 2 Type II, ISO 27001 and HIPAA in the same year to close hospital-system contracts.",
    metrics: [
      { v: "3", l: "Frameworks in one program" },
      { v: "14 wks", l: "From kickoff to reports" },
      { v: "62%", l: "Fewer evidence requests" },
    ],
    quote: {
      text: "We had three audits on the same roadmap. SecureKnots turned it into one program, our engineers barely noticed it happening.",
      name: "VP Engineering",
      role: "Parallax Health",
    },
    challenge: [
      "Parallax's enterprise pipeline was stalling in security review. Every hospital system asked for something different, one wanted SOC 2, another ISO 27001, all of them wanted HIPAA assurances.",
      "Running three separate projects would have tied up the platform team for most of the year, right as they were shipping a major product release.",
    ],
    approach: [
      { t: "Unified scoping", d: "One system boundary and one risk assessment built to satisfy all three frameworks." },
      { t: "Single control library", d: "118 controls mapped across SOC 2 TSC, ISO Annex A and the HIPAA Security Rule." },
      { t: "Evidence once", d: "Automated evidence from AWS, Okta and GitHub, reused across every auditor request." },
      { t: "Coordinated fieldwork", d: "CPA firm and certification body scheduled back to back in one window." },
    ],
    results: [
      "SOC 2 Type I, ISO 27001 certification and HIPAA assessment delivered in 14 weeks",
      "Two stalled hospital contracts closed within a month of reports landing",
      "Security questionnaire turnaround cut from weeks to two days",
    ],
    weeks: 14,
    tone: "brand",
    featured: true,
  },
  {
    slug: "orbital-pay",
    company: "Orbital Pay",
    mark: "OP",
    industry: "Fintech",
    size: "320 employees",
    hq: "London, UK & Bengaluru, IN",
    frameworks: ["PCI DSS", "SOC 1", "DORA"],
    services: ["Compliance Advisory", "Security Testing"],
    headline: "PCI DSS v4 and DORA readiness without doubling the compliance team.",
    summary: "A cross-border payments company faced PCI DSS v4's new requirements and DORA's January 2025 deadline at the same time.",
    metrics: [
      { v: "41%", l: "Smaller cardholder data scope" },
      { v: "0", l: "Findings on first ROC under v4" },
      { v: "5 mo", l: "To DORA readiness" },
    ],
    quote: {
      text: "They'd clearly sat on the auditor's side of the table. Every piece of evidence we produced was accepted first time.",
      name: "Head of Security",
      role: "Orbital Pay",
    },
    challenge: [
      "Orbital's card environment had grown organically across two regions. PCI DSS v4 brought targeted risk analyses and new authentication requirements, while DORA demanded a full ICT third-party register.",
    ],
    approach: [
      { t: "Scope reduction", d: "Network segmentation redesign removed dozens of systems from the CDE." },
      { t: "Targeted risk analyses", d: "Documented analyses for every flexible-frequency requirement." },
      { t: "DORA gap to plan", d: "ICT risk framework, incident classification and register of information built alongside PCI." },
      { t: "Pen testing", d: "Segmentation and application testing scoped to satisfy both regimes." },
    ],
    results: ["Clean PCI DSS v4 Report on Compliance", "DORA register and ICT risk framework ready ahead of supervisory review", "One control set now serving PCI, SOC 1 and DORA"],
    weeks: 22,
    tone: "ink",
  },
  {
    slug: "northstar-defense-works",
    company: "Northstar Defense Works",
    mark: "ND",
    industry: "Government & Defense",
    size: "60 employees",
    hq: "Huntsville, US",
    frameworks: ["CMMC", "NIST 800-53", "ITAR"],
    services: ["Audit Readiness", "Continuous Compliance"],
    headline: "From CMMC anxiety to a clean Level 2 assessment in fourteen weeks.",
    summary: "A precision-machining supplier to defense primes needed CMMC Level 2 to keep its place in the supply chain.",
    metrics: [
      { v: "110/110", l: "NIST 800-171 requirements met" },
      { v: "14 wks", l: "To assessment-ready" },
      { v: "1", l: "Enclave instead of whole-company scope" },
    ],
    quote: {
      text: "CMMC felt impossible for a 60-person shop. Fourteen weeks later we had a clean assessment and a system we actually understand.",
      name: "CEO",
      role: "Northstar Defense Works",
    },
    challenge: [
      "Northstar handled CUI in email, file shares and on the shop floor. With no dedicated security staff, a whole-company Level 2 scope looked unaffordable.",
    ],
    approach: [
      { t: "CUI enclave", d: "A dedicated cloud enclave dramatically reduced the assessment boundary." },
      { t: "SSP authored", d: "A plain-language System Security Plan the team could maintain." },
      { t: "ITAR alignment", d: "Foreign-person access controls built into the same enclave." },
      { t: "Mock assessment", d: "Full C3PAO-style dry run before the real thing." },
    ],
    results: ["CMMC Level 2 assessment passed with no open POA&M items", "Retained two prime-contractor relationships", "Ongoing vCISO keeps annual affirmations routine"],
    weeks: 14,
    tone: "paper",
  },
  {
    slug: "lumen-ai",
    company: "Lumen AI",
    mark: "LA",
    industry: "AI & Data",
    size: "90 employees",
    hq: "San Francisco, US",
    frameworks: ["ISO 42001", "SOC 2", "GDPR"],
    services: ["Compliance Advisory", "Unified Audit"],
    headline: "Among the first in its category certified to ISO 42001.",
    summary: "An enterprise AI platform turned responsible-AI governance from a sales objection into a differentiator.",
    metrics: [
      { v: "1st", l: "ISO 42001 in its segment" },
      { v: "12 wks", l: "Certification timeline" },
      { v: "3×", l: "Faster enterprise security reviews" },
    ],
    quote: {
      text: "Buyers stopped asking whether our AI was governed. Now we send the certificate and move on to pricing.",
      name: "Co-founder & CTO",
      role: "Lumen AI",
    },
    challenge: ["Enterprise buyers were asking detailed questions about model risk, training data and human oversight, questions SOC 2 alone couldn't answer."],
    approach: [
      { t: "AI inventory", d: "Every model, dataset and AI-enabled feature catalogued." },
      { t: "Impact assessments", d: "AI system impact assessments for customer-facing capabilities." },
      { t: "Shared ISMS core", d: "ISO 42001 built on the existing SOC 2 control foundation." },
      { t: "GDPR alignment", d: "Training-data lawful basis and DPIAs integrated." },
    ],
    results: ["ISO 42001 certification in 12 weeks", "Responsible-AI trust page adopted by sales", "Governance questionnaire answered from a single source"],
    weeks: 12,
    tone: "accent",
  },
  {
    slug: "cloudharbor",
    company: "Cloudharbor",
    mark: "CH",
    industry: "SaaS & Cloud",
    size: "45 employees",
    hq: "Austin, US",
    frameworks: ["SOC 2", "SOC 3"],
    services: ["Audit Readiness"],
    headline: "First SOC 2 report in nine weeks, and a public SOC 3 on the website.",
    summary: "A seed-stage infrastructure startup needed SOC 2 to sign its first Fortune 500 customer.",
    metrics: [
      { v: "9 wks", l: "To SOC 2 Type I" },
      { v: "$1.2M", l: "First enterprise contract unblocked" },
      { v: "0", l: "Exceptions in Type II" },
    ],
    quote: {
      text: "We didn't have a security team. We had SecureKnots, and that turned out to be enough.",
      name: "Founder & CEO",
      role: "Cloudharbor",
    },
    challenge: ["A signed LOI from a Fortune 500 buyer was contingent on a SOC 2 report within a quarter."],
    approach: [
      { t: "Right-sized scope", d: "Security criterion only, sized to what the buyer required." },
      { t: "Policy sprint", d: "A full policy set written and approved in two weeks." },
      { t: "Tooling setup", d: "Evidence automation connected to their existing stack." },
      { t: "Type II runway", d: "Observation window started the day Type I was issued." },
    ],
    results: ["SOC 2 Type I in 9 weeks, Type II six months later", "Public SOC 3 report now on the trust page", "Enterprise contract signed"],
    weeks: 9,
    tone: "brand",
  },
  {
    slug: "meridian-capital-markets",
    company: "Meridian Capital Markets",
    mark: "MC",
    industry: "Financial Services",
    size: "1,200 employees",
    hq: "Mumbai, IN",
    frameworks: ["SEBI CSCRF", "ISO 27001", "DPDPA"],
    services: ["Compliance Advisory", "Continuous Compliance"],
    headline: "One framework for SEBI, ISO 27001 and India's new privacy law.",
    summary: "A large broking firm harmonised overlapping regulatory obligations into a single, board-reported program.",
    metrics: [
      { v: "3 → 1", l: "Programs consolidated" },
      { v: "100%", l: "CSCRF controls mapped" },
      { v: "30%", l: "Less audit preparation time" },
    ],
    quote: {
      text: "For the first time our board sees one cyber picture instead of three different audit reports.",
      name: "Chief Information Security Officer",
      role: "Meridian Capital Markets",
    },
    challenge: ["Separate teams were preparing for SEBI's new framework, ISO 27001 surveillance and DPDPA readiness, with conflicting policies and duplicated evidence."],
    approach: [
      { t: "Regulatory crosswalk", d: "CSCRF, ISO 27001 Annex A and DPDPA obligations mapped to one control set." },
      { t: "Governance redesign", d: "A single cyber and privacy committee reporting to the board." },
      { t: "Privacy program", d: "Consent, notices and data-principal rights operationalised." },
      { t: "Audit calendar", d: "Cyber audit and ISO surveillance aligned to one cycle." },
    ],
    results: ["Clean ISO 27001 surveillance and SEBI cyber audit", "DPDPA readiness roadmap underway", "Quarterly board dashboard across all obligations"],
    weeks: 20,
    tone: "ink",
  },
];

export const storyIndustries = Array.from(new Set(stories.map((s) => s.industry)));
export const storyFrameworks = Array.from(new Set(stories.flatMap((s) => s.frameworks)));
export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
