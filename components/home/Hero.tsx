"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ReededGlass } from "@/components/ui/ReededGlass";

const KnotScene = dynamic(() => import("./KnotScene").then((m) => m.KnotScene), { ssr: false });

declare global {
  interface Window {
    __skHero?: number;
  }
}

/**
 * Pinned hero. Scrolling pushes the camera into the knot while a navy portal
 * opens from the knot's centre and swallows the screen, handing off
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
        .to(".hero-glass", { scale: 1.08, autoAlpha: 0, duration: 0.5 }, 0.05)
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
      <div ref={stage} className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ivory lg:flex-row">
        {/* Desktop: tall reeded-glass panel on the right */}
        <div className="hero-glass pointer-events-none absolute bottom-6 right-[var(--gutter)] top-24 hidden w-[41vw] overflow-hidden rounded-[2rem] lg:block">
          <ReededGlass className="relative size-full" stripes={28} cx={0.46} cy={0.55} />
        </div>

        {/* Knot. Mobile: its own glass block above the copy. Desktop: full-bleed, floating over the glass. */}
        <div
          ref={knotBox}
          className="relative mx-[var(--gutter)] mt-20 h-[44svh] overflow-hidden rounded-[1.5rem] lg:absolute lg:inset-0 lg:m-0 lg:h-auto lg:overflow-visible lg:rounded-none"
        >
          <ReededGlass className="absolute inset-0 lg:hidden" stripes={18} />
          <KnotScene className="absolute inset-0" />
        </div>

        <div className="hero-copy container-x relative z-10 flex flex-1 flex-col justify-center pb-12 pt-10 lg:pb-16 lg:pt-24">
          <div className="lg:max-w-[52%]">
            <h1 className="display text-[clamp(2.8rem,5.3vw,6.2rem)] text-ink">
              <Reveal as="span" trigger="load" delay={0.35} className="block">
                Many frameworks.
              </Reveal>
              <Reveal as="span" trigger="load" delay={0.5} className="block">
                One <span className="em text-brand-3">secure</span> knot.
              </Reveal>
            </h1>
            <p className="hero-fade mt-8 max-w-md text-lg leading-relaxed text-ink/65">
              SOC 2, ISO 27001, FedRAMP, CMMC and 25 more frameworks, unified into one audit-ready program.
            </p>
            <div className="hero-fade mt-10 flex flex-wrap items-center gap-3">
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
          <p className="portal-copy display px-6 text-center text-[clamp(2.8rem,8vw,8rem)]">
            Untangle <span className="em text-accent">everything.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
