"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { controlDomains, frameworkGroups, overlapFrameworks, type DomainId } from "@/lib/content";

/**
 * Coverage matrix: every framework (column) against every control domain
 * (row). Cells a framework covers are lit; an orange wave travels through
 * them. `collapse` (0..1) slides every column into the centre, showing the
 * union: one control set.
 *
 * Mapping for the eight frameworks in `overlapFrameworks` is the same
 * illustrative mapping used by the overlap calculator; the rest derive from
 * their group's typical scope.
 */

const groupScope: Record<string, DomainId[]> = {
  assurance: ["gov", "risk", "access", "asset", "crypto", "ops", "change", "sdlc", "vendor", "ir", "bcdr", "hr", "physical"],
  government: ["gov", "risk", "access", "asset", "crypto", "ops", "change", "vendor", "ir", "hr", "physical", "cui"],
  privacy: ["gov", "risk", "access", "crypto", "vendor", "ir", "privacy", "asset"],
  financial: ["gov", "risk", "access", "crypto", "ops", "change", "vendor", "ir", "bcdr", "cardholder"],
  management: ["gov", "risk", "asset", "ops", "bcdr", "hr", "vendor"],
};

const columns = frameworkGroups.flatMap((g) =>
  g.items.map((f) => {
    const known = overlapFrameworks.find((o) => o.name === f.name);
    return { name: f.name, domains: new Set<DomainId>(known ? known.domains : groupScope[g.id]) };
  }),
);

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function CoverageMatrix({
  collapse,
  className,
  onHover,
}: {
  collapse: MutableRefObject<number>;
  className?: string;
  onHover?: (label: string | null) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COLS = columns.length;
    const ROWS = controlDomains.length;
    let w = 0, h = 0, cell = 0, gap = 0, ox = 0, oy = 0;
    let raf = 0;
    let visible = true;
    const hover = { col: -1, row: -1 };
    let colors = { ink: "#ecebe6", brand: "#ff5b2e", muted: "#5c5b57" };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pitch = Math.min(w / COLS, h / ROWS);
      gap = Math.max(1.5, pitch * 0.22);
      cell = pitch - gap;
      ox = (w - pitch * COLS + gap) / 2;
      oy = (h - pitch * ROWS + gap) / 2;
      colors = { ink: cssVar("--ink") || colors.ink, brand: cssVar("--brand") || colors.brand, muted: cssVar("--muted-dark") || colors.muted };
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const time = reduce ? 0 : t / 1000;
      const k = collapse.current;
      const e = k * k * (3 - 2 * k);
      const pitch = cell + gap;
      ctx.clearRect(0, 0, w, h);

      const center = ox + ((COLS - 1) / 2) * pitch;
      // Draw right-to-left so column 0 (which shows the union) ends up on top.
      for (let i = COLS - 1; i >= 0; i--) {
        const col = columns[i];
        // Collapse: every column slides into the centre.
        const x = ox + i * pitch + (center - (ox + i * pitch)) * e;
        const colFade = i === 0 ? 1 : 1 - e * 0.9;
        for (let j = 0; j < ROWS; j++) {
          const on = col.domains.has(controlDomains[j].id);
          const y = oy + j * pitch;
          const wave = Math.max(0, Math.sin(i * 0.42 + j * 0.3 - time * 2.2));
          const pulse = on ? Math.pow(wave, 6) : 0;
          const hl = hover.col === i || hover.row === j;

          let alpha: number;
          let color = colors.ink;
          if (on) {
            alpha = (0.55 + (hl ? 0.35 : 0)) * colFade;
            if (pulse > 0.2 || (hover.col === i && hover.row === j)) color = colors.brand;
          } else {
            color = colors.muted;
            alpha = (hl ? 0.55 : 0.35) * colFade;
          }
          // In the collapsed state the surviving column shows the union in orange.
          if (i === 0 && e > 0.02) {
            const covered = columns.some((cc) => cc.domains.has(controlDomains[j].id));
            if (covered) {
              color = colors.brand;
              alpha = Math.max(alpha, e);
            }
          }
          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          const s = on ? cell : cell * 0.34;
          const d = (cell - s) / 2;
          ctx.fillRect(x + d, y + d, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const move = (ev: PointerEvent) => {
      if (collapse.current > 0.05) return;
      const r = c.getBoundingClientRect();
      const pitch = cell + gap;
      const col = Math.floor((ev.clientX - r.left - ox) / pitch);
      const row = Math.floor((ev.clientY - r.top - oy) / pitch);
      if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        hover.col = col;
        hover.row = row;
        const on = columns[col].domains.has(controlDomains[row].id);
        onHover?.(`${columns[col].name} × ${controlDomains[row].name}${on ? "" : " (not in scope)"}`);
      } else leave();
    };
    const leave = () => {
      hover.col = hover.row = -1;
      onHover?.(null);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(c);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
    };
  }, [collapse, onHover]);

  return <canvas ref={ref} className={className} role="img" aria-label="Coverage matrix of 29 frameworks against 16 control domains" />;
}

export const matrixStats = {
  frameworks: columns.length,
  domains: controlDomains.length,
  controls: controlDomains.reduce((n, d) => n + d.weight, 0),
};
