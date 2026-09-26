/** PLACEHOLDER — sample articles to demonstrate the Insights templates. Replace with the client's editorial content. */

export type Article = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  read: string;
  author: string;
  excerpt: string;
  tone: "brand" | "accent" | "ink" | "paper";
  sections: { h: string; p: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "cmmc-phase-two-what-changes",
    title: "CMMC Phase II: what actually changes for defense suppliers",
    tag: "Government",
    date: "2026-09-02",
    read: "8 min",
    author: "SecureKnots Advisory",
    excerpt: "Certification requirements are moving from self-assessment into contract award decisions. Here's how to prepare without boiling the ocean.",
    tone: "brand",
    sections: [
      { h: "The shift from attestation to assessment", p: ["For years, defense suppliers could self-attest to NIST SP 800-171. CMMC changes the burden of proof: for most contracts involving Controlled Unclassified Information, an independent assessment becomes the gate.", "As requirements phase into solicitations, the practical question is no longer whether CMMC applies, but when it will appear in the contracts you care about."] },
      { h: "Start with scope, not controls", p: ["The single most effective lever is scope. An enclave that isolates CUI can shrink the assessment boundary from the whole company to a handful of users and systems.", "Map where CUI actually flows — email, file shares, CAD systems, the shop floor — before writing a single policy."] },
      { h: "Write an SSP your team can maintain", p: ["Assessors read the System Security Plan closely. A plan written in plain language, reflecting how you really operate, is worth more than a template padded with boilerplate."] },
      { h: "Rehearse before it counts", p: ["A mock assessment surfaces evidence gaps while there's still time to fix them. Treat it as a dress rehearsal, not a formality."] },
    ],
  },
  {
    slug: "iso-42001-new-soc-2-for-ai",
    title: "ISO 42001 is becoming the SOC 2 of AI companies",
    tag: "AI Governance",
    date: "2026-08-18",
    read: "6 min",
    author: "SecureKnots Advisory",
    excerpt: "Enterprise buyers now ask how your AI is governed. A certifiable AI management system answers the question once.",
    tone: "accent",
    sections: [
      { h: "Why buyers are asking", p: ["Procurement teams have added AI sections to their security questionnaires: model risk, training data provenance, human oversight, incident handling. SOC 2 wasn't designed to answer these."] },
      { h: "What ISO 42001 covers", p: ["The standard defines an AI management system: policy, roles, AI risk assessment, AI system impact assessment and lifecycle controls from data to deployment."] },
      { h: "Build on what you have", p: ["If you already run ISO 27001 or SOC 2, much of the management-system structure carries over. The new work is AI-specific, and it's where the real differentiation lives."] },
    ],
  },
  {
    slug: "soc-2-or-iso-27001-first",
    title: "SOC 2 or ISO 27001 first? A decision framework for founders",
    tag: "Strategy",
    date: "2026-07-30",
    read: "5 min",
    author: "SecureKnots Advisory",
    excerpt: "The right first framework depends on where your buyers are and what they'll accept. Here's a simple way to decide.",
    tone: "ink",
    sections: [
      { h: "Follow your pipeline", p: ["North American buyers tend to ask for SOC 2. European, Middle Eastern and many Asian buyers lean towards ISO 27001. Look at the last ten security reviews you faced."] },
      { h: "Plan for both from day one", p: ["The controls overlap heavily. Designing one control set that satisfies both means the second framework costs a fraction of the first."] },
      { h: "Mind the timelines", p: ["A SOC 2 Type I can land quickly, but Type II needs an observation window. ISO 27001 certification is a single two-stage audit. Sequence them around your deal calendar."] },
    ],
  },
  {
    slug: "pci-dss-v4-targeted-risk-analysis",
    title: "PCI DSS v4 targeted risk analyses, explained without jargon",
    tag: "Financial",
    date: "2026-07-11",
    read: "7 min",
    author: "SecureKnots Advisory",
    excerpt: "v4 lets you set some control frequencies yourself — if you can justify them. Here's what a good analysis looks like.",
    tone: "paper",
    sections: [
      { h: "Flexibility with accountability", p: ["Several v4 requirements let entities define how often an activity happens, provided a documented targeted risk analysis supports the choice."] },
      { h: "Anatomy of a good analysis", p: ["Identify the asset, the threat, the likelihood and impact, and the resulting frequency — then review it at least annually."] },
    ],
  },
  {
    slug: "dora-third-party-register",
    title: "DORA's register of information: the part everyone underestimated",
    tag: "Financial",
    date: "2026-06-24",
    read: "6 min",
    author: "SecureKnots Advisory",
    excerpt: "Mapping every ICT third party and the functions it supports is harder than it looks. Lessons from the first year of DORA.",
    tone: "brand",
    sections: [
      { h: "More than a vendor list", p: ["The register links contracts, services and the critical or important functions they support — a view most procurement systems were never designed to produce."] },
      { h: "Make it maintainable", p: ["Assign owners, integrate with onboarding, and treat the register as a living record rather than an annual spreadsheet exercise."] },
    ],
  },
  {
    slug: "dpdpa-rules-readiness",
    title: "India's DPDP Rules are here. What to do in the first 90 days",
    tag: "Privacy",
    date: "2026-06-05",
    read: "7 min",
    author: "SecureKnots Advisory",
    excerpt: "Notices, consent, breach reporting and rights handling — a practical first-quarter plan for data fiduciaries.",
    tone: "ink",
    sections: [
      { h: "Inventory before notices", p: ["You can't write an itemised notice without knowing what you collect and why. Start with a data inventory tied to purposes."] },
      { h: "Operationalise rights", p: ["Access, correction and erasure requests need owners, workflows and timelines — test them before users do."] },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const articleTags = Array.from(new Set(articles.map((a) => a.tag)));
