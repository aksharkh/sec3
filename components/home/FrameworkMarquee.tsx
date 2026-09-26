import { Fragment } from "react";
import { frameworkGroups, frameworkCount } from "@/lib/content";
import { Marquee } from "@/components/ui/Marquee";
import { KnotMark } from "@/components/ui/Logo";

const all = frameworkGroups.flatMap((g) => g.items);
const headline = ["SOC 2", "ISO 27001", "FedRAMP", "CMMC", "PCI DSS", "HIPAA", "ISO 42001", "GDPR", "NIST 800-53", "DORA"];

export function FrameworkMarquee() {
  return (
    <section aria-label="Frameworks we deliver" className="relative border-y border-line bg-ivory py-10 md:py-14">
      <div className="container-x mb-8 flex items-center justify-between gap-6">
        <p className="eyebrow text-muted">(SK—02) {frameworkCount} frameworks. One partner.</p>
        <p className="eyebrow hidden text-muted md:block">Security · Government · Privacy &amp; AI · Financial · Management</p>
      </div>

      <Marquee duration={55}>
        {headline.map((name, i) => (
          <Fragment key={name}>
            <span
              className={`whitespace-nowrap px-6 text-[clamp(2.6rem,6.5vw,6.5rem)] leading-none tracking-[-0.045em] md:px-10 ${
                i % 2 ? "serif text-brand" : "font-medium text-ink"
              }`}
            >
              {name}
            </span>
            <KnotMark className="size-8 shrink-0 text-ink/20 md:size-12" strokeWidth={3} />
          </Fragment>
        ))}
      </Marquee>

      <Marquee duration={70} reverse className="mt-8">
        {all.map((f) => (
          <span
            key={f.slug}
            className="eyebrow mx-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2 text-ink/60"
          >
            {f.name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
