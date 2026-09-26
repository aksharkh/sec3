"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Framework } from "@/lib/frameworks";
import { frameworkGroups } from "@/lib/content";
import { Glyph } from "@/components/ui/Glyph";
import { Arrow } from "@/components/ui/Button";

export function FrameworkExplorer({ items }: { items: Framework[] }) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (f) =>
        (group === "all" || f.groupId === group) &&
        (!term || f.name.toLowerCase().includes(term) || f.full.toLowerCase().includes(term) || f.issuer.toLowerCase().includes(term)),
    );
  }, [items, group, q]);

  const tabs = [{ id: "all", name: "All", n: items.length }, ...frameworkGroups.map((g) => ({ id: g.id, name: g.name, n: g.items.length }))];

  return (
    <section className="bg-ivory pb-28 md:pb-40">
      <div className="container-x">
        <div className="sticky top-24 z-30 -mx-2 flex flex-col gap-3 rounded-[1.75rem] border border-line bg-ivory/85 p-2 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Framework categories">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={group === t.id}
                onClick={() => setGroup(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors duration-300 ${
                  group === t.id ? "bg-ink text-ivory" : "hover:bg-ink/5"
                }`}
              >
                {t.name}
                <span className={`eyebrow text-[0.6rem] ${group === t.id ? "text-accent" : "text-muted"}`}>{t.n}</span>
              </button>
            ))}
          </div>
          <label className="relative flex items-center">
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 size-4 text-muted" fill="none">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search frameworks"
              aria-label="Search frameworks"
              className="h-11 w-full rounded-full bg-ink/5 pl-11 pr-4 text-sm outline-none focus:bg-ink/10 lg:w-72"
            />
          </label>
        </div>

        <p className="eyebrow mt-10 text-muted" aria-live="polite">
          {list.length} {list.length === 1 ? "framework" : "frameworks"}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f, i) => (
            <Link
              key={f.slug}
              href={`/frameworks/${f.slug}`}
              data-cursor="Explore"
              data-fx
              data-label={f.name}
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              className="group relative flex min-h-72 animate-[fadeUp_0.7s_var(--ease-out)_backwards] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-line bg-paper/60 p-7 transition-colors duration-700 ease-out-expo hover:border-brand hover:bg-brand hover:text-ivory"
            >
              <Glyph
                seed={f.slug}
                className="pointer-events-none absolute -bottom-1/3 -right-1/4 w-[85%] text-accent opacity-0 transition-all duration-1000 ease-out-expo group-hover:rotate-12 group-hover:opacity-50"
                strands={7}
              />
              <div className="relative flex items-start justify-between gap-4">
                <span className="eyebrow text-muted transition-colors group-hover:text-accent">{f.group}</span>
                <span className="grid size-10 place-items-center rounded-full border border-current/15 transition-transform duration-700 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                  <Arrow className="size-3" />
                </span>
              </div>
              <div className="relative">
                <p className="display text-[clamp(2.2rem,3.4vw,3.2rem)]">{f.name}</p>
                <p className="mt-2 line-clamp-1 text-sm text-muted transition-colors group-hover:text-ivory/60">{f.full}</p>
                <div className="mt-5 flex gap-4 border-t border-current/10 pt-4 text-sm">
                  <span className="text-muted transition-colors group-hover:text-ivory/60">{f.timeline}</span>
                  <span className="ml-auto text-muted transition-colors group-hover:text-ivory/60">{f.issuer}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-ink/20 p-14 text-center">
            <p className="text-2xl tracking-[-0.02em]">No framework matches “{q}”.</p>
            <p className="mt-2 text-muted">
              We work with many more standards than we list.{" "}
              <a href="#book" className="underline underline-offset-2">
                Ask us
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
