"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { FadeUp } from "@/components/ui/Reveal";

const text =
  "Every new customer asks for another certificate. Another questionnaire. Another audit. So teams end up running five programs that test the same controls five different ways — burning engineering time and stalling the deals that matter.";

const notes = [
  { k: "Up to 80%", v: "of controls overlap between SOC 2 and ISO 27001" },
  { k: "5×", v: "the evidence requests when frameworks run separately" },
  { k: "Months", v: "lost to security reviews in enterprise sales cycles" },
];

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pw",
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ".problem-text", start: "top 75%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from(".problem-answer", {
        yPercent: 100,
        duration: 1.4,
        scrollTrigger: { trigger: ".problem-answer-wrap", start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="relative -mt-px bg-brand pb-28 pt-16 text-ivory md:pb-44 md:pt-24">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow sticky top-28 text-ivory/50">(SK—02) The tangle</p>
        </div>

        <div className="md:col-span-9">
          <p className="problem-text text-[clamp(1.9rem,4.2vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.035em]">
            {text.split(" ").map((w, i) => (
              <span key={i} className="pw">
                {w}{" "}
              </span>
            ))}
          </p>

          <div className="problem-answer-wrap mt-10 overflow-hidden">
            <p className="problem-answer display text-[clamp(3rem,8vw,8rem)] text-accent">
              We tie it into <span className="serif">one.</span>
            </p>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-ivory/10 bg-ivory/10 sm:grid-cols-3">
            {notes.map((n, i) => (
              <FadeUp key={n.k} delay={i * 0.08} className="bg-brand p-7">
                <p className="text-4xl tracking-[-0.04em]">{n.k}</p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ivory/55">{n.v}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
