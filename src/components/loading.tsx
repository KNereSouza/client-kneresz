"use client";

import { useEffect, useState } from "react";

export function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center py-12">
      <span className="text-muted text-sm">
        &gt; {visible ? "_" : "\u00A0"}
      </span>
    </div>
  );
}
