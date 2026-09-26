"use client";

import { useEffect, useRef } from "react";
import { stats } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Odometer } from "@/components/ui/Odometer";

export function Stats({ eyebrow = "(SK—09) In numbers" }: { eyebrow?: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".stat-line", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.6,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="-mt-px bg-brand pb-28 pt-20 text-ivory md:pb-40 md:pt-28">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-ivory/50 md:col-span-3">{eyebrow}</p>
          <div className="md:col-span-9">
            <Reveal as="h2" className="display max-w-5xl text-[clamp(2.4rem,5.5vw,5.5rem)]">
              Knots that <span className="serif text-accent">hold</span> under audit.
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="stat-line h-px w-full bg-ivory/20" />
              <p className="display mt-6 flex items-start text-[clamp(4.5rem,8vw,8.5rem)] tabular-nums">
                <Odometer value={s.value} />
                <span className="serif mt-[0.12em] text-[0.45em] text-accent">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-[15rem] text-ivory/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
