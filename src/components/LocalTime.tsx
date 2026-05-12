"use client";

import { useEffect, useState } from "react";

export default function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  // Use suppressHydrationWarning since the time will only render after mount
  return (
    <span suppressHydrationWarning className="font-mono tabular-nums">
      {time || "—"}
    </span>
  );
}
