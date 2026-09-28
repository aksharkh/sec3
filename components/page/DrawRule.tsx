"use client";

import { useEffect, useRef } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";

/** Hairline rule with a signal-orange segment that draws across once the page is revealed. */
export function DrawRule({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(".dr-fill");
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { scaleX: 0 });
    return onSiteReady(() => gsap.to(el, { scaleX: 1, duration: 1.6, delay: 0.5, ease: "expo.inOut" }));
  }, []);
  return (
    <div ref={ref} className={`relative h-px w-full ${className ?? ""}`} aria-hidden>
      <div className="dr-fill absolute inset-y-0 left-0 w-40 origin-left bg-brand" />
    </div>
  );
}
