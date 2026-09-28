"use client";

import Link from "next/link";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { frameworkGroups, frameworkCount, services, process as steps, contact } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Arrow, Button } from "@/components/ui/Button";
import { ScrubText } from "@/components/page/ScrubText";
import { DotField } from "@/components/ui/DotField";
import { formatDate } from "@/components/insights/ArticleCard";

/* ───────── Framework index ───────── */
export function FrameworkIndex() {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <Reveal as="h2" className="wide max-w-5xl text-[clamp(2rem,4.6vw,5rem)]">
          {frameworkCount} frameworks. <span className="em text-brand">One partner.</span>
        </Reveal>
        <div className="mt-14 border-t border-line md:mt-20">
          {frameworkGroups.map((g) => (
            <FadeUp key={g.id} y={24} className="grid gap-4 border-b border-line py-7 md:grid-cols-12 md:py-9">
              <div className="flex items-baseline gap-3 md:col-span-3">
                <span className="mono text-xs text-brand">{String(g.items.length).padStart(2, "0")}</span>
                <span className="eyebrow text-muted">{g.name}</span>
              </div>
              <p className="text-[clamp(1.4rem,2.6vw,2.6rem)] leading-[1.2] tracking-[-0.02em] [font-stretch:112%] md:col-span-9">
                {g.items.map((f, i) => (
                  <Fragment key={f.slug}>
                    <Link href={`/frameworks/${f.slug}`} data-label={f.name} className="text-ink/85 transition-colors duration-300 hover:text-brand">
                      {f.name}
                    </Link>
                    {i < g.items.length - 1 && <span className="px-3 text-muted-dark">/</span>}
                  </Fragment>
                ))}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Statement ───────── */
export function Statement() {
  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <div className="container-x grid gap-10 border-t border-line pt-16 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-10 md:col-start-2">
          <ScrubText
            className="text-[clamp(1.7rem,3.6vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.03em] [font-stretch:108%]"
            text="Every new customer asks for another certificate. Another questionnaire. Another audit. So teams run five programs that test the same controls five different ways, burning engineering time and stalling the deals that matter."
          />
          <p className="wide mt-12 text-[clamp(2.2rem,5.4vw,5.8rem)] text-brand">We tie it into one.</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── Service console ───────── */
export function ServiceConsole() {
  const [i, setI] = useState(0);
  const s = services[i];
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <p className="eyebrow text-muted">
          <span className="text-brand">/</span> What we do
        </p>
        <Reveal as="h2" className="wide mt-6 max-w-4xl text-[clamp(2rem,4.6vw,5rem)]">
          Five services. <span className="em text-brand">One program.</span>
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12">
          <ul className="border-t border-line lg:col-span-5" role="tablist" aria-label="Services">
            {services.map((sv, n) => (
              <li key={sv.id} className="border-b border-line">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === n}
                  onClick={() => setI(n)}
                  onMouseEnter={() => setI(n)}
                  className="group relative flex w-full items-center gap-5 py-6 text-left"
                >
                  <span className={`absolute inset-y-0 left-0 w-[3px] bg-brand transition-transform duration-500 ease-out-expo ${i === n ? "scale-y-100" : "scale-y-0"}`} />
                  <span className={`mono pl-5 text-xs ${i === n ? "text-brand" : "text-muted"}`}>0{n + 1}</span>
                  <span className={`text-[clamp(1.3rem,2vw,1.9rem)] tracking-[-0.02em] transition-colors [font-stretch:110%] ${i === n ? "text-ink" : "text-ink/45 group-hover:text-ink/80"}`}>
                    {sv.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div role="tabpanel" className="relative min-h-[26rem] overflow-hidden rounded-[12px] border border-line bg-paper lg:col-span-7">
            <div key={s.id} className="flex h-full animate-[fadeUp_0.6s_var(--ease-out)] flex-col p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-brand">{s.kicker}</span>
                <span className="mono text-xs text-muted">0{i + 1} / 0{services.length}</span>
              </div>
              <p className="wide mt-10 text-[clamp(1.8rem,3.4vw,3.4rem)]">{s.title}</p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{s.body}</p>
              <ul className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-line pt-0">
                {s.deliverables.map((d) => (
                  <li key={d} className="bg-paper px-4 py-3 text-sm text-ink/80">
                    <span className="mr-2 text-brand">+</span>
                    {d}
                  </li>
                ))}
              </ul>
              <Link href={`/services/${s.id}`} className="eyebrow mt-6 inline-flex w-fit items-center gap-2 text-ink hover:text-brand">
                Explore {s.title} <Arrow className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Process rail ───────── */
export function ProcessRail() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pr-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".pr-list", start: "top 60%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".pr-step").forEach((step, n) => {
        gsap.fromTo(step, { opacity: 0.25 }, { opacity: 1, scrollTrigger: { trigger: step, start: "top 65%", end: "bottom 45%", toggleActions: "play reverse play reverse" } });
        gsap.to({}, {
          scrollTrigger: {
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive && counter.current) counter.current.textContent = String(n + 1).padStart(2, "0");
            },
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-ink py-24 text-ivory md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal as="h2" className="wide text-[clamp(2rem,4.6vw,5rem)]">
              From tangle <span className="em text-brand-3">to tied.</span>
            </Reveal>
            <p className="mt-6 max-w-sm text-lg text-ivory/65">A typical SOC 2 or ISO 27001 program, from first call to signed report.</p>
            <p className="mono mt-12 hidden text-[clamp(4rem,9vw,9rem)] leading-none text-ivory lg:block">
              <span ref={counter}>01</span>
              <span className="text-ivory/30">/0{steps.length}</span>
            </p>
          </div>
        </div>
        <div className="pr-list relative lg:col-span-6 lg:col-start-7">
          <div className="absolute inset-y-0 left-0 w-px bg-line-dark">
            <div className="pr-fill h-full w-px origin-top bg-brand-3" />
          </div>
          {steps.map((p) => (
            <article key={p.n} className="pr-step relative py-10 pl-10 md:py-16">
              <span className="absolute left-[-4px] top-12 size-[9px] rounded-full border border-brand-3 bg-ink md:top-[4.5rem]" />
              <p className="eyebrow text-brand-3">{p.time}</p>
              <h3 className="wide mt-4 text-[clamp(1.8rem,3vw,3rem)]">{p.title}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ivory/65">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Stories bento ───────── */
export function StoriesBento() {
  const [a, b, c] = stories;
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" className="wide max-w-3xl text-[clamp(2rem,4.6vw,5rem)]">
            Proof, <span className="em text-brand">not promises.</span>
          </Reveal>
          <Link href="/customers" className="eyebrow inline-flex items-center gap-2 text-ink hover:text-brand">
            All customer stories <Arrow className="size-3" />
          </Link>
        </div>
        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12 lg:grid-rows-2">
          <StoryTile s={a} big className="lg:col-span-7 lg:row-span-2" />
          <StoryTile s={b} className="lg:col-span-5" />
          <StoryTile s={c} className="lg:col-span-5" />
        </div>
      </div>
    </section>
  );
}

function StoryTile({ s, big, className }: { s: (typeof stories)[number]; big?: boolean; className?: string }) {
  const m = s.metrics[0];
  return (
    <Link
      href={`/customers/${s.slug}`}
      data-fx
      data-label={s.company}
      className={`group relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[12px] border border-line bg-paper p-7 transition-colors duration-500 hover:border-brand/60 md:p-9 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="mono text-sm text-ink/70">{s.company}</span>
        <span className="eyebrow text-muted">{s.industry}</span>
      </div>
      <div className={big ? "mt-20" : "mt-10"}>
        <p className={`wide text-brand ${big ? "text-[clamp(4rem,9vw,9rem)]" : "text-[clamp(3rem,5vw,4.5rem)]"}`}>{m.v}</p>
        <p className="mt-2 text-sm text-muted">{m.l}</p>
        <p className={`mt-6 max-w-xl leading-snug tracking-[-0.015em] ${big ? "text-2xl md:text-3xl" : "text-lg"}`}>{s.headline}</p>
        <p className="eyebrow mt-6 flex items-center gap-2 text-ink/70 transition-colors group-hover:text-brand">
          Read the story <Arrow className="size-3 transition-transform duration-500 group-hover:rotate-45" />
        </p>
      </div>
    </Link>
  );
}

/* ───────── Insights index ───────── */
export function InsightsIndex() {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" className="wide text-[clamp(2rem,4.6vw,5rem)]">
            Latest <span className="em text-brand">thinking.</span>
          </Reveal>
          <Link href="/insights" className="eyebrow inline-flex items-center gap-2 text-ink hover:text-brand">
            All insights <Arrow className="size-3" />
          </Link>
        </div>
        <ul className="mt-14 border-t border-line md:mt-20">
          {articles.slice(0, 4).map((a) => (
            <li key={a.slug}>
              <Link href={`/insights/${a.slug}`} data-label={a.tag} className="group grid gap-2 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                <span className="mono text-xs text-muted md:col-span-2">{formatDate(a.date)}</span>
                <span className="eyebrow text-brand md:col-span-2">{a.tag}</span>
                <span className="text-[clamp(1.3rem,2.2vw,2rem)] leading-tight tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:col-span-7">
                  {a.title}
                </span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <Arrow className="size-4 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-brand" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Closing CTA ───────── */
export function SignalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand text-accent">
      <DotField color="--accent" className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_80%_50%,black_10%,transparent_70%)]" />
      <div className="container-x relative py-24 md:py-36">
        <h2 className="wide text-[clamp(2.6rem,8.4vw,10rem)]">
          <Reveal as="span" className="block">
            Let&apos;s tie it
          </Reveal>
          <Reveal as="span" delay={0.1} className="block">
            <span className="em">together.</span>
          </Reveal>
        </h2>
        <div className="mt-14 grid gap-8 border-t border-accent/20 pt-8 md:grid-cols-12 md:items-center">
          <p className="max-w-md text-lg md:col-span-5">A 30-minute call with a senior practitioner. You leave with a plan either way.</p>
          <div className="flex flex-wrap items-center gap-6 md:col-span-7 md:justify-end">
            <a href={`mailto:${contact.email}`} className="mono text-sm underline-offset-4 hover:underline">
              {contact.email}
            </a>
            <Button href="#book" variant="accent">
              Book an assessment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
