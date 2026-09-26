"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Full-width SVG "threads" that draw themselves on scroll, looping into a knot
 * in the middle, with light pulses flowing along them continuously.
 */
const PATHS = [
  "M-20 120 C 220 20, 420 220, 640 120 S 820 -10, 760 110 S 600 230, 720 150 S 1100 40, 1460 120",
  "M-20 150 C 260 60, 400 250, 660 140 S 860 10, 790 120 S 620 250, 750 170 S 1120 80, 1460 90",
  "M-20 90 C 200 180, 460 40, 620 110 S 800 230, 740 130 S 640 0, 700 90 S 1080 200, 1460 150",
];

export function FlowThread({ dark = false, className }: { dark?: boolean; className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<SVGPathElement>(".ft-base").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el, start: `top ${85 - i * 5}%`, end: "bottom 35%", scrub: 1 } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const base = dark ? "stroke-ivory/25" : "stroke-ink/20";
  return (
    <div className={`relative overflow-hidden ${dark ? "bg-brand" : "bg-ivory"} ${className ?? ""}`} aria-hidden>
      <svg ref={root} viewBox="0 0 1440 260" preserveAspectRatio="none" className="block h-[22vw] max-h-72 min-h-32 w-full" fill="none">
        <defs>
          <filter id="ft-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {PATHS.map((d, i) => (
          <g key={i}>
            <path d={d} className={`ft-base ${i === 0 ? (dark ? "stroke-accent" : "stroke-brand") : base}`} strokeWidth={i === 0 ? 1.6 : 1} vectorEffect="non-scaling-stroke" />
            <path
              d={d}
              className="ft-pulse stroke-accent"
              strokeWidth={2.4}
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="40 960"
              filter="url(#ft-glow)"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `ft-flow ${6 + i * 1.7}s linear ${i * -2.1}s infinite` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
