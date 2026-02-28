"use client";

import { useEffect, useState } from "react";

const LOGO = `
 _
| |  __  _ __    ___   _ __  ___  ___  ____
| | / / | '_ \\  / _ \\ | '__|/ _ \\/ __|/_  /
| |< <  | | | ||  __/ | |  |  __/\\__ \\ / /
|_| \\_\\ |_| |_| \\___| |_|   \\___||___//___|`;

export function AsciiLogo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <pre
      className={`text-fg text-[10px] leading-[13px] sm:text-sm sm:leading-[18px] md:text-lg md:leading-6 lg:text-xl lg:leading-7 select-none transition-opacity duration-1000 whitespace-pre ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {LOGO}
    </pre>
  );
}
