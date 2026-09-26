"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+=";

/**
 * Site-wide micro-interactions:
 *  - `.eyebrow` labels "decode" from random glyphs when they enter the viewport
 *  - `[data-fx]` cards tilt in 3D toward the pointer with a following spotlight
 */
export function InteractiveFX() {
  const pathname = usePathname();

  // Decode-on-enter for mono labels (text-only elements, skipping live values).
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scramble = (el: HTMLElement) => {
      const final = el.textContent ?? "";
      if (!final.trim() || final.length > 80) return;
      let frame = 0;
      const total = 18;
      const tick = () => {
        const reveal = Math.floor((frame / total) * final.length);
        el.textContent = final
          .split("")
          .map((ch, i) => (i < reveal || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("");
        if (++frame <= total) requestAnimationFrame(tick);
        else el.textContent = final;
      };
      tick();
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          scramble(e.target as HTMLElement);
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>("main .eyebrow").forEach((el) => {
        const textOnly = [...el.childNodes].every((n) => n.nodeType === Node.TEXT_NODE);
        if (textOnly && !el.classList.contains("tabular-nums") && !el.closest("[aria-live]")) io.observe(el);
      });
    }, 400);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  // Tilt + spotlight for [data-fx] cards.
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
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  return null;
}
