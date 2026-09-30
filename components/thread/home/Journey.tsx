"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { frameworkGroups, frameworkCount, services, process as steps, stats } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { gsap, ScrollTrigger, onSiteReady } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/components/insights/ArticleCard";

const CHAPTERS = ["Start", "Problem", "Services", "Process", "Frameworks", "Numbers", "Stories", "Insights"];

/* The tangle: a handful of Lissajous curves laid over each other. */
const TANGLE = [
  [3, 2, 0.4],
  [5, 4, 1.1],
  [3, 4, 2.0],
  [5, 6, 0.2],
  [2, 3, 1.6],
  [7, 6, 2.7],
].map(([a, b, ph]) => {
  const pts: string[] = [];
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    pts.push(`${(200 + 168 * Math.sin(a * t + ph)).toFixed(1)} ${(200 + 168 * Math.sin(b * t)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
});

const FLOATERS = [
  { n: "SOC 2", c: "left-[8%] top-[14%]" },
  { n: "ISO 27001", c: "right-[10%] top-[22%]" },
  { n: "FedRAMP", c: "left-[12%] bottom-[24%]" },
  { n: "HIPAA", c: "right-[14%] bottom-[16%]" },
  { n: "PCI DSS", c: "left-[42%] top-[7%]" },
  { n: "CMMC", c: "right-[40%] bottom-[8%]" },
];

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Chapter opener column: big index numeral, label, title, optional lead + action. */
function Opener({ n, label, title, children, dark, className }: { n: string; label: string; title: ReactNode; children?: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`flex shrink-0 flex-col justify-between gap-10 px-[var(--gutter)] py-10 lg:h-full lg:py-12 ${className ?? ""}`}>
      <p className={`jr-in eyebrow flex items-center gap-3 ${dark ? "text-white/60" : "text-muted"}`}>
        <span className={`px-1.5 py-0.5 ${dark ? "bg-white text-ink" : "bg-ink text-ivory"}`}>{n}</span>
        {label}
      </p>
      <div>
        <h2 className="jr-in wide text-[clamp(2.6rem,11vw,4rem)] lg:text-[clamp(2.4rem,9.5vh,6rem)]">{title}</h2>
        {children && <div className={`jr-in mt-7 max-w-md text-[1.05rem] leading-relaxed ${dark ? "text-white/70" : "text-ink/70"}`}>{children}</div>}
      </div>
    </div>
  );
}

/**
 * The homepage as one sideways journey. On large screens the section pins and
 * the track of chapters is pulled from right to left by the scroll wheel; a
 * ruler along the bottom shows where you are and lets you jump. On small
 * screens the same chapters simply stack.
 */
export function Journey() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const knot = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const index = useRef<HTMLSpanElement>(null);
  const st = useRef<ScrollTrigger | null>(null);

  // Layout effect: the pin must be reverted before React removes the DOM.
  useLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.set(".jh-fade", { autoAlpha: 0, y: 18 });
      gsap.set(".jh-path", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".jh-float", { autoAlpha: 0, scale: 0.8 });
      onSiteReady(() => {
        gsap
          .timeline({ delay: 0.4 })
          .to(".jh-fade", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0)
          .to(".jh-path", { strokeDashoffset: 0, duration: 2.6, stagger: 0.18, ease: "power2.inOut" }, 0.2)
          .to(".jh-float", { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.09, ease: "back.out(2)" }, 1);
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const dist = () => tr.scrollWidth - el.clientWidth;
        const marks = gsap.utils.toArray<HTMLElement>("[data-chapter]", tr);
        const ticks = gsap.utils.toArray<HTMLElement>(".jr-tick", el);
        let active = -1;

        const place = () => {
          const d = dist();
          marks.forEach((m, i) => {
            if (ticks[i]) ticks[i].style.left = `${Math.min(100, (m.offsetLeft / d) * 100)}%`;
          });
        };

        const tween = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: place,
            onUpdate: (self) => {
              const p = self.progress;
              if (fill.current) fill.current.style.transform = `scaleX(${p})`;
              if (knot.current) knot.current.style.left = `${p * 100}%`;
              const x = p * dist() + el.clientWidth * 0.35;
              let cur = 0;
              marks.forEach((m, i) => {
                if (m.offsetLeft <= x) cur = i;
              });
              if (cur !== active) {
                active = cur;
                if (label.current) label.current.textContent = CHAPTERS[cur];
                if (index.current) index.current.textContent = String(cur + 1).padStart(2, "0");
                ticks.forEach((t, i) => t.classList.toggle("is-on", i <= cur));
              }
            },
          },
        });
        st.current = tween.scrollTrigger ?? null;
        place();

        // Chapter content rises in as each panel arrives from the right.
        gsap.utils.toArray<HTMLElement>(".jr-panel", tr).forEach((p) => {
          const items = p.querySelectorAll(".jr-in");
          if (!items.length) return;
          gsap.from(items, {
            y: 46,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.07,
            scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 82%", once: true },
          });
        });
        // Oversized numerals drift against the direction of travel.
        gsap.utils.toArray<HTMLElement>(".jr-drift", tr).forEach((n) => {
          gsap.fromTo(n, { xPercent: 22 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: n, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        gsap.fromTo(".jr-rope", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".jr-rope", containerAnimation: tween, start: "left 85%", end: "right 60%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-count]", tr).forEach((n) => {
          const o = { v: 0 };
          gsap.to(o, {
            v: Number(n.dataset.count),
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: n, containerAnimation: tween, start: "left 90%", once: true },
            onUpdate: () => (n.textContent = String(Math.round(o.v))),
          });
        });

        return () => {
          st.current = null;
        };
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".jr-in", tr).forEach((n) => {
          gsap.from(n, { y: 30, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: n, start: "top 90%", once: true } });
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const jump = (i: number) => {
    const s = st.current;
    const tr = track.current;
    const el = root.current;
    if (!s || !tr || !el) return;
    const m = tr.querySelectorAll<HTMLElement>("[data-chapter]")[i];
    const d = tr.scrollWidth - el.clientWidth;
    const y = s.start + Math.min(1, m.offsetLeft / d) * (s.end - s.start);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const panel = "jr-panel relative shrink-0 border-b border-ink lg:h-full lg:border-b-0 lg:border-r";

  return (
    <section ref={root} className="journey relative bg-ivory pt-14 lg:h-dvh lg:overflow-hidden lg:pt-0">
      <div ref={track} className="flex flex-col will-change-transform lg:h-[calc(100dvh-var(--ruler))] lg:w-max lg:flex-row">
        {/* ── 01 Start ── */}
        <div data-chapter className={`${panel} grid lg:w-[calc(100vw-var(--rail))] lg:grid-cols-12`}>
          <div className="flex flex-col justify-between gap-10 px-[var(--gutter)] py-10 lg:col-span-7 lg:py-12">
            <p className="jh-fade eyebrow flex items-center gap-3 text-muted">
              <span className="bg-ink px-1.5 py-0.5 text-ivory">01</span>
              Compliance advisory &amp; audit readiness
            </p>
            <h1 className="wide text-[clamp(3rem,15vw,6rem)] lg:text-[clamp(3.4rem,14.5vh,10rem)]">
              <Reveal as="span" trigger="load" delay={0.2} className="block">
                Many
              </Reveal>
              <Reveal as="span" trigger="load" delay={0.28} className="block">
                frameworks.
              </Reveal>
              <Reveal as="span" trigger="load" delay={0.4} className="block">
                One <span className="em">secure knot.</span>
              </Reveal>
            </h1>
            <div className="grid gap-6 border-t border-ink pt-6 md:grid-cols-2 md:items-end">
              <p className="jh-fade max-w-md text-[1.05rem] leading-relaxed text-ink/75">
                We unify SOC 2, ISO 27001, FedRAMP, CMMC and {frameworkCount - 4} more frameworks into one audit-ready program. Tested once, reported to every buyer who asks.
              </p>
              <div className="jh-fade flex flex-wrap gap-3 md:justify-end">
                <Button href="#book">Book an assessment</Button>
                <Button href="/customers" variant="outline">
                  Client stories
                </Button>
              </div>
            </div>
          </div>

          <div data-theme="dark" className="blueprint relative min-h-[22rem] overflow-hidden border-t border-ink bg-brand text-white lg:col-span-5 lg:border-l lg:border-t-0">
            <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[70%] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-visible" style={{ animation: "spin-slow 120s linear infinite" }} aria-hidden>
              {TANGLE.map((d, i) => (
                <path key={i} className="jh-path" d={d} pathLength={1} fill="none" stroke="#fff" vectorEffect="non-scaling-stroke" strokeWidth={i === 0 ? 2 : 1} opacity={i === 0 ? 1 : 0.5} />
              ))}
            </svg>
            {FLOATERS.map((f) => (
              <span key={f.n} className={`jh-float mono absolute border border-white bg-brand px-2 py-1 text-[0.7rem] ${f.c}`}>
                {f.n}
              </span>
            ))}
            <p className="jh-fade eyebrow absolute left-[var(--gutter)] top-10 lg:top-12">Fig. 01 · The tangle</p>
            <p className="jh-fade absolute bottom-10 left-[var(--gutter)] right-[var(--gutter)] flex items-end justify-between lg:bottom-12">
              <span className="wide text-[clamp(4rem,14vh,8rem)] leading-[0.8]">{frameworkCount}</span>
              <span className="eyebrow hidden items-center gap-3 lg:flex">
                Scroll to pull the thread <Arrow className="size-4" />
              </span>
            </p>
          </div>
        </div>

        {/* ── 02 Problem ── */}
        <div data-chapter className={`${panel} paper-grid flex flex-col justify-between gap-10 px-[var(--gutter)] py-10 lg:w-[66vw] lg:py-12`}>
          <p className="jr-in eyebrow flex items-center gap-3 text-muted">
            <span className="bg-ink px-1.5 py-0.5 text-ivory">02</span>
            The problem
          </p>
          <p className="jr-in wide max-w-[22ch] text-[clamp(1.9rem,7.4vw,3rem)] !leading-[1.02] lg:text-[clamp(2rem,7.4vh,4.6rem)]">
            Every new customer asks for another certificate, another questionnaire, another audit. Most teams end up running five programs that test the same controls five different ways.
          </p>
          <p className="jr-in wide text-[clamp(2.4rem,10vw,4rem)] lg:text-[clamp(2.4rem,10vh,6.4rem)]">
            <span className="em">We tie them into one.</span>
          </p>
        </div>

        {/* ── 03 Services ── */}
        <div data-chapter className={`${panel} flex flex-col lg:flex-row`}>
          <Opener
            className="lg:w-[32vw]"
            n="03"
            label="What we do"
            title={
              <>
                Five services. <span className="em">One program.</span>
              </>
            }
          >
            Advisory, readiness, audit, testing and continuous compliance, run by practitioners who have sat on the auditor&apos;s side of the table.
          </Opener>
          {services.map((s, i) => (
            <Link
              key={s.id}
              href={`/services/${s.id}`}
              data-label={s.title}
              className="group relative flex shrink-0 flex-col justify-between overflow-hidden border-t border-ink transition-colors duration-500 hover:bg-ink hover:text-ivory lg:h-full lg:w-[23vw] lg:border-l lg:border-t-0"
            >
              <div className="px-7 pt-10 lg:pt-12">
                <p className="jr-in eyebrow flex justify-between text-muted transition-colors group-hover:text-ivory/60">
                  <span>{s.kicker}</span>
                  <span>0{i + 1} / 05</span>
                </p>
                <p className="jr-in wide mt-8 text-[clamp(4.5rem,18vh,11rem)] leading-[0.8] text-brand transition-colors duration-500 group-hover:text-ivory">0{i + 1}</p>
              </div>
              <div className="px-7 pb-0 pt-10">
                <h3 className="jr-in wide text-[clamp(1.9rem,5.4vh,3.2rem)]">{s.title}</h3>
                <p className="jr-in mt-4 text-[0.95rem] leading-relaxed text-ink/70 transition-colors group-hover:text-ivory/70">{s.body}</p>
                <ul className="jr-in mono mt-6 space-y-1 text-xs text-muted transition-colors group-hover:text-ivory/60">
                  {s.deliverables.map((d) => (
                    <li key={d}>+ {d}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-8 flex items-center justify-between border-t border-ink px-7 py-4 text-sm font-medium transition-colors group-hover:border-ivory/25 group-hover:bg-brand">
                Explore
                <Arrow className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>

        {/* ── 04 Process ── */}
        <div data-chapter data-theme="dark" className={`${panel} blueprint flex flex-col bg-ink text-ivory lg:flex-row`}>
          <Opener
            dark
            className="lg:w-[30vw]"
            n="04"
            label="How it works"
            title={
              <>
                From tangle <span className="em">to tied.</span>
              </>
            }
          >
            A typical SOC 2 or ISO 27001 program, from first call to signed report, in around fourteen weeks.
          </Opener>
          <div className="relative border-t border-line-dark lg:h-full lg:w-[104vw] lg:border-l lg:border-t-0">
            <div className="absolute inset-x-0 top-1/2 hidden h-px bg-white/20 lg:block">
              <div className="jr-rope h-[2px] w-full origin-left -translate-y-px bg-white" />
            </div>
            <ol className="grid h-full lg:grid-cols-5">
              {steps.map((p, i) => {
                const up = i % 2 === 0;
                return (
                  <li key={p.n} className="relative grid border-b border-line-dark px-7 py-8 last:border-b-0 lg:grid-rows-2 lg:border-b-0 lg:border-r lg:py-0 lg:last:border-r-0">
                    <span className="absolute left-7 top-1/2 hidden size-4 -translate-y-1/2 bg-brand outline outline-2 outline-white lg:block" />
                    <div className={`jr-in flex flex-col lg:py-12 ${up ? "lg:row-start-1 lg:justify-end lg:pb-10" : "lg:row-start-2 lg:justify-start lg:pt-10"}`}>
                      <p className="eyebrow text-brand-3">
                        {p.n} · {p.time}
                      </p>
                      <h3 className="wide mt-3 text-[clamp(2.2rem,7.4vh,4.6rem)]">{p.title}</h3>
                    </div>
                    <p className={`jr-in mt-4 max-w-xs text-[0.95rem] leading-relaxed text-ivory/65 lg:mt-0 ${up ? "lg:row-start-2 lg:pt-10" : "lg:row-start-1 lg:self-end lg:pb-10"}`}>{p.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ── 05 Frameworks ── */}
        <div data-chapter className={`${panel} flex flex-col lg:flex-row`}>
          <Opener
            className="lg:w-[30vw]"
            n="05"
            label="Frameworks"
            title={
              <>
                {frameworkCount} frameworks. <span className="em">One partner.</span>
              </>
            }
          >
            <Button href="/frameworks" variant="outline">
              Open the full index
            </Button>
          </Opener>
          {frameworkGroups.map((g) => (
            <div key={g.id} className="flex shrink-0 flex-col border-t border-ink lg:h-full lg:w-[19vw] lg:border-l lg:border-t-0">
              <div className="jr-in border-b border-ink px-6 py-6 lg:pt-12">
                <p className="eyebrow flex justify-between">
                  <span>{g.name}</span>
                  <span className="text-brand">{String(g.items.length).padStart(2, "0")}</span>
                </p>
                <p className="mt-3 text-sm leading-snug text-muted">{g.blurb}</p>
              </div>
              <ul className="flex flex-1 flex-col">
                {g.items.map((f) => (
                  <li key={f.slug} className="jr-in border-b border-line lg:flex-1 lg:last:border-b-0">
                    <Link
                      href={`/frameworks/${f.slug}`}
                      data-label={f.name}
                      className="wide group flex h-full items-center justify-between px-6 py-3 text-[clamp(1.4rem,3.8vh,2.3rem)] transition-[background-color,color,padding] duration-500 ease-out-expo hover:bg-brand hover:pl-9 hover:text-white"
                    >
                      {f.name}
                      <Arrow className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── 06 Numbers ── */}
        <div data-chapter data-theme="dark" className={`${panel} blueprint flex flex-col bg-brand text-white lg:flex-row`}>
          {stats.map((s, i) => (
            <div key={s.label} className={`flex shrink-0 flex-col justify-between gap-10 px-[var(--gutter)] py-10 lg:h-full lg:w-[30vw] lg:py-12 ${i ? "border-t border-white/25 lg:border-l lg:border-t-0" : ""}`}>
              <p className="jr-in eyebrow flex items-center gap-3">
                {i === 0 && <span className="bg-white px-1.5 py-0.5 text-ink">06</span>}
                {i === 0 ? "In numbers" : `0${i + 1}`}
              </p>
              <div>
                <p className="jr-in wide whitespace-nowrap text-[clamp(5rem,26vw,9rem)] leading-[0.8] tabular-nums lg:text-[clamp(6rem,11.5vw,15rem)]">
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                </p>
                <p className="jr-in mt-6 max-w-[16rem] border-t border-white/40 pt-4 text-[1.05rem] leading-snug">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 07 Stories ── */}
        <div data-chapter className={`${panel} flex flex-col lg:flex-row`}>
          <Opener
            className="lg:w-[28vw]"
            n="07"
            label="Client stories"
            title={
              <>
                Proof, <span className="em">not promises.</span>
              </>
            }
          >
            <Button href="/customers" variant="outline">
              All client stories
            </Button>
          </Opener>
          {stories.slice(0, 3).map((s) => (
            <Link
              key={s.slug}
              href={`/customers/${s.slug}`}
              data-label={s.company}
              className="group flex shrink-0 flex-col justify-between gap-10 border-t border-ink px-7 py-10 transition-colors duration-500 hover:bg-brand hover:text-white lg:h-full lg:w-[27vw] lg:border-l lg:border-t-0 lg:py-12"
            >
              <p className="jr-in eyebrow flex justify-between">
                <span>{s.company}</span>
                <span className="text-muted transition-colors group-hover:text-white/70">{s.industry}</span>
              </p>
              <div>
                <p className="jr-in wide whitespace-nowrap text-[clamp(4rem,18vw,7rem)] leading-[0.8] text-brand transition-colors duration-500 group-hover:text-white lg:text-[clamp(3.5rem,6.6vw,8.5rem)]">{s.metrics[0].v}</p>
                <p className="jr-in mono mt-4 text-xs uppercase text-muted transition-colors group-hover:text-white/70">{s.metrics[0].l}</p>
              </div>
              <div>
                <p className="jr-in wide text-[clamp(1.5rem,3.8vh,2.2rem)] !leading-[1.05]">{s.headline}</p>
                <p className="jr-in mt-6 flex items-center justify-between border-t border-current pt-4 text-sm font-medium">
                  Read the story <Arrow className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── 08 Insights ── */}
        <div data-chapter className={`${panel} flex flex-col lg:flex-row lg:border-r-0`}>
          <Opener
            className="lg:w-[26vw]"
            n="08"
            label="Insights"
            title={
              <>
                Latest <span className="em">thinking.</span>
              </>
            }
          >
            <Button href="/insights" variant="outline">
              All insights
            </Button>
          </Opener>
          {articles.slice(0, 3).map((a, i) => (
            <Link
              key={a.slug}
              href={`/insights/${a.slug}`}
              data-label={a.tag}
              className="group flex shrink-0 flex-col justify-between gap-10 border-t border-ink px-7 py-10 transition-colors duration-500 hover:bg-ink hover:text-ivory lg:h-full lg:w-[24vw] lg:border-l lg:border-t-0 lg:py-12"
            >
              <p className="jr-in eyebrow flex justify-between">
                <span className="bg-brand px-1.5 py-0.5 text-white">{a.tag}</span>
                <span className="text-muted transition-colors group-hover:text-ivory/60">{formatDate(a.date)}</span>
              </p>
              <p className="jr-in wide text-[clamp(3rem,12vh,7rem)] leading-[0.8] text-ink/10 transition-colors duration-500 group-hover:text-ivory/20">0{i + 1}</p>
              <div>
                <h3 className="jr-in wide text-[clamp(1.6rem,4.4vh,2.6rem)] !leading-[1.02]">{a.title}</h3>
                <p className="jr-in mt-4 line-clamp-3 text-[0.95rem] leading-relaxed text-ink/70 transition-colors group-hover:text-ivory/70">{a.excerpt}</p>
                <p className="jr-in mt-6 flex items-center justify-between border-t border-current pt-4 text-sm font-medium">
                  {a.read} read <Arrow className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
          <div data-theme="dark" className="blueprint flex shrink-0 flex-col justify-between gap-10 border-t border-ink bg-ink px-[var(--gutter)] py-10 text-ivory lg:h-full lg:w-[36vw] lg:border-l lg:border-t-0 lg:py-12">
            <p className="jr-in eyebrow text-ivory/60">End of the thread</p>
            <p className="jr-in wide text-[clamp(2.6rem,10vh,6.4rem)]">
              Now tie <span className="em">yours.</span>
            </p>
            <div className="jr-in flex flex-wrap items-center gap-4">
              <Button href="#book" variant="ivory">
                Book an assessment
              </Button>
              <span className="eyebrow hidden text-ivory/60 lg:inline">Keep scrolling ↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ruler */}
      <div className="absolute inset-x-0 bottom-0 hidden h-[var(--ruler)] items-stretch border-t border-ink bg-ivory lg:flex">
        <div className="flex w-56 shrink-0 items-center gap-4 border-r border-ink px-5">
          <span className="wide text-[2rem] leading-none text-brand">
            <span ref={index}>01</span>
          </span>
          <span className="eyebrow leading-tight">
            <span ref={label}>{CHAPTERS[0]}</span>
            <span className="block text-muted">of 0{CHAPTERS.length}</span>
          </span>
        </div>
        <div className="relative mx-8 flex-1">
          <div className="absolute inset-x-0 bottom-0 h-2 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 12px)" }} />
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink/25" />
          <div ref={fill} className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-px scale-x-0 bg-brand" />
          {CHAPTERS.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => jump(i)}
              className="jr-tick group absolute top-0 flex h-full -translate-x-1/2 flex-col items-center justify-start pt-2 text-muted transition-colors hover:text-ink [&.is-on]:text-ink"
              style={{ left: `${(i / (CHAPTERS.length - 1)) * 100}%` }}
              aria-label={`Go to ${c}`}
            >
              <span className="eyebrow whitespace-nowrap !text-[0.62rem]">{c}</span>
              <span className="absolute top-1/2 size-2 -translate-y-1/2 bg-ivory outline outline-1 outline-ink transition-colors group-hover:bg-ink group-[.is-on]:bg-brand group-[.is-on]:outline-brand" />
            </button>
          ))}
          <span ref={knot} className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-brand outline outline-2 outline-ivory" style={{ left: 0 }} />
        </div>
        <div className="eyebrow flex w-44 shrink-0 items-center justify-center gap-3 border-l border-ink bg-ink text-ivory">
          Scroll <Arrow className="size-4" />
        </div>
      </div>
    </section>
  );
}
