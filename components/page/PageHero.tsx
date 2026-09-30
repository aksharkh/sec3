import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { HeroFade } from "./HeroFade";
import { DrawRule } from "./DrawRule";

type Crumb = { label: string; href?: string };

/**
 * Meridian inner-page hero: label and breadcrumbs over a hairline, a large
 * serif title, a self-drawing cobalt rule, then intro + actions.
 * `art` is accepted for API compatibility and ignored in this design.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  crumbs,
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
  const muted = dark ? "text-accent/60" : "text-muted";
  return (
    <section className={`relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-32 lg:pt-16 border-b border-ink ${dark ? "bg-brand text-accent" : "paper-grid bg-ivory text-ink"}`}>
      <div className="container-x relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <HeroFade as="p" className={`eyebrow flex items-center gap-3 ${muted}`}>
            <span className={`size-2.5 ${dark ? "bg-accent" : "bg-brand"}`} />
            {eyebrow}
          </HeroFade>
          {crumbs && (
            <HeroFade as="nav" aria-label="Breadcrumb">
              <ol className={`mono flex flex-wrap items-center gap-2 text-xs uppercase ${muted}`}>
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {c.href ? (
                      <Link href={c.href} className="hover:text-brand">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={dark ? "text-accent" : "text-ink"}>{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && <span aria-hidden className="opacity-50">/</span>}
                  </li>
                ))}
              </ol>
            </HeroFade>
          )}
        </div>

        <div className={`mt-8 grid gap-10 md:mt-10 ${aside ? "lg:grid-cols-12 lg:items-end" : ""}`}>
          <h1 className={`wide ${size === "xl" ? "text-[clamp(3rem,8.4vw,9rem)]" : "text-[clamp(2.6rem,6.4vw,6.6rem)]"} ${aside ? "lg:col-span-8" : "max-w-[18ch]"}`}>
            <Reveal as="span" trigger="load" delay={0.1} className="block">
              {title}
            </Reveal>
          </h1>
          {aside && <HeroFade className="lg:col-span-4">{aside}</HeroFade>}
        </div>

        <DrawRule className={`mt-12 ${dark ? "bg-accent/25" : "bg-line"}`} />

        {(intro || actions) && (
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            {intro && (
              <HeroFade as="div" className={`max-w-xl text-lg leading-relaxed md:col-span-6 ${dark ? "text-accent/80" : "text-ink/70"}`}>
                {intro}
              </HeroFade>
            )}
            {actions && <HeroFade className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">{actions}</HeroFade>}
          </div>
        )}
      </div>
    </section>
  );
}
