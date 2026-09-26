"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onSiteReady } from "@/lib/gsap";

const KEY = "sk-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (stored) return;
    let t: ReturnType<typeof setTimeout>;
    const cancel = onSiteReady(() => {
      t = setTimeout(() => setShow(true), 2200);
    });
    return () => {
      cancel();
      clearTimeout(t);
    };
  }, []);

  const save = (a: boolean, m: boolean) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics: a, marketing: m, at: Date.now() }));
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className={`fixed bottom-4 left-4 right-4 z-[70] max-w-md rounded-[1.5rem] bg-ink p-6 text-ivory shadow-2xl transition-all duration-700 ease-out-expo sm:right-auto ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <p className="eyebrow text-accent">Cookies, tied neatly</p>
      <p className="mt-3 text-sm leading-relaxed text-ivory/75">
        We use essential cookies to run this site and, with your permission, analytics to improve it.{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2">
          Privacy policy
        </Link>
      </p>

      <div className={`grid transition-all duration-500 ${prefs ? "mt-5 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <Toggle label="Essential" note="Always on" checked disabled />
          <Toggle label="Analytics" note="Anonymous usage" checked={analytics} onChange={setAnalytics} />
          <Toggle label="Marketing" note="Campaign attribution" checked={marketing} onChange={setMarketing} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {prefs ? (
          <button type="button" onClick={() => save(analytics, marketing)} className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink">
            Save choices
          </button>
        ) : (
          <button type="button" onClick={() => save(true, true)} className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink">
            Accept all
          </button>
        )}
        <button type="button" onClick={() => save(false, false)} className="rounded-full border border-ivory/20 px-5 py-2.5 text-sm">
          Essential only
        </button>
        {!prefs && (
          <button type="button" onClick={() => setPrefs(true)} className="px-3 py-2.5 text-sm text-ivory/60 underline-offset-2 hover:underline">
            Customise
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, note, checked, onChange, disabled }: { label: string; note: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center justify-between border-t border-ivory/10 py-3 ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-ivory/45">{note}</span>
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />
      <span className="relative h-6 w-11 rounded-full bg-ivory/15 transition-colors peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-ivory after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-ink" />
    </label>
  );
}
