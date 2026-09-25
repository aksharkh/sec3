"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { frameworkGroups, frameworkCount, services } from "@/lib/content";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";
import { Arrow, Button } from "@/components/ui/Button";

type MenuKey = "frameworks" | "services" | null;

const links = [
  { label: "Frameworks", href: "/frameworks", menu: "frameworks" as const },
  { label: "Services", href: "/services", menu: "services" as const },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Intro
  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { yPercent: -120 });
    return onSiteReady(() => gsap.to(el, { yPercent: 0, duration: 1.4, delay: 0.5 }));
  }, []);

  // Hide on scroll down, show on scroll up; adapt to dark sections.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
      const probe = 44;
      const darkHit = Array.from(document.querySelectorAll<HTMLElement>("[data-theme='dark']")).some((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setDark(darkHit);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [mobileOpen]);

  const open = (k: MenuKey) => {
    clearTimeout(closeTimer.current);
    setMenu(k);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 160);
  };

  const onDark = dark && !menu;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-out-expo ${
          hidden && !menu && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        }`}
        onMouseLeave={scheduleClose}
      >
        <div ref={bar} className="container-x flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="SecureKnots home"
            className={`relative z-10 transition-colors duration-500 ${onDark || mobileOpen ? "text-ivory" : "text-ink"}`}
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl transition-colors duration-500 lg:flex ${
              onDark
                ? "border-ivory/10 bg-ink-2/60 text-ivory"
                : scrolled || menu
                  ? "border-ink/8 bg-ivory/75 text-ink"
                  : "border-transparent bg-transparent text-ink"
            }`}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => (l.menu ? open(l.menu) : scheduleClose())}
                onFocus={() => l.menu && open(l.menu)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] transition-colors duration-300 ${
                  menu && menu === l.menu
                    ? "bg-ink text-ivory"
                    : onDark
                      ? "hover:bg-ivory/10"
                      : "hover:bg-ink/5"
                }`}
              >
                {l.label}
                {l.menu && (
                  <svg viewBox="0 0 10 10" className={`size-2 transition-transform duration-500 ${menu === l.menu ? "rotate-180" : ""}`}>
                    <path d="M1 3l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.4" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              data-cursor="hide"
              className={`group hidden h-11 items-center gap-2 rounded-full px-5 text-[0.9rem] font-medium transition-colors duration-500 md:inline-flex ${
                onDark ? "bg-lime text-ink" : "bg-ink text-ivory"
              }`}
            >
              Book an assessment
              <Arrow className="size-3 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={`relative z-10 grid size-11 place-items-center rounded-full lg:hidden ${
                mobileOpen ? "bg-lime text-ink" : onDark ? "bg-ivory text-ink" : "bg-ink text-ivory"
              }`}
            >
              <span className="relative block h-2.5 w-4">
                <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${mobileOpen ? "top-1 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${mobileOpen ? "top-1 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <div
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          className={`absolute inset-x-0 top-0 -z-10 hidden overflow-hidden bg-ivory shadow-[0_40px_80px_-40px_rgb(11_15_14/0.25)] transition-[clip-path] duration-700 ease-out-expo lg:block ${
            menu ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
          }`}
          aria-hidden={!menu}
        >
          <div className="container-x pb-12 pt-28">
            {menu === "frameworks" && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3 flex flex-col justify-between rounded-3xl bg-knot p-7 text-ivory">
                  <div>
                    <p className="eyebrow text-lime">{frameworkCount} frameworks</p>
                    <p className="mt-4 text-3xl leading-[1.05] tracking-[-0.03em]">
                      Assess once. <span className="serif">Comply to many.</span>
                    </p>
                  </div>
                  <Link href="/frameworks" className="link-sweep mt-10 inline-flex w-fit items-center gap-2 text-sm">
                    Explore all frameworks <Arrow className="size-3" />
                  </Link>
                </div>
                <div className="col-span-9 grid grid-cols-5 gap-6">
                  {frameworkGroups.map((g) => (
                    <div key={g.id}>
                      <p className="eyebrow border-b border-line pb-3 text-muted">{g.name}</p>
                      <ul className="mt-4 space-y-2.5">
                        {g.items.map((f) => (
                          <li key={f.slug}>
                            <Link href={`/frameworks/${f.slug}`} className="link-sweep text-[0.95rem] text-ink/80 hover:text-ink">
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
              <div className="grid grid-cols-5 gap-4">
                {services.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    className="group flex min-h-56 flex-col justify-between rounded-3xl border border-line p-6 transition-colors duration-500 hover:bg-ink hover:text-ivory"
                  >
                    <span className="eyebrow text-muted group-hover:text-lime">
                      {String(i + 1).padStart(2, "0")} — {s.kicker}
                    </span>
                    <span>
                      <span className="block text-2xl leading-tight tracking-[-0.03em]">{s.title}</span>
                      <span className="mt-2 line-clamp-2 block text-sm text-muted group-hover:text-ivory/60">{s.body}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink text-ivory transition-[clip-path] duration-700 ease-out-expo lg:hidden ${
          mobileOpen ? "[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]" : "pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="container-x flex flex-1 flex-col justify-center gap-1 pt-20" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="display flex items-baseline gap-4 border-b border-line-dark py-3 text-[clamp(2.5rem,11vw,4.5rem)]"
              style={{
                transition: "transform 0.9s var(--ease-out), opacity 0.9s var(--ease-out)",
                transitionDelay: mobileOpen ? `${0.15 + i * 0.06}s` : "0s",
                transform: mobileOpen ? "none" : "translateY(40px)",
                opacity: mobileOpen ? 1 : 0,
              }}
            >
              <span className="eyebrow text-lime">0{i + 1}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="container-x flex flex-col gap-6 pb-10">
          <Button href="/contact" variant="lime" magnetic={false}>
            Book an assessment
          </Button>
          <a href="mailto:contact@secureknots.com" className="eyebrow text-ivory/60">
            contact@secureknots.com
          </a>
        </div>
      </div>
    </>
  );
}
