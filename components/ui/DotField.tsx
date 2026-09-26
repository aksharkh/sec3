"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive dot matrix: a slow ambient wave ripples through the grid and
 * dots are displaced away from the cursor, then spring back.
 */
export function DotField({ className, color = "--brand" }: { className?: string; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 26;
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, visible = false;
    const mouse = { x: -9999, y: -9999 };
    let off: { dx: number; dy: number }[] = [];

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      off = Array.from({ length: cols * rows }, () => ({ dx: 0, dy: 0 }));
    };
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const leave = () => {
      mouse.x = mouse.y = -9999;
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const col = getComputedStyle(document.documentElement).getPropertyValue(color).trim() || "#0b2a5b";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = col;
      const time = t / 1000;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const o = off[j * cols + i];
          const x = i * GAP, y = j * GAP;
          const ddx = x - mouse.x, ddy = y - mouse.y;
          const d = Math.hypot(ddx, ddy);
          const R = 140;
          const push = d < R ? (1 - d / R) ** 2 * 26 : 0;
          const tx = d ? (ddx / d) * push : 0;
          const ty = d ? (ddy / d) * push : 0;
          o.dx += (tx - o.dx) * 0.12;
          o.dy += (ty - o.dy) * 0.12;
          const wave = reduce ? 0 : Math.sin(i * 0.28 + j * 0.18 - time * 1.4) * 0.5 + 0.5;
          const near = d < R ? 1 - d / R : 0;
          const size = 0.7 + wave * 0.9 + near * 2.2;
          ctx.globalAlpha = 0.12 + wave * 0.18 + near * 0.6;
          ctx.beginPath();
          ctx.arc(x + o.dx, y + o.dy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
    };
  }, [color]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none size-full ${className ?? ""}`} />;
}
