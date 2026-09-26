import type { Metadata } from "next";
import { values, team, credentials, contact } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { SectionHead } from "@/components/page/Blocks";
import { ScrubText } from "@/components/page/ScrubText";
import { FadeUp } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { KnotMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Stats } from "@/components/home/Stats";
import { FinalCTA } from "@/components/home/FinalCTA";
import { LiveClock } from "@/components/layout/LiveClock";

export const metadata: Metadata = {
  title: "About",
  description: "SecureKnots is a practitioner-led compliance firm helping companies unify security, privacy and AI frameworks into one program.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="(AB—01) About SecureKnots"
        title={
          <>
            We tie <span className="serif text-brand">loose ends.</span>
          </>
        }
        intro="SecureKnots was founded on a simple frustration: companies were running five compliance programs to prove the same controls five times. We built a practice to fix that."
        art="about"
      />

      <section data-theme="dark" className="bg-brand py-28 text-ivory md:py-44">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <p className="eyebrow text-ivory/50 md:col-span-3">(AB—02) Our belief</p>
          <div className="md:col-span-9">
            <ScrubText
              className="text-[clamp(1.9rem,4.2vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.035em]"
              text="Compliance should be a byproduct of running a secure company — not a separate job. When controls are designed once, owned clearly and evidenced automatically, every certificate you need becomes a formality."
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHead eyebrow="(AB—03) How we work" title={<>Four things we <span className="serif text-brand">won&apos;t compromise.</span></>} />
          <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
            {values.map((v, i) => (
              <FadeUp key={v.t} delay={(i % 2) * 0.08} className="group relative min-h-80 overflow-hidden rounded-[2rem] bg-paper p-8 md:p-10">
                <Glyph seed={v.t} className="pointer-events-none absolute -bottom-20 -right-20 w-80 text-brand/10 transition-transform duration-[1.6s] ease-out-expo group-hover:rotate-45" strands={9} />
                <p className="serif text-7xl text-brand/25">0{i + 1}</p>
                <p className="relative mt-10 text-3xl tracking-[-0.03em]">{v.t}</p>
                <p className="relative mt-4 max-w-md text-lg leading-relaxed text-muted">{v.d}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Stats eyebrow="(AB—04) In numbers" />

      {/* Team */}
      <section className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHead
            eyebrow="(AB—05) Leadership"
            title={<>Practitioners who&apos;ve <span className="serif text-brand">sat on both sides.</span></>}
            intro="Former auditors, CISOs, penetration testers and privacy counsel — across the US and India."
          />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
            {team.map((m, i) => (
              <FadeUp key={m.name} delay={(i % 3) * 0.08} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-brand">
                  <Glyph seed={m.name} className="absolute inset-0 m-auto w-[120%] -translate-x-[8%] text-accent/40 transition-transform duration-[1.6s] ease-out-expo group-hover:scale-110 group-hover:rotate-12" strands={9} />
                  <span className="eyebrow absolute left-5 top-5 text-ivory/60">Photo coming soon</span>
                </div>
                <p className="mt-5 text-xl tracking-[-0.02em]">{m.name}</p>
                <p className="text-muted">{m.focus}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section aria-label="Team credentials" className="border-y border-line bg-ivory py-10">
        <VelocityMarquee speed={50}>
          {credentials.map((c) => (
            <span key={c} className="mx-8 flex items-center gap-8 whitespace-nowrap text-4xl tracking-[-0.04em] md:text-6xl">
              {c}
              <KnotMark className="size-8 text-brand/30" strokeWidth={3} />
            </span>
          ))}
        </VelocityMarquee>
      </section>

      {/* Offices */}
      <section data-theme="dark" className="bg-ink py-28 text-ivory md:py-40">
        <div className="container-x">
          <SectionHead dark eyebrow="(AB—06) Offices" title={<>Two time zones. <span className="serif text-accent">One team.</span></>} />
          <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
            {contact.offices.map((o) => (
              <FadeUp key={o.city} className="relative overflow-hidden rounded-[2rem] border border-ivory/10 p-8 md:p-12">
                <Glyph seed={o.city} className="pointer-events-none absolute -right-16 -top-16 w-80 text-brand-3/30" />
                <p className="eyebrow text-ivory/50">{o.region}</p>
                <p className="display mt-10 text-[clamp(3rem,6vw,6rem)]">{o.city}</p>
                <div className="mt-6 flex items-center justify-between gap-6 border-t border-ivory/10 pt-6">
                  <p className="text-ivory/60">{o.address}</p>
                  <span className="text-2xl">
                    <LiveClock tz={o.tz} />
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button href="/careers" variant="accent">
              Join the team
            </Button>
          </div>
        </div>
      </section>

      <FinalCTA eyebrow="(AB—07) Work with us" />
    </>
  );
}
