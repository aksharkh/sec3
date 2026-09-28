import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";
import { HeroFade } from "./HeroFade";
import { ReededGlass } from "@/components/ui/ReededGlass";

type Crumb = { label: string; href?: string };

/** Shared inner-page hero: breadcrumbs, giant masked headline, intro, optional actions and generative art. */
export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  crumbs,
  art,
  dark = false,
  aside,
  size = "xl",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
  art?: string;
  dark?: boolean;
  aside?: ReactNode;
  size?: "xl" | "lg";
}) {
  const glass = !!art && !aside;
  return (
    <section
      data-theme={dark ? "dark" : undefined}
      className={`relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-36 ${dark ? "bg-brand text-ivory" : "bg-ivory text-ink"}`}
    >
      {glass && (
        <HeroFade className="pointer-events-none absolute bottom-10 right-[var(--gutter)] top-24 hidden w-[32vw] overflow-hidden rounded-[2rem] lg:block" delay={0.2}>
          <ReededGlass className="relative size-full" stripes={22} cx={0.5} cy={0.5} tone={dark ? "light" : "dark"} />
        </HeroFade>
      )}
      {art && !glass && (
        <HeroFade className="pointer-events-none absolute -right-[18%] -top-[10%] w-[80vw] max-w-[62rem] md:-right-[8%] md:w-[55vw]" delay={0.2}>
          <Glyph seed={art} className={`w-full animate-[drift_40s_linear_infinite] ${dark ? "text-accent/30" : "text-brand/15"}`} strands={11} strokeWidth={0.45} />
        </HeroFade>
      )}
      <div className="container-x relative">
        <div className={glass ? "lg:max-w-[60%]" : undefined}>
        {crumbs && (
          <HeroFade as="nav" aria-label="Breadcrumb" className="mb-10">
            <ol className={`eyebrow flex flex-wrap items-center gap-2 ${dark ? "text-ivory/50" : "text-muted"}`}>
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="link-sweep hover:text-current">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={dark ? "text-ivory" : "text-ink"}>{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </HeroFade>
        )}
        <HeroFade as="p" className={`eyebrow ${dark ? "text-accent" : "text-muted"}`}>
          {eyebrow}
        </HeroFade>
        <div className={`mt-8 grid gap-10 ${aside ? "lg:grid-cols-12 lg:items-end" : ""}`}>
          <h1
            className={`display ${size === "xl" ? "text-[clamp(3rem,7.2vw,8.4rem)]" : "text-[clamp(2.6rem,5.6vw,6.2rem)]"} ${aside ? "lg:col-span-8" : "max-w-[14ch]"}`}
          >
            <Reveal as="span" trigger="load" delay={0.1} className="block">
              {title}
            </Reveal>
          </h1>
          {aside && <HeroFade className="lg:col-span-4">{aside}</HeroFade>}
        </div>
        {(intro || actions) && (
          <div className={`mt-12 grid gap-8 border-t pt-8 md:grid-cols-12 md:items-end ${dark ? "border-ivory/15" : "border-line"}`}>
            {intro && (
              <HeroFade as="div" className={`max-w-xl text-lg leading-relaxed md:col-span-6 ${dark ? "text-ivory/70" : "text-ink/70"}`}>
                {intro}
              </HeroFade>
            )}
            {actions && <HeroFade className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">{actions}</HeroFade>}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
