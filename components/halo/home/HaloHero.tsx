"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { frameworkCount } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const SCOPE = [
  { name: "SOC 2 Type II", pct: 100 },
  { name: "ISO 27001", pct: 96 },
  { name: "HIPAA", pct: 92 },
  { name: "PCI DSS", pct: 88 },
  { name: "ISO 42001", pct: 74 },
];

const FEED = [
  { t: "Access review signed off", m: "Mapped to 4 frameworks" },
  { t: "Encryption policy approved", m: "Mapped to 5 frameworks" },
  { t: "Pen test report uploaded", m: "Mapped to 3 frameworks" },
];

const R = 78;
const C = 2 * Math.PI * R;
const SCORE = 98;

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Halo hero: centred statement over an illustrative compliance dashboard.
 * The board rises in, fills its ring, bars and checklist, then levels out
 * from a slight tilt as the page scrolls.
 */
export function HaloHero() {
  const root = useRef<HTMLElement>(null);
  const score = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".hh-fade", { autoAlpha: 0, y: 18 });
      gsap.set(".hh-tile", { autoAlpha: 0, y: 50, scale: 0.96 });
      gsap.set(".hh-ring", { strokeDashoffset: C });
      gsap.set(".hh-bar", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(".hh-tick", { scale: 0 });
      gsap.set(".hh-feed", { autoAlpha: 0, x: 16 });

      onSiteReady(() => {
        const o = { v: 0 };
        gsap
          .timeline({ delay: 0.45 })
          .to(".hh-fade", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0)
          .to(".hh-tile", { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, stagger: 0.09 }, 0.35)
          .to(".hh-ring", { strokeDashoffset: C * (1 - SCORE / 100), duration: 2, ease: "power3.inOut" }, 0.9)
          .to(o, { v: SCORE, duration: 2, ease: "power3.inOut", onUpdate: () => score.current && (score.current.textContent = String(Math.round(o.v))) }, 0.9)
          .to(".hh-bar", { scaleX: 1, duration: 1.4, stagger: 0.08, ease: "expo.out" }, 1)
          .to(".hh-tick", { scale: 1, duration: 0.6, stagger: 0.14, ease: "back.out(2.4)" }, 1.2)
          .to(".hh-feed", { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.18 }, 1.5);
      });

      // The board starts slightly tilted back and levels out on scroll.
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".hh-board",
          { rotateX: 14, scale: 0.94, y: 0 },
          { rotateX: 0, scale: 1, y: -30, ease: "none", scrollTrigger: { trigger: ".hh-stage", start: "top 85%", end: "top 18%", scrub: 0.6 } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="halo-bg relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_62%)]" />

      <div className="container-x relative text-center">
        <p className="hh-fade pill mx-auto shadow-[var(--shadow-card)]">
          <span className="relative grid size-2 place-items-center">
            <span className="absolute size-2 rounded-full bg-brand" style={{ animation: "ping-soft 2s ease-out infinite" }} />
            <span className="size-2 rounded-full bg-brand" />
          </span>
          {frameworkCount} frameworks · one audit-ready program
        </p>

        <h1 className="wide mx-auto mt-8 max-w-5xl text-[clamp(2.7rem,6.8vw,6.4rem)]">
          <Reveal as="span" trigger="load" delay={0.2} className="block">
            Many frameworks.
          </Reveal>
          <Reveal as="span" trigger="load" delay={0.32} className="block">
            One <span className="em">secure knot.</span>
          </Reveal>
        </h1>

        <p className="hh-fade mx-auto mt-7 max-w-xl text-[1.1rem] leading-relaxed text-muted">
          We unify SOC 2, ISO 27001, FedRAMP, CMMC and {frameworkCount - 4} more frameworks into a single program. Tested once, reported to every buyer who asks.
        </p>
        <div className="hh-fade mt-9 flex flex-wrap justify-center gap-3">
          <Button href="#book">Book an assessment</Button>
          <Button href="/customers" variant="outline">
            See client stories
          </Button>
        </div>
      </div>

      {/* Illustrative dashboard */}
      <div className="hh-stage relative mx-auto mt-16 max-w-[1180px] px-3 [perspective:1600px] md:mt-20">
        <div className="hh-board rounded-[36px] border border-white bg-white/55 p-3 shadow-[0_50px_120px_-50px_rgb(26_63_208/0.45)] backdrop-blur-xl [transform-style:preserve-3d]">
          <div className="grid gap-3 lg:grid-cols-12">
            {/* Scope */}
            <div className="hh-tile card flex flex-col p-6 text-left lg:col-span-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Frameworks in scope</p>
                <span className="pill !bg-ivory !py-1 text-muted">5 active</span>
              </div>
              <ul className="mb-6 mt-6 space-y-4">
                {SCOPE.map((f) => (
                  <li key={f.name}>
                    <div className="flex items-center justify-between text-[0.88rem] font-semibold">
                      <span className="flex items-center gap-2.5">
                        <span className="hh-tick grid size-5 place-items-center rounded-full bg-brand text-white">
                          <Check className="size-3" />
                        </span>
                        {f.name}
                      </span>
                      <span className="mono text-xs text-muted">{f.pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory">
                      <div className="hh-bar h-full rounded-full bg-gradient-to-r from-brand to-brand-3" style={{ width: `${f.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex items-center justify-between rounded-[16px] bg-ivory px-4 py-3 text-[0.82rem] font-semibold">
                <span className="text-muted">Add a framework</span>
                <span className="text-brand">+{frameworkCount - SCOPE.length} available</span>
              </p>
            </div>

            {/* Score */}
            <div className="hh-tile navy-glow on-dark flex flex-col items-center justify-between rounded-[28px] p-6 text-white lg:col-span-4">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-bold">Audit readiness</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">Illustrative</span>
              </div>
              <div className="relative my-6 grid size-[196px] place-items-center">
                <svg viewBox="0 0 196 196" className="absolute inset-0 -rotate-90">
                  <circle cx="98" cy="98" r={R} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="12" />
                  <circle className="hh-ring" cx="98" cy="98" r={R} fill="none" stroke="url(#hh-grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - SCORE / 100)} />
                  <defs>
                    <linearGradient id="hh-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="1" stopColor="#7fa2ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="text-[3.6rem] font-semibold leading-none tracking-[-0.06em]">
                  <span ref={score}>{SCORE}</span>
                  <span className="text-[1.6rem] text-white/60">%</span>
                </p>
              </div>
              <p className="w-full rounded-[18px] bg-white/[0.07] px-4 py-3 text-center text-sm text-white/75">
                One control set. <span className="font-semibold text-white">Every report.</span>
              </p>
            </div>

            {/* Effort + feed */}
            <div className="grid gap-3 lg:col-span-4">
              <div className="hh-tile card p-6 text-left">
                <p className="text-sm font-bold">Controls to test</p>
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-muted">
                      <span>Five separate audits</span>
                      <span className="mono">366</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-ivory">
                      <div className="hh-bar h-full w-full rounded-full bg-bone" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span>With SecureKnots</span>
                      <span className="mono text-brand">133</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-ivory">
                      <div className="hh-bar h-full w-[36%] rounded-full bg-brand" />
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-[1.7rem] font-semibold leading-none tracking-[-0.04em]">
                  64% <span className="text-sm font-semibold tracking-normal text-muted">less duplicate effort</span>
                </p>
              </div>
              <div className="hh-tile card p-6 text-left">
                <p className="text-sm font-bold">Evidence, collected once</p>
                <ul className="mt-4 space-y-2.5">
                  {FEED.map((f) => (
                    <li key={f.t} className="hh-feed flex items-center gap-3 rounded-[16px] bg-ivory px-3 py-2.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-brand shadow-[var(--shadow-card)]">
                        <Check className="size-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[0.82rem] font-semibold">{f.t}</span>
                        <span className="block text-xs text-muted">{f.m}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
