"use client";

import { useEffect, useRef } from "react";

/** A soft "thread" that trails the pointer — a rope of points eased toward the cursor. */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    const N = 26;
    const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
    const mouse = { x: -100, y: -100 };
    let idle = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      idle = 0;
    };
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7fb2ff";

    const draw = () => {
      raf = requestAnimationFrame(draw);
      idle++;
      pts[0].x += (mouse.x - pts[0].x) * 0.45;
      pts[0].y += (mouse.y - pts[0].y) * 0.45;
      for (let i = 1; i < N; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
      }
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (idle > 90) return;
      ctx.lineCap = "round";
      ctx.strokeStyle = accent();
      for (let i = 1; i < N - 1; i++) {
        const t = 1 - i / N;
        ctx.globalAlpha = t * 0.7;
        ctx.lineWidth = t * 3.2;
        ctx.beginPath();
        ctx.moveTo((pts[i - 1].x + pts[i].x) / 2, (pts[i - 1].y + pts[i].y) / 2);
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[99] size-full" />;
}
