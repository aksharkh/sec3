"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

const SEEN_KEY = "sk-preloaded";
const RINGS = [60, 96, 132, 168, 204];

/**
 * Atlas loader: five rings draw themselves around the mark, settle, and the
 * navy sheet fades to the page. Short and quiet.
 */
export function AtlasLoader() {
  const root = useRef<HTMLDivElement>(null);
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
    gsap.set(q(".al-ring"), { strokeDasharray: 1, strokeDashoffset: 1 });

    const tl = gsap.timeline();
    tl.from(q(".al-mark"), { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0)
      .to(q(".al-ring"), { strokeDashoffset: 0, duration: 1.5, stagger: 0.12, ease: "power2.inOut" }, 0.15)
      .from(q(".al-word"), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.1, ease: "expo.out" }, 0.7)
      .to(q(".al-bar"), { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.1)
      .to(q(".al-inner"), { autoAlpha: 0, scale: 1.06, duration: 0.6, ease: "power2.in" }, "+=0.2")
      .add(finish, "-=0.15")
      .to(el, { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="navy fixed inset-0 z-[90] grid place-items-center text-white" aria-hidden>
      <div className="al-inner flex flex-col items-center">
        <div className="relative grid size-[min(70vw,420px)] place-items-center">
          <svg viewBox="0 0 420 420" className="absolute inset-0 -rotate-90">
            {RINGS.map((r, i) => (
              <circle key={r} className="al-ring" cx="210" cy="210" r={r} fill="none" stroke="#fff" strokeOpacity={0.55 - i * 0.09} strokeWidth="1" pathLength={1} />
            ))}
          </svg>
          <span className="al-mark grid size-20 place-items-center rounded-full bg-brand">
            <KnotMark className="size-9" strokeWidth={3.4} />
          </span>
        </div>
        <p className="al-word -mt-6 text-[1.5rem] font-medium tracking-[-0.02em]">SecureKnots</p>
        <p className="al-word mt-2 text-sm text-white/60">Assess once. Comply to many.</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
        <div className="al-bar h-full origin-left scale-x-0 bg-brand-3" />
      </div>
    </div>
  );
}
