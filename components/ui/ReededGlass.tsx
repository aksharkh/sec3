"use client";

import { useEffect, useRef } from "react";

/**
 * Reeded ("fluted") glass: a soft light seen through vertical glass ribs.
 * Each rib acts as a thin cylindrical lens, displacing the light behind it,
 * with a bright lip and a shadowed trough.
 *
 * `ReededGlass` is a live WebGL shader (drifting light, pointer-reactive).
 * `ReededGlassStatic` is a CSS approximation for cards.
 */

type Tone = "dark" | "light";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uStripes;
uniform float uRefract;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
uniform vec2 uCenter;

float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}

vec3 field(vec2 p, float aspect){
  vec2 c = uCenter + vec2(0.05*sin(uTime*0.23), 0.04*cos(uTime*0.19)) + uMouse*vec2(0.06,0.05);
  vec2 d = p - c; d.x *= aspect;
  float r = length(d);
  vec2 c2p = c + vec2(0.18*cos(uTime*0.13), -0.22 + 0.05*sin(uTime*0.17));
  vec2 e = p - c2p; e.x *= aspect;
  float r2 = length(e);
  vec3 col = c0;
  col = mix(col, c1, (1.0 - smoothstep(0.12, 0.85, r)) * 0.8);
  col = mix(col, c2, (1.0 - smoothstep(0.05, 0.55, r)) * 0.8);
  col = mix(col, c3, (1.0 - smoothstep(0.0, 0.4, r)) * 0.95);
  col = mix(col, c1, (1.0 - smoothstep(0.0, 0.5, r2)) * 0.35);
  return col;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float f = fract(uv.x * uStripes);
  float lens = f - 0.5;
  float k = uRefract * (0.55 + uv.x * 0.9);
  vec2 p = uv;
  p.x += lens * k;
  p.y += lens * lens * k * 0.35;
  vec3 col = field(p, aspect);

  float lip = 1.0 - smoothstep(0.0, 0.07, f);
  float trough = smoothstep(0.55, 1.0, f);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col *= 1.0 - trough * (0.55 + 0.3 * uv.x);
  col += lip * (0.10 + lum * 0.35);

  float vig = (1.0 - smoothstep(0.35, 1.25, length((uv - 0.5) * vec2(1.0, 1.15))));
  col *= mix(0.35, 1.0, vig);

  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.045;
  gl_FragColor = vec4(col, 1.0);
}`;

function hexToRgb(v: string): [number, number, number] {
  let h = v.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return [0.5, 0.5, 0.5];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function tokens(tone: Tone) {
  const cs = getComputedStyle(document.documentElement);
  const g = (n: string) => hexToRgb(cs.getPropertyValue(n) || "#000");
  return tone === "dark"
    ? [g("--ink"), g("--brand-2"), g("--brand-3"), g("--glow")]
    : [g("--paper"), g("--accent"), g("--brand-3"), g("--glow")];
}

export function ReededGlass({
  className,
  tone = "dark",
  stripes = 26,
  refract = 0.14,
  cx = 0.42,
  cy = 0.52,
  children,
}: {
  className?: string;
  tone?: Tone;
  stripes?: number;
  refract?: number;
  cx?: number;
  cy?: number;
  children?: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const el = host.current;
    if (!c || !el) return;
    const gl = c.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return; // CSS gradient fallback stays visible

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const setColors = () => {
      const [a, b, cc, d] = tokens(tone);
      gl.uniform3fv(u("c0"), a);
      gl.uniform3fv(u("c1"), b);
      gl.uniform3fv(u("c2"), cc);
      gl.uniform3fv(u("c3"), d);
    };
    gl.uniform1f(u("uStripes"), stripes);
    gl.uniform1f(u("uRefract"), refract);
    gl.uniform2f(u("uCenter"), cx, cy);
    setColors();

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let visible = true;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      c.width = Math.max(1, Math.round(el.clientWidth * dpr));
      c.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
    };
    const frame = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) frame();
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    resize();
    if (reduce) frame();
    else loop();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const mo = new MutationObserver(() => {
      setColors();
      if (reduce) frame();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    addEventListener("pointermove", onMove);
    c.style.opacity = "1";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      removeEventListener("pointermove", onMove);
      // No loseContext(): effects may re-run on the same canvas (dev Strict
      // Mode), and a lost context can't be revived. The GC frees it on unmount.
    };
  }, [tone, stripes, refract, cx, cy]);

  return (
    <div
      ref={host}
      className={`isolate overflow-hidden ${className ?? "relative"}`}
      style={{
        background:
          tone === "dark"
            ? "radial-gradient(60% 55% at 42% 52%, var(--glow) 0%, var(--brand-3) 28%, var(--brand-2) 55%, var(--ink) 85%)"
            : "radial-gradient(60% 55% at 42% 52%, var(--glow) 0%, var(--brand-3) 30%, var(--accent) 55%, var(--paper) 85%)",
      }}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}

/** CSS-only reeded glass for cards: per-rib offset + lens scale over a radial light. */
export function ReededGlassStatic({
  className,
  stripes = 18,
  hue = 0,
  tone = "dark",
}: {
  className?: string;
  stripes?: number;
  /** Moves the light so each card looks different (0..1). */
  hue?: number;
  tone?: Tone;
}) {
  const cx = 30 + hue * 40;
  const cy = 38 + ((hue * 7) % 1) * 30;
  const light =
    tone === "dark"
      ? `radial-gradient(55% 50% at ${cx}% ${cy}%, var(--glow) 0%, var(--brand-3) 26%, var(--brand-2) 52%, var(--ink) 82%)`
      : `radial-gradient(55% 50% at ${cx}% ${cy}%, var(--glow) 0%, var(--accent) 30%, var(--brand-3) 60%, var(--brand) 95%)`;
  return (
    <div aria-hidden className={`flex overflow-hidden ${className ?? ""}`}>
      {Array.from({ length: stripes }, (_, i) => {
        const t = i / (stripes - 1);
        return (
          <div key={i} className="relative h-full flex-1 overflow-hidden">
            <div
              className="absolute inset-y-0"
              style={{
                width: `${stripes * 100}%`,
                left: `${-i * 100 + (t - 0.5) * 38}%`,
                background: light,
                transform: `scaleX(${1.04 + t * 0.06})`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, rgb(255 255 255 / ${(0.16 - t * 0.06).toFixed(3)}) 0%, transparent 10%, transparent 55%, rgb(0 0 0 / ${(0.22 + t * 0.28).toFixed(3)}) 100%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
