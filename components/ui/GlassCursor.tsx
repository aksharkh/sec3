"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Reeded-glass cursor: a small lens of vertical glass ribs that follows the
 * pointer and refracts the page beneath it (SVG displacement via
 * backdrop-filter in Chromium; ribbed frosted glass elsewhere).
 * It stretches with pointer velocity and morphs by context:
 *  - links / buttons  → wider glass pill (with a label if data-cursor="Label")
 *  - large headings   → tall, thin glass text bar
 *  - data-cursor="hide" → collapses (magnetic buttons keep their own feedback)
 */

// Horizontal sawtooth ramps: each ramp shifts pixels sideways → one glass rib.
const RIBS = 9;
const MAP = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'><defs><linearGradient id='g' x1='0' x2='${1 / RIBS}' y1='0' y2='0' spreadMethod='repeat'><stop offset='0' stop-color='rgb(0,128,0)'/><stop offset='1' stop-color='rgb(255,128,0)'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/></svg>`,
)}`;

type Mode = "idle" | "link" | "label" | "text" | "hide";

export function GlassCursor() {
  const lens = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const mode = useRef<Mode>("idle");

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media queries are client-only
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    const el = lens.current;
    if (!enabled || !el) return;
    document.documentElement.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let shown = false;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();

    const setMode = (m: Mode, text = "", target?: HTMLElement) => {
      if (m === mode.current && (m !== "text" || !target)) {
        if (m === "label") setLabel(text);
        return;
      }
      mode.current = m;
      setLabel(m === "label" ? text : "");
      let [w, h, r] = [42, 28, 10];
      if (m === "link") [w, h, r] = [64, 40, 20];
      if (m === "label") [w, h, r] = [Math.max(96, text.length * 9 + 44), 44, 22];
      if (m === "text" && target) {
        const fs = parseFloat(getComputedStyle(target).fontSize) || 60;
        [w, h, r] = [10, Math.min(160, fs * 0.9), 5];
      }
      if (m === "hide") [w, h, r] = [0, 0, 10];
      gsap.to(el, { width: w, height: h, borderRadius: r, opacity: m === "hide" ? 0 : 1, duration: 0.55, ease: "expo.out" });
    };

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      // Velocity stretch (squash & stretch along the dominant axis).
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      const sx = 1 + Math.min(Math.abs(vx) * 0.35, 0.45) - Math.min(Math.abs(vy) * 0.12, 0.2);
      const sy = 1 + Math.min(Math.abs(vy) * 0.35, 0.45) - Math.min(Math.abs(vx) * 0.12, 0.2);
      gsap.to(el, { scaleX: sx, scaleY: sy, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      gsap.to(el, { scaleX: 1, scaleY: 1, duration: 0.6, delay: 0.08, ease: "elastic.out(1, 0.5)" });

      const t = e.target as HTMLElement;
      const interactive = t.closest<HTMLElement>("[data-cursor], a, button, [role=button], label, select, input, textarea");
      const attr = interactive?.getAttribute("data-cursor");
      if (attr === "hide") setMode("hide");
      else if (attr) setMode("label", attr);
      else if (interactive) setMode("link");
      else {
        const heading = t.closest<HTMLElement>("h1, h2, .display");
        if (heading) setMode("text", "", heading);
        else setMode("idle");
      }
    };
    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };
    const down = () => gsap.to(el, { scale: 0.86, duration: 0.18 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.5, ease: "back.out(3)" });

    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="sk-reeded" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={MAP} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        ref={lens}
        aria-hidden
        className="glass-cursor pointer-events-none fixed left-0 top-0 z-[100] invisible -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{ width: 42, height: 28, borderRadius: 10 }}
      >
        {label && <span className="eyebrow relative z-10 flex h-full items-center justify-center whitespace-nowrap px-4 text-[0.64rem] text-ink">{label}</span>}
      </div>
    </>
  );
}
