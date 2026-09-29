"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { frameworkGroups, frameworkCount, services, process as steps, stats, contact } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ScrubText } from "@/components/page/ScrubText";
import { formatDate } from "@/components/insights/ArticleCard";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Section header shared by the homepage: index number, label, serif title. */
function Head({ n, label, title, aside, dark }: { n: string; label: string; title: React.ReactNode; aside?: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`grid gap-8 border-t pt-6 lg:grid-cols-12 ${dark ? "border-line-dark" : "border-line"}`}>
      <p className={`eyebrow flex gap-4 lg:col-span-3 ${dark ? "text-ivory/55" : "text-muted"}`}>
        <span className={dark ? "text-brand-3" : "text-brand"}>{n}</span>
        {label}
      </p>
      <div className="lg:col-span-9">
        <Reveal as="h2" className="wide max-w-4xl text-[clamp(2.4rem,5vw,5.2rem)] leading-[0.98]">
          {title}
        </Reveal>
        {aside && <div className={`mt-6 max-w-xl text-lg leading-relaxed ${dark ? "text-ivory/65" : "text-ink/65"}`}>{aside}</div>}
      </div>
    </div>
  );
}

/* ───────── Framework band ───────── */
export function FrameworkBand() {
  const names = frameworkGroups.flatMap((g) => g.items.map((f) => f.name));
  const row = [...names, ...names];
  return (
    <section className="border-b border-line bg-ivory py-8" aria-label="Frameworks we deliver">
      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track" style={{ ["--marquee-duration" as string]: "90s" }}>
          {row.map((n, i) => (
            <span key={i} className="serif flex items-center whitespace-nowrap text-[1.7rem] text-ink/45">
              {n}
              <span className="mx-8 size-1 rounded-full bg-ink/20" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Perspective + figures ───────── */
export function Perspective() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nums = el.querySelectorAll<HTMLElement>("[data-count]");
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      nums.forEach((n) => {
        const to = Number(n.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="eyebrow flex gap-4 text-muted lg:col-span-3">
            <span className="text-brand">01</span>
            Our perspective
          </p>
          <ScrubText
            className="serif text-[clamp(1.9rem,3.6vw,3.6rem)] leading-[1.12] lg:col-span-9"
            text="Every new customer asks for another certificate, another questionnaire, another audit. Most teams end up running five programs that test the same controls five different ways. We tie them into one."
          />
        </div>

        <dl className="mt-24 grid grid-cols-2 border-t border-line md:mt-32 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col py-8 pr-6 ${i % 2 ? "pl-6 border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} lg:border-l lg:pl-6 ${i === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}>
              <dt className="order-2 mt-4 max-w-[14rem] text-sm leading-relaxed text-muted">{s.label}</dt>
              <dd className="serif order-1 text-[clamp(3.4rem,6vw,5.8rem)] leading-none tabular-nums">
                <span data-count={s.value}>{s.value}</span>
                <span className="text-brand">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────── Capabilities ───────── */
export function Capabilities() {
  return (
    <section className="bg-ivory pb-28 md:pb-40">
      <div className="container-x">
        <Head
          n="02"
          label="Capabilities"
          title={
            <>
              Five services. <span className="em text-brand">One program.</span>
            </>
          }
          aside="Advisory, readiness, audit, managed compliance and AI governance, run by practitioners who have sat on the auditor's side of the table."
        />

        <ul className="mt-16 border-t border-line md:mt-24">
          {services.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/services/${s.id}`}
                data-label={s.title}
                className="group relative grid gap-4 overflow-hidden border-b border-line py-9 md:grid-cols-12 md:items-center md:py-11"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
                <span className="serif relative text-lg italic text-brand md:col-span-1">0{i + 1}</span>
                <span className="serif relative text-[clamp(2rem,3.4vw,3.2rem)] leading-none transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:col-span-5">
                  {s.title}
                </span>
                <span className="relative max-w-md text-[0.98rem] leading-relaxed text-ink/65 md:col-span-5">{s.body}</span>
                <span className="relative hidden justify-end md:col-span-1 md:flex">
                  <span className="grid size-11 place-items-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <Arrow className="size-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Approach (dark) ───────── */
export function Approach() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ap-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".ap-row", start: "top 80%", end: "bottom 55%", scrub: true } });
      gsap.from(".ap-step", { autoAlpha: 0, y: 30, duration: 1.2, stagger: 0.12, scrollTrigger: { trigger: ".ap-row", start: "top 78%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="bg-ink py-28 text-ivory md:py-40">
      <div className="container-x">
        <Head
          dark
          n="03"
          label="Approach"
          title={
            <>
              From tangle <span className="em text-brand-3">to tied.</span>
            </>
          }
          aside="A typical SOC 2 or ISO 27001 program, from first call to signed report, in around fourteen weeks."
        />

        <div className="ap-row relative mt-20 md:mt-28">
          <div className="absolute inset-x-0 top-0 hidden h-px bg-line-dark lg:block">
            <div className="ap-fill h-px w-full origin-left bg-brand-3" />
          </div>
          <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
            {steps.map((p) => (
              <li key={p.n} className="ap-step relative border-t border-line-dark pt-8 lg:border-t-0 lg:pt-10">
                <span className="absolute -top-[5px] left-0 hidden size-[9px] rounded-full border border-brand-3 bg-ink lg:block" />
                <p className="eyebrow text-ivory/50">{p.time}</p>
                <h3 className="serif mt-5 text-[2.3rem] leading-none">
                  <span className="mr-2 text-[1.3rem] italic text-brand-3">{p.n}</span>
                  {p.title}
                </h3>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-ivory/60">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────── Framework directory ───────── */
export function FrameworkDirectory() {
  return (
    <section className="bg-paper py-28 md:py-40">
      <div className="container-x">
        <Head
          n="04"
          label="Frameworks"
          title={
            <>
              {frameworkCount} frameworks. <span className="em text-brand">One partner.</span>
            </>
          }
          aside="Security attestations, government authorisations, privacy law, financial regulation and AI governance, delivered from a single control set."
        />
        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-5">
          {frameworkGroups.map((g, gi) => (
            <FadeUp key={g.id} y={24} delay={gi * 0.06}>
              <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
                <p className="text-[0.95rem] font-medium">{g.name}</p>
                <span className="serif text-lg italic text-muted">{g.items.length}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{g.blurb}</p>
              <ul className="mt-6 space-y-1">
                {g.items.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/frameworks/${f.slug}`} data-label={f.name} className="group flex items-center justify-between py-1.5 text-[0.95rem] text-ink/80 transition-colors hover:text-brand">
                      {f.name}
                      <Arrow className="size-3 -translate-x-2 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>
        <div className="mt-16 flex justify-start md:mt-20">
          <Button href="/frameworks" variant="outline">
            Explore the framework index
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ───────── Client stories ───────── */
export function Voices() {
  const [a, ...rest] = stories;
  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <Head
          n="05"
          label="Client stories"
          title={
            <>
              Proof, <span className="em text-brand">not promises.</span>
            </>
          }
        />

        <FadeUp className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-lg font-medium">{a.company}</p>
            <p className="mt-1 text-sm text-muted">
              {a.industry} · {a.hq}
            </p>
            <div className="mt-10 hidden space-y-8 lg:block">
              {a.metrics.slice(0, 3).map((m) => (
                <div key={m.l}>
                  <p className="serif text-[3.2rem] leading-none text-brand">{m.v}</p>
                  <p className="mt-2 text-sm text-muted">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
          <figure className="lg:col-span-9">
            <blockquote className="serif text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[1.15]">
              <span className="text-brand">&ldquo;</span>
              {a.quote.text}
              <span className="text-brand">&rdquo;</span>
            </blockquote>
            <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <span className="text-sm text-muted">
                <span className="text-ink">{a.quote.name}</span>, {a.quote.role}
              </span>
              <Link href={`/customers/${a.slug}`} data-label={a.company} className="link-u text-sm">
                Read the full story
              </Link>
            </figcaption>
          </figure>
        </FadeUp>

        <div className="mt-20 grid gap-px overflow-hidden border-y border-line bg-line md:grid-cols-3">
          {rest.slice(0, 3).map((s) => (
            <Link key={s.slug} href={`/customers/${s.slug}`} data-label={s.company} className="group flex flex-col bg-ivory py-10 transition-colors duration-500 hover:bg-paper md:px-8">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.company}</span>
                <span className="text-muted">{s.industry}</span>
              </div>
              <p className="serif mt-10 text-[3rem] leading-none text-brand">{s.metrics[0].v}</p>
              <p className="mt-2 text-sm text-muted">{s.metrics[0].l}</p>
              <p className="mt-8 text-[1.05rem] leading-snug">{s.headline}</p>
              <span className="mt-auto flex items-center gap-2 pt-10 text-sm text-ink/70 group-hover:text-brand">
                Read story <Arrow className="size-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Insights ───────── */
export function Journal() {
  return (
    <section className="bg-ivory pb-28 md:pb-40">
      <div className="container-x">
        <Head
          n="06"
          label="Insights"
          title={
            <>
              Latest <span className="em text-brand">thinking.</span>
            </>
          }
        />
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          {articles.slice(0, 3).map((a, i) => (
            <FadeUp key={a.slug} y={24} delay={i * 0.08}>
              <Link href={`/insights/${a.slug}`} data-label={a.tag} className="group block border-t border-ink pt-6">
                <p className="flex justify-between text-sm text-muted">
                  <span className="text-brand">{a.tag}</span>
                  <span>{formatDate(a.date)}</span>
                </p>
                <h3 className="serif mt-8 text-[clamp(1.7rem,2.3vw,2.2rem)] leading-[1.1] transition-colors duration-300 group-hover:text-brand">{a.title}</h3>
                <p className="mt-5 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{a.excerpt}</p>
                <p className="mt-8 flex items-center gap-2 text-sm">
                  {a.read} read <Arrow className="size-3 transition-transform duration-500 group-hover:translate-x-1" />
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>
        <div className="mt-16">
          <Link href="/insights" className="link-u text-sm">
            View all insights
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── Closing CTA ───────── */
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-paper py-28 md:py-44">
      <div className="container-x relative text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-muted">
          <span className="size-1.5 rounded-full bg-brand" />
          Start a conversation
        </p>
        <h2 className="wide mx-auto mt-8 max-w-5xl text-[clamp(3rem,8vw,8.6rem)] leading-[0.95]">
          <Reveal as="span" className="block">
            Let&apos;s tie it
          </Reveal>
          <Reveal as="span" delay={0.1} className="block">
            <span className="em text-brand">together.</span>
          </Reveal>
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink/65">
          A 30-minute call with a senior practitioner. You leave with a plan either way.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Button href="#book">Book a consultation</Button>
          <a href={`mailto:${contact.email}`} className="link-u text-sm">
            {contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
