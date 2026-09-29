"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { frameworkGroups, frameworkCount, navLinks, services } from "@/lib/content";
import { ScrollTrigger, gsap, onSiteReady, openSearch, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

type Menu = "frameworks" | "services" | null;

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <KnotMark className="size-[22px] text-brand" strokeWidth={3.4} />
      <span className="serif text-[1.45rem] leading-none tracking-[-0.01em]">
        Secure<span className="italic">Knots</span>
      </span>
    </span>
  );
}

export function MeridianNav() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset menus on navigation
    setMenu(null);
    setMobile(false);
  }, [pathname]);

  // Scroll state via ScrollTrigger (no raw scroll listeners).
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScrolled(self.scroll() > 24);
        setHidden(self.direction === 1 && self.scroll() > 320);
      },
    });
    return () => st.kill();
  }, [pathname]);

  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { yPercent: -100 });
    return onSiteReady(() => gsap.to(el, { yPercent: 0, duration: 1, delay: 0.2, ease: "expo.out" }));
  }, []);

  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current && !mobile) return;
    touched.current = true;
    if (mobile) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [mobile]);

  const open = (m: Menu) => {
    clearTimeout(timer.current);
    setMenu(m);
  };
  const close = () => {
    timer.current = setTimeout(() => setMenu(null), 140);
  };

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        ref={bar}
        onMouseLeave={close}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo ${
          hidden && !menu && !mobile ? "-translate-y-full" : ""
        } border-b ${scrolled || menu ? "border-line bg-ivory" : "border-transparent bg-ivory"}`}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-6">
          <Link href="/" aria-label="SecureKnots home" className="relative z-10">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-9">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => (l.menu ? open(l.menu) : close())}
                onFocus={() => l.menu && open(l.menu)}
                className={`group relative py-2 text-[0.9rem] transition-colors duration-300 ${
                  active(l.href) || menu === l.menu ? "text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-brand transition-transform duration-500 ease-out-expo ${
                    active(l.href) || menu === l.menu ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search (Ctrl K)"
              className="hidden size-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-paper hover:text-ink sm:grid"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <Link
              href="#book"
              className="hidden h-10 items-center whitespace-nowrap rounded-full bg-ink px-5 text-[0.85rem] font-medium text-ivory transition-colors duration-500 hover:bg-brand md:flex"
            >
              Book a consultation
            </Link>
            <button
              type="button"
              onClick={() => setMobile((v) => !v)}
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              className="relative z-10 grid size-10 place-items-center rounded-full border border-line lg:hidden"
            >
              <span className="relative block h-2 w-4">
                <span className={`absolute left-0 h-px w-4 bg-ink transition-all duration-500 ${mobile ? "top-1 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-4 bg-ink transition-all duration-500 ${mobile ? "top-1 -rotate-45" : "top-2"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega panels */}
        <div
          onMouseEnter={() => clearTimeout(timer.current)}
          className={`hidden overflow-hidden border-t border-line transition-[max-height,opacity] duration-700 ease-out-expo lg:block ${
            menu ? "max-h-[520px] opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="container-x py-10">
            {menu === "frameworks" && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3">
                  <p className="serif text-[4rem] leading-none text-ink">{frameworkCount}</p>
                  <p className="mt-2 max-w-[16rem] text-sm text-muted">Frameworks delivered as one program. Tested once, mapped everywhere.</p>
                  <Link href="/frameworks" className="link-u mt-8 inline-flex text-sm text-ink">
                    View the full index
                  </Link>
                </div>
                <div className="col-span-9 grid grid-cols-5 gap-6">
                  {frameworkGroups.map((g) => (
                    <div key={g.id}>
                      <p className="eyebrow border-b border-line pb-3 text-muted">{g.name}</p>
                      <ul className="mt-3 space-y-2">
                        {g.items.map((f) => (
                          <li key={f.slug}>
                            <Link href={`/frameworks/${f.slug}`} className="text-[0.88rem] text-ink/70 transition-colors hover:text-brand">
                              {f.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {menu === "services" && (
              <ul className="grid grid-cols-5 border-l border-line">
                {services.map((s, i) => (
                  <li key={s.id} className="border-r border-line">
                    <Link href={`/services/${s.id}`} className="group block px-6 py-2">
                      <span className="serif text-lg italic text-brand">0{i + 1}</span>
                      <span className="serif mt-6 block text-[1.6rem] leading-tight text-ink transition-colors group-hover:text-brand">{s.title}</span>
                      <span className="mt-2 line-clamp-3 block text-sm text-muted">{s.body}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ivory transition-[opacity,visibility] duration-500 lg:hidden ${
          mobile ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!mobile}
      >
        <nav aria-label="Mobile" className="container-x mt-24 flex flex-1 flex-col">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="serif flex items-baseline justify-between border-b border-line py-4 text-[clamp(2.2rem,9vw,3.4rem)] leading-none"
              style={{
                transition: "transform .7s var(--ease-out), opacity .7s var(--ease-out)",
                transitionDelay: mobile ? `${0.05 + i * 0.05}s` : "0s",
                transform: mobile ? "none" : "translateY(24px)",
                opacity: mobile ? 1 : 0,
              }}
            >
              {l.label}
              <span className="serif text-base italic text-muted">0{i + 1}</span>
            </Link>
          ))}
        </nav>
        <div className="container-x pb-10 pt-6">
          <Link href="#book" onClick={() => setMobile(false)} className="flex h-13 items-center justify-center rounded-full bg-ink text-sm font-medium text-ivory">
            Book a consultation
          </Link>
        </div>
      </div>
    </>
  );
}
