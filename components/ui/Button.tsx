import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

// "ink" is the primary action: deep ink pill that warms to cobalt on hover.
const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-ink text-ivory hover:bg-brand", dot: "" },
  accent: { wrap: "bg-accent text-ink hover:bg-glow", dot: "" },
  ivory: { wrap: "bg-ink text-ivory hover:bg-brand", dot: "" },
  outline: { wrap: "border border-ink/15 text-ink hover:border-ink/60", dot: "" },
  "outline-light": { wrap: "border border-ivory/25 text-ivory hover:border-ivory/70", dot: "" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Meridian button: quiet pill with a sliding arrow. */
export function Button({
  href,
  children,
  variant = "ink",
  className,
  magnetic = false,
  book,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  /** Opens the booking modal pre-selecting this framework. */
  book?: string;
}) {
  const s = styles[variant];
  const inner = (
    <Link
      href={book ? "#book" : href}
      data-book={book}
      data-cursor="hide"
      className={`group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-6 pr-5 text-[0.92rem] font-medium tracking-[-0.005em] transition-[background-color,border-color,color] duration-500 ease-out-expo active:scale-[0.98] ${s.wrap} ${className ?? ""}`}
    >
      <span className="relative">{children}</span>
      <span className="relative block size-3.5 overflow-hidden">
        <svg viewBox="0 0 16 16" fill="none" className="absolute inset-0 size-3.5 transition-transform duration-700 ease-out-expo group-hover:translate-x-5" aria-hidden>
          <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg viewBox="0 0 16 16" fill="none" className="absolute inset-0 size-3.5 -translate-x-5 transition-transform duration-700 ease-out-expo group-hover:translate-x-0" aria-hidden>
          <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.12}>{inner}</Magnetic> : inner;
}
