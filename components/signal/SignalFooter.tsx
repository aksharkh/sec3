import Link from "next/link";
import { contact, frameworkGroups, services } from "@/lib/content";
import { LiveClock } from "@/components/layout/LiveClock";
import { Wordmark } from "./SignalNav";

const company = [
  { label: "About", href: "/about" },
  { label: "Customers", href: "/customers" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function SignalFooter() {
  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="container-x grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark />
          <p className="mt-6 max-w-sm text-ivory/55">Practitioner-led compliance for companies that sell to demanding buyers.</p>
          <a href={`mailto:${contact.email}`} className="link-sweep mt-8 inline-block text-lg">
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
              <p className="mt-2 text-xl">{o.city}</p>
              <p className="mt-1 text-sm text-ivory/55">{o.address}</p>
            </div>
            <span className="mono text-sm">
              <LiveClock tz={o.tz} />
            </span>
          </div>
        ))}
      </div>

      <div className="container-x group select-none py-8" aria-hidden>
        <p className="wide whitespace-nowrap text-center text-[9.4vw] leading-none text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_var(--muted-dark)] group-hover:text-brand-3 group-hover:[-webkit-text-stroke:1px_var(--brand-3)] 2xl:text-[9rem]">
          Secure<span className="em">Knots</span>
        </p>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-ivory/55 md:flex-row md:justify-between">
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
      <Link href={href} className="text-ivory/75 transition-colors hover:text-brand-3">
        {children}
      </Link>
    </li>
  );
}
