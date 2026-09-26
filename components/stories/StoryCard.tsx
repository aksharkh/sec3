import Link from "next/link";
import type { Story } from "@/lib/stories";
import { Glyph, toneClasses } from "@/components/ui/Glyph";
import { Arrow } from "@/components/ui/Button";

/** Customer story card — company mark, headline metric, frameworks, generative art. */
export function StoryCard({ story, className, size = "md" }: { story: Story; className?: string; size?: "md" | "lg" }) {
  const t = toneClasses[story.tone];
  const m = story.metrics[0];
  return (
    <Link
      href={`/customers/${story.slug}`}
      data-cursor="Read story"
      data-fx
      data-label={story.company}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] ${t.bg} ${t.fg} ${
        size === "lg" ? "min-h-[34rem] p-8 md:p-12" : "min-h-[30rem] p-7"
      } ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_15%,transparent_62%)]">
        <Glyph
          seed={story.slug}
          className={`absolute -right-[20%] -top-[15%] w-[85%] transition-transform duration-[1.6s] ease-out-expo group-hover:rotate-[20deg] group-hover:scale-110 ${t.art}`}
          strands={size === "lg" ? 11 : 7}
          strokeWidth={size === "lg" ? 0.5 : 0.6}
        />
      </div>
      <div className="relative flex items-center gap-3">
        <span className={`grid size-11 place-items-center rounded-xl border text-sm font-semibold tracking-tight ${story.tone === "accent" || story.tone === "paper" ? "border-ink/15" : "border-ivory/20"}`}>
          {story.mark}
        </span>
        <span className="font-medium tracking-[-0.01em]">{story.company}</span>
      </div>

      <div className="relative mt-auto pt-24">
        <p className={`display ${size === "lg" ? "text-[clamp(4.5rem,9vw,9rem)]" : "text-7xl"}`}>{m.v}</p>
        <p className={`mt-2 ${t.sub}`}>{m.l}</p>
        <p className={`mt-6 max-w-xl leading-snug tracking-[-0.02em] ${size === "lg" ? "text-2xl md:text-3xl" : "text-xl"}`}>
          {story.headline}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {story.frameworks.map((f) => (
              <span
                key={f}
                className={`eyebrow rounded-full border px-2.5 py-1 text-[0.62rem] ${story.tone === "accent" || story.tone === "paper" ? "border-ink/15" : "border-ivory/20"}`}
              >
                {f}
              </span>
            ))}
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-current/10 transition-transform duration-700 ease-out-expo group-hover:rotate-45">
            <Arrow className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
