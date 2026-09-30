"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

const SEEN_KEY = "sk-preloaded";
const STEPS = ["Scoping frameworks", "Mapping controls", "Collecting evidence", "Audit-ready"];
const R = 54;
const C = 2 * Math.PI * R;

/**
 * Halo loader: a readiness ring fills around the knot mark while the status
 * line steps through a program, then the screen irises closed onto the page.
 */
export function HaloLoader() {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
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
    const ring = el.querySelector<SVGCircleElement>(".hl-ring")!;
    const p = { v: 0 };
    let last = -1;

    const tl = gsap.timeline();
    tl.from(q(".hl-card"), { scale: 0.86, autoAlpha: 0, y: 24, duration: 1, ease: "expo.out" }, 0)
      .to(
        p,
        {
          v: 100,
          duration: 2.1,
          ease: "power2.inOut",
          onUpdate: () => {
            ring.style.strokeDashoffset = String(C * (1 - p.v / 100));
            if (pct.current) pct.current.textContent = String(Math.round(p.v));
            const i = Math.min(STEPS.length - 1, Math.floor((p.v / 100) * STEPS.length));
            if (i !== last && status.current) {
              last = i;
              status.current.textContent = STEPS[i];
            }
          },
        },
        0.25,
      )
      .to(q(".hl-card"), { scale: 0.9, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=0.2")
      .to(el, { clipPath: "circle(0% at 50% 50%)", duration: 0.9, ease: "expo.inOut" }, "-=0.2")
      .add(finish, "-=0.35");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="halo-bg fixed inset-0 z-[90] grid place-items-center text-ink" style={{ clipPath: "circle(150% at 50% 50%)" }} aria-hidden>
      <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_65%)]" />
      <div className="hl-card card relative flex w-[min(86vw,320px)] flex-col items-center px-8 py-9">
        <div className="relative grid size-[132px] place-items-center">
          <svg viewBox="0 0 132 132" className="absolute inset-0 -rotate-90">
            <circle cx="66" cy="66" r={R} fill="none" stroke="var(--bone)" strokeWidth="6" />
            <circle className="hl-ring" cx="66" cy="66" r={R} fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
          </svg>
          <span className="grid size-16 place-items-center rounded-[20px] bg-brand text-white shadow-[0_14px_30px_-12px_rgb(42_92_255/0.8)]">
            <KnotMark className="size-8" strokeWidth={4} />
          </span>
        </div>
        <p className="mt-7 text-[1.35rem] font-bold tracking-[-0.04em]">SecureKnots</p>
        <p className="mt-5 flex w-full items-center justify-between rounded-full bg-ivory px-4 py-2.5 text-sm font-semibold">
          <span className="flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-brand" />
            <span ref={status}>{STEPS[0]}</span>
          </span>
          <span className="mono tabular-nums">
            <span ref={pct}>0</span>%
          </span>
        </p>
      </div>
    </div>
  );
}
