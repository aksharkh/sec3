"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { frameworkGroups, frameworkCount, services, process as steps, stats } from "@/lib/content";
import { gsap, ScrollTrigger, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { KnotMark } from "@/components/ui/Logo";
import { Orbit } from "./Orbit";

const CHAPTERS = ["Overview", "The challenge", "Services", "Approach", "Frameworks", "Results"];
const CAPTIONS = [
  "Each ring is a family of frameworks. Each point is one framework.",
  "Run separately, every program tests the same controls again.",
  "Five services work on one shared control set.",
  "A typical program, from first call to signed report.",
  "Pick a family to see where it sits on the map.",
  "One control set, evidenced once, reported to many.",
];

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Chapter({ i, label, children, className }: { i: number; label: string; children: ReactNode; className?: string }) {
  return (
    <section data-chapter={i} className={`flex flex-col justify-center border-b border-line px-[var(--gutter)] py-20 lg:min-h-[calc(100dvh-var(--header))] lg:py-24 ${className ?? ""}`}>
      <p className="at-in eyebrow mb-8 flex items-center gap-3 text-muted">
        <span className="mono text-brand">0{i + 1}</span>
        <span className="h-px w-8 bg-line" />
        {label}
      </p>
      {children}
    </section>
  );
}

/**
 * The homepage spine. A navy panel holding the control map stays pinned on the
 * left while the chapters scroll past on the right; the map reacts to whichever
 * chapter, service, step or framework family is in focus.
 */
export function Split() {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [service, setService] = useState(0);
  const [step, setStep] = useState(0);
  const [group, setGroup] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((c) => {
        ScrollTrigger.create({
          trigger: c,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setChapter(Number(c.dataset.chapter)),
          onEnterBack: () => setChapter(Number(c.dataset.chapter)),
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top 62%",
          end: "bottom 62%",
          onEnter: () => setStep(Number(s.dataset.step)),
          onEnterBack: () => setStep(Number(s.dataset.step)),
        });
      });

      if (prefersReducedMotion()) return;
      gsap.set(".at-hero", { autoAlpha: 0, y: 16 });
      gsap.set(".at-map", { autoAlpha: 0, scale: 0.92 });
      onSiteReady(() => {
        gsap.to(".at-map", { autoAlpha: 1, scale: 1, duration: 1.6, delay: 0.3, ease: "expo.out" });
        gsap.to(".at-hero", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, delay: 0.5 });
      });
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((c, i) => {
        if (i === 0) return;
        gsap.from(c.querySelectorAll(".at-in"), { y: 28, autoAlpha: 0, duration: 1, stagger: 0.07, scrollTrigger: { trigger: c, start: "top 70%", once: true } });
      });
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(n.dataset.count),
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const goTo = (i: number) => {
    const target = root.current?.querySelector<HTMLElement>(`[data-chapter="${i}"]`);
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const core: { v: ReactNode; l: string }[] = [
    { v: <KnotMark className="mx-auto size-12" strokeWidth={3.2} />, l: "" },
    { v: "5×", l: "the same controls" },
    { v: `0${service + 1}`, l: services[service].title },
    { v: steps[step].n, l: steps[step].title },
    { v: String(frameworkGroups[group].items.length), l: "frameworks" },
    { v: "1", l: "control set" },
  ];

  return (
    <div ref={root} className="grid lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
      {/* ── Pinned control map ── */}
      <aside data-theme="dark" className="navy relative text-white lg:sticky lg:top-[var(--header)] lg:h-[calc(100dvh-var(--header))]">
        <div className="flex h-full flex-col justify-between gap-6 p-[var(--gutter)] lg:py-10">
          <p className="eyebrow flex items-center justify-between text-white/60">
            <span>Control map</span>
            <span className="mono normal-case tracking-normal">
              {frameworkCount} frameworks · {frameworkGroups.length} families
            </span>
          </p>

          <div className="at-map relative mx-auto aspect-square w-full max-w-[min(100%,62vh)]">
            <Orbit chapter={chapter} service={service} step={step} group={group} className="size-full overflow-visible" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div key={`${chapter}-${chapter === 2 ? service : chapter === 3 ? step : chapter === 4 ? group : 0}`} className="w-[21%] animate-[fadeUp_0.5s_var(--ease-out)]">
                <div className="text-[clamp(1.5rem,3.2vw,2.6rem)] font-light leading-none tracking-[-0.03em]">{core[chapter].v}</div>
                {core[chapter].l && <p className="mt-1 text-[0.6rem] font-medium uppercase leading-tight tracking-[0.06em] text-white/80">{core[chapter].l}</p>}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <p key={chapter} className="max-w-sm animate-[fadeUp_0.6s_var(--ease-out)] text-[0.95rem] leading-relaxed text-white/75">
              {CAPTIONS[chapter]}
            </p>
            <ol className="mt-6 grid grid-cols-6 gap-2">
              {CHAPTERS.map((c, i) => (
                <li key={c}>
                  <button type="button" onClick={() => goTo(i)} className="group block w-full text-left" aria-current={chapter === i}>
                    <span className="block h-[2px] bg-white/20">
                      <span className={`block h-full origin-left bg-white transition-transform duration-700 ease-out-expo ${i <= chapter ? "scale-x-100" : "scale-x-0"}`} />
                    </span>
                    <span className={`mt-2 block text-[0.68rem] font-medium leading-tight transition-colors ${chapter === i ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>{c}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>

      {/* ── Scrolling chapters ── */}
      <div className="bg-ivory">
        {/* 01 Overview */}
        <section data-chapter={0} className="flex flex-col justify-center border-b border-line px-[var(--gutter)] py-20 lg:min-h-[calc(100dvh-var(--header))] lg:py-16">
          <p className="at-hero eyebrow flex items-center gap-3 text-muted">
            <span className="size-1.5 rounded-full bg-brand" />
            Compliance advisory &amp; audit readiness
          </p>
          <h1 className="wide mt-8 text-[clamp(2.8rem,5.6vw,5.6rem)]">
            <Reveal as="span" trigger="load" delay={0.2} className="block">
              Many frameworks.
            </Reveal>
            <Reveal as="span" trigger="load" delay={0.32} className="block">
              One <span className="em">secure knot.</span>
            </Reveal>
          </h1>
          <p className="at-hero mt-8 max-w-xl text-[1.15rem] leading-relaxed text-muted">
            We unify SOC 2, ISO 27001, FedRAMP, CMMC and {frameworkCount - 4} more frameworks into one audit-ready program. Tested once, reported to every buyer who asks.
          </p>
          <div className="at-hero mt-10 flex flex-wrap gap-3">
            <Button href="#book">Book a consultation</Button>
            <Button href="/customers" variant="outline">
              Client stories
            </Button>
          </div>
          <dl className="at-hero mt-16 grid grid-cols-3 border-t border-line">
            {stats.slice(0, 3).map((s, i) => (
              <div key={s.label} className={`pt-6 ${i ? "border-l border-line pl-6" : ""}`}>
                <dd className="text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-none tracking-[-0.03em]">
                  {s.value}
                  <span className="text-brand">{s.suffix}</span>
                </dd>
                <dt className="mt-3 max-w-[11rem] text-sm leading-snug text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* 02 The challenge */}
        <Chapter i={1} label="The challenge">
          <p className="at-in wide max-w-3xl text-[clamp(1.7rem,2.9vw,2.9rem)] !leading-[1.2]">
            Every new customer asks for another certificate, another questionnaire, another audit. Most teams end up running five programs that test the same controls five different ways.
          </p>
          <p className="at-in mt-10 flex items-center gap-5 text-[clamp(1.4rem,2.2vw,2.1rem)] font-medium tracking-[-0.02em] text-brand">
            <span className="h-px w-14 bg-brand" />
            We tie them into one.
          </p>
        </Chapter>

        {/* 03 Services */}
        <Chapter i={2} label="Services">
          <h2 className="at-in wide max-w-2xl text-[clamp(2.1rem,3.8vw,3.8rem)]">
            Five services. <span className="em">One program.</span>
          </h2>
          <ul className="mt-12 border-t border-line">
            {services.map((s, i) => {
              const on = service === i;
              return (
                <li key={s.id} className="at-in border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setService(i)}
                    onFocus={() => setService(i)}
                    onClick={() => setService(i)}
                    aria-expanded={on}
                    className="flex w-full items-center gap-6 py-5 text-left"
                  >
                    <span className={`mono text-xs transition-colors ${on ? "text-brand" : "text-muted"}`}>0{i + 1}</span>
                    <span className={`flex-1 text-[clamp(1.25rem,1.9vw,1.7rem)] tracking-[-0.02em] transition-colors ${on ? "font-medium text-ink" : "font-light text-ink/60"}`}>{s.title}</span>
                    <span className={`hidden text-xs uppercase tracking-[0.1em] sm:block ${on ? "text-brand" : "text-muted"}`}>{s.kicker}</span>
                    <span className={`relative size-4 transition-transform duration-500 ${on ? "rotate-45 text-brand" : "text-muted"}`} aria-hidden>
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="grid gap-6 pb-7 pl-10 md:grid-cols-2">
                        <div>
                          <p className="leading-relaxed text-muted">{s.body}</p>
                          <Link href={`/services/${s.id}`} data-label={s.title} tabIndex={on ? 0 : -1} className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand">
                            Explore {s.title} <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                          </Link>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {s.deliverables.map((d) => (
                            <li key={d} className="flex items-center gap-3 border-b border-line pb-2">
                              <span className="size-1 rounded-full bg-brand" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Chapter>

        {/* 04 Approach */}
        <Chapter i={3} label="Approach">
          <h2 className="at-in wide max-w-2xl text-[clamp(2.1rem,3.8vw,3.8rem)]">
            From tangle <span className="em">to tied.</span>
          </h2>
          <p className="at-in mt-5 max-w-lg text-[1.05rem] leading-relaxed text-muted">A typical SOC 2 or ISO 27001 program, from first call to signed report, in around fourteen weeks.</p>
          <ol className="relative mt-12">
            <span className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
            {steps.map((p, i) => {
              const done = i <= step && chapter >= 3;
              return (
                <li key={p.n} data-step={i} className="relative grid gap-2 py-7 pl-12 md:grid-cols-[9rem_1fr] md:gap-8">
                  <span className={`absolute left-0 top-9 size-[15px] rounded-full border-2 transition-colors duration-500 ${done ? "border-brand bg-brand" : "border-line bg-ivory"}`} />
                  <p className={`mono pt-1.5 text-xs uppercase transition-colors ${done ? "text-brand" : "text-muted"}`}>{p.time}</p>
                  <div className={`transition-opacity duration-500 ${i === step || chapter !== 3 ? "opacity-100" : "opacity-45"}`}>
                    <h3 className="text-[1.6rem] font-medium tracking-[-0.02em]">{p.title}</h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-muted">{p.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Chapter>

        {/* 05 Frameworks */}
        <Chapter i={4} label="Frameworks">
          <h2 className="at-in wide max-w-2xl text-[clamp(2.1rem,3.8vw,3.8rem)]">
            {frameworkCount} frameworks. <span className="em">One partner.</span>
          </h2>
          <div className="at-in mt-12 grid gap-8 md:grid-cols-[15rem_1fr]">
            <div role="tablist" aria-label="Framework families" className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:border-l md:border-line">
              {frameworkGroups.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={group === i}
                  onClick={() => setGroup(i)}
                  onMouseEnter={() => setGroup(i)}
                  className={`relative shrink-0 whitespace-nowrap px-4 py-3 text-left text-[0.95rem] transition-colors md:-ml-px md:border-l-2 ${
                    group === i ? "font-medium text-ink md:border-brand" : "text-muted hover:text-ink md:border-transparent"
                  }`}
                >
                  {g.name}
                  <span className="mono ml-2 text-xs text-brand">{g.items.length}</span>
                </button>
              ))}
            </div>
            <div role="tabpanel" key={group} className="animate-[fadeUp_0.5s_var(--ease-out)]">
              <p className="text-muted">{frameworkGroups[group].blurb}</p>
              <ul className="mt-5 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
                {frameworkGroups[group].items.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/frameworks/${f.slug}`} data-label={f.name} className="group flex items-center justify-between border-b border-line py-3.5 text-[1.05rem] transition-colors hover:text-brand">
                      {f.name}
                      <Arrow className="size-3.5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/frameworks" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">
                View all {frameworkCount} frameworks <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Chapter>

        {/* 06 Results */}
        <Chapter i={5} label="Results" className="border-b-0">
          <h2 className="at-in wide max-w-2xl text-[clamp(2.1rem,3.8vw,3.8rem)]">
            Knots that <span className="em">hold under audit.</span>
          </h2>
          <dl className="mt-12 grid grid-cols-2 border-l border-t border-line">
            {stats.map((s) => (
              <div key={s.label} className="at-in flex flex-col border-b border-r border-line p-6 md:p-8">
                <dd className="text-[clamp(2.8rem,5.4vw,5rem)] font-light leading-none tracking-[-0.04em] tabular-nums">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-brand">{s.suffix}</span>
                </dd>
                <dt className="mt-5 max-w-[14rem] text-[0.95rem] leading-snug text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Chapter>
      </div>
    </div>
  );
}
