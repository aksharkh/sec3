import { Button } from "@/components/ui/Button";
import { KnotMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ivory pb-16 pt-32">
      <KnotMark className="pointer-events-none absolute -right-[10%] top-1/2 w-[70vw] max-w-[56rem] -translate-y-1/2 text-knot/10" strokeWidth={2} />
      <div className="container-x relative">
        <p className="eyebrow text-muted">(404) Loose thread</p>
        <h1 className="display mt-8 text-[clamp(3.4rem,10vw,10rem)]">
          This page is still <span className="serif text-knot">being tied.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-muted">
          We&apos;re rebuilding SecureKnots from the ground up. This section is on its way.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="outline" magnetic={false}>
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
}
