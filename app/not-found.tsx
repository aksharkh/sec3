import { Button } from "@/components/ui/Button";
import { KnotMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ivory pb-16 pt-32">
      <KnotMark className="pointer-events-none absolute -right-[10%] top-1/2 w-[70vw] max-w-[56rem] -translate-y-1/2 text-brand/10" strokeWidth={2} />
      <div className="container-x relative">
        <p className="eyebrow text-muted">(404) Loose thread</p>
        <h1 className="display mt-8 text-[clamp(3.4rem,10vw,10rem)]">
          This thread <span className="em text-brand">comes loose.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-muted">
          The page you&apos;re looking for has moved or never existed. Try search, or head back to solid ground.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/frameworks" variant="outline" magnetic={false}>
            Browse frameworks
          </Button>
        </div>
      </div>
    </section>
  );
}
