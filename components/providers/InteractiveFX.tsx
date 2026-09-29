"use client";

import { useEffect } from "react";

/**
 * Site-wide micro-interaction: `[data-fx]` cards carry a soft spotlight that
 * follows the pointer.
 */
export function InteractiveFX() {
  // Soft spotlight for [data-fx] cards (no tilt in the Meridian design).
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.transform = "";
      el.style.setProperty("--spot", "0");
    };
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-fx]");
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--spot", "1");
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  return null;
}
