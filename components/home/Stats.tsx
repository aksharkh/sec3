"use client";

import { useEffect, useRef } from "react";
import { stats } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((n) => {
        const end = Number(n.dataset.value);
        const obj = { v: 0 };
        n.textContent = "0";
        gsap.to(obj, {
          v: end,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: n, start: "top 90%", once: true },
          onUpdate: () => (n.textContent = String(Math.round(obj.v))),
        });
      });
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
    <section ref={root} className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">(SK—07) In numbers</p>
          <div className="md:col-span-9">
            <Reveal as="h2" className="display max-w-5xl text-[clamp(2.4rem,5.5vw,5.5rem)]">
              Knots that <span className="serif text-brand">hold</span> under audit.
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="stat-line h-px w-full bg-ink/20" />
              <p className="display mt-6 flex items-start text-[clamp(4.5rem,8vw,8.5rem)] tabular-nums">
                <span className="stat-num" data-value={s.value}>
                  {s.value}
                </span>
                <span className="serif mt-[0.12em] text-[0.45em] text-brand">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-[15rem] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
