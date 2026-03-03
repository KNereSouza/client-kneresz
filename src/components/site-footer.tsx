"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 sm:px-8 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-muted">
        <span>&copy; {new Date().getFullYear()} kneresz</span>
        <ThemeToggle />
        <a
          href="https://github.com/KNereSouza"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg transition-colors"
        >
          github
        </a>
      </div>
    </footer>
  );
}
