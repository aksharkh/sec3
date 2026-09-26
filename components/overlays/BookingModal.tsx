"use client";

import { useCallback, useEffect, useState } from "react";
import { BOOK_EVENT, toast } from "@/lib/gsap";
import { Modal, CloseButton } from "./Modal";
import { Glyph } from "@/components/ui/Glyph";

const FRAMEWORKS = ["SOC 2", "ISO 27001", "ISO 42001", "HIPAA", "PCI DSS", "FedRAMP", "CMMC", "GDPR", "DORA", "DPDPA", "SEBI CSCRF", "Not sure yet"];
const TIMELINES = ["Under 3 months", "3–6 months", "6–12 months", "Just exploring"];
const SIZES = ["1–50", "51–200", "201–1,000", "1,000+"];
const STEPS = ["Frameworks", "Timeline", "Details"];

type Form = { frameworks: string[]; timeline: string; size: string; name: string; email: string; company: string; message: string };
const empty: Form = { frameworks: [], timeline: "", size: "", name: "", email: "", company: "", message: "" };

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onBook = (e: Event) => {
      const fw = (e as CustomEvent<{ framework?: string } | undefined>).detail?.framework;
      setForm((f) => (fw && !f.frameworks.includes(fw) ? { ...f, frameworks: [...f.frameworks, fw] } : f));
      setOpen(true);
    };
    // Any link to #book (usable from server components) opens the modal.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href="#book"], [data-book]');
      if (!a) return;
      e.preventDefault();
      const fw = a.getAttribute("data-book") || undefined;
      window.dispatchEvent(new CustomEvent(BOOK_EVENT, { detail: { framework: fw } }));
    };
    window.addEventListener(BOOK_EVENT, onBook);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(BOOK_EVENT, onBook);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (done) {
      setTimeout(() => {
        setStep(0);
        setForm(empty);
        setDone(false);
      }, 600);
    }
  }, [done]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleFw = (fw: string) =>
    set("frameworks", form.frameworks.includes(fw) ? form.frameworks.filter((f) => f !== fw) : [...form.frameworks, fw]);

  const canNext = step === 0 ? form.frameworks.length > 0 : step === 1 ? !!form.timeline && !!form.size : true;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim()) return setError("Please add your name and company.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Please use a valid work email.");
    setError("");
    setSending(true);
    // TODO: connect to CRM / email endpoint (e.g. a Route Handler posting to HubSpot).
    await new Promise((r) => setTimeout(r, 1100));
    setSending(false);
    setDone(true);
    toast("Request received — we'll be in touch within one business day.");
  };

  return (
    <Modal open={open} onClose={close} label="Book an assessment" className="max-w-5xl">
      <div className="grid overflow-hidden rounded-[2rem] bg-ivory md:grid-cols-[0.8fr_1.2fr]">
        {/* Side panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand p-8 text-ivory md:flex">
          <Glyph seed="booking" className="absolute -bottom-24 -right-24 size-[26rem] text-accent/40" strands={9} />
          <div className="relative">
            <p className="eyebrow text-accent">Book an assessment</p>
            <p className="mt-5 text-3xl leading-[1.05] tracking-[-0.03em]">
              30 minutes with a <span className="serif">senior practitioner.</span>
            </p>
          </div>
          <ol className="relative mt-12 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={`grid size-7 place-items-center rounded-full border text-xs transition-colors duration-500 ${
                    done || i < step ? "border-accent bg-accent text-ink" : i === step ? "border-ivory text-ivory" : "border-ivory/25 text-ivory/40"
                  }`}
                >
                  {done || i < step ? "✓" : i + 1}
                </span>
                <span className={i === step && !done ? "text-ivory" : "text-ivory/50"}>{s}</span>
              </li>
            ))}
          </ol>
          <p className="relative mt-12 text-sm text-ivory/55">Response within one business day. No sales script — just a clear plan.</p>
        </aside>

        {/* Form */}
        <div className="relative flex min-h-[34rem] flex-col p-6 md:p-10">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted">{done ? "Confirmed" : `Step ${step + 1} of ${STEPS.length}`}</p>
            <CloseButton onClick={close} />
          </div>

          {done ? (
            <div className="flex flex-1 animate-[fadeUp_0.8s_var(--ease-out)] flex-col justify-center">
              <div className="grid size-16 place-items-center rounded-full bg-accent text-2xl">✓</div>
              <h2 className="display mt-8 text-5xl md:text-6xl">
                You&apos;re <span className="serif text-brand">tied in.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-muted">
                Thanks, {form.name.split(" ")[0]}. A practitioner specialising in {form.frameworks.slice(0, 2).join(" and ") || "your frameworks"} will email{" "}
                {form.email} within one business day with times to meet.
              </p>
              <button type="button" onClick={close} className="mt-10 w-fit rounded-full bg-ink px-6 py-3.5 text-ivory">
                Back to the site
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-1 flex-col">
              <div key={step} className="flex-1 animate-[fadeUp_0.6s_var(--ease-out)] pt-8">
                {step === 0 && (
                  <>
                    <h2 className="text-3xl leading-tight tracking-[-0.03em] md:text-4xl">Which frameworks are on your roadmap?</h2>
                    <p className="mt-2 text-muted">Pick all that apply.</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {FRAMEWORKS.map((fw) => {
                        const on = form.frameworks.includes(fw);
                        return (
                          <button
                            key={fw}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleFw(fw)}
                            className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                              on ? "border-brand bg-brand text-ivory" : "border-ink/15 hover:border-ink/40"
                            }`}
                          >
                            {fw}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <h2 className="text-3xl leading-tight tracking-[-0.03em] md:text-4xl">When do you need the report?</h2>
                    <Choice options={TIMELINES} value={form.timeline} onChange={(v) => set("timeline", v)} />
                    <p className="eyebrow mt-10 text-muted">Company size</p>
                    <Choice options={SIZES} value={form.size} onChange={(v) => set("size", v)} compact />
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="text-3xl leading-tight tracking-[-0.03em] md:text-4xl">Where should we reach you?</h2>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
                      <Field label="Work email" type="email" value={form.email} onChange={(v) => set("email", v)} autoComplete="email" />
                      <Field label="Company" value={form.company} onChange={(v) => set("company", v)} autoComplete="organization" className="sm:col-span-2" />
                      <Field label="Anything we should know? (optional)" value={form.message} onChange={(v) => set("message", v)} textarea className="sm:col-span-2" />
                    </div>
                    {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
                  </>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={`link-sweep text-sm ${step === 0 ? "invisible" : ""}`}
                >
                  ← Back
                </button>
                {step < 2 ? (
                  <button
                    type="button"
                    disabled={!canNext}
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-full bg-ink px-7 py-3.5 text-ivory transition-opacity disabled:opacity-30"
                  >
                    Continue →
                  </button>
                ) : (
                  <button type="submit" disabled={sending} className="flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 text-ivory">
                    {sending && <span className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />}
                    {sending ? "Sending…" : "Request my assessment"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Choice({ options, value, onChange, compact }: { options: string[]; value: string; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <div className={`mt-6 grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"}`} role="radiogroup">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`rounded-2xl border px-5 text-left transition-all duration-300 ${compact ? "py-3 text-center" : "py-5"} ${
            value === o ? "border-brand bg-brand text-ivory" : "border-ink/15 hover:border-ink/40"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  className,
  autoComplete,
  dark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  className?: string;
  autoComplete?: string;
  dark?: boolean;
}) {
  const base = `peer w-full rounded-2xl border bg-transparent px-5 pb-3 pt-7 outline-none transition-colors duration-300 ${
    dark ? "border-ivory/15 focus:border-accent" : "border-ink/15 focus:border-brand"
  }`;
  return (
    <label className={`relative block ${className ?? ""}`}>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" " className={`${base} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" " autoComplete={autoComplete} className={base} />
      )}
      <span
        className={`pointer-events-none absolute left-5 top-5 origin-left transition-all duration-300 peer-focus:top-2.5 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:scale-75 ${
          dark ? "text-ivory/50" : "text-muted"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
