import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

// "ink" is the primary action: signal orange on the dark theme.
const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-brand text-accent hover:bg-brand-3", dot: "bg-accent text-brand" },
  accent: { wrap: "bg-accent text-ink", dot: "bg-brand text-accent" },
  ivory: { wrap: "bg-ink text-ivory", dot: "bg-brand text-accent" },
  outline: { wrap: "border border-ink/20 text-ink hover:border-ink/50", dot: "bg-ink text-ivory" },
  "outline-light": { wrap: "border border-ivory/25 text-ivory", dot: "bg-ivory text-ink" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Signal button: expanded uppercase label that rolls on hover + square arrow chip. */
export function Button({
  href,
  children,
  variant = "ink",
  className,
  magnetic = true,
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
      className={`group relative inline-flex h-13 items-center gap-5 rounded-[8px] pl-5 pr-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.02em] [font-stretch:118%] transition-[transform,background-color,border-color] duration-500 ease-out-expo active:scale-[0.98] ${s.wrap} ${className ?? ""}`}
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
      <span className={`relative grid size-10 place-items-center overflow-hidden rounded-[6px] ${s.dot}`}>
        <Arrow className="size-3.5 transition-transform duration-700 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
        <Arrow className="absolute size-3.5 -translate-x-6 translate-y-6 transition-transform duration-700 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.12}>{inner}</Magnetic> : inner;
}
