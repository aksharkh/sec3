"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Two rows of giant outlined type that slide in opposite directions with
 * scroll, while a solid fill wipes across each word as it passes centre.
 */
export function OutlineBand({
  rows = [
    ["Assess once", "Comply everywhere", "Assess once", "Comply everywhere"],
    ["Security", "Privacy", "AI governance", "Resilience", "Security", "Privacy"],
  ],
  dark = false,
}: {
  rows?: string[][];
  dark?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ob-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -30 : 0 },
          { xPercent: i % 2 ? 0 : -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 30%", scrub: 0.6 } })
        .fromTo(".ob-word", { "--fill": "0%" }, { "--fill": "100%", ease: "none", stagger: 0.18, duration: 0.6 });
    }, el);
    return () => ctx.revert();
  }, []);

  const stroke = dark ? "var(--ivory)" : "var(--ink)";
  const fill = dark ? "var(--accent)" : "var(--brand)";

  return (
    <section ref={root} data-theme={dark ? "dark" : undefined} aria-hidden className={`overflow-hidden py-16 md:py-24 ${dark ? "bg-ink" : "bg-ivory"}`}>
      {rows.map((words, i) => (
        <div key={i} className="ob-row flex w-max gap-[4vw] whitespace-nowrap py-[0.5vw]">
          {words.map((w, j) => (
            <span
              key={j}
              className="ob-word display text-[clamp(4rem,11vw,12rem)] leading-[0.95]"
              style={{
                color: "transparent",
                WebkitTextStroke: `1.2px ${stroke}`,
                backgroundImage: `linear-gradient(90deg, ${fill} var(--fill, 0%), transparent var(--fill, 0%))`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                ["--fill" as string]: "0%",
              }}
            >
              {j % 2 ? <span className="em font-normal">{w}</span> : w}
            </span>
          ))}
        </div>
      ))}
    </section>
  );
}
