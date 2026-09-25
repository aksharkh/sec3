/** Trefoil knot mark — the simplest knot that can't be untied without cutting. */
function trefoilPath(size: number, pad: number) {
  const pts: string[] = [];
  const steps = 180;
  const s = (size - pad * 2) / 6;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = Math.sin(t) + 2 * Math.sin(2 * t);
    const y = Math.cos(t) - 2 * Math.cos(2 * t);
    pts.push(`${(size / 2 + x * s).toFixed(2)} ${(size / 2 + y * s * 0.98 + s * 0.35).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

export const TREFOIL_PATH = trefoilPath(48, 5);

export function KnotMark({
  className,
  strokeWidth = 4.2,
  pathClassName,
}: {
  className?: string;
  strokeWidth?: number;
  pathClassName?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path
        d={TREFOIL_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        className={pathClassName}
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <KnotMark className="size-7" />
      <span className="text-[1.15rem] font-semibold tracking-[-0.04em]">
        Secure<span className="serif font-normal tracking-[-0.02em]">Knots</span>
      </span>
    </span>
  );
}
