"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { services } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";
import { KnotMark } from "@/components/ui/Logo";

const themes = [
  { card: "bg-paper text-ink", sub: "text-ink/60", pill: "border-ink/15", mark: "text-ink/[0.06]" },
  { card: "bg-brand text-ivory", sub: "text-ivory/65", pill: "border-ivory/20", mark: "text-ivory/[0.07]" },
  { card: "bg-ink text-ivory", sub: "text-ivory/60", pill: "border-ivory/20", mark: "text-accent/[0.12]" },
  { card: "bg-bone text-ink", sub: "text-ink/60", pill: "border-ink/15", mark: "text-brand/[0.1]" },
  { card: "bg-accent text-ink", sub: "text-ink/70", pill: "border-ink/20", mark: "text-ink/[0.08]" },
];

export function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: "top bottom", end: "top 15%", scrub: true };
        gsap.to(card.querySelector(".svc-inner"), { scale: 0.9, rotateX: 12, yPercent: -4, ease: "none", scrollTrigger: st });
        gsap.to(card.querySelector(".svc-shade"), { opacity: 0.55, ease: "none", scrollTrigger: st });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ivory pb-28 pt-28 md:pb-40 md:pt-40">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">(SK—06) What we do</p>
          <div className="md:col-span-9">
            <Reveal as="h2" className="display text-[clamp(2.8rem,7vw,7.5rem)]">
              Five services. <span className="serif text-brand">One program.</span>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          {services.map((s, i) => {
            const t = themes[i % themes.length];
            return (
              <article
                key={s.id}
                className="svc-card sticky mb-6 [perspective:1400px] md:mb-10"
                style={{ top: `calc(6rem + ${i * 1.25}rem)` }}
              >
                <div
                  className={`svc-inner relative flex min-h-[72svh] origin-top flex-col overflow-hidden rounded-[2rem] p-7 md:min-h-[68vh] md:rounded-[2.5rem] md:p-12 ${t.card}`}
                >
                  <div className="svc-shade pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" />
                  <KnotMark
                    className={`pointer-events-none absolute -bottom-[18%] -right-[8%] w-[70%] max-w-[46rem] md:w-[45%] ${t.mark}`}
                    strokeWidth={5}
                  />
                  <div className="relative flex items-start justify-between gap-6">
                    <span className="eyebrow">
                      {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>
                    <span className={`eyebrow rounded-full border px-3 py-1.5 ${t.pill}`}>{s.kicker}</span>
                  </div>

                  <div className="relative mt-auto grid gap-10 pt-16 md:grid-cols-12 md:items-end">
                    <h3 className="display text-[clamp(2.6rem,6.5vw,6.5rem)] md:col-span-7">{s.title}</h3>
                    <div className="md:col-span-5">
                      <p className={`text-lg leading-relaxed ${t.sub}`}>{s.body}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.deliverables.map((d) => (
                          <li key={d} className={`rounded-full border px-3.5 py-1.5 text-sm ${t.pill}`}>
                            {d}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/services/${s.id}`}
                        data-cursor="Explore"
                        className="group mt-8 inline-flex items-center gap-3 text-sm font-medium"
                      >
                        <span className="link-sweep">Explore {s.title.toLowerCase()}</span>
                        <Arrow className="size-3 transition-transform duration-500 group-hover:rotate-45" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
