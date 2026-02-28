"use client";

import { useEffect, useState } from "react";

const EYES_OPEN = "4";
const EYES_CLOSED = "+";

const base = (eyes: string, suffix = "") =>
  `  |\\      _,,,---,,_${suffix}\n  /,\`.-'\`'    -.  ;-;;,_\n |,${eyes}-  ) )-,_. ,\\ (  \`'-'\n'---''(_/--'  \`-'\\_)`;

const FRAMES = [
  // idle (eyes open)
  base(EYES_OPEN),
  base(EYES_OPEN),
  base(EYES_OPEN),
  // blink
  base(EYES_CLOSED),
  base(EYES_CLOSED),
  // idle
  base(EYES_OPEN),
  // sleeping
  base(EYES_CLOSED, "   z"),
  base(EYES_CLOSED, " z"),
  base(EYES_CLOSED, "  z"),
  base(EYES_CLOSED, " z"),
  base(EYES_CLOSED, "   z"),
  // waking
  base(EYES_CLOSED),
  base(EYES_OPEN),
];

export function AsciiCat() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <pre className="text-fg text-[9px] leading-[11px] sm:text-[11px] sm:leading-[14px] md:text-xs md:leading-4 select-none whitespace-pre">
        {FRAMES[frame]}
      </pre>
    </div>
  );
}
