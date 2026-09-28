import type { Metadata } from "next";
import { articles, articleTags } from "@/lib/insights";
import { PageHero } from "@/components/page/PageHero";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightsBrowser, Newsletter } from "@/components/insights/InsightsBrowser";
import { FadeUp } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical guidance on SOC 2, ISO 27001, CMMC, ISO 42001, PCI DSS, DORA and privacy law from SecureKnots practitioners.",
};

export default function InsightsPage() {
  const [featured, ...rest] = articles;
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Latest <span className="em text-brand">thinking.</span>
          </>
        }
        intro="Practical guidance from the people doing the work."
        art="insights"
      />
      <section className="bg-ivory pb-20">
        <FadeUp className="container-x">
          <ArticleCard a={featured} large />
        </FadeUp>
      </section>
      <section className="bg-ivory pb-28 md:pb-40">
        <div className="container-x">
          <InsightsBrowser items={rest} tags={articleTags} />
        </div>
      </section>
      <section data-theme="dark" className="relative overflow-hidden bg-brand py-24 text-ivory md:py-32">
        <Glyph seed="newsletter" className="pointer-events-none absolute -right-32 -top-32 w-[40rem] text-accent/25" strands={11} />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent">The Knot, monthly</p>
            <p className="display mt-6 text-[clamp(2.6rem,5.5vw,5.5rem)]">
              Regulatory change, <span className="em">untangled.</span>
            </p>
            <p className="mt-6 max-w-lg text-lg text-ivory/65">One email a month. What changed, who it affects, and what to do about it.</p>
          </div>
          <div className="lg:col-span-5">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
