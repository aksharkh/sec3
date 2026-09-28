import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, serviceDetails, frameworkCount } from "@/lib/content";
import { getFramework } from "@/lib/frameworks";
import { stories } from "@/lib/stories";
import { PageHero } from "@/components/page/PageHero";
import { SectionHead } from "@/components/page/Blocks";
import { FadeUp } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { StoryCard } from "@/components/stories/StoryCard";
import { Process } from "@/components/home/Process";
import { FinalCTA } from "@/components/home/FinalCTA";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  if (!s) return {};
  return { title: s.title, description: serviceDetails[s.id].tagline };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  if (!s) notFound();
  const d = serviceDetails[s.id];
  const idx = services.indexOf(s);
  const next = services[(idx + 1) % services.length];
  const related = stories.filter((st) => st.services.includes(s.title)).slice(0, 2);
  const fws = d.frameworks.map(getFramework).filter(Boolean) as NonNullable<ReturnType<typeof getFramework>>[];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        eyebrow={`(0${idx + 1}) ${s.kicker}`}
        title={s.title}
        intro={
          <>
            <span className="block text-2xl leading-snug tracking-[-0.02em] text-ink">{d.tagline}</span>
            <span className="mt-4 block">{s.body}</span>
          </>
        }
        actions={<Button href="#book">Talk to a practitioner</Button>}
        art={s.id}
      />

      {/* Outcomes */}
      <section data-theme="dark" className="bg-brand text-ivory">
        <div className="container-x grid md:grid-cols-3">
          {d.outcomes.map((o, i) => (
            <FadeUp key={o.l} delay={i * 0.08} className={`py-12 md:py-16 ${i ? "border-t border-ivory/15 md:border-l md:border-t-0 md:pl-10" : ""}`}>
              <p className="display text-[clamp(3.5rem,7vw,6.5rem)]">{o.v}</p>
              <p className="mt-2 text-ivory/60">{o.l}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Includes */}
      <section className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHead
            eyebrow="What's included"
            title={
              <>
                Everything you need. <span className="em text-brand">Nothing you don&apos;t.</span>
              </>
            }
          />
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
            {d.includes.map((x, i) => (
              <FadeUp key={x.t} delay={(i % 3) * 0.08} className="group relative min-h-64 overflow-hidden bg-ivory p-8 transition-colors duration-700 hover:bg-ink hover:text-ivory">
                <Glyph seed={x.t} className="pointer-events-none absolute -bottom-16 -right-16 w-56 text-brand-3 opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
                <p className="eyebrow text-muted group-hover:text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-16 text-2xl tracking-[-0.02em]">{x.t}</p>
                <p className="mt-3 leading-relaxed text-muted group-hover:text-ivory/60">{x.d}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Frameworks covered" title={<>Built for <span className="em text-brand">your roadmap.</span></>} />
          <div className="mt-14 flex flex-wrap gap-3">
            {fws.map((f) => (
              <Link
                key={f.slug}
                href={`/frameworks/${f.slug}`}
                data-label={f.name}
                className="group inline-flex items-center gap-3 rounded-full border border-ink/15 bg-ivory py-3 pl-6 pr-3 text-lg transition-colors duration-500 hover:bg-ink hover:text-ivory"
              >
                {f.name}
                <span className="grid size-9 place-items-center rounded-full bg-ink/5 transition-transform duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-ink">
                  <Arrow className="size-3" />
                </span>
              </Link>
            ))}
            <Link href="/frameworks" className="inline-flex items-center rounded-full px-6 py-3 text-lg text-muted underline-offset-4 hover:underline">
              + {frameworkCount - fws.length} more
            </Link>
          </div>
        </div>
      </section>

      <Process eyebrow="How we deliver" />

      {related.length > 0 && (
        <section className="bg-ivory py-28 md:py-40">
          <div className="container-x">
            <SectionHead eyebrow="Customer stories" title={<>{s.title}, <span className="em text-brand">in practice.</span></>} />
            <div className="mt-16 grid gap-5 md:grid-cols-2">
              {related.map((st) => (
                <StoryCard key={st.slug} story={st} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Link href={`/services/${next.id}`} data-label={next.title} data-cursor="Next" data-theme="dark" className="group relative block overflow-hidden bg-ink text-ivory">
        <div className="container-x relative py-20 md:py-28">
          <p className="eyebrow text-accent">Next service</p>
          <p className="display mt-6 text-[clamp(3rem,9vw,9rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-6">{next.title}</p>
        </div>
      </Link>

      <FinalCTA eyebrow="Start here" />
    </>
  );
}
