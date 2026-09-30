"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";

const SEEN_KEY = "sk-preloaded";

/**
 * Thread loader: a black sheet, one line pulled left to right across it while
 * a poster-sized counter runs, then the whole sheet is drawn off to the left,
 * the same direction the homepage travels.
 */
export function ThreadLoader() {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      window.__lenis?.start();
      markSiteReady();
      setDone(true);
    };
    if (seen || prefersReducedMotion()) {
      gsap.to(el, { autoAlpha: 0, duration: 0.4, onComplete: finish });
      return;
    }

    window.__lenis?.stop();
    window.scrollTo(0, 0);
    const q = gsap.utils.selector(el);
    const line = el.querySelector<HTMLElement>(".tl-line")!;
    const knot = el.querySelector<HTMLElement>(".tl-knot")!;
    const p = { v: 0 };
    let swapped = false;

    const tl = gsap.timeline();
    tl.from(q(".tl-meta"), { autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 0)
      .from(q(".tl-a"), { yPercent: 110, duration: 0.9, ease: "expo.out" }, 0.1)
      .to(
        p,
        {
          v: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            line.style.transform = `scaleX(${p.v / 100})`;
            knot.style.left = `${p.v}%`;
            if (pct.current) pct.current.textContent = String(Math.round(p.v)).padStart(2, "0");
            if (!swapped && p.v > 58) {
              swapped = true;
              gsap.to(q(".tl-a"), { yPercent: -110, duration: 0.7, ease: "expo.inOut" });
              gsap.fromTo(q(".tl-b"), { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" });
            }
          },
        },
        0.2,
      )
      .to(el, { xPercent: -100, duration: 1, ease: "expo.inOut" }, "+=0.25")
      .add(finish, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="blueprint fixed inset-0 z-[90] flex flex-col justify-between bg-ink text-ivory" aria-hidden>
      <div className="flex justify-between px-[var(--gutter)] pt-7">
        <span className="tl-meta eyebrow">SecureKnots</span>
        <span className="tl-meta eyebrow text-ivory/50">Compliance advisory · Audit readiness</span>
      </div>

      <div>
        <div className="relative mx-[var(--gutter)] h-[1.1em] overflow-hidden text-[clamp(2rem,6vw,5.5rem)]">
          <p className="tl-a wide absolute left-0 top-0 whitespace-nowrap">Many frameworks.</p>
          <p className="tl-b wide absolute left-0 top-0 translate-y-[110%] whitespace-nowrap">
            One <span className="bg-brand px-[0.14em]">secure knot.</span>
          </p>
        </div>
        <div className="relative mt-6 h-[2px] bg-ivory/15">
          <div className="tl-line h-full origin-left scale-x-0 bg-ivory" />
          <span className="tl-knot absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 bg-brand outline outline-2 outline-ivory" style={{ left: 0 }} />
        </div>
      </div>

      <div className="flex items-end justify-between px-[var(--gutter)] pb-4">
        <span className="tl-meta eyebrow pb-4 text-ivory/50">Pulling the thread</span>
        <span ref={pct} className="wide text-[clamp(7rem,24vw,20rem)] leading-[0.8] tabular-nums">
          00
        </span>
      </div>
    </div>
  );
}
