import Link from "next/link";
import { contact, frameworkGroups, services } from "@/lib/content";
import { LiveClock } from "@/components/layout/LiveClock";
import { Wordmark } from "./AtlasHeader";

const company = [
  { label: "About", href: "/about" },
  { label: "Customers", href: "/customers" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function AtlasFooter() {
  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));
  return (
    <footer data-theme="dark" className="relative overflow-hidden border-t border-line-dark bg-ink text-white">
      <div className="container-x grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark className="[&_svg]:text-brand-3" />
          <p className="mt-6 max-w-sm text-ivory/55">Practitioner-led compliance for companies that sell to demanding buyers.</p>
          <a href={`mailto:${contact.email}`} className="link-sweep mt-8 inline-block text-[1.35rem] font-light">
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

      <div className="container-x grid gap-px border-y border-line-dark sm:grid-cols-2">
        {contact.offices.map((o, i) => (
          <div key={o.city} className={`flex items-end justify-between gap-6 py-8 ${i ? "sm:border-l sm:border-line-dark sm:pl-8" : "sm:pr-8"}`}>
            <div>
              <p className="eyebrow text-ivory/55">{o.region}</p>
              <p className="wide mt-2 text-[1.8rem]">{o.city}</p>
              <p className="mt-1 text-sm text-ivory/55">{o.address}</p>
            </div>
            <span className="mono text-sm">
              <LiveClock tz={o.tz} />
            </span>
          </div>
        ))}
      </div>

      <div className="container-x mt-12 flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-ivory/55 md:flex-row md:justify-between">
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
