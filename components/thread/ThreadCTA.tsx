import { contact } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/** Closing slab: cobalt blueprint, a poster line and one action. */
export function ThreadCTA() {
  return (
    <section data-theme="dark" className="blueprint relative overflow-hidden border-t border-ink bg-brand text-white">
      <div className="grid lg:grid-cols-12">
        <div className="px-[var(--gutter)] py-16 lg:col-span-8 lg:py-28">
          <p className="eyebrow flex items-center gap-3">
            <span className="bg-white px-1.5 py-0.5 text-ink">→</span>
            Start a conversation
          </p>
          <h2 className="wide mt-10 text-[clamp(3.4rem,11vw,11rem)]">
            <Reveal as="span" className="block">
              Let&apos;s tie it
            </Reveal>
            <Reveal as="span" delay={0.1} className="block">
              <span className="em">together.</span>
            </Reveal>
          </h2>
        </div>
        <div className="flex flex-col justify-between gap-10 border-t border-white/30 px-[var(--gutter)] py-12 lg:col-span-4 lg:border-l lg:border-t-0 lg:py-28">
          <p className="max-w-sm text-[1.15rem] leading-relaxed">A 30-minute call with a senior practitioner. You leave with a plan either way.</p>
          <div className="flex flex-col items-start gap-5">
            <Button href="#book" variant="accent">
              Book an assessment
            </Button>
            <a href={`mailto:${contact.email}`} className="mono text-sm underline underline-offset-4 hover:no-underline">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
