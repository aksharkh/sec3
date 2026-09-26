/**
 * Site content. Anything marked PLACEHOLDER must be replaced with
 * client-supplied facts before launch (numbers, quotes, case studies).
 */

export const contact = {
  email: "contact@secureknots.com",
  phoneUS: "+1-302-608-6708",
  phoneIN: "080-3165-8865",
  offices: [
    {
      city: "Wilmington",
      region: "Delaware, US",
      address: "1207 Delaware Ave #749, Wilmington, DE 19806",
      tz: "America/New_York",
    },
    {
      city: "Bengaluru",
      region: "Karnataka, IN",
      address: "Bengaluru, India",
      tz: "Asia/Kolkata",
    },
  ],
};

export type FrameworkGroup = {
  id: string;
  name: string;
  blurb: string;
  items: { name: string; slug: string; full?: string }[];
};

export const frameworkGroups: FrameworkGroup[] = [
  {
    id: "assurance",
    name: "Security & Assurance",
    blurb: "Attestations your customers ask for first.",
    items: [
      { name: "SOC 2", slug: "soc-2", full: "Service Organization Control 2" },
      { name: "SOC 1", slug: "soc-1" },
      { name: "SOC 3", slug: "soc-3" },
      { name: "ISO 27001", slug: "iso-27001", full: "Information Security Management" },
      { name: "NIST CSF", slug: "nist-csf" },
      { name: "ITGC", slug: "itgc", full: "IT General Controls" },
      { name: "Unified Audits", slug: "unified-audits" },
    ],
  },
  {
    id: "government",
    name: "Government & Defense",
    blurb: "Authorisations that unlock public-sector revenue.",
    items: [
      { name: "FedRAMP", slug: "fedramp" },
      { name: "StateRAMP / GovRAMP", slug: "stateramp" },
      { name: "CMMC", slug: "cmmc", full: "Cybersecurity Maturity Model Certification" },
      { name: "NIST 800-53", slug: "nist-800-53" },
      { name: "ITAR", slug: "itar" },
      { name: "EAR", slug: "ear" },
    ],
  },
  {
    id: "privacy",
    name: "Privacy & AI",
    blurb: "Govern data and models before regulators do.",
    items: [
      { name: "ISO 42001", slug: "iso-42001", full: "AI Management System" },
      { name: "ISO 27701", slug: "iso-27701" },
      { name: "GDPR", slug: "gdpr" },
      { name: "CCPA", slug: "ccpa" },
      { name: "HIPAA", slug: "hipaa" },
      { name: "PDPA", slug: "pdpa" },
      { name: "DPDPA", slug: "dpdpa" },
    ],
  },
  {
    id: "financial",
    name: "Financial Services",
    blurb: "Resilience for payments, banking and markets.",
    items: [
      { name: "PCI DSS", slug: "pci-dss" },
      { name: "PCI Risk Assessment", slug: "pci-risk-assessment" },
      { name: "DORA", slug: "dora" },
      { name: "SEBI CSCRF", slug: "sebi-cscrf" },
    ],
  },
  {
    id: "management",
    name: "Management Systems",
    blurb: "Quality, continuity and operational excellence.",
    items: [
      { name: "ISO 9001", slug: "iso-9001" },
      { name: "ISO 20000", slug: "iso-20000" },
      { name: "ISO 22301", slug: "iso-22301" },
      { name: "ISO 41001", slug: "iso-41001" },
      { name: "ISO 45001", slug: "iso-45001" },
    ],
  },
];

export const frameworkCount = frameworkGroups.reduce((n, g) => n + g.items.length, 0);

