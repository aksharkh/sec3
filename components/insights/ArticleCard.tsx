import Link from "next/link";
import type { Article } from "@/lib/insights";
import { ReededGlassStatic } from "@/components/ui/ReededGlass";

export function formatDate(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Stable 0..1 value per slug, so each cover gets its own light position. */
function seed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

export function ArticleCard({ a, large }: { a: Article; large?: boolean }) {
  return (
    <Link href={`/insights/${a.slug}`} data-cursor="Read" data-label={a.tag} className={`group block ${large ? "lg:grid lg:grid-cols-12 lg:items-end lg:gap-10" : ""}`}>
      <div data-fx className={`relative overflow-hidden rounded-[1.75rem] bg-ink ${large ? "aspect-[16/10] lg:col-span-7" : "aspect-[4/5]"}`}>
        <ReededGlassStatic
          className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
          stripes={large ? 26 : 16}
          hue={seed(a.slug)}
          tone={a.tone === "accent" || a.tone === "paper" ? "light" : "dark"}
        />
      </div>
      <div className={large ? "mt-8 lg:col-span-5 lg:mt-0" : "mt-6"}>
        <p className="text-sm text-muted">
          {a.tag} <span aria-hidden>·</span> {formatDate(a.date)}
        </p>
        <h3 className={`mt-3 leading-[1.1] tracking-[-0.03em] ${large ? "text-[clamp(2rem,3.4vw,3.4rem)]" : "text-2xl"}`}>
          <span className="link-sweep">{a.title}</span>
        </h3>
        {large && <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">{a.excerpt}</p>}
      </div>
    </Link>
  );
}
