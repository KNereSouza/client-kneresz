"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const { user, isAdmin, isLoading } = useAuth();

  return (
    <header className="border-b border-border px-4 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link
            href="/"
            className="text-fg font-bold hover:text-accent transition-colors"
          >
            kneresz
          </Link>
          <Link
            href="/posts"
            className="text-muted hover:text-fg transition-colors"
          >
            [posts]
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-fg transition-colors"
          >
            [about]
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-muted hover:text-fg transition-colors"
            >
              [admin]
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-muted">{user.github_username}</span>
                  <button
                    onClick={() => {
                      window.location.href = "/api/auth/logout";
                    }}
                    className="text-muted hover:text-fg transition-colors cursor-pointer"
                  >
                    [logout]
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/login"
                  className="text-muted hover:text-fg transition-colors"
                >
                  [login]
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
