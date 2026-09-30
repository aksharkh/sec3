import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "ink" | "accent" | "ivory" | "outline" | "outline-light";

// "ink" is the primary action: a black slab whose arrow block turns cobalt.
const styles: Record<Variant, { wrap: string; dot: string }> = {
  ink: { wrap: "bg-ink text-ivory", dot: "bg-brand text-white" },
  accent: { wrap: "bg-white text-ink", dot: "bg-ink text-white" },
  ivory: { wrap: "bg-brand text-white", dot: "bg-ink text-white" },
  outline: { wrap: "border border-ink text-ink", dot: "border-l border-ink text-ink group-hover:bg-ink group-hover:text-ivory" },
  "outline-light": { wrap: "border border-white/60 text-white", dot: "border-l border-white/60 text-white group-hover:bg-white group-hover:text-ink" },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Thread button: square slab with a separate arrow block. */
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
      className={`group relative inline-flex h-13 items-stretch text-[0.95rem] font-medium tracking-[-0.01em] transition-transform duration-500 ease-out-expo active:scale-[0.98] ${s.wrap} ${className ?? ""}`}
    >
      <span className="flex items-center overflow-hidden px-5">
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
          <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
            {children}
          </span>
        </span>
      </span>
      <span className={`grid w-13 place-items-center transition-colors duration-500 ${s.dot}`}>
        <svg viewBox="0 0 16 16" fill="none" className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" aria-hidden>
          <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.12}>{inner}</Magnetic> : inner;
}
