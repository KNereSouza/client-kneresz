"use client";

import { useTheme } from "@/components/theme-provider";

const modes = [
  { key: "light" as const, label: "/light" },
  { key: "dark" as const, label: "/dark" },
  { key: "system" as const, label: "/system" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 sm:gap-1.5 text-xs">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`sm:px-2 sm:py-0.5 sm:border transition-colors cursor-pointer ${
            theme === key
              ? "text-fg sm:border-fg"
              : "text-muted hover:text-fg sm:border-border sm:hover:border-fg"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