export const services = [
  {
    id: "advisory",
    title: "Compliance Advisory",
    kicker: "Strategy",
    body: "We map where you sell to what you must prove, then design one control set that satisfies every framework on your roadmap — not five parallel programs.",
    deliverables: ["Framework roadmap", "Unified control library", "Policy suite", "Board-ready reporting"],
  },
  {
    id: "readiness",
    title: "Audit Readiness",
    kicker: "Gap → Ready",
    body: "A practitioner-led gap assessment, a prioritised remediation plan, and hands-on help closing it. You walk into the audit knowing the outcome.",
    deliverables: ["Gap assessment", "Remediation sprints", "Evidence collection", "Mock audit"],
  },
  {
    id: "unified",
    title: "Unified Audit",
    kicker: "Assess once",
    body: "Test each control once and map the evidence to SOC 2, ISO 27001, PCI DSS, HIPAA and more. Fewer interviews, fewer samples, one calendar.",
    deliverables: ["Cross-framework mapping", "Single fieldwork window", "Consolidated reports", "Auditor coordination"],
  },
  {
    id: "testing",
    title: "Security Testing",
    kicker: "Offense",
    body: "Web, API, mobile, cloud and network penetration testing by certified testers — scoped to satisfy auditors and actually find what attackers would.",
    deliverables: ["VAPT", "Cloud configuration review", "Red team exercises", "Retest & attestation letter"],
  },
  {
    id: "continuous",
    title: "Continuous Compliance",
    kicker: "Always on",
    body: "A fractional compliance team and vCISO that keeps controls operating year-round, so renewal audits are a formality instead of a fire drill.",
    deliverables: ["vCISO", "Quarterly control testing", "Vendor risk management", "Security questionnaires"],
  },
];

export const process = [
  { n: "01", title: "Scope", time: "Week 1", body: "We learn your product, your buyers and your deadlines, then fix the exact frameworks, boundaries and systems in scope." },
  { n: "02", title: "Assess", time: "Weeks 2–3", body: "Control-by-control gap assessment against every target framework at once, with a single prioritised findings register." },
  { n: "03", title: "Remediate", time: "Weeks 3–10", body: "Policies written, controls implemented, evidence automated. We work inside your tools — Jira, GitHub, AWS, Google Workspace." },
  { n: "04", title: "Certify", time: "Weeks 10–14", body: "Mock audit, auditor selection and fieldwork support. We sit beside you until the report is signed." },
  { n: "05", title: "Sustain", time: "Year-round", body: "Continuous monitoring, quarterly testing and a renewal calendar that never surprises you." },
];

// PLACEHOLDER — replace with verified client figures.
export const stats = [
  { value: frameworkCount, suffix: "", label: "Frameworks delivered under one roof" },
  { value: 250, suffix: "+", label: "Audits and assessments completed" },
  { value: 98, suffix: "%", label: "First-attempt certification rate" },
  { value: 60, suffix: "%", label: "Less audit effort with unified testing" },
];

export const industries = [
  { name: "SaaS & Cloud", frameworks: ["SOC 2", "ISO 27001", "ISO 42001", "GDPR"], note: "Close enterprise deals without the security-review stall." },
  { name: "Fintech & Payments", frameworks: ["PCI DSS", "SOC 1", "DORA", "SEBI CSCRF"], note: "Prove resilience to banks, networks and regulators." },
  { name: "Healthcare & Life Sciences", frameworks: ["HIPAA", "ISO 27701", "SOC 2", "GDPR"], note: "Protect patient data and pass partner diligence." },
  { name: "Government & Defense", frameworks: ["FedRAMP", "CMMC", "NIST 800-53", "ITAR"], note: "Win public-sector contracts with authorisation in hand." },
  { name: "AI & Data Platforms", frameworks: ["ISO 42001", "NIST AI RMF", "GDPR", "SOC 2"], note: "Show responsible AI governance before buyers ask." },
  { name: "Enterprise & BFSI", frameworks: ["ISO 22301", "ITGC", "SOC 1", "DPDPA"], note: "Harmonise controls across entities and geographies." },
];

// PLACEHOLDER — anonymised sample testimonials; replace with approved client quotes.
export const testimonials = [
  {
    quote: "We had SOC 2, ISO 27001 and HIPAA on the same year's roadmap. SecureKnots turned it into one program and one fieldwork window. Our engineers barely noticed.",
    name: "VP Engineering",
    org: "Series B health-tech SaaS",
  },
  {
    quote: "They'd clearly sat on the auditor side of the table. Every piece of evidence we produced was accepted first time.",
    name: "Head of Security",
    org: "Payments platform, Europe & India",
  },
  {
    quote: "CMMC felt impossible for a 60-person supplier. Fourteen weeks later we had a clean assessment and a system we actually understand.",
    name: "CEO",
    org: "US defense manufacturer",
  },
];

/* ───────── Overlap map ─────────
   Illustrative mapping of control domains to frameworks, used by the
   interactive "Assess once" section. Weights ≈ number of testable controls. */
