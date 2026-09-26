"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/content";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

const INTERVAL = 9000;

export function Testimonials({ items = testimonials, eyebrow = "(SK—09) Client voices" }: { items?: { quote: string; name: string; org: string }[]; eyebrow?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const quote = useRef<HTMLQuoteElement>(null);
  const t = items[i];

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % items.length), INTERVAL);
    return () => clearTimeout(id);
  }, [i, paused, items.length]);

  useEffect(() => {
    const el = quote.current;
    if (!el || prefersReducedMotion()) return;
    const split = SplitText.create(el, { type: "words", mask: "words" });
    const tween = gsap.from(split.words, { yPercent: 110, duration: 1, stagger: 0.015 });
    return () => {
      tween.kill();
      split.revert();
    };
  }, [i]);

  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <section
      className="bg-paper py-28 md:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 md:col-span-3">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <div className="flex items-center gap-3">
            <NavBtn onClick={() => go(-1)} label="Previous testimonial" dir={-1} />
            <NavBtn onClick={() => go(1)} label="Next testimonial" dir={1} />
            <span className="eyebrow ml-3 tabular-nums text-muted">
              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <figure className="md:col-span-9">
          <span aria-hidden className="serif block text-[8rem] leading-[0.5] text-brand">&ldquo;</span>
          <blockquote
            key={i}
            ref={quote}
            className="mt-4 text-[clamp(1.8rem,3.8vw,3.6rem)] leading-[1.12] tracking-[-0.03em]"
          >
            {t.quote}
          </blockquote>
          <figcaption className="mt-12 flex items-center gap-4 border-t border-line pt-6">
            <span className="grid size-12 place-items-center rounded-full bg-brand text-accent">
              <KnotMark className="size-6" strokeWidth={4} />
            </span>
            <span>
              <span className="block font-medium">{t.name}</span>
              <span className="block text-sm text-muted">{t.org}</span>
            </span>
            <span className="ml-auto hidden h-px w-40 overflow-hidden bg-ink/10 sm:block">
              <span
                key={`${i}-${paused}`}
                className="block h-full origin-left bg-brand"
                style={{
                  animation: paused ? "none" : `progress ${INTERVAL}ms linear forwards`,
                  transform: paused ? "scaleX(0)" : undefined,
                }}
              />
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function NavBtn({ onClick, label, dir }: { onClick: () => void; label: string; dir: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-14 place-items-center rounded-full border border-ink/15 transition-colors duration-500 hover:bg-ink hover:text-ivory"
    >
      <svg viewBox="0 0 16 16" className={`size-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none">
        <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
