"use client";

import Link from "next/link";
import { useState } from "react";
import { services, serviceDetails } from "@/lib/content";
import { Glyph } from "@/components/ui/Glyph";
import { Arrow } from "@/components/ui/Button";

/** Large accordion-style rows; hovering (or focusing) a row expands it. */
export function ServiceRows() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-ivory pb-28 md:pb-40">
      <div className="container-x">
        <ul className="border-t border-line">
          {services.map((s, i) => {
            const on = active === i;
            const d = serviceDetails[s.id];
            return (
              <li key={s.id} className="border-b border-line" onMouseEnter={() => setActive(i)}>
                <Link
                  href={`/services/${s.id}`}
                  data-label={s.title}
                  data-cursor="Explore"
                  onFocus={() => setActive(i)}
                  className="group relative block overflow-hidden"
                >
                  <div className={`absolute inset-0 origin-bottom bg-brand transition-transform duration-700 ease-out-expo ${on ? "scale-y-100" : "scale-y-0"}`} />
                  <div className={`relative grid gap-6 px-2 py-8 transition-colors duration-500 md:grid-cols-12 md:items-center md:px-6 ${on ? "text-ivory" : ""}`}>
                    <span className={`eyebrow md:col-span-1 ${on ? "text-accent" : "text-muted"}`}>0{i + 1}</span>
                    <span className="display text-[clamp(2.4rem,5.5vw,5.5rem)] md:col-span-7">{s.title}</span>
                    <span className={`eyebrow md:col-span-3 ${on ? "text-ivory/60" : "text-muted"}`}>{s.kicker}</span>
                    <span className="hidden justify-end md:col-span-1 md:flex">
                      <span className={`grid size-12 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-accent bg-accent text-ink" : "border-ink/15"}`}>
                        <Arrow className="size-3.5" />
                      </span>
                    </span>
                  </div>
                  <div className={`relative grid transition-[grid-template-rows] duration-700 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="grid gap-8 px-2 pb-10 text-ivory md:grid-cols-12 md:px-6">
                        <p className="text-2xl leading-snug tracking-[-0.02em] md:col-span-6 md:col-start-2">{d.tagline}</p>
                        <ul className="flex flex-wrap content-start gap-2 md:col-span-4">
                          {d.includes.slice(0, 4).map((x) => (
                            <li key={x.t} className="rounded-full border border-ivory/20 px-3.5 py-1.5 text-sm text-ivory/80">
                              {x.t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Glyph
                    seed={s.id}
                    className={`pointer-events-none absolute -right-20 top-1/2 hidden w-96 -translate-y-1/2 text-accent/25 transition-all duration-1000 ease-out-expo lg:block ${on ? "rotate-0 opacity-100" : "rotate-45 opacity-0"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
