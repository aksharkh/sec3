"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Accessible modal shell: portal, scroll lock, Esc to close, focus handling, animated entry. */
export function Modal({
  open,
  onClose,
  children,
  label,
  className,
  align = "center",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  className?: string;
  align?: "center" | "top";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      const f = panel.current?.querySelector<HTMLElement>("[data-autofocus], input, button");
      f?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const els = panel.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])",
        );
        if (!els.length) return;
        const firstEl = els[0];
        const lastEl = els[els.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      restore.current?.focus?.();
    };
  }, [open, onClose]);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex justify-center p-3 transition-[visibility] duration-700 md:p-6 ${
        align === "top" ? "items-start pt-[12vh]" : "items-center"
      } ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink/55 backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-lenis-prevent
        className={`relative max-h-full w-full overflow-auto transition-[transform,opacity,clip-path] duration-700 ease-out-expo ${
          open ? "translate-y-0 opacity-100 [clip-path:inset(0_0_0_0_round_2rem)]" : "translate-y-10 opacity-0 [clip-path:inset(12%_6%_12%_6%_round_2rem)]"
        } ${className ?? ""}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function CloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close dialog"
      className={`group grid size-11 place-items-center rounded-full border border-current/15 transition-colors duration-300 hover:bg-current/10 ${className ?? ""}`}
    >
      <svg viewBox="0 0 14 14" className="size-3.5 transition-transform duration-500 group-hover:rotate-90">
        <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
