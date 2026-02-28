"use client";

import { useState } from "react";

export default function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("This is a test error");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 gap-6">
      <p className="text-muted text-sm">
        click the button to trigger the error boundary
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="px-4 py-2 border border-border text-muted text-xs sm:text-sm hover:text-fg hover:border-fg transition-colors cursor-pointer"
      >
        [throw error]
      </button>
    </div>
  );
}
