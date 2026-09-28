"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CoverageMatrix, matrixStats } from "./CoverageMatrix";

/**
 * Pinned hero. The coverage matrix shows 29 frameworks against their control
 * domains; scrolling collapses every column into one: a single control set.
 */
export function SignalHero() {
  const root = useRef<HTMLElement>(null);
  const collapse = useRef(0);
  const readout = useRef<HTMLSpanElement>(null);
  const [tip, setTip] = useState<string | null>(null);
  const onHover = useCallback((l: string | null) => setTip(l), []);

  // Layout effect: the pin must be reverted before React removes the DOM.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(".sh-fade", { autoAlpha: 0, y: 20 });
        onSiteReady(() => gsap.to(".sh-fade", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.5 }));
      }
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              collapse.current = self.progress;
              if (readout.current)
                readout.current.textContent =
                  self.progress > 0.6 ? `1 control set / ${matrixStats.controls} controls` : `${matrixStats.frameworks} frameworks × ${matrixStats.domains} domains`;
            },
          },
        }).to(".sh-copy", { yPercent: -8, autoAlpha: 0.25, ease: "none" }, 0);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[100dvh] flex-col bg-ivory pb-10 pt-28 md:pb-12">
      <div className="container-x flex flex-1 flex-col">
        <p className="sh-fade eyebrow text-muted">
          <span className="text-brand">/</span> Compliance advisory and audit readiness
        </p>
        <h1 className="wide mt-6 text-[clamp(2.3rem,6.6vw,7.6rem)]">
          <Reveal as="span" trigger="load" delay={0.3} className="block">
            Many frameworks.
          </Reveal>
          <Reveal as="span" trigger="load" delay={0.42} className="block">
            One <span className="em text-brand">secure</span> knot.
          </Reveal>
        </h1>

        <div className="mt-10 grid flex-1 gap-8 md:mt-14 md:grid-cols-12">
          <div className="sh-copy flex flex-col justify-between gap-8 md:col-span-4">
            <p className="sh-fade max-w-sm text-lg leading-relaxed text-ink/70">
              SOC 2, ISO 27001, FedRAMP, CMMC and 25 more frameworks, unified into one audit-ready program.
            </p>
            <div className="sh-fade flex flex-wrap gap-3">
              <Button href="#book">Book an assessment</Button>
              <Button href="/customers" variant="outline" magnetic={false}>
                Customer stories
              </Button>
            </div>
          </div>

          <div className="sh-fade sh-panel relative flex min-h-[280px] flex-col overflow-hidden rounded-[12px] bg-ink text-ivory shadow-[0_30px_80px_-40px_rgb(11_27_54/0.6)] md:col-span-8">
            <div className="flex items-center justify-between border-b border-line-dark px-5 py-3">
              <span className="eyebrow text-ivory/55">Coverage matrix</span>
              <span ref={readout} className="eyebrow text-brand-3">
                {matrixStats.frameworks} frameworks × {matrixStats.domains} domains
              </span>
            </div>
            <div className="relative flex-1 p-4">
              <CoverageMatrix collapse={collapse} onHover={onHover} onDark className="absolute inset-4 size-[calc(100%-2rem)]" />
            </div>
            <div className="flex h-10 items-center border-t border-line-dark px-5">
              <span className="mono text-xs text-ivory/55">{tip ?? "Hover a cell to see the framework and control domain."}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
