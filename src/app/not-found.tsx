import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <pre className="text-fg text-sm sm:text-base md:text-lg leading-tight select-none whitespace-pre mb-8">
{`  _  _    ___  _  _
 | || |  / _ \\| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \\___/   |_|`}
      </pre>
      <p className="text-muted text-sm sm:text-base mb-6">
        page not found
      </p>
      <Link
        href="/"
        className="px-4 py-2 border border-border text-muted text-xs sm:text-sm hover:text-fg hover:border-fg transition-colors"
      >
        [back to home]
      </Link>
    </div>
  );
}
