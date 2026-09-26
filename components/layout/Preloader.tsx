"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { TREFOIL_PATH } from "@/components/ui/Logo";

const SEEN_KEY = "sk-preloaded";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const count = useRef<HTMLSpanElement>(null);
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
    const p = path.current!;
    const len = p.getTotalLength();
    const counter = { v: 0 };

    const tl = gsap.timeline();
    tl.set(p, { strokeDasharray: len, strokeDashoffset: len })
      .to(p, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0)
      .to(
        counter,
        {
          v: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0,
      )
      .to(".pl-fade", { autoAlpha: 0, y: -20, duration: 0.6, stagger: 0.05, ease: "power2.in" }, "+=0.15")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.2")
      .add(finish, "-=0.55");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col bg-ink text-ivory"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="container-x flex items-center justify-between pt-8">
        <span className="pl-fade eyebrow text-ivory/50">SecureKnots®</span>
        <span className="pl-fade eyebrow text-ivory/50">Tying it together</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <svg viewBox="0 0 48 48" fill="none" className="pl-fade size-28 text-accent md:size-36">
          <path ref={path} d={TREFOIL_PATH} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
      <div className="container-x flex items-end justify-between pb-8">
        <span className="pl-fade eyebrow max-w-[16rem] text-ivory/50">
          Compliance advisory &amp; audit readiness — US / IN
        </span>
        <span className="pl-fade display text-[clamp(4rem,12vw,10rem)] tabular-nums leading-none">
          <span ref={count}>000</span>
        </span>
      </div>
    </div>
  );
}
