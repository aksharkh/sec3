"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Minimal custom cursor: a small dot that expands into a labelled disc
 * over elements with data-cursor="Label", and hides over data-cursor="hide".
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    document.documentElement.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role=button], input, label",
      );
      const attr = target?.getAttribute("data-cursor");
      const state = attr === "hide" ? "hide" : attr ? "label" : target ? "hover" : "";
      el.dataset.state = state;
      setLabel(state === "label" ? attr! : "");
    };
    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };
    const down = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(3)" });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden className="cursor pointer-events-none fixed left-0 top-0 z-[100] invisible opacity-0">
      <div className="cursor-disc grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-ink">
        <span className="eyebrow cursor-label whitespace-nowrap text-[0.65rem]">{label}</span>
      </div>
    </div>
  );
}
