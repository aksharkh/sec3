"use client";

import { useEffect, useRef } from "react";
import { process } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Process({ eyebrow = "(SK—07) How it works" }: { eyebrow?: string }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".proc-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".proc-panel").forEach((p) => {
        gsap.from(p.querySelectorAll(".proc-anim"), {
          y: 60,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 85%" },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="relative overflow-hidden bg-brand text-ivory md:h-screen">
      <div className="flex h-full flex-col py-24 md:py-0">
        <div className="container-x flex items-end justify-between gap-6 md:pt-32">
          <div>
            <p className="eyebrow text-ivory/50">{eyebrow}</p>
            <h2 className="display mt-6 text-[clamp(2.6rem,6vw,6rem)]">
              From tangle <span className="serif text-accent">to tied</span>
            </h2>
          </div>
          <p className="eyebrow hidden text-ivory/50 md:block">Typical SOC 2 / ISO 27001 timeline →</p>
        </div>

        <div className="container-x mt-10 hidden md:block">
          <div className="h-px w-full bg-ivory/15">
            <div className="proc-bar h-px origin-left scale-x-0 bg-accent" />
          </div>
        </div>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-4 px-[var(--gutter)] md:mt-auto md:flex-row md:gap-6 md:pb-20 md:pr-[20vw]"
        >
          {process.map((p) => (
            <article
              key={p.n}
              className="proc-panel relative flex shrink-0 flex-col justify-between rounded-[2rem] border border-ivory/12 bg-ivory/[0.03] p-7 md:h-[52vh] md:w-[38vw] md:p-10 lg:w-[30vw]"
            >
              <div className="proc-anim flex items-center justify-between">
                <span className="eyebrow text-accent">{p.time}</span>
                <span className="eyebrow text-ivory/40">Step {p.n}</span>
              </div>
              <div className="mt-12 md:mt-0">
                <p className="proc-anim serif text-[clamp(5rem,9vw,9rem)] leading-[0.8] text-ivory/15">{p.n}</p>
                <h3 className="proc-anim mt-4 text-4xl tracking-[-0.03em] md:text-5xl">{p.title}</h3>
                <p className="proc-anim mt-4 max-w-sm leading-relaxed text-ivory/65">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
