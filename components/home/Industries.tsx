"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { industries } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

export function Industries() {
  const [active, setActive] = useState<number | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // Floating preview card follows the pointer across the list.
  useEffect(() => {
    const c = card.current;
    const l = list.current;
    if (!c || !l || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(c, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.7, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = l.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    l.addEventListener("pointermove", move);
    return () => l.removeEventListener("pointermove", move);
  }, []);

  const current = active !== null ? industries[active] : null;

  return (
    <section data-theme="dark" className="relative bg-ink-2 py-28 text-ivory md:py-40">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-ivory/45 md:col-span-3">(SK—08) Industries</p>
          <div className="md:col-span-9">
            <Reveal as="h2" className="display text-[clamp(2.6rem,6.5vw,7rem)]">
              Built for teams that sell to <span className="serif text-accent">demanding buyers.</span>
            </Reveal>
          </div>
        </div>

        <div ref={list} className="relative mt-16 md:mt-24" onPointerLeave={() => setActive(null)}>
        <ul className="border-t border-line-dark">
          {industries.map((ind, i) => (
            <li key={ind.name} onPointerEnter={() => setActive(i)}>
              <Link
                href="/industries"
                data-cursor="hide"
                className="group grid grid-cols-12 items-center gap-4 border-b border-line-dark py-7 md:py-9"
              >
                <span className="eyebrow col-span-2 text-ivory/35 md:col-span-1">0{i + 1}</span>
                <span
                  className={`col-span-10 text-[clamp(1.9rem,4.4vw,4.4rem)] leading-none tracking-[-0.04em] transition-all duration-700 ease-out-expo md:col-span-6 ${
                    active !== null && active !== i ? "text-ivory/25" : "text-ivory"
                  } group-hover:translate-x-4`}
                >
                  {ind.name}
                </span>
                <span className="col-span-12 flex flex-wrap gap-1.5 md:col-span-4 md:col-start-8 md:justify-end">
                  {ind.frameworks.map((f) => (
                    <span key={f} className="eyebrow rounded-full border border-ivory/12 px-2.5 py-1 text-[0.62rem] text-ivory/55">
                      {f}
                    </span>
                  ))}
                </span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="grid size-11 place-items-center rounded-full border border-ivory/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    <Arrow className="size-3" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

          <div
            ref={card}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          >
            <div
              className={`w-72 -translate-x-1/2 -translate-y-[115%] rounded-3xl bg-accent p-6 text-ink shadow-2xl transition-[opacity,scale] duration-500 ease-out-expo ${
                current ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <p className="eyebrow text-ink/60">Why it matters</p>
              <p className="mt-3 text-xl leading-snug tracking-[-0.02em]">{current?.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
