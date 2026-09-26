"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, markSiteBusy, markSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

/**
 * Curtain page transitions. Internal link clicks are intercepted: the curtain
 * rises to cover the screen, the route changes, then it continues up and away
 * to reveal the new page, whose hero animations wait for the "ready" signal.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page / hash links
      e.preventDefault();

      if (prefersReducedMotion() || pending.current) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      pending.current = true;
      markSiteBusy();
      window.__lenis?.stop();
      const el = curtain.current!;
      if (label.current) label.current.textContent = a.dataset.label || prettify(url.pathname);
      gsap.set(el, { visibility: "visible", yPercent: 100 });
      gsap.set(".pt-inner", { yPercent: 30, autoAlpha: 0 });
      gsap
        .timeline()
        .to(el, { yPercent: 0, duration: 0.75, ease: "expo.inOut" })
        .to(".pt-inner", { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, "-=0.25")
        .add(() => router.push(url.pathname + url.search + url.hash));
    };
    // Capture phase: runs before next/link's handler, which then sees
    // defaultPrevented and leaves navigation to us.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New route rendered → reset scroll, refresh triggers, lift the curtain.
  useEffect(() => {
    // Only react to real route changes (effects may run twice in development).
    if (lastPath.current === null || lastPath.current === pathname) {
      lastPath.current = pathname;
      return;
    }
    lastPath.current = pathname;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const el = curtain.current!;
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!pending.current) {
        markSiteReady();
        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
            pending.current = false;
          },
        })
        .to(".pt-inner", { yPercent: -30, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 0.2)
        .add(() => {
          window.__lenis?.start();
          markSiteReady();
        }, 0.55);
    });
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden
      className="invisible fixed inset-0 z-[95] flex items-center justify-center overflow-hidden rounded-none bg-brand text-ivory"
    >
      <div className="pt-inner flex flex-col items-center gap-5">
        <KnotMark className="size-14 animate-[spin_3s_linear_infinite] text-accent" strokeWidth={2.4} />
        <span ref={label} className="display text-[clamp(2.4rem,6vw,5rem)]" />
      </div>
    </div>
  );
}

function prettify(path: string) {
  const seg = path.split("/").filter(Boolean);
  if (!seg.length) return "Home";
  const last = seg[seg.length - 1].replace(/-/g, " ");
  return last.length <= 4 ? last.toUpperCase() : last.replace(/\b\w/g, (c) => c.toUpperCase());
}
