import Link from "next/link";
import type { ReactNode } from "react";
import { contact } from "@/lib/content";
import { stories } from "@/lib/stories";
import { articles } from "@/lib/insights";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/components/insights/ArticleCard";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Head({ label, title, href, cta }: { label: string; title: ReactNode; href: string; cta: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow flex items-center gap-3 text-muted">
          <span className="size-1.5 rounded-full bg-brand" />
          {label}
        </p>
        <Reveal as="h2" className="wide mt-6 text-[clamp(2.1rem,3.8vw,3.8rem)]">
          {title}
        </Reveal>
      </div>
      <Link href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-brand">
        {cta} <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ───────── Client stories as a register ───────── */
export function StoryRegister() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="container-x">
        <Head
          label="Client stories"
          title={
            <>
              Proof, <span className="em">not promises.</span>
            </>
          }
          href="/customers"
          cta="All client stories"
        />
        <div className="mt-14 border-t border-ink">
          <div className="eyebrow hidden grid-cols-12 gap-6 border-b border-line py-3 text-muted lg:grid">
            <span className="col-span-3">Client</span>
            <span className="col-span-4">Outcome</span>
            <span className="col-span-3">Frameworks</span>
            <span className="col-span-2 text-right">Result</span>
          </div>
          {stories.map((s, i) => (
            <FadeUp key={s.slug} y={20} delay={(i % 3) * 0.05}>
              <Link
                href={`/customers/${s.slug}`}
                data-label={s.company}
                className="group relative grid gap-4 border-b border-line py-7 transition-colors duration-500 hover:bg-paper lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-4 lg:hover:px-6"
                style={{ transitionProperty: "background-color, padding" }}
              >
                <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-brand transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                <span className="lg:col-span-3">
                  <span className="block text-[1.15rem] font-medium tracking-[-0.01em]">{s.company}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {s.industry} · {s.hq}
                  </span>
                </span>
                <span className="text-[1.05rem] leading-snug lg:col-span-4">{s.headline}</span>
                <span className="flex flex-wrap gap-1.5 lg:col-span-3">
                  {s.frameworks.map((f) => (
                    <span key={f} className="rounded-[3px] border border-line px-2 py-1 text-xs text-muted">
                      {f}
                    </span>
                  ))}
                </span>
                <span className="flex items-center justify-between gap-4 lg:col-span-2 lg:justify-end">
                  <span className="lg:text-right">
                    <span className="block text-[1.9rem] font-light leading-none tracking-[-0.03em] text-brand">{s.metrics[0].v}</span>
                    <span className="mt-1 block text-xs text-muted">{s.metrics[0].l}</span>
                  </span>
                  <Arrow className="size-4 shrink-0 text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:text-brand" />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Insights ───────── */
export function InsightBriefs() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="container-x">
        <Head
          label="Insights"
          title={
            <>
              Latest <span className="em">thinking.</span>
            </>
          }
          href="/insights"
          cta="All insights"
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} data-label={a.tag} className="group flex min-h-[22rem] flex-col bg-ivory p-8 transition-colors duration-500 hover:bg-ink hover:text-white">
              <p className="flex items-center justify-between text-sm">
                <span className="font-medium text-brand transition-colors group-hover:text-brand-3">{a.tag}</span>
                <span className="text-muted transition-colors group-hover:text-white/60">{formatDate(a.date)}</span>
              </p>
              <h3 className="mt-10 text-[1.55rem] font-light leading-[1.2] tracking-[-0.02em]">{a.title}</h3>
              <p className="mt-4 line-clamp-3 text-[0.95rem] leading-relaxed text-muted transition-colors group-hover:text-white/70">{a.excerpt}</p>
              <p className="mt-auto flex items-center justify-between border-t border-line pt-5 text-sm transition-colors group-hover:border-white/20">
                {a.read} read <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Closing CTA ───────── */
export function AtlasCTA() {
  return (
    <section data-theme="dark" className="navy relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-40 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
        {[760, 600, 440, 280].map((d) => (
          <span key={d} className="absolute left-1/2 top-1/2 rounded-full border border-white/10" style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }} />
        ))}
      </div>
      <div className="container-x relative grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3 text-white/60">
            <span className="size-1.5 rounded-full bg-brand-3" />
            Start a conversation
          </p>
          <h2 className="wide mt-8 text-[clamp(2.6rem,5.6vw,5.6rem)]">
            <Reveal as="span" className="block">
              Let&apos;s tie it <span className="em">together.</span>
            </Reveal>
          </h2>
        </div>
        <div className="border-t border-white/20 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="max-w-sm text-[1.1rem] leading-relaxed text-white/75">A 30-minute call with a senior practitioner. You leave with a plan either way.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button href="#book" variant="accent">
              Book a consultation
            </Button>
            <a href={`mailto:${contact.email}`} className="link-u text-sm">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
