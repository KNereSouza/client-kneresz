"use client";

import { AsciiCat } from "@/components/ascii-cat";
import { AsciiFireworks } from "@/components/ascii-fireworks";
import { AsciiLogo } from "@/components/ascii-logo";
import { AsciiRain } from "@/components/ascii-rain";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypingText } from "@/components/typing-text";

export function HoldingPage() {
  return (
    <>
      <AsciiRain />
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-md sm:max-w-lg">
          <AsciiCat />

          <div className="relative w-full flex items-center justify-center">
            <AsciiFireworks />
            <AsciiLogo />
          </div>

          <p className="text-muted text-xs sm:text-sm tracking-widest uppercase">
            coming soon
          </p>

          <TypingText />

          <div className="w-32 sm:w-48 border-t border-border" />

          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
            <a
              href="https://github.com/KNereSouza"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 border border-border text-muted hover:text-fg hover:border-fg transition-colors"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/kneresouza"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 border border-border text-muted hover:text-fg hover:border-fg transition-colors"
            >
              linkedin
            </a>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
