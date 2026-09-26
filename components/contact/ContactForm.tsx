"use client";

import { useState } from "react";
import { toast } from "@/lib/gsap";
import { Field } from "@/components/overlays/BookingModal";

const TOPICS = ["New certification", "Multiple frameworks", "Security testing", "Ongoing compliance", "Partnership", "Something else"];

export function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [f, setF] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.message.trim()) return setError("Please add your name and a short message.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setError("Please use a valid email address.");
    setError("");
    setState("sending");
    // TODO: connect to CRM / email endpoint.
    await new Promise((r) => setTimeout(r, 1000));
    setState("sent");
    toast("Message sent — we'll reply within one business day.");
  };

  if (state === "sent") {
    return (
      <div className="flex min-h-[32rem] animate-[fadeUp_0.8s_var(--ease-out)] flex-col justify-center">
        <div className="grid size-16 place-items-center rounded-full bg-accent text-2xl text-ink">✓</div>
        <p className="display mt-8 text-5xl">
          Message <span className="serif text-accent">received.</span>
        </p>
        <p className="mt-5 max-w-md text-lg text-ivory/65">Thanks {f.name.split(" ")[0]}. A practitioner will reply to {f.email} within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="eyebrow text-ivory/50">What can we help with?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${topic === t ? "border-accent bg-accent text-ink" : "border-ivory/15 hover:border-ivory/40"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Field dark label="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
        <Field dark label="Work email" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        <Field dark label="Company" value={f.company} onChange={set("company")} autoComplete="organization" />
        <Field dark label="Phone (optional)" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
        <Field dark label="How can we help?" value={f.message} onChange={set("message")} textarea className="sm:col-span-2" />
      </div>
      {error && (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xs text-xs text-ivory/45">By submitting you agree to our privacy policy. We never share your details.</p>
        <button type="submit" disabled={state === "sending"} className="flex h-14 items-center gap-3 rounded-full bg-accent px-8 font-medium text-ink">
          {state === "sending" && <span className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />}
          {state === "sending" ? "Sending…" : "Send message →"}
        </button>
      </div>
    </form>
  );
}
