"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Infinite marquee whose speed and skew react to scroll velocity; scrolling
 * up reverses its direction.
 */
export function VelocityMarquee({
  children,
  speed = 60,
  reverse = false,
  skew = true,
  className,
}: {
  children: ReactNode;
  speed?: number; // px per second at rest
  reverse?: boolean;
  skew?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;
    let lastY = window.scrollY;
    const setX = gsap.quickSetter(el, "x", "px");
    const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });

    const tick = (_t: number, dt: number) => {
      const y = window.scrollY;
      const v = (y - lastY) / Math.max(dt, 1); // px per ms
      lastY = y;
      if (Math.abs(v) > 0.05) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      boost += (Math.min(Math.abs(v) * 900, 900) - boost) * 0.08;
      const half = el.scrollWidth / 2;
      x += (dir * (speed + boost) * dt) / 1000;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
      if (skew) skewTo(gsap.utils.clamp(-12, 12, v * -6));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, reverse, skew]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
