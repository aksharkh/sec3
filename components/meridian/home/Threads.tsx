"use client";

import { useEffect, useRef, useState } from "react";
import { frameworkGroups } from "@/lib/content";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";

const W = 1600;
const H = 500;
const X0 = 186; // where threads begin, right of the labels
const XK = 1060; // where they are tied into one strand
const YC = H / 2;

const names = frameworkGroups.flatMap((g) => g.items.map((f) => f.name));
const N = names.length;

const threads = names.map((name, i) => {
  const y = 26 + (i * (H - 52)) / (N - 1);
  const off = (i - (N - 1) / 2) * 0.55;
  return {
    name,
    y,
    d: `M${X0} ${y.toFixed(1)} C${X0 + 430} ${y.toFixed(1)} ${XK - 360} ${(YC + off).toFixed(1)} ${XK} ${(YC + off).toFixed(1)} L${W} ${(YC + off).toFixed(1)}`,
  };
});

// A handful of threads carry a travelling pulse, "evidence" moving through.
const PULSES = [2, 7, 11, 16, 21, 26];

/**
 * Hero figure: every framework is a thread. They leave their labels, bend
 * toward each other and are tied into a single strand: one control set.
 */
export function Threads({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const [hi, setHi] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".thr-line", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".thr-label, .thr-knot, .thr-note, .thr-pulse", { autoAlpha: 0 });
      gsap.set(".thr-strand", { scaleX: 0, transformOrigin: "0% 50%" });
    }, el);
    const cancel = onSiteReady(() => {
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.6 })
          .to(".thr-label", { autoAlpha: 1, duration: 0.8, stagger: 0.018, ease: "power2.out" }, 0)
          .to(".thr-line", { strokeDashoffset: 0, duration: 2.2, stagger: { each: 0.025, from: "edges" }, ease: "power3.inOut" }, 0.1)
          .to(".thr-knot", { autoAlpha: 1, duration: 0.6 }, 1.9)
          .to(".thr-strand", { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 1.9)
          .to(".thr-note", { autoAlpha: 1, duration: 0.8, stagger: 0.15 }, 2.2)
          .to(".thr-pulse", { autoAlpha: 1, duration: 1 }, 2.6);
      });
    });
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${N} compliance frameworks converging into one control set`}
      onMouseLeave={() => setHi(null)}
    >
      <defs>
        <linearGradient id="thr-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--ink)" stopOpacity="0.2" />
          <stop offset="0.62" stopColor="var(--ink)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--ink)" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {threads.map((t, i) => (
        <g key={t.name} onMouseEnter={() => setHi(i)} className="cursor-default">
          <text
            x={X0 - 14}
            y={t.y}
            dy="0.34em"
            textAnchor="end"
            className="thr-label hidden md:block"
            style={{
              font: "400 11.5px var(--font-geist), sans-serif",
              fill: hi === i ? "var(--brand)" : "var(--muted)",
              transition: "fill .3s",
            }}
          >
            {t.name}
          </text>
          {/* Wide invisible hit area for hover. */}
          <path d={t.d} stroke="transparent" strokeWidth={14} fill="none" />
          <path
            d={t.d}
            pathLength={1}
            className="thr-line"
            fill="none"
            stroke={hi === i ? "var(--brand)" : "url(#thr-fade)"}
            strokeWidth={hi === i ? 1.6 : 0.9}
            style={{ transition: "stroke-width .3s" }}
          />
        </g>
      ))}

      {PULSES.map((i, n) => (
        <path
          key={i}
          d={threads[i].d}
          pathLength={1600}
          className="thr-pulse thread-pulse pointer-events-none"
          fill="none"
          stroke="var(--brand)"
          strokeWidth={1.6}
          strokeLinecap="round"
          style={{ animationDelay: `${-n * 1.1}s` }}
        />
      ))}

      {/* The tied strand */}
      <rect className="thr-strand pointer-events-none" x={XK} y={YC - 9} width={W - XK} height={18} fill="var(--brand)" opacity="0.07" />
      <line className="thr-strand pointer-events-none" x1={XK} x2={W} y1={YC} y2={YC} stroke="var(--brand)" strokeWidth={2} />

      <g className="thr-knot pointer-events-none">
        <circle cx={XK} cy={YC} r={16} fill="var(--brand)" opacity="0.1" style={{ transformOrigin: `${XK}px ${YC}px`, animation: "breathe 3.2s ease-in-out infinite" }} />
        <circle cx={XK} cy={YC} r={6} fill="var(--ivory)" stroke="var(--brand)" strokeWidth={2} />
      </g>

      <g className="thr-note pointer-events-none" style={{ font: "500 11px var(--font-geist), sans-serif", letterSpacing: "0.14em" }}>
        <line x1={XK} x2={XK} y1={YC - 30} y2={YC - 86} stroke="var(--line)" />
        <text x={XK + 12} y={YC - 76} fill="var(--muted)">
          ONE CONTROL SET
        </text>
      </g>
      <g className="thr-note pointer-events-none" style={{ font: "500 11px var(--font-geist), sans-serif", letterSpacing: "0.14em" }}>
        <text x={W - 8} y={YC + 40} textAnchor="end" fill="var(--muted)">
          TESTED ONCE · REPORTED TO MANY
        </text>
      </g>
    </svg>
  );
}
