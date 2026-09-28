/**
 * Deterministic generative artwork. Each seed (a slug) produces a unique
 * Lissajous "knot" drawn as a bundle of parallel strands, the visual
 * language of the brand, used in place of stock imagery.
 */

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pairs = [
  [3, 2],
  [5, 4],
  [3, 4],
  [5, 2],
  [1, 2],
  [4, 3],
  [5, 6],
  [2, 3],
];

export function Glyph({
  seed,
  className,
  strands = 7,
  strokeWidth = 0.6,
  spread = 3.2,
}: {
  seed: string;
  className?: string;
  strands?: number;
  strokeWidth?: number;
  spread?: number;
}) {
  const r = rng(hash(seed));
  const [a, b] = pairs[Math.floor(r() * pairs.length)];
  const delta = r() * Math.PI;
  const steps = 360;
  const paths: string[] = [];

  for (let s = 0; s < strands; s++) {
    const off = (s - (strands - 1) / 2) * spread;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = Math.sin(a * t + delta);
      const y = Math.sin(b * t);
      // normal offset approximated by derivative rotation → parallel strands
      const dx = a * Math.cos(a * t + delta);
      const dy = b * Math.cos(b * t);
      const len = Math.hypot(dx, dy) || 1;
      const px = 100 + x * 78 + (-dy / len) * off;
      const py = 100 + y * 78 + (dx / len) * off;
      pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    paths.push(`M${pts.join("L")}`);
  }

  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.35 + 0.65 * (1 - Math.abs(i - (strands - 1) / 2) / strands)}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export const toneClasses = {
  brand: { bg: "bg-brand", fg: "text-ivory", art: "text-accent", sub: "text-ivory/60" },
  ink: { bg: "bg-ink", fg: "text-ivory", art: "text-brand-3", sub: "text-ivory/55" },
  accent: { bg: "bg-accent", fg: "text-ink", art: "text-brand", sub: "text-ink/60" },
  paper: { bg: "bg-bone", fg: "text-ink", art: "text-brand-2", sub: "text-ink/60" },
} as const;
