"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { frameworkGroups, frameworkCount, navLinks, services } from "@/lib/content";
import { ScrollTrigger, gsap, onSiteReady, openSearch, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

type Menu = "frameworks" | "services" | null;

export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className={`grid size-8 place-items-center rounded-[10px] ${light ? "bg-white text-brand" : "bg-brand text-white"}`}>
        <KnotMark className="size-[18px]" strokeWidth={4.4} />
      </span>
      <span className="text-[1.08rem] font-bold tracking-[-0.04em]">SecureKnots</span>
    </span>
  );
}

/** Floating capsule navigation: a white pill that grows into a card for the mega menus. */
export function HaloNav() {
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
        setHidden(self.direction === 1 && self.scroll() > 420);
      },
    });
    return () => st.kill();
  }, [pathname]);

  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { y: -90, autoAlpha: 0 });
    return onSiteReady(() => gsap.to(el, { y: 0, autoAlpha: 1, duration: 1.1, delay: 0.15, ease: "expo.out" }));
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
    timer.current = setTimeout(() => setMenu(null), 160);
  };

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        ref={bar}
        onMouseLeave={close}
        className={`fixed inset-x-0 top-3 z-50 px-3 transition-transform duration-700 ease-out-expo md:top-4 ${hidden && !menu && !mobile ? "-translate-y-[140%]" : ""}`}
      >
        <div
          className={`mx-auto max-w-[1180px] overflow-hidden rounded-[32px] border backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-500 ${
            scrolled || menu ? "border-line bg-white/90 shadow-[0_18px_50px_-24px_rgb(10_18_48/0.35)]" : "border-white/70 bg-white/70 shadow-[0_8px_30px_-20px_rgb(10_18_48/0.25)]"
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-4 pl-4 pr-2.5">
            <Link href="/" aria-label="SecureKnots home" className="relative z-10">
              <Wordmark />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => (l.menu ? open(l.menu) : close())}
                  onFocus={() => l.menu && open(l.menu)}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.88rem] font-semibold transition-colors duration-300 ${
                    active(l.href) || (l.menu && menu === l.menu) ? "bg-ivory text-ink" : "text-ink/60 hover:bg-ivory hover:text-ink"
                  }`}
                >
                  {l.label}
                  {l.menu && (
                    <svg viewBox="0 0 12 12" className={`size-2.5 transition-transform duration-500 ${menu === l.menu ? "rotate-180" : ""}`} fill="none" aria-hidden>
                      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search (Ctrl K)"
                className="hidden size-11 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ivory hover:text-ink sm:grid"
              >
                <svg viewBox="0 0 20 20" className="size-4" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
              <Link
                href="#book"
                className="hidden h-11 items-center whitespace-nowrap rounded-full bg-ink px-5 text-[0.86rem] font-semibold text-white transition-colors duration-500 hover:bg-brand md:flex"
              >
                Book a call
              </Link>
              <button
                type="button"
                onClick={() => setMobile((v) => !v)}
                aria-label={mobile ? "Close menu" : "Open menu"}
                aria-expanded={mobile}
                className="relative z-10 grid size-11 place-items-center rounded-full bg-ivory lg:hidden"
              >
                <span className="relative block h-2 w-4">
                  <span className={`absolute left-0 h-[1.5px] w-4 rounded bg-ink transition-all duration-500 ${mobile ? "top-1 rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 h-[1.5px] w-4 rounded bg-ink transition-all duration-500 ${mobile ? "top-1 -rotate-45" : "top-2"}`} />
                </span>
              </button>
            </div>
          </div>

          {/* Mega panels: the capsule grows into a card */}
          <div
            onMouseEnter={() => clearTimeout(timer.current)}
            className={`hidden transition-[max-height,opacity] duration-700 ease-out-expo lg:block ${menu ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="p-3 pt-1">
              {menu === "frameworks" && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="blue-glow col-span-3 flex flex-col justify-between rounded-[22px] p-6 text-white">
                    <div>
                      <p className="text-[3.4rem] font-semibold leading-none tracking-[-0.05em]">{frameworkCount}</p>
                      <p className="mt-3 text-sm text-white/80">Frameworks delivered as one program. Tested once, mapped everywhere.</p>
                    </div>
                    <Link href="/frameworks" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
                      Full index
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                  <div className="col-span-9 grid grid-cols-5 gap-3 rounded-[22px] bg-ivory p-6">
                    {frameworkGroups.map((g) => (
                      <div key={g.id}>
                        <p className="eyebrow text-muted">{g.name}</p>
                        <ul className="mt-4 space-y-2">
                          {g.items.map((f) => (
                            <li key={f.slug}>
                              <Link href={`/frameworks/${f.slug}`} className="text-[0.88rem] font-medium text-ink/75 transition-colors hover:text-brand">
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
                <ul className="grid grid-cols-5 gap-3">
                  {services.map((s, i) => (
                    <li key={s.id}>
                      <Link href={`/services/${s.id}`} className="group block h-full rounded-[22px] bg-ivory p-5 transition-colors duration-500 hover:bg-brand hover:text-white">
                        <span className="grid size-9 place-items-center rounded-full bg-white text-xs font-bold text-brand">0{i + 1}</span>
                        <span className="mt-8 block text-[1.05rem] font-semibold leading-tight tracking-[-0.02em]">{s.title}</span>
                        <span className="mt-2 line-clamp-3 block text-sm text-muted transition-colors group-hover:text-white/75">{s.body}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ivory transition-[opacity,visibility] duration-500 lg:hidden ${mobile ? "visible opacity-100" : "invisible opacity-0"}`}
        aria-hidden={!mobile}
      >
        <nav aria-label="Mobile" className="mt-24 flex flex-1 flex-col gap-2 px-3">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 text-[1.4rem] font-semibold tracking-[-0.03em]"
              style={{
                transition: "transform .7s var(--ease-out), opacity .7s var(--ease-out)",
                transitionDelay: mobile ? `${0.05 + i * 0.05}s` : "0s",
                transform: mobile ? "none" : "translateY(24px)",
                opacity: mobile ? 1 : 0,
              }}
            >
              {l.label}
              <span className="grid size-9 place-items-center rounded-full bg-ivory text-sm text-brand" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-8 pt-4">
          <Link href="#book" onClick={() => setMobile(false)} className="flex h-14 items-center justify-center rounded-full bg-brand text-base font-semibold text-white">
            Book a call
          </Link>
        </div>
      </div>
    </>
  );
}
