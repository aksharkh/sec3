"use client";

import { useMemo, useState } from "react";
import type { Story } from "@/lib/stories";
import { StoryCard } from "./StoryCard";

export function StoriesGrid({ items, industries, frameworks }: { items: Story[]; industries: string[]; frameworks: string[] }) {
  const [industry, setIndustry] = useState("All");
  const [framework, setFramework] = useState("All");

  const list = useMemo(
    () => items.filter((s) => (industry === "All" || s.industry === industry) && (framework === "All" || s.frameworks.includes(framework))),
    [items, industry, framework],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by industry">
          {["All", ...industries].map((i) => (
            <button
              key={i}
              type="button"
              aria-pressed={industry === i}
              onClick={() => setIndustry(i)}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${industry === i ? "bg-ink text-ivory" : "hover:bg-ink/5"}`}
            >
              {i}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <span className="eyebrow text-muted">Framework</span>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="h-10 rounded-full border border-ink/15 bg-transparent px-4 outline-none focus:border-brand"
          >
            {["All", ...frameworks].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="eyebrow mt-8 text-muted" aria-live="polite">
        Showing {list.length} of {items.length} stories
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s, i) => (
          <div key={s.slug} className="animate-[fadeUp_0.7s_var(--ease-out)_both]" style={{ animationDelay: `${i * 60}ms` }}>
            <StoryCard story={s} className="h-full" />
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <div className="mt-6 rounded-[2rem] border border-dashed border-ink/20 p-16 text-center">
          <p className="text-2xl tracking-[-0.02em]">No stories match those filters yet.</p>
          <button type="button" onClick={() => (setIndustry("All"), setFramework("All"))} className="mt-4 underline underline-offset-4">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
