"use client";

import { useState } from "react";

export function Accordion({ items, dark }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`border-t ${dark ? "border-ivory/15" : "border-line"}`}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className={`border-b ${dark ? "border-ivory/15" : "border-line"}`}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span className="text-[clamp(1.2rem,2vw,1.6rem)] leading-snug tracking-[-0.02em]">{it.q}</span>
                <span
                  className={`relative grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    on ? (dark ? "border-accent bg-accent text-ink" : "border-ink bg-ink text-ivory") : dark ? "border-ivory/20" : "border-ink/15"
                  }`}
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ${on ? "rotate-90 scale-0" : ""}`} />
                </span>
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className={`max-w-3xl pb-8 text-lg leading-relaxed ${dark ? "text-ivory/65" : "text-muted"}`}>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
