import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

// "ink" is the primary action: solid brand blue, legible on white and on navy.
const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-brand text-white hover:bg-brand-2", dot: "" },
  accent: { wrap: "bg-white text-ink hover:bg-glow", dot: "" },
  ivory: { wrap: "bg-ink text-white hover:bg-ink-3", dot: "" },
  outline: { wrap: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white", dot: "" },
  "outline-light": { wrap: "border border-white/35 text-white hover:bg-white hover:text-ink", dot: "" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Atlas button: a plain, confident rectangle with a nudging arrow. */
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
      className={`group inline-flex h-12 items-center gap-4 rounded-[3px] px-6 text-[0.95rem] font-medium transition-colors duration-300 active:translate-y-px ${s.wrap} ${className ?? ""}`}
    >
      <span>{children}</span>
      <svg viewBox="0 0 16 16" fill="none" className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" aria-hidden>
        <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.12}>{inner}</Magnetic> : inner;
}
