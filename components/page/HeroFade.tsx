"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";

/** Fades content in once the page is revealed (after preloader / page transition). */
export function HeroFade({
  children,
  className,
  delay = 0.45,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { autoAlpha: 0, y: 28 });
    const cancel = onSiteReady(() => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.3, delay }));
    return () => {
      cancel();
      gsap.killTweensOf(el);
    };
  }, [delay]);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
