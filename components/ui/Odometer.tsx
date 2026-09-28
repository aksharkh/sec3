"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Mechanical odometer: each digit is a 0-9 column that rolls into place on scroll. */
export function Odometer({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(value).split("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = el.querySelectorAll<HTMLElement>(".odo-col");
    if (prefersReducedMotion()) {
      cols.forEach((c) => gsap.set(c, { yPercent: -Number(c.dataset.d) * 10 }));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(cols, { yPercent: 0 });
      gsap.to(cols, {
        yPercent: (i, c: HTMLElement) => -Number(c.dataset.d) * 10,
        duration: 2.2,
        ease: "expo.out",
        stagger: { each: 0.12, from: "end" },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={`inline-flex overflow-hidden leading-none ${className ?? ""}`} aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] overflow-hidden" aria-hidden>
          <span className="odo-col flex flex-col" data-d={d} style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
