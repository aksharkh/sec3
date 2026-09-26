import Link from "next/link";
import { contact } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow } from "@/components/ui/Button";
import { DotField } from "@/components/ui/DotField";

export function FinalCTA({ eyebrow = "(SK—14) Start here" }: { eyebrow?: string }) {
  return (
    <section className="relative overflow-hidden bg-ivory pb-24 pt-20 md:pb-36 md:pt-28">
      <DotField className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_60%,black_20%,transparent_75%)]" />
      <div className="container-x relative">
        <div className="border-t border-line pt-10">
          <p className="eyebrow text-muted">{eyebrow}</p>
        </div>
        <div className="mt-12 grid items-end gap-12 lg:grid-cols-12">
          <h2 className="display text-[clamp(3.6rem,11vw,12.5rem)] lg:col-span-9">
            <Reveal as="span" className="block">
              Let&apos;s tie it
            </Reveal>
            <Reveal as="span" delay={0.1} className="block">
              <span className="serif text-brand">together.</span>
            </Reveal>
          </h2>
          <div className="flex lg:col-span-3 lg:justify-end">
            <Magnetic strength={0.4}>
              <Link
                href="#book"
                data-cursor="hide"
                className="group relative grid size-44 place-items-center overflow-hidden rounded-full bg-ink text-ivory md:size-56"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
                <span className="relative flex flex-col items-center gap-3 text-center transition-colors duration-500 group-hover:text-ink">
                  <Arrow className="size-5 transition-transform duration-700 ease-out-expo group-hover:rotate-45" />
                  <span className="text-lg font-medium leading-tight">
                    Book an
                    <br />
                    assessment
                  </span>
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
        <div className="mt-16 grid gap-6 text-lg md:grid-cols-3">
          <p className="text-muted">A 30-minute call with a senior practitioner. No sales script.</p>
          <a href={`mailto:${contact.email}`} className="link-sweep w-fit">
            {contact.email}
          </a>
          <a href={`tel:${contact.phoneUS.replace(/[^+\d]/g, "")}`} className="link-sweep w-fit md:justify-self-end">
            {contact.phoneUS}
          </a>
        </div>
      </div>
    </section>
  );
}
