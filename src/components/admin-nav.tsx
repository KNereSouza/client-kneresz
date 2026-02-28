"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "posts" },
  { href: "/admin/new", label: "new post" },
  { href: "/admin/media", label: "media" },
  { href: "/posts", label: "back to blog" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm mb-8">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-2 py-1 border transition-colors ${
            pathname === href
              ? "border-fg text-fg"
              : "border-border text-muted hover:text-fg hover:border-fg"
          }`}
        >
          [{label}]
        </Link>
      ))}
    </nav>
  );
}
