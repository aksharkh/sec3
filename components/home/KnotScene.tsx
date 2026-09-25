"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap, onSiteReady, prefersReducedMotion } from "@/lib/gsap";
import { KnotMark } from "@/components/ui/Logo";

/**
 * The SecureKnots hero: seven strands (frameworks) start as a loose tangle
 * and pull tight into a braided trefoil knot. Morphing happens on the GPU —
 * every strand has two tube geometries with identical topology (tangle + knot)
 * and the vertex shader mixes between them.
 */

const STRANDS = [
  { color: "#0e3b34", lime: false },
  { color: "#16574c", lime: false },
  { color: "#0b0f0e", lime: false },
  { color: "#d7ff3a", lime: true },
  { color: "#2c7a6b", lime: false },
  { color: "#0e3b34", lime: false },
  { color: "#1b2522", lime: false },
];

const SAMPLES = 420;
const TUBULAR = 720;
const RADIAL = 12;

class TrefoilCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private scale = 0.5) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const u = t * Math.PI * 2;
    return target
      .set(Math.sin(u) + 2 * Math.sin(2 * u), Math.cos(u) - 2 * Math.cos(2 * u), -Math.sin(3 * u) * 1.1)
      .multiplyScalar(this.scale);
  }
}

// Deterministic PRNG so the tangle looks the same on every load.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStrandCurves(index: number, count: number) {
  const center = new TrefoilCurve(0.5);
  const frames = center.computeFrenetFrames(SAMPLES, true);
  const phase = (index / count) * Math.PI * 2;
  const twist = 7;
  const r = 0.19;
  const rand = mulberry32(1337 + index * 97);

  const knotPts: THREE.Vector3[] = [];
  const tanglePts: THREE.Vector3[] = [];

  // Random low-frequency loops (integer frequencies keep the curve closed).
  const waves = [1, 2, 3].map((k) => ({
    k,
    amp: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(1.7 / k),
    phi: rand() * Math.PI * 2,
  }));
  const drift = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.8);

  for (let j = 0; j < SAMPLES; j++) {
    const t = j / SAMPLES;
    const c = center.getPoint(t);
    const a = phase + twist * Math.PI * 2 * t;
    const n = frames.normals[j];
    const b = frames.binormals[j];
    knotPts.push(
      c.clone()
        .addScaledVector(n, Math.cos(a) * r)
        .addScaledVector(b, Math.sin(a) * r),
    );

    const p = c.clone().multiplyScalar(0.55).add(drift);
    for (const w of waves) p.addScaledVector(w.amp, Math.sin(w.k * Math.PI * 2 * t + w.phi));
    tanglePts.push(p);
  }

  return {
    knot: new THREE.CatmullRomCurve3(knotPts, true, "centripetal"),
    tangle: new THREE.CatmullRomCurve3(tanglePts, true, "centripetal"),
  };
}

