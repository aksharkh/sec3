import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/** Standard section header: eyebrow in a 3-col gutter, masked headline in the remaining 9. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  dark,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid gap-8 md:grid-cols-12 ${className ?? ""}`}>
      <p className={`eyebrow md:col-span-3 ${dark ? "text-ivory/50" : "text-muted"}`}>{eyebrow}</p>
      <div className="md:col-span-9">
        <Reveal as="h2" className="display text-[clamp(2.4rem,5.8vw,6rem)]">
          {title}
        </Reveal>
        {intro && <div className={`mt-8 max-w-2xl text-lg leading-relaxed ${dark ? "text-ivory/65" : "text-muted"}`}>{intro}</div>}
      </div>
    </div>
  );
}

export function Chip({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span className={`eyebrow inline-flex rounded-full border px-3 py-1.5 text-[0.65rem] ${dark ? "border-ivory/20 text-ivory/70" : "border-ink/15 text-ink/70"} ${className ?? ""}`}>
      {children}
    </span>
  );
}
