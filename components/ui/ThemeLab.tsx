"use client";

import { useEffect, useState } from "react";

/** Temporary palette switcher for client review — remove before launch. */
const palettes = [
  { name: "Navy & Sky", ivory: "#f3f0e8", paper: "#ebe7dc", bone: "#dfdacb", brand: "#0b2a5b", brand2: "#1c4a96", brand3: "#3a6fd8", accent: "#7fb2ff" },
  { name: "Midnight & Gold", ivory: "#f5f1e8", paper: "#ece5d6", bone: "#e0d6c2", brand: "#121a2e", brand2: "#24304f", brand3: "#3d4c75", accent: "#d4a64a" },
  { name: "Graphite & Electric", ivory: "#f4f4f2", paper: "#e9e9e6", bone: "#dcdcd8", brand: "#1a1d21", brand2: "#2b3036", brand3: "#4a525c", accent: "#5b82ff" },
  { name: "Indigo & Lilac", ivory: "#f5f3f0", paper: "#ece8e4", bone: "#dfd9d3", brand: "#231a5c", brand2: "#3b2d8f", brand3: "#5b4bd1", accent: "#b9a8ff" },
  { name: "Oxblood & Cream", ivory: "#f6f1ea", paper: "#eee5d9", bone: "#e2d5c4", brand: "#4e1220", brand2: "#6e1f2e", brand3: "#9c3a4a", accent: "#e9b8a3" },
  { name: "Slate & Coral", ivory: "#f3f2ef", paper: "#e8e6e1", bone: "#dbd8d1", brand: "#1e2a38", brand2: "#34465c", brand3: "#56708f", accent: "#ff7a59" },
  { name: "Ink & Signal Red", ivory: "#f2f0eb", paper: "#e7e4dd", bone: "#d9d5cc", brand: "#111111", brand2: "#2a2a2a", brand3: "#4d4d4d", accent: "#ff4a3d" },
];

const KEY = "sk-theme";

function apply(i: number) {
  const p = palettes[i];
  const r = document.documentElement.style;
  r.setProperty("--ivory", p.ivory);
  r.setProperty("--paper", p.paper);
  r.setProperty("--bone", p.bone);
  r.setProperty("--brand", p.brand);
  r.setProperty("--brand-2", p.brand2);
  r.setProperty("--brand-3", p.brand3);
  r.setProperty("--accent", p.accent);
}

export function ThemeLab() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let i = 0;
    try {
      i = Number(localStorage.getItem(KEY) ?? 0) || 0;
    } catch {}
    if (i) apply(i);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved choice
    setActive(i);
  }, []);

  const pick = (i: number) => {
    apply(i);
    setActive(i);
    try {
      localStorage.setItem(KEY, String(i));
    } catch {}
  };

  return (
    <div className="fixed bottom-4 right-4 z-[75] flex flex-col items-end gap-2">
      {open && (
        <div className="w-64 animate-[fadeUp_0.4s_var(--ease-out)] rounded-2xl bg-ink p-3 text-ivory shadow-2xl">
          <p className="eyebrow px-2 pb-2 pt-1 text-ivory/50">Colour lab</p>
          {palettes.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => pick(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors ${active === i ? "bg-ivory/10" : "hover:bg-ivory/5"}`}
            >
              <span className="flex overflow-hidden rounded-full ring-1 ring-ivory/20">
                {[p.ivory, p.brand, p.brand3, p.accent].map((c) => (
                  <span key={c} className="size-4" style={{ background: c }} />
                ))}
              </span>
              {p.name}
              {active === i && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Colour lab"
        className="grid size-12 place-items-center rounded-full bg-ink text-lg text-ivory shadow-xl"
      >
        {open ? "×" : "◐"}
      </button>
    </div>
  );
}
