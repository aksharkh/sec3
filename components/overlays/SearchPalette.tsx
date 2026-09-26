"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_EVENT } from "@/lib/gsap";
import { frameworks } from "@/lib/frameworks";
import { services } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { Modal } from "./Modal";

type Item = { group: string; title: string; sub: string; href: string };

const index: Item[] = [
  ...[
    ["Home", "/"],
    ["All frameworks", "/frameworks"],
    ["Services", "/services"],
    ["Industries", "/industries"],
    ["Customer stories", "/customers"],
    ["About", "/about"],
    ["Insights", "/insights"],
    ["Careers", "/careers"],
    ["Contact", "/contact"],
  ].map(([title, href]) => ({ group: "Pages", title, sub: href, href })),
  ...frameworks.map((f) => ({ group: "Frameworks", title: f.name, sub: f.full, href: `/frameworks/${f.slug}` })),
  ...services.map((s) => ({ group: "Services", title: s.title, sub: s.kicker, href: `/services/${s.id}` })),
  ...stories.map((s) => ({ group: "Customer stories", title: s.company, sub: s.headline, href: `/customers/${s.slug}` })),
  ...articles.map((a) => ({ group: "Insights", title: a.title, sub: a.tag, href: `/insights/${a.slug}` })),
];

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener(SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.filter((i) => i.group === "Pages" || ["soc-2", "iso-27001", "cmmc", "iso-42001"].some((s) => i.href.endsWith(s)));
    return index
      .map((i) => {
        const t = i.title.toLowerCase();
        const score = t.startsWith(term) ? 3 : t.includes(term) ? 2 : i.sub.toLowerCase().includes(term) ? 1 : 0;
        return { i, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
      .map((r) => r.i);
  }, [q]);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setQ("");
      setActive(0);
    }, 400);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      list.current?.querySelector<HTMLAnchorElement>(`[data-idx="${active}"]`)?.click();
    }
  };

  useEffect(() => {
    list.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Modal open={open} onClose={close} label="Search" align="top" className="max-w-2xl">
      <div className="overflow-hidden rounded-[1.75rem] bg-ivory shadow-2xl">
        <div className="flex items-center gap-4 border-b border-line px-6">
          <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-muted" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            data-autofocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search frameworks, services, stories…"
            aria-label="Search the site"
            className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-muted focus-visible:outline-none"
          />
          <kbd className="eyebrow rounded-md border border-line px-2 py-1 text-muted">Esc</kbd>
        </div>
        <ul ref={list} className="max-h-[55vh] overflow-auto p-2" role="listbox" data-lenis-prevent>
          {results.length === 0 && <li className="px-4 py-10 text-center text-muted">No matches for “{q}”.</li>}
          {results.map((r, idx) => {
            const header = idx === 0 || results[idx - 1].group !== r.group;
            return (
              <li key={r.href} role="option" aria-selected={idx === active}>
                {header && <p className="eyebrow px-4 pb-2 pt-4 text-muted">{r.group}</p>}
                <Link
                  href={r.href}
                  data-idx={idx}
                  onClick={close}
                  onMouseEnter={() => setActive(idx)}
                  className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors ${
                    idx === active ? "bg-ink text-ivory" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{r.title}</span>
                    <span className={`block truncate text-sm ${idx === active ? "text-ivory/55" : "text-muted"}`}>{r.sub}</span>
                  </span>
                  <span className={`shrink-0 transition-transform ${idx === active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>↵</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-5 border-t border-line px-6 py-3 text-xs text-muted">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span className="ml-auto">⌘K / Ctrl K</span>
        </div>
      </div>
    </Modal>
  );
}
