"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";

const SEEN_KEY = "sk-preloaded";
const READOUT = ["Scoping", "Mapping controls", "Collecting evidence", "Testing once", "Mapped to 29"];

/**
 * Signal loader: an outlined, expanded wordmark fills left to right behind a
 * signal-orange scan line while a mono readout counts up. The screen then
 * collapses into a single horizontal line and snaps away.
 */
export function SignalLoader() {
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
      gsap.to(el, { autoAlpha: 0, duration: 0.35, onComplete: finish });
      return;
    }

    window.__lenis?.stop();
    window.scrollTo(0, 0);
    const q = gsap.utils.selector(el);
    const p = { v: 0 };
    let last = -1;

    const tl = gsap.timeline();
    tl.from(q(".sl-meta"), { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.05, ease: "expo.out" }, 0)
      .from(q(".sl-outline"), { autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0.1)
      .to(
        p,
        {
          v: 100,
          duration: 2.3,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = p.v;
            q(".sl-fill")[0].style.clipPath = `inset(0 ${100 - v}% 0 0)`;
            (q(".sl-scan")[0] as HTMLElement).style.left = `${v}%`;
            if (pct.current) pct.current.textContent = String(Math.round(v)).padStart(3, "0");
            const i = Math.min(READOUT.length - 1, Math.floor((v / 100) * READOUT.length));
            if (i !== last && status.current) {
              last = i;
              status.current.textContent = READOUT[i];
            }
          },
        },
        0.2,
      )
      .to(q(".sl-scan"), { autoAlpha: 0, duration: 0.3 }, "+=0.1")
      .to(q(".sl-meta, .sl-word"), { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "+=0.15")
      .set(q(".sl-line"), { autoAlpha: 1 })
      .to(el, { clipPath: "inset(49.9% 0% 49.9% 0%)", duration: 0.75, ease: "expo.inOut" }, "<")
      .to(el, { clipPath: "inset(49.9% 50% 49.9% 50%)", duration: 0.45, ease: "expo.in" })
      .add(finish);

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] bg-ivory text-ink" style={{ clipPath: "inset(0% 0% 0% 0%)" }} aria-hidden>
      <div className="sl-line invisible absolute inset-x-0 top-1/2 h-px bg-brand opacity-0" />
      <div className="container-x flex h-full flex-col">
        <div className="flex justify-between pt-7">
          <span className="sl-meta eyebrow text-muted">SecureKnots</span>
          <span className="sl-meta eyebrow text-muted">Compliance signal</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="sl-word relative w-full">
            <p className="sl-outline wide select-none text-center text-[clamp(2rem,8.4vw,10rem)] text-transparent [-webkit-text-stroke:1px_var(--muted-dark)]">
              Secure<span className="em">Knots</span>
            </p>
            <p className="sl-fill wide absolute inset-0 select-none text-center text-[clamp(2rem,8.4vw,10rem)] text-ink" style={{ clipPath: "inset(0 100% 0 0)" }}>
              Secure<span className="em text-brand">Knots</span>
            </p>
            <span className="sl-scan absolute -inset-y-6 left-0 w-px bg-brand shadow-[0_0_24px_4px_var(--brand)]" />
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-line pb-7 pt-4">
          <span className="sl-meta eyebrow flex gap-3 text-muted">
            <span className="text-brand">/</span>
            <span ref={status}>{READOUT[0]}</span>
          </span>
          <span className="sl-meta mono text-[clamp(2rem,4vw,3.5rem)] leading-none tabular-nums">
            <span ref={pct}>000</span>
            <span className="text-muted">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
