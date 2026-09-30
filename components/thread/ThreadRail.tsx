"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact, frameworkGroups, navLinks, services } from "@/lib/content";
import { openSearch } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <span className="grid size-9 place-items-center bg-brand text-white">
        <KnotMark className="size-5" strokeWidth={4.4} />
      </span>
      <span className="text-[1.15rem] font-semibold tracking-[-0.04em]">SecureKnots</span>
    </span>
  );
}

const links = [...navLinks.map((l) => ({ label: l.label, href: l.href })), { label: "Contact", href: "/contact" }];

function sectionName(path: string) {
  if (path === "/") return "Index";
  const seg = path.split("/").filter(Boolean)[0];
  return seg.replace(/-/g, " ");
}

/**
 * Thread navigation: a fixed vertical rail on the left edge (a top bar on
 * small screens) and a full-screen cobalt index that wipes in from it.
 */
export function ThreadRail() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the index on navigation
    setOpen(false);
  }, [pathname]);

  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current && !open) return;
    touched.current = true;
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const popular = frameworkGroups.flatMap((g) => g.items.slice(0, 2));
  const burger = (
    <span className="relative block h-2.5 w-6">
      <span className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-500 ease-out-expo ${open ? "top-1 rotate-45" : "top-0"}`} />
      <span className={`absolute left-0 h-[2px] bg-current transition-all duration-500 ease-out-expo ${open ? "top-1 w-6 -rotate-45" : "top-2 w-4"}`} />
    </span>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed left-0 top-0 z-50 hidden h-dvh w-[var(--rail)] flex-col border-r border-ink bg-ivory text-ink lg:flex">
        <Link href="/" aria-label="SecureKnots home" className="grid h-[76px] shrink-0 place-items-center bg-brand text-white transition-colors duration-500 hover:bg-ink">
          <KnotMark className="size-8" strokeWidth={3.6} />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close index" : "Open index"}
          className={`group flex h-40 shrink-0 flex-col items-center justify-between border-b border-ink py-6 transition-colors duration-500 ${open ? "bg-ink text-ivory" : "hover:bg-ink hover:text-ivory"}`}
        >
          {burger}
          <span className="vert eyebrow">{open ? "Close" : "Index"}</span>
        </button>
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <span className="vert eyebrow whitespace-nowrap text-muted">
            SecureKnots <span className="mx-2 text-brand">/</span> {sectionName(pathname)}
          </span>
        </div>
        <button type="button" onClick={openSearch} aria-label="Search (Ctrl K)" className="grid h-[76px] shrink-0 place-items-center border-t border-ink transition-colors duration-500 hover:bg-ink hover:text-ivory">
          <svg viewBox="0 0 20 20" className="size-5" fill="none">
            <rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13.5 13.5 5 5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
        <Link href="#book" className="flex h-44 shrink-0 items-center justify-center bg-ink text-ivory transition-colors duration-500 hover:bg-brand">
          <span className="vert text-[0.95rem] font-medium tracking-[-0.01em]">Book a call →</span>
        </Link>
      </aside>

      {/* Mobile bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-stretch justify-between border-b border-ink bg-ivory lg:hidden">
        <Link href="/" aria-label="SecureKnots home" className="flex items-center gap-3 pr-4">
          <span className="grid size-14 place-items-center bg-brand text-white">
            <KnotMark className="size-6" strokeWidth={4} />
          </span>
          <span className="text-[1.1rem] font-semibold tracking-[-0.04em]">SecureKnots</span>
        </Link>
        <div className="flex">
          <Link href="#book" className="hidden items-center border-l border-ink px-4 text-sm font-medium sm:flex">
            Book a call
          </Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close index" : "Open index"} className={`grid w-14 place-items-center border-l border-ink ${open ? "bg-ink text-ivory" : ""}`}>
            {burger}
          </button>
        </div>
      </header>

      {/* Full-screen index */}
      <div
        className="blueprint fixed bottom-0 left-0 right-0 top-14 z-40 overflow-y-auto bg-brand text-white transition-[clip-path,visibility] duration-[900ms] ease-in-out-quart lg:left-[var(--rail)] lg:top-0"
        style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", visibility: open ? "visible" : "hidden" }}
        aria-hidden={!open}
        data-lenis-prevent
      >
        <div className="grid min-h-full lg:grid-cols-12">
          <nav aria-label="Index" className="flex flex-col justify-center px-[var(--gutter)] py-10 lg:col-span-7 lg:py-16">
            <p className="eyebrow mb-6 text-white/60">Index</p>
            <ul className="group/list">
              {links.map((l, i) => {
                const on = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <li key={l.href} className="overflow-hidden border-t border-white/25 last:border-b">
                    <Link
                      href={l.href}
                      tabIndex={open ? 0 : -1}
                      className="group flex items-baseline gap-5 py-2 transition-[opacity,transform,padding] duration-500 ease-out-expo hover:!opacity-100 hover:pl-4 group-hover/list:opacity-45 lg:py-3"
                      style={{
                        transform: open ? "none" : "translateY(110%)",
                        transitionDelay: open ? `${0.25 + i * 0.05}s, ${0.25 + i * 0.05}s, 0s` : "0s",
                      }}
                    >
                      <span className="mono w-7 text-xs text-white/60">0{i + 1}</span>
                      <span className="wide text-[clamp(2.4rem,8.4vh,5.6rem)]">{l.label}</span>
                      {on && <span className="eyebrow ml-auto bg-white px-2 py-1 text-brand">You are here</span>}
                      <span className="ml-auto hidden text-2xl opacity-0 transition-opacity group-hover:opacity-100 lg:block" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col justify-between gap-10 border-t border-white/25 bg-ink px-[var(--gutter)] py-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:py-16">
            <div>
              <p className="eyebrow text-white/50">Services</p>
              <ul className="mt-4">
                {services.map((s, i) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.id}`} tabIndex={open ? 0 : -1} className="group flex items-center justify-between border-b border-white/15 py-3 text-[1.15rem] font-medium tracking-[-0.02em] transition-colors hover:text-brand-3">
                      <span>
                        <span className="mono mr-4 text-xs text-white/40">0{i + 1}</span>
                        {s.title}
                      </span>
                      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-10 text-white/50">Popular frameworks</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {popular.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/frameworks/${f.slug}`} tabIndex={open ? 0 : -1} className="mono block border border-white/30 px-3 py-1.5 text-xs transition-colors hover:bg-white hover:text-ink">
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <a href={`mailto:${contact.email}`} className="wide block text-[clamp(1.5rem,2.6vw,2.4rem)] hover:text-brand-3">
                {contact.email}
              </a>
              <p className="mono mt-4 text-xs text-white/55">
                US {contact.phoneUS} · IN {contact.phoneIN}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
