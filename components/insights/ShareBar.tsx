"use client";

import { toast } from "@/lib/gsap";

export function ShareBar({ title }: { title: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast("Link copied to clipboard.");
    } catch {
      toast("Couldn't copy, please copy the URL from your address bar.");
    }
  };
  const share = (base: string) => {
    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent(title);
    window.open(base.replace("{url}", url).replace("{text}", text), "_blank", "noopener,noreferrer,width=640,height=560");
  };
  const btn = "grid size-12 place-items-center rounded-full border border-ink/15 transition-colors duration-300 hover:bg-ink hover:text-ivory";
  return (
    <div className="sticky top-28 flex gap-2 lg:flex-col">
      <p className="eyebrow mb-2 hidden text-muted lg:block">Share</p>
      <button type="button" onClick={() => share("https://www.linkedin.com/sharing/share-offsite/?url={url}")} aria-label="Share on LinkedIn" className={btn}>
        <span className="text-sm font-semibold">in</span>
      </button>
      <button type="button" onClick={() => share("https://twitter.com/intent/tweet?url={url}&text={text}")} aria-label="Share on X" className={btn}>
        <span className="text-sm font-semibold">𝕏</span>
      </button>
      <button type="button" onClick={copy} aria-label="Copy link" className={btn}>
        <svg viewBox="0 0 20 20" className="size-4" fill="none">
          <path d="M8 12l4-4M7 9 5 11a3 3 0 0 0 4 4l2-2M13 11l2-2a3 3 0 0 0-4-4L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
