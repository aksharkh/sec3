import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

// "ink" is the primary action: electric blue pill with a white arrow chip.
const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-brand text-white shadow-[0_10px_24px_-10px_rgb(42_92_255/0.7)] hover:bg-brand-2", dot: "bg-white text-brand" },
  accent: { wrap: "bg-white text-ink hover:bg-glow", dot: "bg-brand text-white" },
  ivory: { wrap: "bg-ink text-white hover:bg-ink-3", dot: "bg-white/15 text-white" },
  outline: { wrap: "border border-line bg-paper text-ink hover:border-brand/40", dot: "bg-ivory text-ink" },
  "outline-light": { wrap: "border border-white/20 bg-white/5 text-white hover:bg-white/10", dot: "bg-white/15 text-white" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Halo button: soft pill with a round arrow chip. */
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
      className={`group relative inline-flex h-12 items-center gap-3 rounded-full pl-5 pr-1.5 text-[0.9rem] font-semibold tracking-[-0.01em] transition-[background-color,border-color,transform] duration-500 ease-out-expo active:scale-[0.97] ${s.wrap} ${className ?? ""}`}
    >
      <span>{children}</span>
      <span className={`relative grid size-9 place-items-center overflow-hidden rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-105 ${s.dot}`}>
        <svg viewBox="0 0 16 16" fill="none" className="absolute size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-6" aria-hidden>
          <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 16 16" fill="none" className="absolute size-3.5 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" aria-hidden>
          <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.12}>{inner}</Magnetic> : inner;
}
