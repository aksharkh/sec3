"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { frameworkGroups } from "@/lib/content";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { RotatingBadge } from "@/components/ui/RotatingBadge";

const KnotScene = dynamic(() => import("./KnotScene").then((m) => m.KnotScene), { ssr: false });

const ticker = frameworkGroups.flatMap((g) => g.items.map((i) => i.name));

declare global {
  interface Window {
    __skHero?: number;
  }
}

/**
 * Pinned hero. Scrolling pushes the camera into the knot while a navy portal
 * opens from the knot's centre and swallows the screen — handing off
 * seamlessly to the (navy) section that follows.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const knotBox = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    window.__skHero = 0;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });
      onSiteReady(() => gsap.to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.08, delay: 0.9 }));

      const origin = () => {
        const r = knotBox.current!.getBoundingClientRect();
        const desktop = window.innerWidth >= 1024;
        const x = desktop ? r.left + r.width * 0.74 : r.left + r.width / 2;
        const y = desktop ? r.top + r.height * 0.41 : r.top + r.height / 2;
        return `${x}px ${y}px`;
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=160%",
          pin: stage.current,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => (window.__skHero = self.progress),
        },
      });
      tl.to(".hero-copy", { yPercent: -25, scale: 0.92, autoAlpha: 0, filter: "blur(8px)", duration: 0.45 }, 0)
        .to(".hero-meta", { autoAlpha: 0, y: -30, duration: 0.3 }, 0)
        .fromTo(
          portal.current,
          { clipPath: () => `circle(0% at ${origin()})` },
          { clipPath: () => `circle(150% at ${origin()})`, duration: 0.6, ease: "power2.in" },
          0.4,
        )
        .fromTo(".portal-copy", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3 }, 0.7);
    }, el);
    return () => {
      ctx.revert();
      window.__skHero = 0;
    };
  }, []);

  return (
    <section ref={root} className="relative">
      <div
        ref={stage}
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(120%_90%_at_75%_40%,#faf8f2_0%,var(--ivory)_45%,var(--paper)_100%)]"
      >
        {/* Top meta row */}
        <div className="hero-meta container-x relative z-10 grid grid-cols-2 gap-6 pt-28 md:grid-cols-4">
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
        <div ref={knotBox} className="relative h-[42svh] w-full lg:absolute lg:inset-0 lg:h-auto">
          <KnotScene className="absolute inset-0" />
        </div>

        <div className="hero-copy container-x relative z-10 mt-auto origin-bottom-left pb-10 md:pb-14">
          <h1 className="display text-[clamp(3.4rem,10.2vw,11.5rem)] text-ink">
            <Reveal as="span" trigger="load" delay={0.35} className="block">
              Many frameworks.
            </Reveal>
            <Reveal as="span" trigger="load" delay={0.5} className="block">
              One <span className="serif text-brand">secure</span> knot.
            </Reveal>
          </h1>

          <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:items-center">
            <p className="hero-fade max-w-md text-[1.05rem] leading-relaxed text-ink/70 md:col-span-5">
              SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS, ISO 42001 and more — unified into one audit-ready program by
              practitioners who&apos;ve sat on both sides of the audit table.
            </p>
            <div className="hero-fade hidden justify-center md:col-span-2 md:flex">
              <RotatingBadge text="Scroll to enter the knot • Scroll to enter the knot • " />
            </div>
            <div className="hero-fade flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
              <Button href="#book">Book an assessment</Button>
              <Button href="/customers" variant="outline" magnetic={false}>
                Customer stories
              </Button>
            </div>
          </div>
        </div>

        {/* Portal */}
        <div
          ref={portal}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-brand text-ivory"
          style={{ clipPath: "circle(0% at 74% 41%)" }}
        >
          <div className="portal-copy px-6 text-center">
            <p className="eyebrow text-accent">(SK—02) Inside the knot</p>
            <p className="display mt-6 text-[clamp(2.8rem,8vw,8rem)]">
              Untangle <span className="serif">everything.</span>
            </p>
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
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-3" />
          <span className="relative size-1.5 rounded-full bg-brand-3" />
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
