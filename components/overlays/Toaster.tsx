"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT } from "@/lib/gsap";

export function Toaster() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg({ id: Date.now(), text: (e as CustomEvent<string>).detail });
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 4800);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => {
      window.removeEventListener(TOAST_EVENT, on);
      clearTimeout(t);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[85] flex justify-center px-4">
      {msg && (
        <div key={msg.id} className="flex animate-[fadeUp_0.6s_var(--ease-out)] items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-5 text-sm text-ivory shadow-2xl">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-ink">✓</span>
          {msg.text}
        </div>
      )}
    </div>
  );
}
