"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "> a blog about code, systems and things i build", className: "text-muted" },
  { text: "> by Kauã Neres de Souza", className: "text-fg" },
  { text: "> fullstack developer // cs student", className: "text-muted", delay: 300 },
];

const TYPE_SPEED = 35;
const LINE_PAUSE = 500;
const CURSOR_BLINK_MS = 530;

export function TypingText() {
  const [displayed, setDisplayed] = useState(() =>
    LINES.map(() => ""),
  );
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const done = lineIdx >= LINES.length;
  const cursorRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    cursorRef.current = setInterval(() => {
      setShowCursor((v) => !v);
    }, CURSOR_BLINK_MS);
    return () => clearInterval(cursorRef.current);
  }, []);

  // Stop cursor blink once typing is done
  useEffect(() => {
    if (done) {
      clearInterval(cursorRef.current);
      setShowCursor(false);
    }
  }, [done]);

  useEffect(() => {
    if (done) return;

    const line = LINES[lineIdx];

    if (charIdx === 0 && line.delay) {
      const timer = setTimeout(() => {
        setCharIdx(1);
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = line.text[0];
          return next;
        });
      }, line.delay);
      return () => clearTimeout(timer);
    }

    if (charIdx < line.text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = line.text.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, LINE_PAUSE);
    return () => clearTimeout(timer);
  }, [lineIdx, charIdx, done]);

  return (
    <div className="flex flex-col gap-1 text-[11px] sm:text-xs md:text-sm w-full max-w-xs sm:max-w-sm md:max-w-md">
      {LINES.map((line, i) => (
        <div
          key={i}
          className={`${line.className} whitespace-nowrap overflow-hidden min-h-[1.4em]`}
        >
          {displayed[i] || "\u00A0"}
          {i === lineIdx && showCursor ? "_" : ""}
        </div>
      ))}
    </div>
  );
}
