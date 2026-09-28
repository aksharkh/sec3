"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const cols = ["SOC 2", "ISO 27001", "HIPAA", "PCI DSS", "ISO 42001"];
const rows: { id: string; name: string; owner: string; map: number[] }[] = [
  { id: "AC-01", name: "Quarterly access reviews", owner: "IT", map: [1, 1, 1, 1, 0] },
  { id: "AC-04", name: "MFA on privileged access", owner: "Security", map: [1, 1, 1, 1, 1] },
  { id: "CM-02", name: "Peer-reviewed production changes", owner: "Engineering", map: [1, 1, 0, 1, 1] },
  { id: "RA-01", name: "Annual risk assessment", owner: "GRC", map: [1, 1, 1, 1, 1] },
  { id: "IR-03", name: "Incident response tabletop", owner: "Security", map: [1, 1, 1, 1, 0] },
  { id: "VM-02", name: "Vendor security reviews", owner: "Procurement", map: [1, 1, 1, 1, 1] },
  { id: "LG-05", name: "Centralised log retention", owner: "Platform", map: [1, 1, 1, 1, 0] },
  { id: "AI-02", name: "AI system impact assessment", owner: "Product", map: [0, 0, 0, 0, 1] },
  { id: "DP-03", name: "Encryption at rest & in transit", owner: "Platform", map: [1, 1, 1, 1, 1] },
];

/**
 * Pinned "expanding window": a small framed preview grows to fill the viewport,
 * then the unified control matrix comes alive inside it.
 */
export function ControlMatrix() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.8 },
      });
      tl.fromTo(".cm-frame", { clipPath: "inset(24% 26% 24% 26% round 2.5rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1 })
        .fromTo(".cm-inner", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .to(".cm-head", { autoAlpha: 0, y: -60, duration: 0.5 }, 0)
        .fromTo(".cm-status", { "--on": 0 }, { "--on": 1, stagger: 0.08, duration: 0.3 }, 1.2)
        .fromTo(".cm-count", { innerText: 0 }, { innerText: 118, snap: { innerText: 1 }, duration: 1 }, 1.1)
        .fromTo(".cm-bar", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 1.1);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ivory max-md:h-auto">
      <div className="cm-head pointer-events-none absolute inset-x-0 top-0 z-10 hidden pt-[9vh] text-center md:block">
        
        <h2 className="display mx-auto max-w-4xl text-[clamp(2.4rem,5vw,5rem)] text-ink">
          Every control. <span className="em text-brand">One matrix.</span>
        </h2>
      </div>

      <div className="cm-frame relative h-full w-full overflow-hidden bg-ink text-ivory">
        <div className="cm-inner flex h-full w-full flex-col px-[var(--gutter)] pb-8 pt-24 md:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-accent">Unified control matrix · sample program</p>
              <p className="mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none tracking-[-0.03em]">
                Tested once. <span className="em text-accent">Mapped to five.</span>
              </p>
            </div>
            <div className="min-w-64">
              <div className="flex items-baseline justify-between gap-6">
                <span className="eyebrow text-ivory/50">Controls passing</span>
                <span className="text-3xl tabular-nums tracking-[-0.03em]">
                  <span className="cm-count">118</span>
                  <span className="text-ivory/40">/118</span>
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-ivory/10">
                <div className="cm-bar h-full origin-left rounded-full bg-accent" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex-1 overflow-hidden rounded-3xl border border-ivory/10 bg-ink-2/80 md:mt-10">
            <div className="grid grid-cols-[4rem_1fr_6rem] md:grid-cols-[5rem_1.6fr_0.8fr_6.5rem] lg:grid-cols-[5rem_1.6fr_0.8fr_repeat(5,1fr)_7rem] items-center gap-3 border-b border-ivory/10 px-5 py-4 text-ivory/45">
              <span className="eyebrow">ID</span>
              <span className="eyebrow">Control</span>
              <span className="eyebrow hidden md:block">Owner</span>
              {cols.map((c) => (
                <span key={c} className="eyebrow hidden text-center lg:block">
                  {c}
                </span>
              ))}
              <span className="eyebrow text-right">Status</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.id}
                className="cm-row grid grid-cols-[4rem_1fr_6rem] md:grid-cols-[5rem_1.6fr_0.8fr_6.5rem] lg:grid-cols-[5rem_1.6fr_0.8fr_repeat(5,1fr)_7rem] items-center gap-3 border-b border-ivory/5 px-5 py-3.5"
              >
                <span className="font-mono text-xs text-ivory/50">{r.id}</span>
                <span className="truncate text-[0.95rem]">{r.name}</span>
                <span className="hidden text-sm text-ivory/50 md:block">{r.owner}</span>
                {r.map.map((m, i) => (
                  <span key={i} className="hidden justify-center lg:flex">
                    {m ? (
                      <span className="grid size-6 place-items-center rounded-full bg-brand-3/25 text-accent">
                        <svg viewBox="0 0 10 10" className="size-2.5">
                          <path d="M2 5.2 4.2 7.4 8 2.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-px w-3 bg-ivory/15" />
                    )}
                  </span>
                ))}
                <span className="flex justify-end">
                  <span className="cm-status relative overflow-hidden rounded-full border border-ivory/10 px-3 py-1 text-xs [--on:1]">
                    <span className="block transition-none" style={{ opacity: "calc(1 - var(--on))" }}>
                      In review
                    </span>
                    <span
                      className="absolute inset-0 grid place-items-center bg-accent font-medium text-ink"
                      style={{ opacity: "var(--on)" }}
                    >
                      Passing
                    </span>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