export const controlDomains = [
  { id: "gov", name: "Governance & Policy", weight: 14 },
  { id: "risk", name: "Risk Assessment", weight: 9 },
  { id: "access", name: "Access Control", weight: 18 },
  { id: "asset", name: "Asset Management", weight: 8 },
  { id: "crypto", name: "Cryptography", weight: 6 },
  { id: "ops", name: "Logging & Monitoring", weight: 12 },
  { id: "change", name: "Change Management", weight: 10 },
  { id: "sdlc", name: "Secure SDLC", weight: 9 },
  { id: "vendor", name: "Vendor Risk", weight: 7 },
  { id: "ir", name: "Incident Response", weight: 8 },
  { id: "bcdr", name: "Continuity & DR", weight: 7 },
  { id: "hr", name: "People Security", weight: 6 },
  { id: "physical", name: "Physical Security", weight: 7 },
  { id: "privacy", name: "Privacy & Data Rights", weight: 12 },
  { id: "cardholder", name: "Cardholder Data", weight: 11 },
  { id: "cui", name: "CUI Handling", weight: 10 },
] as const;

export type DomainId = (typeof controlDomains)[number]["id"];

const core: DomainId[] = ["gov", "risk", "access", "asset", "crypto", "ops", "change", "vendor", "ir", "hr"];

export const overlapFrameworks: { name: string; domains: DomainId[] }[] = [
  { name: "SOC 2", domains: [...core, "sdlc", "bcdr", "physical"] },
  { name: "ISO 27001", domains: [...core, "sdlc", "bcdr", "physical"] },
  { name: "PCI DSS", domains: [...core, "sdlc", "physical", "cardholder"] },
  { name: "HIPAA", domains: [...core, "bcdr", "physical", "privacy"] },
  { name: "GDPR", domains: ["gov", "risk", "access", "crypto", "vendor", "ir", "privacy"] },
  { name: "CMMC", domains: [...core, "physical", "cui"] },
  { name: "FedRAMP", domains: [...core, "sdlc", "bcdr", "physical", "cui"] },
  { name: "ISO 42001", domains: ["gov", "risk", "asset", "ops", "change", "sdlc", "vendor", "privacy"] },
];

