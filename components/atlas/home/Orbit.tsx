import { frameworkGroups } from "@/lib/content";

const C = 300;
const RINGS = frameworkGroups.map((g, i) => ({
  id: g.id,
  r: 112 + i * 38,
  n: g.items.length,
  dur: 70 + i * 22,
  dir: i % 2 ? "orbit-ccw" : "orbit-cw",
  phase: i * 0.7,
}));
// How far each ring sits off-centre while the programs are still separate.
const DRIFT = [
  [-26, 14],
  [30, -20],
  [-18, -30],
  [24, 26],
  [-32, 4],
];
const OUTER = 286;

function wedge(i: number, n: number) {
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
  const p = (a: number, r: number) => `${(C + r * Math.cos(a)).toFixed(1)} ${(C + r * Math.sin(a)).toFixed(1)}`;
  return `M${p(a0, 78)}L${p(a0, OUTER)}A${OUTER} ${OUTER} 0 0 1 ${p(a1, OUTER)}L${p(a1, 78)}A78 78 0 0 0 ${p(a0, 78)}Z`;
}

export type OrbitState = {
  /** 0 intro · 1 problem · 2 services · 3 process · 4 frameworks · 5 numbers */
  chapter: number;
  service: number;
  step: number;
  group: number;
};

/**
 * The control map. Five rings, one per framework family, each carrying a dot
 * per framework. While the programs are separate the rings sit off-centre and
 * drift; once unified they lock concentric around a single core. Later
 * chapters light a service sector, fill a progress arc, or pick out a ring.
 */
export function Orbit({ chapter, service, step, group, className }: OrbitState & { className?: string }) {
  const tangled = chapter <= 1;
  const spread = chapter === 1 ? 1.5 : 1;

  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Framework families arranged as concentric rings around one control set">
      {/* guide cross */}
      <g stroke="rgb(255 255 255 / 0.08)">
        <line x1="0" y1={C} x2="600" y2={C} />
        <line x1={C} y1="0" x2={C} y2="600" />
      </g>

      {/* service sectors */}
      <g style={{ opacity: chapter === 2 ? 1 : 0, transition: "opacity .8s" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={wedge(i, 5)}
            fill={i === service ? "rgb(127 176 255 / 0.22)" : "transparent"}
            stroke="rgb(255 255 255 / 0.14)"
            style={{ transition: "fill .6s" }}
          />
        ))}
      </g>

      {/* rings */}
      {RINGS.map((ring, i) => {
        const on = chapter === 4 && group === i;
        const dim = chapter === 4 && group !== i;
        const [dx, dy] = DRIFT[i];
        return (
          <g
            key={ring.id}
            style={{
              transform: tangled ? `translate(${dx * spread}px, ${dy * spread}px)` : "translate(0px, 0px)",
              transition: "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity .8s",
              opacity: dim ? 0.28 : 1,
            }}
          >
            <g style={{ transformBox: "view-box", transformOrigin: `${C}px ${C}px`, animation: `${ring.dir} ${ring.dur}s linear infinite` }}>
              <circle
                cx={C}
                cy={C}
                r={ring.r}
                fill="none"
                stroke={on ? "var(--brand-3)" : "rgb(255 255 255 / 0.28)"}
                strokeWidth={on ? 1.8 : 1}
                strokeDasharray={tangled ? "2 7" : "none"}
                style={{ transition: "stroke .6s" }}
              />
              {Array.from({ length: ring.n }, (_, k) => {
                const a = (k / ring.n) * Math.PI * 2 + ring.phase;
                return (
                  <circle
                    key={k}
                    cx={(C + ring.r * Math.cos(a)).toFixed(1)}
                    cy={(C + ring.r * Math.sin(a)).toFixed(1)}
                    r={on ? 6 : 3.6}
                    fill={on ? "var(--brand-3)" : "#fff"}
                    style={{ transition: "r .6s, fill .6s" }}
                  />
                );
              })}
            </g>
          </g>
        );
      })}

      {/* process arc */}
      <circle
        cx={C}
        cy={C}
        r={OUTER + 8}
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={chapter === 3 ? 1 - (step + 1) / 5 : 1}
        transform={`rotate(-90 ${C} ${C})`}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />

      {/* core */}
      <circle cx={C} cy={C} r="70" fill="var(--brand)" />
      <circle cx={C} cy={C} r="78" fill="none" stroke="rgb(255 255 255 / 0.35)" />
    </svg>
  );
}
