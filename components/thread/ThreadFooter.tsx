import Link from "next/link";
import { contact, frameworkGroups, services } from "@/lib/content";
import { LiveClock } from "@/components/layout/LiveClock";
import { Wordmark } from "./ThreadRail";

const company = [
  { label: "About", href: "/about" },
  { label: "Customers", href: "/customers" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function ThreadFooter() {
  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));
  return (
    <footer data-theme="dark" className="blueprint relative overflow-hidden bg-ink text-ivory">
      <div className="grid border-b border-line-dark lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 border-b border-line-dark px-[var(--gutter)] py-12 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div>
            <Wordmark />
            <p className="mt-6 max-w-sm text-ivory/60">Practitioner-led compliance for companies that sell to demanding buyers.</p>
          </div>
          <a href={`mailto:${contact.email}`} className="wide block text-[clamp(1.6rem,3vw,2.8rem)] transition-colors hover:text-brand-3">
            {contact.email}
          </a>
        </div>
        <div className="grid sm:grid-cols-3 lg:col-span-7">
          <Col title="Frameworks">
            {popular.map((f) => (
              <FLink key={f.slug} href={`/frameworks/${f.slug}`}>
                {f.name}
              </FLink>
            ))}
          </Col>
          <Col title="Services">
            {services.map((s) => (
              <FLink key={s.id} href={`/services/${s.id}`}>
                {s.title}
              </FLink>
            ))}
          </Col>
          <Col title="Company">
            {company.map((c) => (
              <FLink key={c.href} href={c.href}>
                {c.label}
              </FLink>
            ))}
          </Col>
        </div>
      </div>

      <div className="grid border-b border-line-dark sm:grid-cols-2">
        {contact.offices.map((o, i) => (
          <div key={o.city} className={`flex items-end justify-between gap-6 px-[var(--gutter)] py-8 ${i ? "border-t border-line-dark sm:border-l sm:border-t-0" : ""}`}>
            <div>
              <p className="eyebrow text-ivory/50">{o.region}</p>
              <p className="wide mt-3 text-[2.4rem]">{o.city}</p>
              <p className="mt-2 text-sm text-ivory/55">{o.address}</p>
            </div>
            <LiveClock tz={o.tz} />
          </div>
        ))}
      </div>

      <div className="select-none overflow-hidden px-[var(--gutter)] pt-8" aria-hidden>
        <p className="wide whitespace-nowrap text-[21vw] leading-[0.78] lg:text-[19.5vw]">SecureKnots</p>
      </div>

      <div className="flex flex-col gap-3 bg-brand px-[var(--gutter)] py-4 text-sm text-white md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} SecureKnots. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <a href={`tel:${contact.phoneUS.replace(/[^+\d]/g, "")}`} className="hover:underline">
            {contact.phoneUS}
          </a>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line-dark px-[var(--gutter)] py-12 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="eyebrow text-ivory/50">{title}</p>
      <ul className="mt-6 space-y-2.5">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[1.05rem] text-ivory/80 transition-colors hover:text-brand-3">
        {children}
      </Link>
    </li>
  );
}
