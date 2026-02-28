"use client";

import { useTheme } from "@/components/theme-provider";

const modes = [
  { key: "light" as const, label: "light" },
  { key: "dark" as const, label: "dark" },
  { key: "system" as const, label: "system" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 text-xs sm:text-sm">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`px-3 py-1.5 border transition-colors cursor-pointer ${
            theme === key
              ? "border-fg text-fg"
              : "border-border text-muted hover:text-fg hover:border-fg"
          }`}
        >
          [{label}]
        </button>
      ))}
    </div>
  );
}
