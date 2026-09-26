"use client";

import { useEffect, useState } from "react";

/** Sticky in-page navigation that highlights the section in view. */
export function StickyToc({ items, title = "On this page" }: { items: { id: string; label: string }[]; title?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} className="sticky top-28">
      <p className="eyebrow text-muted">{title}</p>
      <ol className="mt-5 space-y-1 border-l border-line">
        {items.map((i, idx) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`-ml-px flex items-center gap-3 border-l py-2 pl-4 text-[0.95rem] transition-all duration-500 ${
                active === i.id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <span className="eyebrow text-[0.6rem] opacity-60">{String(idx + 1).padStart(2, "0")}</span>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
