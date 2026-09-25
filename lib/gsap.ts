"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fired once the preloader has finished (or immediately if it's skipped). */
export const READY_EVENT = "sk:ready";

export function onSiteReady(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as unknown as { __skReady?: boolean }).__skReady) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}

export function markSiteReady() {
  (window as unknown as { __skReady?: boolean }).__skReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}
