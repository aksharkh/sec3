import Link from "next/link";
import { articles } from "@/lib/insights";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";
import { ArticleCard } from "@/components/insights/ArticleCard";

export function Insights({ eyebrow = "(SK—13) Insights" }: { eyebrow?: string }) {
  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-muted">{eyebrow}</p>
            <Reveal as="h2" className="display mt-8 text-[clamp(2.6rem,6vw,6rem)]">
              Field <span className="serif text-brand">notes.</span>
            </Reveal>
          </div>
          <Link href="/insights" className="group inline-flex items-center gap-3 font-medium">
            <span className="link-sweep">All insights</span>
            <Arrow className="size-3 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-14 md:mt-20 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <FadeUp key={a.slug} delay={i * 0.1}>
              <ArticleCard a={a} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
