"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { frameworkGroups, frameworkCount, services, process as steps, stats, contact } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ScrubText } from "@/components/page/ScrubText";
import { formatDate } from "@/components/insights/ArticleCard";
import { OverlapMap } from "@/components/home/OverlapMap";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowChip({ className }: { className?: string }) {
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-full transition-all duration-500 ease-out-expo group-hover:-rotate-45 ${className ?? "bg-ivory text-ink group-hover:bg-brand group-hover:text-white"}`}>
      <Arrow className="size-3.5" />
    </span>
  );
}

/** Centred section header: label pill, headline, optional lead. */
function Head({ label, title, lead, dark }: { label: string; title: ReactNode; lead?: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`pill ${dark ? "!border-white/15 !bg-white/10 text-white" : "text-ink"}`}>
        <span className={`size-1.5 rounded-full ${dark ? "bg-brand-3" : "bg-brand"}`} />
        {label}
      </p>
      <Reveal as="h2" className="wide mt-6 text-[clamp(2.1rem,4.4vw,4rem)]">
        {title}
      </Reveal>
      {lead && <p className={`mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed ${dark ? "text-white/65" : "text-muted"}`}>{lead}</p>}
    </div>
  );
}

/* ───────── Framework chips ───────── */
export function ChipBand() {
  const names = frameworkGroups.flatMap((g) => g.items.map((f) => f.name));
  const half = Math.ceil(names.length / 2);
  const rows = [names.slice(0, half), names.slice(half)];
  return (
    <section className="bg-ivory py-10" aria-label="Frameworks we deliver">
      <p className="text-center text-sm font-semibold text-muted">One program across every framework your buyers ask for</p>
      <div className="mt-7 space-y-3 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        {rows.map((r, n) => (
          <div key={n} className="marquee overflow-hidden">
            <div className="marquee-track gap-3 pr-3" data-reverse={n === 1} style={{ ["--marquee-duration" as string]: "70s" }}>
              {[...r, ...r, ...r].map((name, i) => (
                <span key={i} className="pill whitespace-nowrap !px-5 !py-2.5 !text-[0.92rem] shadow-[var(--shadow-card)]">
                  <span className="size-1.5 rounded-full bg-brand" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Statement ───────── */
export function Statement() {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <div className="mx-auto max-w-5xl text-center">
          <p className="pill">
            <span className="size-1.5 rounded-full bg-brand" />
            Why SecureKnots
          </p>
          <ScrubText
            className="mt-8 text-[clamp(1.7rem,3.5vw,3.3rem)] font-semibold leading-[1.14] tracking-[-0.04em]"
            text="Every new customer asks for another certificate, another questionnaire, another audit. Most teams end up running five programs that test the same controls five different ways. We tie them into one."
          />
        </div>
      </div>
    </section>
  );
}

/* ───────── Services bento ───────── */
export function ServiceBento() {
  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <div className="container-x">
        <Head
          label="What we do"
          title={
            <>
              Five services. <span className="em">One program.</span>
            </>
          }
          lead="Advisory, readiness, audit, testing and continuous compliance, run by practitioners who have sat on the auditor's side of the table."
        />
        <div className="mt-14 grid gap-3 md:mt-20 lg:grid-cols-6">
          {services.map((s, i) => {
            const hero = i === 0;
            return (
              <FadeUp key={s.id} y={30} delay={(i % 3) * 0.07} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                <Link
                  href={`/services/${s.id}`}
                  data-label={s.title}
                  className={`group card-hover relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[28px] p-7 md:p-8 ${
                    hero ? "blue-glow text-white shadow-[var(--shadow-float)]" : "card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`pill !py-1 ${hero ? "!border-white/20 !bg-white/15 text-white" : "!bg-ivory text-brand"}`}>
                      0{i + 1} · {s.kicker}
                    </span>
                    <ArrowChip className={hero ? "bg-white text-brand" : undefined} />
                  </div>
                  <h3 className={`mt-10 font-semibold tracking-[-0.04em] ${i < 2 ? "text-[clamp(1.8rem,2.6vw,2.4rem)]" : "text-[1.6rem]"} leading-[1.05]`}>{s.title}</h3>
                  <p className={`mt-3 max-w-md text-[0.95rem] leading-relaxed ${hero ? "text-white/80" : "text-muted"}`}>{s.body}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-8">
                    {s.deliverables.map((d) => (
                      <li key={d} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${hero ? "bg-white/15 text-white" : "bg-ivory text-ink/75"}`}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── Process stepper (navy card) ───────── */
const STEP_MS = 4500;

export function ProcessStepper() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(() => visible.current && setI((v) => (v + 1) % steps.length), STEP_MS);
    return () => clearInterval(id);
  }, [paused, i]);

  const s = steps[i];
  return (
    <section className="bg-ivory px-3">
      <div
        ref={root}
        data-theme="dark"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="navy-glow overflow-hidden rounded-[36px] py-20 text-white md:py-28"
      >
        <div className="container-x">
          <Head
            dark
            label="How it works"
            title={
              <>
                From tangle <span className="em">to tied.</span>
              </>
            }
            lead="A typical SOC 2 or ISO 27001 program, from first call to signed report, in around fourteen weeks."
          />

          <div className="mx-auto mt-14 max-w-[1080px] md:mt-20">
            <div role="tablist" aria-label="Process steps" className="grid grid-cols-5 gap-2">
              {steps.map((p, n) => (
                <button key={p.n} type="button" role="tab" aria-selected={i === n} onClick={() => setI(n)} className="group text-left">
                  <span className="block h-1 overflow-hidden rounded-full bg-white/12">
                    <span
                      key={i === n ? `on-${i}` : "off"}
                      className={`block h-full origin-left rounded-full bg-white ${n < i ? "scale-x-100" : n === i ? "" : "scale-x-0"}`}
                      style={n === i ? { animation: `progress ${STEP_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" } : undefined}
                    />
                  </span>
                  <span className={`mt-4 block text-xs font-bold transition-colors ${i === n ? "text-brand-3" : "text-white/40"}`}>{p.n}</span>
                  <span className={`mt-1 hidden text-[1.05rem] font-semibold tracking-[-0.02em] transition-colors sm:block ${i === n ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>
                    {p.title}
                  </span>
                </button>
              ))}
            </div>

            <div role="tabpanel" className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-sm">
              <div key={s.n} className="grid animate-[fadeUp_0.7s_var(--ease-out)] gap-8 p-7 md:grid-cols-12 md:items-center md:p-12">
                <div className="md:col-span-5">
                  <p className="text-[clamp(5rem,11vw,9rem)] font-semibold leading-[0.85] tracking-[-0.07em] text-white/[0.14]">{s.n}</p>
                </div>
                <div className="md:col-span-7">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink">{s.time}</span>
                  <h3 className="mt-6 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.045em]">{s.title}</h3>
                  <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-white/70">{s.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Frameworks (tabbed) ───────── */
export function FrameworkTabs() {
  const [g, setG] = useState(0);
  const group = frameworkGroups[g];
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <Head
          label="Frameworks"
          title={
            <>
              {frameworkCount} frameworks. <span className="em">One partner.</span>
            </>
          }
          lead="Security attestations, government authorisations, privacy law, financial regulation and management systems, delivered from a single control set."
        />

        <div className="card mx-auto mt-14 max-w-[1180px] p-3 md:mt-20">
          <div role="tablist" aria-label="Framework groups" className="flex gap-1.5 overflow-x-auto rounded-[20px] bg-ivory p-1.5 [scrollbar-width:none]">
            {frameworkGroups.map((fg, n) => (
              <button
                key={fg.id}
                type="button"
                role="tab"
                aria-selected={g === n}
                onClick={() => setG(n)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[15px] px-4 py-3 text-[0.88rem] font-semibold transition-all duration-500 ease-out-expo lg:flex-1 lg:justify-center ${
                  g === n ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"
                }`}
              >
                {fg.name}
                <span className={`rounded-full px-2 py-0.5 text-[0.7rem] ${g === n ? "bg-brand text-white" : "bg-bone text-muted"}`}>{fg.items.length}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel" key={group.id} className="grid gap-8 p-5 pt-8 md:p-8 lg:grid-cols-12">
            <div className="animate-[fadeUp_0.6s_var(--ease-out)] lg:col-span-4">
              <h3 className="text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.04em]">{group.name}</h3>
              <p className="mt-3 max-w-xs text-muted">{group.blurb}</p>
              <Link href="/frameworks" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand">
                View all {frameworkCount} frameworks <Arrow className="size-3.5" />
              </Link>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:col-span-8">
              {group.items.map((f, n) => (
                <li key={f.slug} className="animate-[fadeUp_0.6s_var(--ease-out)_both]" style={{ animationDelay: `${n * 45}ms` }}>
                  <Link
                    href={`/frameworks/${f.slug}`}
                    data-label={f.name}
                    className="group flex items-center justify-between gap-4 rounded-[18px] border border-transparent bg-ivory px-5 py-4 transition-colors duration-500 hover:border-brand/25 hover:bg-glow"
                  >
                    <span className="min-w-0">
                      <span className="block text-[1.02rem] font-semibold tracking-[-0.02em]">{f.name}</span>
                      {f.full && <span className="block truncate text-xs text-muted">{f.full}</span>}
                    </span>
                    <ArrowChip className="size-8 bg-white text-ink group-hover:bg-brand group-hover:text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Overlap calculator, inset as a card ───────── */
export function OverlapCard() {
  return (
    <section className="bg-ivory px-3">
      <div className="overflow-hidden rounded-[36px]">
        <OverlapMap />
      </div>
    </section>
  );
}

/* ───────── Numbers ───────── */
export function Numbers() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(n.dataset.count),
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 90%", once: true },
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-ivory py-24 md:py-36">
      <div className="container-x">
        <Head
          label="In numbers"
          title={
            <>
              Knots that <span className="em">hold under audit.</span>
            </>
          }
        />
        <dl className="mt-14 grid gap-3 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} y={30} delay={i * 0.07} className={`flex min-h-[15rem] flex-col justify-between rounded-[28px] p-7 ${i === 0 ? "blue-glow text-white shadow-[var(--shadow-float)]" : "card"}`}>
              <dd className="text-[clamp(3.4rem,5.4vw,5rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums">
                <span data-count={s.value}>{s.value}</span>
                <span className={i === 0 ? "text-white/60" : "text-brand"}>{s.suffix}</span>
              </dd>
              <dt className={`max-w-[14rem] text-[0.95rem] font-medium leading-snug ${i === 0 ? "text-white/80" : "text-muted"}`}>{s.label}</dt>
            </FadeUp>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────── Client stories ───────── */
export function StoryCards() {
  const [a, b, c] = stories;
  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <div className="container-x">
        <Head
          label="Client stories"
          title={
            <>
              Proof, <span className="em">not promises.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-3 md:mt-20 lg:grid-cols-12">
          <FadeUp y={30} className="lg:col-span-7">
            <Link href={`/customers/${a.slug}`} data-label={a.company} className="group navy-glow on-dark flex h-full min-h-[30rem] flex-col justify-between rounded-[28px] p-7 text-white md:p-10">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-sm font-bold">
                  <span className="grid size-10 place-items-center rounded-[12px] bg-white text-xs text-ink">{a.mark}</span>
                  {a.company}
                </span>
                <ArrowChip className="bg-white/10 text-white group-hover:bg-white group-hover:text-ink" />
              </div>
              <blockquote className="mt-12 text-[clamp(1.5rem,2.5vw,2.3rem)] font-semibold leading-[1.18] tracking-[-0.035em]">&ldquo;{a.quote.text}&rdquo;</blockquote>
              <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
                <p className="text-sm text-white/65">
                  <span className="font-semibold text-white">{a.quote.name}</span>
                  <br />
                  {a.quote.role}
                </p>
                <div className="flex gap-2">
                  {a.metrics.slice(0, 2).map((m) => (
                    <div key={m.l} className="rounded-[18px] bg-white/[0.08] px-4 py-3">
                      <p className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em]">{m.v}</p>
                      <p className="mt-1 max-w-[9rem] text-xs text-white/60">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </FadeUp>
          <div className="grid gap-3 lg:col-span-5">
            {[b, c].map((s, i) => (
              <FadeUp key={s.slug} y={30} delay={0.08 + i * 0.08}>
                <Link href={`/customers/${s.slug}`} data-label={s.company} className="group card card-hover flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-sm font-bold">
                      <span className="grid size-10 place-items-center rounded-[12px] bg-ivory text-xs text-brand">{s.mark}</span>
                      {s.company}
                    </span>
                    <span className="pill !bg-ivory !py-1 text-muted">{s.industry}</span>
                  </div>
                  <div className="mt-8 flex items-end justify-between gap-6">
                    <div>
                      <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-brand">{s.metrics[0].v}</p>
                      <p className="mt-2 text-sm text-muted">{s.metrics[0].l}</p>
                    </div>
                    <ArrowChip />
                  </div>
                  <p className="mt-6 border-t border-line pt-5 text-[1.02rem] font-semibold leading-snug tracking-[-0.02em]">{s.headline}</p>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/customers" variant="outline">
            All client stories
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ───────── Insights ───────── */
const THUMBS = [
  "radial-gradient(80% 120% at 0% 0%, #9fbaff, transparent 60%), radial-gradient(70% 100% at 100% 100%, #173bd0, transparent 60%), #2a5cff",
  "radial-gradient(90% 120% at 100% 0%, #2a5cff, transparent 60%), radial-gradient(60% 90% at 0% 100%, #182555, transparent 70%), #0a1230",
  "radial-gradient(80% 120% at 50% 120%, #2a5cff, transparent 65%), radial-gradient(60% 80% at 0% 0%, #ffffff, transparent 70%), #cfdcff",
];

export function InsightCards() {
  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <div className="container-x">
        <Head
          label="Insights"
          title={
            <>
              Latest <span className="em">thinking.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-3 md:mt-20 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <FadeUp key={a.slug} y={30} delay={i * 0.08}>
              <Link href={`/insights/${a.slug}`} data-label={a.tag} className="group card card-hover flex h-full flex-col p-3">
                <div className="relative h-48 overflow-hidden rounded-[20px]" style={{ background: THUMBS[i] }}>
                  <div className="dot-grid absolute inset-0 opacity-30 mix-blend-overlay transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink">{a.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-4 pt-6">
                  <p className="text-xs font-semibold text-muted">
                    {formatDate(a.date)} · {a.read} read
                  </p>
                  <h3 className="mt-3 text-[1.3rem] font-semibold leading-[1.18] tracking-[-0.03em]">{a.title}</h3>
                  <p className="mt-3 line-clamp-2 text-[0.92rem] leading-relaxed text-muted">{a.excerpt}</p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-brand">
                    Read article <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Closing CTA ───────── */
export function HaloCTA() {
  return (
    <section className="bg-ivory px-3 pb-3">
      <div className="blue-glow on-dark relative overflow-hidden rounded-[36px] px-6 py-24 text-center text-white md:py-36">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
        <div className="relative">
          <p className="pill !border-white/20 !bg-white/15 text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Start a conversation
          </p>
          <h2 className="wide mx-auto mt-7 max-w-4xl text-[clamp(2.6rem,6.6vw,6rem)]">
            <Reveal as="span" className="block">
              Let&apos;s tie it together.
            </Reveal>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[1.08rem] leading-relaxed text-white/80">A 30-minute call with a senior practitioner. You leave with a plan either way.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="#book" variant="accent">
              Book an assessment
            </Button>
            <a href={`mailto:${contact.email}`} className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/10 px-5 text-[0.9rem] font-semibold transition-colors hover:bg-white/20">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
