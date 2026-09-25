import Link from "next/link";
import { insights } from "@/lib/content";
import { Reveal, FadeUp } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";
import { KnotMark } from "@/components/ui/Logo";

const tones = {
  knot: { bg: "bg-knot", fg: "text-lime", mark: "text-ivory/15" },
  lime: { bg: "bg-lime", fg: "text-ink", mark: "text-ink/15" },
  ink: { bg: "bg-ink", fg: "text-ivory", mark: "text-lime/25" },
};

export function Insights() {
  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-muted">(SK—11) Insights</p>
            <Reveal as="h2" className="display mt-8 text-[clamp(2.6rem,6vw,6rem)]">
              Field <span className="serif text-knot">notes.</span>
            </Reveal>
          </div>
          <Link href="/insights" className="group inline-flex items-center gap-3 font-medium">
            <span className="link-sweep">All insights</span>
            <Arrow className="size-3 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
          {insights.map((a, i) => {
            const t = tones[a.tone];
            return (
              <FadeUp key={a.title} delay={i * 0.1}>
                <Link href="/insights" data-cursor="Read" className="group block">
                  <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ${t.bg}`}>
                    <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110 group-hover:rotate-6">
                      <KnotMark
                        className={`absolute left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 ${t.mark}`}
                        strokeWidth={0.6 + i * 0.5}
                      />
                    </div>
                    <div className={`absolute inset-x-0 top-0 flex justify-between p-6 ${t.fg}`}>
                      <span className="eyebrow">{a.tag}</span>
                      <span className="eyebrow">{a.read}</span>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl leading-snug tracking-[-0.025em]">
                    <span className="link-sweep">{a.title}</span>
                  </h3>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
