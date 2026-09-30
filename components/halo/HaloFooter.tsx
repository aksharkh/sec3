import Link from "next/link";
import { contact, frameworkGroups, services } from "@/lib/content";
import { LiveClock } from "@/components/layout/LiveClock";
import { Wordmark } from "./HaloNav";

const company = [
  { label: "About", href: "/about" },
  { label: "Customers", href: "/customers" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function HaloFooter() {
  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));
  return (
    <footer className="bg-ivory p-3 pt-0">
      <div data-theme="dark" className="navy-glow relative overflow-hidden rounded-[32px] text-ivory">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Wordmark light />
            <p className="mt-6 max-w-sm text-ivory/60">Practitioner-led compliance for companies that sell to demanding buyers.</p>
            <a href={`mailto:${contact.email}`} className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[0.95rem] font-semibold transition-colors hover:bg-white/10">
              <span className="size-2 rounded-full bg-brand-3" />
              {contact.email}
            </a>
          </div>
          <Col title="Frameworks" className="md:col-span-3">
            {popular.map((f) => (
              <FLink key={f.slug} href={`/frameworks/${f.slug}`}>
                {f.name}
              </FLink>
            ))}
          </Col>
          <Col title="Services" className="md:col-span-3">
            {services.map((s) => (
              <FLink key={s.id} href={`/services/${s.id}`}>
                {s.title}
              </FLink>
            ))}
          </Col>
          <Col title="Company" className="md:col-span-2">
            {company.map((c) => (
              <FLink key={c.href} href={c.href}>
                {c.label}
              </FLink>
            ))}
          </Col>
        </div>

        <div className="container-x grid gap-3 sm:grid-cols-2">
          {contact.offices.map((o) => (
            <div key={o.city} className="flex items-end justify-between gap-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
              <div>
                <p className="eyebrow text-ivory/50">{o.region}</p>
                <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em]">{o.city}</p>
                <p className="mt-1 text-sm text-ivory/55">{o.address}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                <LiveClock tz={o.tz} />
              </span>
            </div>
          ))}
        </div>

        <div className="container-x mt-10 flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-ivory/55 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} SecureKnots. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-ivory">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ivory">
              Terms
            </Link>
            <a href={`tel:${contact.phoneUS.replace(/[^+\d]/g, "")}`} className="hover:text-ivory">
              {contact.phoneUS}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-ivory/55">{title}</p>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-ivory/70 transition-colors hover:text-ivory">
        {children}
      </Link>
    </li>
  );
}
