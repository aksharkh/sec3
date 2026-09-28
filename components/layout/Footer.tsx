import Link from "next/link";
import { contact, frameworkGroups, services } from "@/lib/content";
import { LiveClock } from "./LiveClock";
import { KnotMark } from "@/components/ui/Logo";

const company = [
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));

  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-ink text-ivory">
      <div className="container-x pt-24">
        <div className="grid gap-12 border-b border-line-dark pb-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="max-w-sm text-2xl leading-snug tracking-[-0.02em] text-ivory/90">
              Practitioner-led compliance for companies that sell to{" "}
              <span className="em text-accent">demanding buyers.</span>
            </p>
            <div className="mt-10 space-y-2">
              <a href={`mailto:${contact.email}`} className="link-sweep block text-lg">
                {contact.email}
              </a>
              <a href={`tel:${contact.phoneUS.replace(/[^+\d]/g, "")}`} className="link-sweep block text-ivory/60">
                {contact.phoneUS} <span className="eyebrow ml-1 text-ivory/35">US</span>
              </a>
              <a href={`tel:${contact.phoneIN.replace(/[^\d]/g, "")}`} className="link-sweep block text-ivory/60">
                {contact.phoneIN} <span className="eyebrow ml-1 text-ivory/35">IN</span>
              </a>
            </div>
          </div>

          <FooterCol title="Frameworks" className="md:col-span-3">
            {popular.map((f) => (
              <FooterLink key={f.slug} href={`/frameworks/${f.slug}`}>
                {f.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Services" className="md:col-span-3">
            {services.map((s) => (
              <FooterLink key={s.id} href={`/services/${s.id}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Company" className="md:col-span-2">
            {company.map((c) => (
              <FooterLink key={c.href} href={c.href}>
                {c.label}
              </FooterLink>
            ))}
          </FooterCol>
        </div>

        <div className="grid gap-8 py-10 md:grid-cols-12">
          {contact.offices.map((o) => (
            <div key={o.city} className="md:col-span-3">
              <p className="eyebrow text-ivory/40">{o.region}</p>
              <p className="mt-2 flex items-baseline gap-3 text-xl tracking-[-0.02em]">
                {o.city}
                <LiveClock tz={o.tz} />
              </p>
              <p className="mt-1 text-sm text-ivory/50">{o.address}</p>
            </div>
          ))}
          <div className="flex items-end md:col-span-6 md:justify-end">
            <p className="eyebrow flex items-center gap-2 text-ivory/50">
              Accepting new engagements for Q4
            </p>
          </div>
        </div>
      </div>

      {/* Giant wordmark, spans the full content width */}
      <div className="container-x relative select-none overflow-hidden" aria-hidden>
        <p className="display whitespace-nowrap pb-[1vw] text-[19.4vw] font-semibold leading-[0.8] tracking-[-0.065em] text-ivory 2xl:text-[19rem]">
          Secure<span className="em font-normal tracking-[-0.035em] text-accent">Knots</span>
        </p>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-ivory/45 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2"><KnotMark className="size-4 text-accent" strokeWidth={5} /> © {new Date().getFullYear()} SecureKnots. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="link-sweep">Privacy</Link>
          <Link href="/terms" className="link-sweep">Terms</Link>
          <a href="#top" className="link-sweep">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-ivory/40">{title}</p>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="link-sweep text-ivory/75 transition-colors hover:text-ivory">
        {children}
      </Link>
    </li>
  );
}