const vertexShader = /* glsl */ `
  attribute vec3 aTangle;
  attribute vec3 aTangleNormal;
  uniform float uProgress;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vProgress;

  void main() {
    float p = smoothstep(0.0, 1.0, uProgress);
    // subtle breathing while tangled
    vec3 tangle = aTangle + aTangleNormal * sin(uTime * 0.8 + uv.x * 18.0) * 0.03;
    vec3 pos = mix(tangle, position, p);
    vec3 nrm = normalize(mix(aTangleNormal, normal, p));
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * nrm);
    vView = -mv.xyz;
    vUv = uv;
    vProgress = p;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLime;
  uniform float uTime;
  uniform float uOffset;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vProgress;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    vec3 L = normalize(vec3(0.4, 0.8, 0.9));
    vec3 L2 = normalize(vec3(-0.8, -0.3, 0.4));

    float diff = max(dot(N, L), 0.0);
    float fill = max(dot(N, L2), 0.0) * 0.35;
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 60.0);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    vec3 base = uColor;
    vec3 col = base * (0.42 + diff * 0.75 + fill);
    col += spec * mix(0.55, 0.9, uLime);
    // warm ivory rim picks the strands off the paper background
    col = mix(col, vec3(0.96, 0.94, 0.88), fres * 0.35 * (1.0 - uLime));

    // light pulse travelling along each strand once the knot is tied
    float travel = fract(vUv.x * 2.0 - uTime * 0.08 + uOffset);
    float pulse = smoothstep(0.0, 0.02, travel) * (1.0 - smoothstep(0.02, 0.09, travel));
    col = mix(col, vec3(0.843, 1.0, 0.227), pulse * vProgress * (1.0 - uLime) * 0.9);
    col += pulse * uLime * 0.35;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

type Props = { className?: string };

export function KnotScene({ className }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL availability is only knowable client-side
      setFallback(true);
      return;
    }

    const reduce = prefersReducedMotion();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    // ShaderMaterial skips colour-space conversion, so colours stay in display (sRGB) space.
    THREE.ColorManagement.enabled = false;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const root = new THREE.Group();
    const knot = new THREE.Group();
    root.add(knot);
    scene.add(root);

    const materials: THREE.ShaderMaterial[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    STRANDS.forEach((s, i) => {
      const { knot: kc, tangle: tc } = buildStrandCurves(i, STRANDS.length);
      const radius = s.lime ? 0.062 : 0.056;
      const g = new THREE.TubeGeometry(kc, TUBULAR, radius, RADIAL, true);
      const gt = new THREE.TubeGeometry(tc, TUBULAR, radius, RADIAL, true);
      g.setAttribute("aTangle", gt.getAttribute("position"));
      g.setAttribute("aTangleNormal", gt.getAttribute("normal"));
      gt.dispose();
      geometries.push(g);

      const m = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uProgress: { value: reduce ? 1 : 0 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(s.color) },
          uLime: { value: s.lime ? 1 : 0 },
          uOffset: { value: i * 0.37 },
          uOpacity: { value: reduce ? 1 : 0 },
        },
      });
      materials.push(m);
      knot.add(new THREE.Mesh(g, m));
    });

    // Layout: fit the knot to the visible frustum. Right-aligned on desktop,
    // centred and raised on mobile.
    const target = { x: 0, y: 0 };
    const desktop = () => host.clientWidth >= 1024;
    const layout = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const desktop = w >= 1024;
      const s = desktop ? Math.min((visH * 0.6) / 3.4, (visW * 0.38) / 3.4) : Math.min((visH * 0.9) / 3.4, (visW * 0.8) / 3.4);
      root.scale.setScalar(s);
      target.x = desktop ? visW * 0.24 : 0;
      target.y = desktop ? visH * 0.09 : 0;
      root.position.x = target.x;
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(host);

    // Pointer parallax
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    // Intro: fade in the tangle, then pull the knot tight strand by strand.
    let cancelReady = () => {};
    if (!reduce) {
      materials.forEach((m, i) => gsap.to(m.uniforms.uOpacity, { value: 1, duration: 1.2, delay: 0.1 + i * 0.05 }));
      cancelReady = onSiteReady(() => {
        materials.forEach((m, i) =>
          gsap.to(m.uniforms.uProgress, { value: 1, duration: 3.2, delay: 0.25 + i * 0.12, ease: "expo.inOut" }),
        );
        gsap.fromTo(knot.rotation, { z: -1.2 }, { z: 0, duration: 3.6, delay: 0.2, ease: "expo.inOut" });
      });
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      if (!reduce) {
        knot.rotation.y = t * 0.12 + scroll * 1.4;
        knot.rotation.x = Math.sin(t * 0.2) * 0.08 + pointer.y * 0.25 + scroll * 0.3;
        root.rotation.y = pointer.x * 0.3;
        root.position.y += (target.y + scroll * (desktop() ? 1.2 : 0.4) - root.position.y) * 0.1;
      }
      materials.forEach((m) => (m.uniforms.uTime.value = t));
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      cancelReady();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      materials.forEach((m) => {
        gsap.killTweensOf(m.uniforms.uProgress);
        gsap.killTweensOf(m.uniforms.uOpacity);
        m.dispose();
      });
      geometries.forEach((g) => g.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mount} className={className} aria-hidden>
      {fallback && (
        <div className="grid h-full w-full place-items-center lg:justify-end lg:pr-[12vw]">
          <KnotMark className="w-[60vmin] text-knot" strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}
