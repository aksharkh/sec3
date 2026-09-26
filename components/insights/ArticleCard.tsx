import Link from "next/link";
import type { Article } from "@/lib/insights";
import { Glyph, toneClasses } from "@/components/ui/Glyph";

export function formatDate(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function ArticleCard({ a, large }: { a: Article; large?: boolean }) {
  const t = toneClasses[a.tone];
  return (
    <Link href={`/insights/${a.slug}`} data-cursor="Read" data-label={a.tag} className={`group block ${large ? "lg:grid lg:grid-cols-12 lg:items-end lg:gap-10" : ""}`}>
      <div data-fx className={`relative overflow-hidden rounded-[1.75rem] ${t.bg} ${large ? "aspect-[16/10] lg:col-span-7" : "aspect-[4/5]"}`}>
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110 group-hover:rotate-6">
          <Glyph seed={a.slug} className={`absolute left-1/2 top-1/2 w-[115%] -translate-x-1/2 -translate-y-1/2 ${t.art} opacity-70`} strands={9} strokeWidth={0.5} />
        </div>
        <div className={`absolute inset-x-0 top-0 flex justify-between p-6 ${t.fg}`}>
          <span className="eyebrow">{a.tag}</span>
          <span className="eyebrow">{a.read}</span>
        </div>
      </div>
      <div className={large ? "mt-8 lg:col-span-5 lg:mt-0" : "mt-6"}>
        <p className="eyebrow text-muted">{formatDate(a.date)}</p>
        <h3 className={`mt-3 leading-[1.1] tracking-[-0.03em] ${large ? "text-[clamp(2rem,3.4vw,3.4rem)]" : "text-2xl"}`}>
          <span className="link-sweep">{a.title}</span>
        </h3>
        {large && <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">{a.excerpt}</p>}
      </div>
    </Link>
  );
}
