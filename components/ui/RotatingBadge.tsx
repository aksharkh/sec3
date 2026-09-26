import { KnotMark } from "./Logo";

/** Circular rotating text badge. */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`relative grid size-28 place-items-center ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_14s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current font-mono text-[8.4px] uppercase tracking-[0.18em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <KnotMark className="size-8 text-brand" strokeWidth={3.5} />
    </span>
  );
}
