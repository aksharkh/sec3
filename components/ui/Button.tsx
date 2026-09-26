import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-ink text-ivory", dot: "bg-accent text-ink" },
  accent: { wrap: "bg-accent text-ink", dot: "bg-ink text-accent" },
  ivory: { wrap: "bg-ivory text-ink", dot: "bg-ink text-ivory" },
  outline: { wrap: "border border-ink/20 text-ink", dot: "bg-ink text-ivory" },
  "outline-light": { wrap: "border border-ivory/25 text-ivory", dot: "bg-ivory text-ink" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Pill button: rolling label + arrow chip that swaps on hover. */
export function Button({
  href,
  children,
  variant = "ink",
  className,
  magnetic = true,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
}) {
  const s = styles[variant];
  const inner = (
    <Link
      href={href}
      data-cursor="hide"
      className={`group relative inline-flex h-14 items-center gap-4 rounded-full pl-6 pr-2 text-[0.95rem] font-medium tracking-[-0.01em] transition-transform duration-500 ease-out-expo active:scale-[0.97] ${s.wrap} ${className ?? ""}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-700 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span className={`relative grid size-10 place-items-center overflow-hidden rounded-full ${s.dot}`}>
        <Arrow className="size-3.5 transition-transform duration-700 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
        <Arrow className="absolute size-3.5 -translate-x-6 translate-y-6 transition-transform duration-700 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.25}>{inner}</Magnetic> : inner;
}
