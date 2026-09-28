"use client";

import { useEffect, useState } from "react";

export function LiveClock({ tz }: { tz: string }) {
  const [time, setTime] = useState<string>("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [tz]);

  return <span className="eyebrow tabular-nums text-brand">{time}</span>;
}
