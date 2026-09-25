"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, onSiteReady, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "scroll" animates when scrolled into view; "load" waits for the preloader. */
  trigger?: "scroll" | "load";
  stagger?: number;
};

/** Masked line-by-line text reveal. */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  trigger = "scroll",
  stagger = 0.09,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.visibility = "visible";
      return;
    }

    let split: SplitText | undefined;
    let cancelReady = () => {};
    let played = false;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          // On re-split (resize / font load) after playing, don't replay.
          if (played) return;
          const tween = gsap.from(self.lines, {
            yPercent: 110,
            rotate: 2.5,
            transformOrigin: "0% 0%",
            duration: 1.3,
            stagger,
            delay,
            paused: true,
            onStart: () => {
              played = true;
            },
          });
          if (trigger === "load") {
            cancelReady = onSiteReady(() => tween.play());
          } else {
            gsap.to({}, {
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
                onEnter: () => {
                  tween.play();
                },
              },
            });
          }
          return tween;
        },
      });
    }, el);

    return () => {
      cancelReady();
      split?.revert();
      ctx.revert();
    };
  }, [delay, trigger, stagger]);

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}

/** Simple fade + rise for non-text blocks. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 40,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        autoAlpha: 0,
        duration: 1.4,
        delay,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
