"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Full-screen panels that stack: each panel pins while the next slides over
 * it, and the covered panel recedes (scale + dim) into the background.
 */
export function StackPanels({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".stack-panel");
      panels.forEach((p, i) => {
        if (i === panels.length - 1) return;
        gsap.to(p, {
          scale: 0.9,
          filter: "brightness(0.55)",
          borderRadius: "3rem",
          ease: "none",
          scrollTrigger: { trigger: panels[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
        gsap.set(p, { transformOrigin: "50% 0%" });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative bg-ink [&>.stack-panel]:sticky [&>.stack-panel]:top-0">
      {children}
    </div>
  );
}
