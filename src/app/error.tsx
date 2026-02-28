"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <pre className="text-fg text-sm sm:text-base md:text-lg leading-tight select-none whitespace-pre mb-8">
{`  ____   ___   ___
 | ___| / _ \\ / _ \\
 |___ \\| | | | | | |
  ___) | |_| | |_| |
 |____/ \\___/ \\___/`}
      </pre>
      <p className="text-muted text-sm sm:text-base mb-6">
        something went wrong
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 border border-border text-muted text-xs sm:text-sm hover:text-fg hover:border-fg transition-colors cursor-pointer"
      >
        [try again]
      </button>
    </div>
  );
}
