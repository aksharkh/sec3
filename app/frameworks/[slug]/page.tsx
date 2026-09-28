import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { frameworks, getFramework } from "@/lib/frameworks";
import { process } from "@/lib/content";
import { stories } from "@/lib/stories";
import { PageHero } from "@/components/page/PageHero";
import { StickyToc } from "@/components/page/StickyToc";
import { Accordion } from "@/components/page/Accordion";
import { Chip } from "@/components/page/Blocks";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { StoryCard } from "@/components/stories/StoryCard";
import { FinalCTA } from "@/components/home/FinalCTA";

export function generateStaticParams() {
  return frameworks.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/frameworks/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const f = getFramework(slug);
  if (!f) return {};
  return { title: `${f.name} compliance`, description: f.summary };
}

const toc = [
  { id: "overview", label: "Overview" },
  { id: "requirements", label: "Requirements" },
  { id: "approach", label: "Our approach" },
  { id: "related", label: "Related frameworks" },
  { id: "faq", label: "FAQ" },
];

export default async function FrameworkPage({ params }: PageProps<"/frameworks/[slug]">) {
  const { slug } = await params;
  const f = getFramework(slug);
  if (!f) notFound();

  const related = f.related.map(getFramework).filter(Boolean) as NonNullable<ReturnType<typeof getFramework>>[];
  const story = stories.find((s) => s.frameworks.includes(f.name)) ?? stories.find((s) => s.frameworks.some((x) => related.some((r) => r.name === x)));
  const idx = frameworks.findIndex((x) => x.slug === f.slug);
  const next = frameworks[(idx + 1) % frameworks.length];

  const facts = [
    { k: "Issued by", v: f.issuer },
    { k: "Typical timeline", v: f.timeline },
    { k: "Assessed by", v: f.assessment },
    { k: "Validity", v: f.validity },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Frameworks", href: "/frameworks" }, { label: f.name }]}
        eyebrow={`${f.group} · ${f.full}`}
        title={f.name}
        intro={f.summary}
        actions={
          <>
            <Button href="#book" book={f.name}>
              Book a {f.name} assessment
            </Button>
          </>
        }
        art={f.slug}
      />

      {/* Key facts */}
      <section data-theme="dark" className="bg-brand text-ivory">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {facts.map((x, i) => (
            <FadeUp key={x.k} delay={i * 0.06} className={`border-ivory/15 py-10 pr-6 ${i % 2 ? "pl-6" : ""} ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""}`}>
              <p className="eyebrow text-accent">{x.k}</p>
              <p className="mt-3 text-xl tracking-[-0.02em] md:text-2xl">{x.v}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="bg-ivory">
        <div className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <StickyToc items={toc} />
          </aside>

          <div className="space-y-28 lg:col-span-9 md:space-y-36">
            {/* Overview */}
            <section id="overview" className="scroll-mt-28">
              <p className="eyebrow text-muted">Overview</p>
              <Reveal as="h2" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.6rem)]">
                Who needs <span className="em text-brand">{f.name}?</span>
              </Reveal>
              <ul className="mt-12 grid gap-3 md:grid-cols-3">
                {f.who.map((w, i) => (
                  <FadeUp as="li" key={w} delay={i * 0.08} className="flex min-h-44 flex-col justify-between rounded-[1.5rem] bg-paper p-6">
                    <span className="eyebrow text-brand-3">0{i + 1}</span>
                    <span className="text-lg leading-snug tracking-[-0.01em]">{w}</span>
                  </FadeUp>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section id="requirements" className="scroll-mt-28">
              <p className="eyebrow text-muted">Requirements</p>
              <Reveal as="h2" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.6rem)]">
                What the auditor <span className="em text-brand">looks for.</span>
              </Reveal>
              <ol className="mt-12 border-t border-line">
                {f.requirements.map((r, i) => (
                  <FadeUp as="li" key={r.t} className="group grid gap-4 border-b border-line py-8 md:grid-cols-12 md:items-baseline">
                    <span className="em text-5xl text-brand/30 transition-colors duration-500 group-hover:text-brand md:col-span-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl tracking-[-0.02em] md:col-span-4">{r.t}</span>
                    <span className="text-lg leading-relaxed text-muted md:col-span-6">{r.d}</span>
                  </FadeUp>
                ))}
              </ol>
            </section>

            {/* Approach */}
            <section id="approach" className="scroll-mt-28">
              <p className="eyebrow text-muted">Our approach</p>
              <Reveal as="h2" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.6rem)]">
                From scoping to <span className="em text-brand">signed report.</span>
              </Reveal>
              <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {process.map((p, i) => (
                  <FadeUp key={p.n} delay={i * 0.06} className="relative overflow-hidden rounded-[1.5rem] bg-ink p-6 text-ivory">
                    <p className="eyebrow text-accent">{p.time}</p>
                    <p className="em mt-8 text-5xl text-ivory/20">{p.n}</p>
                    <p className="mt-2 text-2xl tracking-[-0.02em]">{p.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/55">{p.body}</p>
                  </FadeUp>
                ))}
              </div>
            </section>

            {/* Related */}
            <section id="related" className="scroll-mt-28">
              <p className="eyebrow text-muted">Related frameworks</p>
              <Reveal as="h2" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.6rem)]">
                Tie it together <span className="em text-brand">with…</span>
              </Reveal>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                {f.name} shares a large share of its controls with these frameworks. Add them to the same program and most of the evidence is already done.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/frameworks/${r.slug}`}
                    data-label={r.name}
                    className="group flex items-center justify-between gap-6 rounded-[1.5rem] border border-line p-6 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory"
                  >
                    <span>
                      <span className="block text-2xl tracking-[-0.02em]">{r.name}</span>
                      <span className="mt-1 block text-sm text-muted group-hover:text-ivory/55">{r.full}</span>
                    </span>
                    <Arrow className="size-4 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                ))}
              </div>
            </section>

            {story && (
              <section>
                <p className="eyebrow text-muted">Customer story</p>
                <div className="mt-8">
                  <StoryCard story={story} size="lg" />
                </div>
              </section>
            )}

            {/* FAQ */}
            <section id="faq" className="scroll-mt-28">
              <p className="eyebrow text-muted">FAQ</p>
              <Reveal as="h2" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.6rem)]">
                Questions, <span className="em text-brand">answered.</span>
              </Reveal>
              <div className="mt-12">
                <Accordion items={f.faq} />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Next framework */}
      <Link href={`/frameworks/${next.slug}`} data-label={next.name} data-cursor="Next" className="group relative block overflow-hidden bg-ink text-ivory" data-theme="dark">
        <Glyph seed={next.slug} className="pointer-events-none absolute -right-[10%] top-1/2 w-[50vw] -translate-y-1/2 text-brand-3/40 transition-transform duration-[1.6s] ease-out-expo group-hover:rotate-12 group-hover:scale-110" strands={9} />
        <div className="container-x relative flex flex-wrap items-end justify-between gap-6 py-20 md:py-28">
          <div>
            <p className="eyebrow text-accent">Next framework</p>
            <p className="display mt-6 text-[clamp(3rem,10vw,10rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-6">{next.name}</p>
          </div>
          <span className="flex flex-wrap gap-2">
            <Chip dark>{next.group}</Chip>
            <Chip dark>{next.issuer}</Chip>
          </span>
        </div>
      </Link>

      <FinalCTA eyebrow={`Start your ${f.name} program`} />
    </>
  );
}
