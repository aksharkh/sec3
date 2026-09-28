"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { ReededGlassStatic } from "@/components/ui/ReededGlass";

const SEEN_KEY = "sk-preloaded";
const COLS = 6;
const WORD_A = "Secure";
const WORD_B = "Knots";
const TICKER = ["SOC 2", "ISO 27001", "FedRAMP", "CMMC", "PCI DSS", "HIPAA", "ISO 42001", "GDPR", "DORA"];

/**
 * Editorial preloader: wordmark rises letter by letter through masks while a
 * hairline progress rule fills and framework names tick past; the letters then
 * lift away and six shutter columns slide up in sequence to reveal the site.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const tick = useRef<HTMLSpanElement>(null);
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
    const progress = { v: 0 };
    let lastTick = -1;

    const tl = gsap.timeline();
    tl.set(q(".pl-char"), { yPercent: 115 })
      .set(q(".pl-rule"), { scaleX: 0 })
      .to(q(".pl-meta"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0.1)
      .to(q(".pl-char"), { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" }, 0.25)
      .to(
        progress,
        {
          v: 100,
          duration: 2.4,
          ease: "power3.inOut",
          onUpdate: () => {
            const v = Math.round(progress.v);
            if (count.current) count.current.textContent = String(v).padStart(3, "0");
            const t = Math.min(TICKER.length - 1, Math.floor((v / 100) * TICKER.length));
            if (t !== lastTick && tick.current) {
              lastTick = t;
              tick.current.textContent = TICKER[t];
              gsap.fromTo(tick.current, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: "expo.out" });
            }
          },
        },
        0.2,
      )
      .to(q(".pl-rule"), { scaleX: 1, duration: 2.4, ease: "power3.inOut" }, 0.2)
      .add(() => {
        if (tick.current) tick.current.textContent = "All tied";
      })
      .to(q(".pl-char"), { yPercent: -115, duration: 0.8, stagger: 0.03, ease: "expo.in" }, "+=0.25")
      .to(q(".pl-meta, .pl-rule-wrap"), { autoAlpha: 0, duration: 0.4 }, "<0.2")
      .to(q(".pl-col"), { yPercent: -100, duration: 1.1, stagger: 0.07, ease: "expo.inOut" }, "-=0.25")
      .add(finish, "-=0.7");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] text-ivory" aria-hidden>
      {/* Shutter columns (the background) */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }).map((_, i) => (
          <div key={i} className="pl-col relative h-full flex-1 overflow-hidden bg-ink" style={{ marginLeft: i ? -1 : 0 }}>
            <div className="absolute inset-y-0" style={{ width: `${COLS * 100}%`, left: `${-i * 100}%` }}>
              <ReededGlassStatic className="absolute inset-0" stripes={30} hue={0.55} />
              <div className="absolute inset-0 bg-ink/55" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="container-x flex items-start justify-between pt-7">
          <span className="pl-meta eyebrow translate-y-3 text-ivory/50 opacity-0">SecureKnots®</span>
          <span className="pl-meta eyebrow hidden translate-y-3 text-ivory/50 opacity-0 sm:block">Compliance, untangled</span>
          <span className="pl-meta eyebrow translate-y-3 text-ivory/50 opacity-0">Est. US · IN</span>
        </div>

        <div className="container-x flex flex-1 items-center justify-center">
          <h2 className="display flex text-[clamp(3.6rem,13.5vw,15rem)] leading-[0.9]">
            {WORD_A.split("").map((c, i) => (
              <span key={`a${i}`} className="inline-block overflow-hidden pb-[0.06em]">
                <span className="pl-char inline-block will-change-transform">{c}</span>
              </span>
            ))}
            {WORD_B.split("").map((c, i) => (
              <span key={`b${i}`} className="inline-block overflow-hidden pb-[0.06em]">
                <span className="pl-char em inline-block text-accent will-change-transform">{c}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="container-x pb-8">
          <div className="pl-rule-wrap h-px w-full bg-ivory/12">
            <div className="pl-rule h-px w-full origin-left bg-accent" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <span className="pl-meta eyebrow flex translate-y-3 items-center gap-3 text-ivory/50 opacity-0">
              Tying
              <span className="relative inline-block h-[1.2em] min-w-28 overflow-hidden text-ivory">
                <span ref={tick} className="block">
                  {TICKER[0]}
                </span>
              </span>
            </span>
            <span className="pl-meta translate-y-3 font-mono text-[clamp(2.4rem,5vw,4.5rem)] leading-none tabular-nums tracking-[-0.04em] opacity-0">
              <span ref={count}>000</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
