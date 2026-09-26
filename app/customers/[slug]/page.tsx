import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stories, getStory } from "@/lib/stories";
import { frameworks } from "@/lib/frameworks";
import { HeroFade } from "@/components/page/HeroFade";
import { Chip } from "@/components/page/Blocks";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Glyph, toneClasses } from "@/components/ui/Glyph";
import { Button, Arrow } from "@/components/ui/Button";
import { StoryCard } from "@/components/stories/StoryCard";
import { FinalCTA } from "@/components/home/FinalCTA";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/customers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getStory(slug);
  if (!s) return {};
  return { title: `${s.company} — customer story`, description: s.summary };
}

export default async function StoryPage({ params }: PageProps<"/customers/[slug]">) {
  const { slug } = await params;
  const s = getStory(slug);
  if (!s) notFound();
  const t = toneClasses[s.tone];
  const idx = stories.indexOf(s);
  const next = stories[(idx + 1) % stories.length];
  const more = stories.filter((x) => x.slug !== s.slug).slice(0, 2);
  const fwSlug = (name: string) => frameworks.find((f) => f.name === name)?.slug;
  const light = s.tone === "accent" || s.tone === "paper";

  const facts = [
    { k: "Industry", v: s.industry },
    { k: "Company size", v: s.size },
    { k: "Headquarters", v: s.hq },
    { k: "Time to report", v: `${s.weeks} weeks` },
  ];

  return (
    <>
      {/* Hero */}
      <section data-theme={light ? undefined : "dark"} className={`relative overflow-hidden pb-16 pt-36 md:pt-44 ${t.bg} ${t.fg}`}>
        <HeroFade className="pointer-events-none absolute -right-[15%] -top-[10%] w-[75vw] max-w-[60rem] md:-right-[5%] md:w-[50vw]" delay={0.2}>
          <Glyph seed={s.slug} className={`w-full animate-[drift_60s_linear_infinite] ${t.art} opacity-60`} strands={13} strokeWidth={0.45} />
        </HeroFade>
        <div className="container-x relative">
          <HeroFade as="nav" aria-label="Breadcrumb" className={`eyebrow flex gap-2 ${t.sub}`}>
            <Link href="/customers" className="link-sweep">
              Customer stories
            </Link>
            <span>/</span>
            <span>{s.company}</span>
          </HeroFade>
          <HeroFade className="mt-12 flex items-center gap-4">
            <span className={`grid size-14 place-items-center rounded-2xl border text-lg font-semibold ${light ? "border-ink/20" : "border-ivory/25"}`}>{s.mark}</span>
            <span className="text-2xl font-medium tracking-[-0.02em]">{s.company}</span>
          </HeroFade>
          <h1 className="display mt-10 max-w-6xl text-[clamp(2.8rem,6.4vw,7rem)]">
            <Reveal as="span" trigger="load" delay={0.1} className="block">
              {s.headline}
            </Reveal>
          </h1>
          <HeroFade className={`mt-10 max-w-2xl text-xl leading-relaxed ${t.sub}`}>{s.summary}</HeroFade>
        </div>

        {/* Metrics */}
        <div className="container-x relative mt-20">
          <div className={`grid border-t md:grid-cols-3 ${light ? "border-ink/15" : "border-ivory/20"}`}>
            {s.metrics.map((m, i) => (
              <FadeUp key={m.l} delay={i * 0.08} className={`pt-8 md:pr-8 ${i ? `mt-8 border-t md:mt-0 md:border-l md:border-t-0 md:pl-8 ${light ? "border-ink/15" : "border-ivory/20"}` : ""}`}>
                <p className="display text-[clamp(3.5rem,7vw,7rem)]">{m.v}</p>
                <p className={`mt-2 ${t.sub}`}>{m.l}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 rounded-[1.75rem] border border-line p-7">
              <dl className="space-y-5">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt className="eyebrow text-muted">{f.k}</dt>
                    <dd className="mt-1 text-lg">{f.v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="eyebrow text-muted">Frameworks</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {s.frameworks.map((f) => {
                      const slugFw = fwSlug(f);
                      return slugFw ? (
                        <Link key={f} href={`/frameworks/${slugFw}`} data-label={f}>
                          <Chip className="transition-colors hover:border-ink hover:bg-ink hover:text-ivory">{f}</Chip>
                        </Link>
                      ) : (
                        <Chip key={f}>{f}</Chip>
                      );
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted">Services</dt>
                  <dd className="mt-1 text-lg">{s.services.join(", ")}</dd>
                </div>
              </dl>
              <div className="mt-8 border-t border-line pt-6">
                <Button href="#book" magnetic={false} className="w-full justify-between">
                  Get similar results
                </Button>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
            <p className="eyebrow text-muted">01 — The challenge</p>
            <div className="mt-6 space-y-6 text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.3] tracking-[-0.02em]">
              {s.challenge.map((p) => (
                <FadeUp as="p" key={p}>
                  {p}
                </FadeUp>
              ))}
            </div>

            <p className="eyebrow mt-24 text-muted">02 — The approach</p>
            <ol className="relative mt-10 space-y-3 before:absolute before:bottom-6 before:left-[1.35rem] before:top-6 before:w-px before:bg-line">
              {s.approach.map((a, i) => (
                <FadeUp as="li" key={a.t} delay={i * 0.05} className="relative flex gap-6 rounded-[1.5rem] p-2 pr-6">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm text-ivory">{i + 1}</span>
                  <span className="pt-2">
                    <span className="block text-2xl tracking-[-0.02em]">{a.t}</span>
                    <span className="mt-2 block text-lg leading-relaxed text-muted">{a.d}</span>
                  </span>
                </FadeUp>
              ))}
            </ol>

            <FadeUp as="figure" className="relative mt-24 overflow-hidden rounded-[2rem] bg-brand p-10 text-ivory md:p-14">
              <Glyph seed={`${s.slug}-q`} className="pointer-events-none absolute -bottom-24 -right-24 w-96 text-accent/30" strands={9} />
              <span aria-hidden className="serif block text-[7rem] leading-[0.5] text-accent">&ldquo;</span>
              <blockquote className="serif relative mt-6 text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1]">{s.quote.text}</blockquote>
              <figcaption className="relative mt-10 text-ivory/70">
                <span className="block text-ivory">{s.quote.name}</span>
                {s.quote.role}
              </figcaption>
            </FadeUp>

            <p className="eyebrow mt-24 text-muted">03 — The results</p>
            <ul className="mt-8 border-t border-line">
              {s.results.map((r) => (
                <FadeUp as="li" key={r} className="flex items-start gap-5 border-b border-line py-6 text-xl tracking-[-0.01em]">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-sm text-ink">✓</span>
                  {r}
                </FadeUp>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* Next story */}
      <Link
        href={`/customers/${next.slug}`}
        data-label={next.company}
        data-cursor="Next story"
        data-theme="dark"
        className="group relative block overflow-hidden bg-ink text-ivory"
      >
        <Glyph seed={next.slug} className="pointer-events-none absolute -right-[10%] top-1/2 w-[50vw] -translate-y-1/2 text-brand-3/40 transition-transform duration-[1.6s] ease-out-expo group-hover:rotate-12 group-hover:scale-110" strands={9} />
        <div className="container-x relative py-20 md:py-28">
          <p className="eyebrow text-accent">Next story</p>
          <p className="display mt-6 text-[clamp(3rem,9vw,9rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-6">{next.company}</p>
          <p className="mt-6 flex max-w-2xl items-center gap-4 text-xl text-ivory/60">
            {next.headline}
            <Arrow className="size-4 shrink-0" />
          </p>
        </div>
      </Link>

      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <p className="eyebrow text-muted">More stories</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {more.map((m) => (
              <StoryCard key={m.slug} story={m} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA eyebrow="Your story next" />
    </>
  );
}