/* ───────── Site navigation ───────── */
export const navLinks = [
  { label: "Frameworks", href: "/frameworks", menu: "frameworks" as const },
  { label: "Services", href: "/services", menu: "services" as const },
  { label: "Industries", href: "/industries" },
  { label: "Customers", href: "/customers" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

/* ───────── Service detail pages ───────── */
export const serviceDetails: Record<
  string,
  { tagline: string; includes: { t: string; d: string }[]; outcomes: { v: string; l: string }[]; frameworks: string[] }
> = {
  advisory: {
    tagline: "A roadmap that turns every framework you'll ever need into one program.",
    includes: [
      { t: "Framework strategy", d: "Which frameworks, in what order, tied to your pipeline and markets." },
      { t: "Unified control library", d: "One control set mapped to every target requirement." },
      { t: "Policy suite", d: "Plain-language policies your teams will actually follow." },
      { t: "Risk management", d: "Risk methodology, register and treatment plans." },
      { t: "Board reporting", d: "One executive view of posture across all obligations." },
      { t: "Regulatory watch", d: "Early warning on changes that affect you." },
    ],
    outcomes: [{ v: "1", l: "Control set for every framework" }, { v: "60%", l: "Less duplicated work" }, { v: "2 wks", l: "To a costed roadmap" }],
    frameworks: ["soc-2", "iso-27001", "iso-42001", "gdpr", "dora"],
  },
  readiness: {
    tagline: "Walk into the audit already knowing the outcome.",
    includes: [
      { t: "Gap assessment", d: "Control-by-control review against each target framework." },
      { t: "Remediation plan", d: "Prioritised, owned and sized to your team." },
      { t: "Hands-on remediation", d: "We write, configure and implement alongside you." },
      { t: "Evidence collection", d: "Automated where possible, organised always." },
      { t: "Mock audit", d: "A realistic dry run with auditor-grade sampling." },
      { t: "Auditor selection", d: "Shortlisting and negotiation support." },
    ],
    outcomes: [{ v: "98%", l: "First-attempt pass rate" }, { v: "8–16", l: "Weeks to audit-ready" }, { v: "0", l: "Surprises in fieldwork" }],
    frameworks: ["soc-2", "iso-27001", "cmmc", "hipaa", "pci-dss"],
  },
  unified: {
    tagline: "Test each control once. Map the evidence everywhere.",
    includes: [
      { t: "Cross-framework mapping", d: "Every control traced to every applicable requirement." },
      { t: "Single fieldwork window", d: "Auditors and certification bodies coordinated." },
      { t: "Common evidence pool", d: "One request list, reused across assessors." },
      { t: "Consolidated findings", d: "One remediation register across frameworks." },
      { t: "Aligned renewals", d: "One compliance calendar instead of four." },
      { t: "Executive reporting", d: "One report for the board." },
    ],
    outcomes: [{ v: "3–5", l: "Frameworks per program" }, { v: "1", l: "Fieldwork window" }, { v: "60%", l: "Fewer evidence requests" }],
    frameworks: ["unified-audits", "soc-2", "iso-27001", "pci-dss", "hipaa"],
  },
  testing: {
    tagline: "Find what attackers would — and satisfy auditors in the same engagement.",
    includes: [
      { t: "Web & API testing", d: "OWASP-aligned manual and automated testing." },
      { t: "Cloud configuration review", d: "AWS, Azure and GCP posture assessment." },
      { t: "Network & segmentation", d: "Internal, external and PCI segmentation tests." },
      { t: "Mobile testing", d: "iOS and Android application security." },
      { t: "Red team", d: "Objective-based adversary simulation." },
      { t: "Retest & attestation", d: "Verification and a letter for your buyers." },
    ],
    outcomes: [{ v: "100%", l: "Manual validation of findings" }, { v: "48h", l: "Critical findings reported" }, { v: "Free", l: "Retest included" }],
    frameworks: ["pci-dss", "soc-2", "iso-27001", "dora", "fedramp"],
  },
  continuous: {
    tagline: "Stay audit-ready all year, so renewals are a formality.",
    includes: [
      { t: "Fractional vCISO", d: "Senior security leadership, part-time." },
      { t: "Quarterly control testing", d: "Internal audits that catch drift early." },
      { t: "Vendor risk management", d: "Third-party reviews and register upkeep." },
      { t: "Security questionnaires", d: "We answer them, fast and consistently." },
      { t: "Policy & training", d: "Annual reviews and awareness programs." },
      { t: "Renewal management", d: "Auditor scheduling and evidence refresh." },
    ],
    outcomes: [{ v: "365", l: "Days audit-ready" }, { v: "48h", l: "Questionnaire turnaround" }, { v: "1", l: "Named security lead" }],
    frameworks: ["soc-2", "iso-27001", "cmmc", "sebi-cscrf", "dpdpa"],
  },
};

/* ───────── About ───────── */
export const values = [
  { t: "Practitioners, not paper-pushers", d: "Our consultants have run security programs and sat on the auditor side of the table." },
  { t: "One program, many frameworks", d: "We design for the frameworks you'll need next year, not just this quarter." },
  { t: "Plain language", d: "If your engineers can't read the policy, it isn't a control." },
  { t: "Outcomes over hours", d: "We measure success in reports issued and deals closed." },
];

// PLACEHOLDER — replace with the real leadership team and credentials.
export const team = [
  { name: "Founder & CEO", role: "Leadership", focus: "Compliance strategy" },
  { name: "Head of Advisory", role: "Leadership", focus: "ISO & SOC programs" },
  { name: "Head of Government", role: "Leadership", focus: "FedRAMP & CMMC" },
  { name: "Head of Offensive Security", role: "Leadership", focus: "Penetration testing" },
  { name: "Head of Privacy", role: "Leadership", focus: "GDPR, DPDPA & AI" },
  { name: "Head of Delivery, India", role: "Leadership", focus: "SEBI & financial services" },
];

// PLACEHOLDER — confirm actual team certifications.
export const credentials = ["CISSP", "CISA", "CISM", "ISO 27001 Lead Auditor", "ISO 42001 Lead Auditor", "CMMC RP", "OSCP", "CIPP/E", "CRISC", "CCSP"];

// PLACEHOLDER — replace with real openings.
export const roles = [
  { title: "Senior GRC Consultant", team: "Advisory", location: "Remote, US", type: "Full-time" },
  { title: "ISO Lead Implementer", team: "Advisory", location: "Bengaluru, IN", type: "Full-time" },
  { title: "CMMC Assessment Specialist", team: "Government", location: "Remote, US", type: "Full-time" },
  { title: "Penetration Tester", team: "Offensive Security", location: "Bengaluru, IN / Remote", type: "Full-time" },
  { title: "Privacy Counsel", team: "Privacy", location: "Remote, EU / IN", type: "Contract" },
];
