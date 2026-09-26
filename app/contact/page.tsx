import type { Metadata } from "next";
import { contact } from "@/lib/content";
import { HeroFade } from "@/components/page/HeroFade";
import { Accordion } from "@/components/page/Accordion";
import { SectionHead } from "@/components/page/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";
import { ContactForm } from "@/components/contact/ContactForm";
import { LiveClock } from "@/components/layout/LiveClock";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a SecureKnots practitioner about SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS and more. Offices in Wilmington, DE and Bengaluru.",
};

const faqs = [
  { q: "How quickly will you respond?", a: "Within one business day, from a practitioner — not a sales development rep." },
  { q: "What happens on the first call?", a: "We learn what you sell, who you sell to and your deadlines, then outline the frameworks, sequence and rough timeline. You leave with a plan whether or not you work with us." },
  { q: "Do you work with early-stage startups?", a: "Yes. We right-size scope so a seed-stage team can get a first report without a full-time security hire." },
  { q: "Are you an auditor?", a: "We prepare you for audits and coordinate with independent auditors and certification bodies, keeping advisory and attestation properly separate." },
];

export default function ContactPage() {
  return (
    <>
      <section data-theme="dark" className="relative overflow-hidden bg-ink pb-24 pt-36 text-ivory md:pb-32 md:pt-44">
        <Glyph seed="contact" className="pointer-events-none absolute -left-40 bottom-0 w-[50rem] text-brand-3/25" strands={11} strokeWidth={0.5} />
        <div className="container-x relative grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <HeroFade as="p" className="eyebrow text-accent">
              (CT—01) Contact
            </HeroFade>
            <h1 className="display mt-8 text-[clamp(3.2rem,7.5vw,8rem)]">
              <Reveal as="span" trigger="load" className="block">
                Let&apos;s tie it <span className="serif text-accent">together.</span>
              </Reveal>
            </h1>
            <HeroFade className="mt-10 space-y-6">
              <a href={`mailto:${contact.email}`} className="link-sweep block text-2xl tracking-[-0.02em]">
                {contact.email}
              </a>
              <div className="grid gap-6 sm:grid-cols-2">
                {contact.offices.map((o) => (
                  <div key={o.city} className="border-t border-ivory/15 pt-5">
                    <p className="flex items-center justify-between">
                      <span className="text-xl">{o.city}</span>
                      <LiveClock tz={o.tz} />
                    </p>
                    <p className="mt-2 text-sm text-ivory/55">{o.address}</p>
                    <a href={`tel:${(o.tz.startsWith("America") ? contact.phoneUS : contact.phoneIN).replace(/[^+\d]/g, "")}`} className="link-sweep mt-2 inline-block text-sm text-ivory/80">
                      {o.tz.startsWith("America") ? contact.phoneUS : contact.phoneIN}
                    </a>
                  </div>
                ))}
              </div>
            </HeroFade>
          </div>
          <HeroFade className="rounded-[2rem] border border-ivory/10 bg-ink-2/80 p-6 backdrop-blur md:p-10 lg:col-span-7" delay={0.6}>
            <ContactForm />
          </HeroFade>
        </div>
      </section>

      <section className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHead eyebrow="(CT—02) Before you reach out" title={<>Good <span className="serif text-brand">questions.</span></>} />
          <div className="mt-14 md:ml-[25%]">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
