"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { frameworkGroups } from "@/lib/content";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const KnotScene = dynamic(() => import("./KnotScene").then((m) => m.KnotScene), { ssr: false });

const ticker = frameworkGroups.flatMap((g) => g.items.map((i) => i.name));

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });
      onSiteReady(() => gsap.to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.08, delay: 0.9 }));

      // Headline drifts up and the section dims as you scroll away.
      gsap.to(".hero-copy", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(120%_90%_at_75%_40%,#faf8f2_0%,var(--ivory)_45%,var(--paper)_100%)]"
    >
      {/* Top meta row */}
      <div className="container-x relative z-10 grid grid-cols-2 gap-6 pt-28 md:grid-cols-4">
        <p className="hero-fade eyebrow text-muted">(SK—01)</p>
        <p className="hero-fade eyebrow hidden text-muted md:block">
          Compliance advisory
          <br />
          &amp; audit readiness
        </p>
        <p className="hero-fade eyebrow hidden text-muted md:block">
          Wilmington, DE
          <br />
          Bengaluru, IN
        </p>
        <NowTying />
      </div>

      {/* Mobile: its own block above the headline. Desktop: full-bleed behind the copy. */}
      <KnotScene className="relative h-[42svh] w-full lg:absolute lg:inset-0 lg:h-auto" />

      <div className="hero-copy container-x relative z-10 mt-auto pb-10 md:pb-14">
        <h1 className="display text-[clamp(3.4rem,10.2vw,11.5rem)] text-ink">
          <Reveal as="span" trigger="load" delay={0.35} className="block">
            Many frameworks.
          </Reveal>
          <Reveal as="span" trigger="load" delay={0.5} className="block">
            One <span className="serif text-knot">secure</span> knot.
          </Reveal>
        </h1>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:items-end">
          <p className="hero-fade max-w-md text-[1.05rem] leading-relaxed text-ink/70 md:col-span-5">
            SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS, ISO 42001 and more — unified into one
            audit-ready program by practitioners who&apos;ve sat on both sides of the audit table.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
            <Button href="/contact">Book an assessment</Button>
            <Button href="#assess-once" variant="outline" magnetic={false}>
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function NowTying() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ticker.length), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hero-fade flex flex-col items-end text-right md:items-start md:text-left">
      <p className="eyebrow flex items-center gap-2 text-muted">
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-knot-3" />
          <span className="relative size-1.5 rounded-full bg-knot-3" />
        </span>
        Now tying
      </p>
      <p className="relative mt-1 h-5 overflow-hidden text-sm font-medium" aria-live="off">
        <span key={i} className="block animate-[tick_0.6s_var(--ease-out)]">
          {ticker[i]}
        </span>
      </p>
    </div>
  );
}
