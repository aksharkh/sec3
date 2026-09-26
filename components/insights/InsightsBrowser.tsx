"use client";

import { useState } from "react";
import type { Article } from "@/lib/insights";
import { ArticleCard } from "./ArticleCard";
import { toast } from "@/lib/gsap";

export function InsightsBrowser({ items, tags }: { items: Article[]; tags: string[] }) {
  const [tag, setTag] = useState("All");
  const list = items.filter((a) => tag === "All" || a.tag === tag);
  return (
    <>
      <div className="flex flex-wrap gap-1.5 border-y border-line py-5" role="group" aria-label="Filter by topic">
        {["All", ...tags].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${tag === t ? "bg-ink text-ivory" : "hover:bg-ink/5"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {list.map((a, i) => (
          <div key={a.slug} className="animate-[fadeUp_0.7s_var(--ease-out)_both]" style={{ animationDelay: `${i * 60}ms` }}>
            <ArticleCard a={a} />
          </div>
        ))}
      </div>
    </>
  );
}

export function Newsletter({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Please enter a valid email address.");
    // TODO: connect to newsletter provider.
    setDone(true);
    toast("You're subscribed. First issue lands next month.");
  };
  return (
    <form onSubmit={submit} className={`flex flex-col gap-3 sm:flex-row ${dark ? "text-ivory" : ""}`}>
      <label className="sr-only" htmlFor="nl-email">
        Work email
      </label>
      <input
        id="nl-email"
        type="email"
        value={email}
        disabled={done}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={done ? "Subscribed ✓" : "Work email"}
        className={`h-14 flex-1 rounded-full border bg-transparent px-6 outline-none ${dark ? "border-ivory/20 placeholder:text-ivory/40 focus:border-accent" : "border-ink/20 focus:border-brand"}`}
      />
      <button type="submit" disabled={done} className="h-14 rounded-full bg-accent px-7 font-medium text-ink disabled:opacity-50">
        Subscribe
      </button>
    </form>
  );
}
