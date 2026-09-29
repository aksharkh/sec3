"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

const SEEN_KEY = "sk-preloaded";

/**
 * Meridian loader: the knot mark draws itself in one continuous stroke, the
 * serif wordmark settles beneath it while a hairline fills, then the whole
 * sheet lifts away like a page being turned.
 */
export function MeridianLoader() {
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
    const path = el.querySelector<SVGPathElement>(".ml-knot path")!;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const p = { v: 0 };

    const tl = gsap.timeline();
    tl.to(path, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" }, 0.1)
      .from(q(".ml-word"), { yPercent: 100, duration: 1.1, ease: "expo.out" }, 0.55)
      .from(q(".ml-meta"), { autoAlpha: 0, y: 8, duration: 0.8, stagger: 0.08, ease: "expo.out" }, 0.4)
      .to(
        p,
        {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            (q(".ml-bar")[0] as HTMLElement).style.transform = `scaleX(${p.v / 100})`;
            if (pct.current) pct.current.textContent = String(Math.round(p.v)).padStart(2, "0");
          },
        },
        0.1,
      )
      .to(q(".ml-center, .ml-meta"), { autoAlpha: 0, y: -16, duration: 0.5, stagger: 0.03, ease: "power2.in" }, "+=0.15")
      .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.15")
      .add(finish, "-=0.45");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] bg-ivory text-ink" aria-hidden>
      <div className="container-x flex h-full flex-col">
        <div className="flex justify-between pt-8">
          <span className="ml-meta eyebrow text-muted">SecureKnots</span>
          <span className="ml-meta eyebrow text-muted">Compliance advisory</span>
        </div>

        <div className="ml-center flex flex-1 flex-col items-center justify-center gap-6">
          <KnotMark className="ml-knot size-16 text-brand" strokeWidth={1.6} />
          <span className="block overflow-hidden pb-2">
            <span className="ml-word serif block text-[clamp(2.4rem,5vw,4rem)] leading-none">
              Secure<span className="italic">Knots</span>
            </span>
          </span>
        </div>

        <div className="pb-8">
          <div className="flex items-end justify-between pb-4">
            <span className="ml-meta text-sm text-muted">Assess once. Comply to many.</span>
            <span className="ml-meta mono text-sm tabular-nums text-muted">
              <span ref={pct}>00</span>
            </span>
          </div>
          <div className="ml-meta h-px w-full bg-line">
            <div className="ml-bar h-px w-full origin-left scale-x-0 bg-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}
