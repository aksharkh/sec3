import type { MetadataRoute } from "next";
import { frameworks } from "@/lib/frameworks";
import { services } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";

const base = "https://secureknots.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/frameworks", "/services", "/industries", "/customers", "/about", "/insights", "/careers", "/contact", "/privacy-policy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...frameworks.map((f) => ({ url: `${base}/frameworks/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...services.map((s) => ({ url: `${base}/services/${s.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...stories.map((s) => ({ url: `${base}/customers/${s.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
