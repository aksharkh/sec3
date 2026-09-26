import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/insights";
import { HeroFade } from "@/components/page/HeroFade";
import { StickyToc } from "@/components/page/StickyToc";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Glyph, toneClasses } from "@/components/ui/Glyph";
import { ArticleCard, formatDate } from "@/components/insights/ArticleCard";
import { Newsletter } from "@/components/insights/InsightsBrowser";
import { ShareBar } from "@/components/insights/ShareBar";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, openGraph: { type: "article", publishedTime: a.date } };
}

const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const t = toneClasses[a.tone];
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    author: { "@type": "Organization", name: "SecureKnots" },
    publisher: { "@type": "Organization", name: "SecureKnots" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-ivory pb-14 pt-36 md:pt-44">
        <div className="container-x">
          <HeroFade as="nav" aria-label="Breadcrumb" className="eyebrow flex gap-2 text-muted">
            <Link href="/insights" className="link-sweep">
              Insights
            </Link>
            <span>/</span>
            <span className="text-ink">{a.tag}</span>
          </HeroFade>
          <h1 className="display mt-10 max-w-6xl text-[clamp(2.6rem,6vw,6.5rem)]">
            <Reveal as="span" trigger="load" className="block">
              {a.title}
            </Reveal>
          </h1>
          <HeroFade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 text-muted">
            <span>{a.author}</span>
            <span>{formatDate(a.date)}</span>
            <span>{a.read} read</span>
          </HeroFade>
        </div>
      </section>

      <HeroFade className="container-x bg-ivory" delay={0.6}>
        <div className={`relative h-[46vh] overflow-hidden rounded-[2rem] ${t.bg}`}>
          <Glyph seed={a.slug} className={`absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 animate-[drift_80s_linear_infinite] ${t.art} opacity-70`} strands={13} strokeWidth={0.35} />
        </div>
      </HeroFade>

      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <StickyToc items={a.sections.map((s) => ({ id: id(s.h), label: s.h }))} title="Contents" />
          </aside>
          <article className="lg:col-span-7">
            <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.35] tracking-[-0.02em]">{a.excerpt}</p>
            {a.sections.map((s) => (
              <section key={s.h} id={id(s.h)} className="mt-16 scroll-mt-28">
                <FadeUp as="h2" className="text-[clamp(1.8rem,2.8vw,2.6rem)] leading-tight tracking-[-0.03em]">
                  {s.h}
                </FadeUp>
                {s.p.map((p) => (
                  <p key={p} className="mt-6 text-lg leading-[1.75] text-ink/80">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <div className="mt-16 rounded-[1.75rem] bg-paper p-8">
              <p className="eyebrow text-muted">Need help with this?</p>
              <p className="mt-3 text-2xl tracking-[-0.02em]">Talk it through with a practitioner — 30 minutes, no pitch.</p>
              <a href="#book" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-ivory">
                Book a call →
              </a>
            </div>
          </article>
          <aside className="lg:col-span-2">
            <ShareBar title={a.title} />
          </aside>
        </div>
      </section>

      <section data-theme="dark" className="bg-brand py-20 text-ivory">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-center">
          <p className="display text-[clamp(2rem,3.6vw,3.6rem)] lg:col-span-6">
            Get the next one <span className="serif text-accent">in your inbox.</span>
          </p>
          <div className="lg:col-span-6">
            <Newsletter />
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <p className="eyebrow text-muted">Keep reading</p>
          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.slug} a={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
