"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { controlDomains, overlapFrameworks } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";

const DEFAULT = ["SOC 2", "ISO 27001", "HIPAA"];

export function OverlapMap({ eyebrow = "Assess once" }: { eyebrow?: string }) {
  const [selected, setSelected] = useState<string[]>(DEFAULT);

  const { separate, unified, saved, coverage } = useMemo(() => {
    const picks = overlapFrameworks.filter((f) => selected.includes(f.name));
    const coverage = new Map<string, string[]>();
    let separate = 0;
    for (const f of picks) {
      for (const d of f.domains) {
        coverage.set(d, [...(coverage.get(d) ?? []), f.name]);
        separate += controlDomains.find((c) => c.id === d)!.weight;
      }
    }
    const unified = [...coverage.keys()].reduce((n, d) => n + controlDomains.find((c) => c.id === d)!.weight, 0);
    const saved = separate ? Math.round((1 - unified / separate) * 100) : 0;
    return { separate, unified, saved, coverage };
  }, [selected]);

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  return (
    <section id="assess-once" data-theme="dark" className="relative overflow-hidden bg-ink py-28 text-ivory md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgb(47_93_176/0.45),transparent_60%)]"
      />
      <div className="container-x relative">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-ivory/45 md:col-span-3">{eyebrow}</p>
          <div className="md:col-span-9">
            <Reveal as="h2" className="display text-[clamp(2.8rem,7vw,7.5rem)]">
              Test a control once. <span className="em text-accent">Map it everywhere.</span>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-ivory/65">
              Pick the frameworks on your roadmap. Watch how much of the work is shared, that&apos;s the
              work we do once, not five times.
            </p>

            <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Choose frameworks">
              {overlapFrameworks.map((f) => {
                const on = selected.includes(f.name);
                return (
                  <button
                    key={f.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(f.name)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-500 ease-out-expo ${
                      on
                        ? "border-accent bg-accent text-ink"
                        : "border-ivory/15 text-ivory/70 hover:border-ivory/40 hover:text-ivory"
                    }`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full border transition-colors ${
                        on ? "border-ink bg-ink text-accent" : "border-ivory/30"
                      }`}
                    >
                      {on && (
                        <svg viewBox="0 0 10 10" className="size-2">
                          <path d="M2 5.2 4.2 7.4 8 2.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
                        </svg>
                      )}
                    </span>
                    {f.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line-dark bg-line-dark">
              <Stat label="Controls tested separately" value={separate} muted />
              <Stat label="Tested once with SecureKnots" value={unified} />
              <div className="col-span-2 flex items-end justify-between gap-6 bg-ink-2 p-7">
                <div>
                  <p className="eyebrow text-ivory/45">Duplicate effort removed</p>
                  <p className="mt-2 text-sm text-ivory/45">
                    {selected.length < 2 ? "Select two or more frameworks" : `Across ${selected.length} frameworks`}
                  </p>
                </div>
                <p className="display text-[clamp(4rem,8vw,7rem)] text-accent">
                  <Count value={saved} />
                  <span className="text-[0.5em]">%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Domain grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {controlDomains.map((d) => {
                const hits = coverage.get(d.id) ?? [];
                const c = hits.length;
                return (
                  <div
                    key={d.id}
                    className={`relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-700 ease-out-expo ${
                      c === 0
                        ? "border-ivory/8 bg-transparent text-ivory/30"
                        : c === 1
                          ? "border-ivory/10 bg-ink-3 text-ivory"
                          : "border-brand-3/60 bg-brand text-ivory"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="eyebrow text-[0.62rem] opacity-60">{String(d.weight).padStart(2, "0")} ctrl</span>
                      {c > 1 && (
                        <span className="eyebrow rounded-full bg-accent px-2 py-0.5 text-[0.6rem] text-ink">×{c}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[0.95rem] leading-tight tracking-[-0.01em]">{d.name}</p>
                      <div className="mt-2.5 flex gap-1">
                        {selected.map((s) => (
                          <span
                            key={s}
                            title={s}
                            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                              hits.includes(s) ? "bg-accent" : "bg-ivory/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="eyebrow mt-5 text-ivory/35">
              Illustrative control-domain mapping. Actual overlap depends on scope and system boundary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="bg-ink-2 p-7">
      <p className="eyebrow text-ivory/45">{label}</p>
      <p className={`mt-4 text-5xl tracking-[-0.04em] ${muted ? "text-ivory/40 line-through decoration-1" : "text-ivory"}`}>
        <Count value={value} />
      </p>
    </div>
  );
}

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  useEffect(() => {
    const obj = { v: current.current };
    const t = gsap.to(obj, {
      v: value,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = String(Math.round(obj.v));
      },
    });
    current.current = value;
    return () => {
      t.kill();
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}
