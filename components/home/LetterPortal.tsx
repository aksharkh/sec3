"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const WORD = "UNIFIED";
const TARGET = 2; // the first "I" — a solid stem we can dive through

/**
 * An ivory wall with a giant word knocked out of it. Scrolling scales the word
 * around the centre of one letter's stem until the stem fills the screen —
 * so you pass *through* the letter into the navy scene behind.
 */
export function LetterPortal() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const text = useRef<SVGTextElement>(null);
  const group = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !text.current || prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled || !text.current) return;
      const box = text.current.getExtentOfChar(TARGET);
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height * 0.55;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=200%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.to(".lp-caption", { autoAlpha: 0, y: -30, duration: 0.15 }, 0)
          .to(group.current, { scale: 140, svgOrigin: `${cx} ${cy}`, duration: 1, ease: "power3.in" }, 0)
          .fromTo(".lp-behind", { scale: 1.6, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.55);
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [size]);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-brand text-ivory">
      {/* Behind the wall */}
      <div className="lp-behind absolute inset-0 grid place-items-center">
        <div className="px-6 text-center">
          <p className="eyebrow text-accent">(SK—08) Through the letter</p>
          <p className="display mt-6 text-[clamp(3rem,9vw,9.5rem)]">
            Tied once.
            <br />
            <span className="serif text-accent">Proven everywhere.</span>
          </p>
        </div>
      </div>

      {/* The wall */}
      <svg ref={svg} className="absolute inset-0 size-full" width={size.w} height={size.h} aria-hidden>
        <defs>
          <mask id="lp-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
            <rect width={size.w} height={size.h} fill="white" />
            <g ref={group}>
              <text
                ref={text}
                x={size.w / 2}
                y={size.h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                style={{
                  fontFamily: "var(--font-inter-tight)",
                  fontWeight: 800,
                  fontSize: Math.min(size.w * 0.235, size.h * 0.55),
                  letterSpacing: "-0.04em",
                }}
              >
                {WORD}
              </text>
            </g>
          </mask>
        </defs>
        <rect width={size.w} height={size.h} fill="var(--ivory)" mask="url(#lp-mask)" />
      </svg>

      <div className="lp-caption pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-between px-[var(--gutter)] text-ink">
        <span className="eyebrow">(SK—08) One program</span>
        <span className="eyebrow">Keep scrolling ↓</span>
      </div>
      <h2 className="sr-only">Unified — tied once, proven everywhere.</h2>
    </section>
  );
}
