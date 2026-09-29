"use client";

import { useEffect, useRef } from "react";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { frameworkCount } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Threads } from "./Threads";

/**
 * Editorial hero: a serif statement over a quiet figure in which every
 * framework is a thread tied into one strand.
 */
export function MeridianHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".mh-fade", { autoAlpha: 0, y: 14 });
      onSiteReady(() => gsap.to(".mh-fade", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, delay: 0.55 }));
      gsap.to(".mh-copy", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-ivory pt-28 md:pt-32">
      <div className="mh-copy container-x">
        <div className="mh-fade flex items-center justify-between gap-6 border-b border-line pb-5">
          <p className="eyebrow flex items-center gap-3 text-muted">
            <span className="size-1.5 rounded-full bg-brand" />
            Compliance advisory &amp; audit readiness
          </p>
          <p className="hidden text-sm text-muted md:block">
            {frameworkCount} frameworks · Practitioner-led · US &amp; India
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <h1 className="wide text-[clamp(3.2rem,8.6vw,9.6rem)] leading-[0.92] lg:col-span-8">
            <Reveal as="span" trigger="load" delay={0.25} className="block">
              Many frameworks.
            </Reveal>
            <Reveal as="span" trigger="load" delay={0.4} className="block">
              One <span className="em text-brand">secure knot.</span>
            </Reveal>
          </h1>
          <div className="lg:col-span-4 lg:pb-4">
            <p className="mh-fade max-w-md text-lg leading-relaxed text-ink/70">
              We unify SOC 2, ISO 27001, FedRAMP, CMMC and {frameworkCount - 4} more frameworks into one audit-ready program. Tested once, reported to every buyer who asks.
            </p>
            <div className="mh-fade mt-8 flex flex-wrap gap-3">
              <Button href="#book">Book a consultation</Button>
              <Button href="/customers" variant="outline">
                Client stories
              </Button>
            </div>
          </div>
        </div>
      </div>

      <figure className="mt-14 md:mt-16">
        <div className="container-x">
          <Threads className="h-[300px] w-full md:h-auto" />
        </div>
        <figcaption className="container-x mt-2 flex items-center justify-between gap-6 border-t border-line py-5 text-sm text-muted">
          <span>
            <span className="serif mr-2 text-base italic text-ink">Fig. 1</span>
            Each thread is a framework a buyer may ask you to prove.
          </span>
          <span className="hidden md:inline">Hover a thread to trace it</span>
        </figcaption>
      </figure>
    </section>
  );
}
