import { PageHero } from "./PageHero";
import { StickyToc } from "./StickyToc";

const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${updated}`} title={title} size="lg" crumbs={[{ label: "Home", href: "/" }, { label: title }]} />
      <section className="bg-ivory pb-28 md:pb-40">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <StickyToc items={sections.map((s) => ({ id: id(s.h), label: s.h }))} title="Sections" />
          </aside>
          <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
            <p className="rounded-2xl bg-paper p-5 text-sm text-muted">
              Template text for review by SecureKnots&apos; legal counsel before publication.
            </p>
            {sections.map((s) => (
              <section key={s.h} id={id(s.h)} className="mt-14 scroll-mt-28">
                <h2 className="text-3xl tracking-[-0.03em]">{s.h}</h2>
                {s.p.map((p) => (
                  <p key={p} className="mt-5 text-lg leading-[1.75] text-ink/80">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
