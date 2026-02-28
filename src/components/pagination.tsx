"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  total: number;
  limit: number;
}

export function Pagination({ total, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  function navigate(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    router.push(qs ? `/posts?${qs}` : "/posts");
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8 text-xs sm:text-sm">
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        className="text-muted hover:text-fg transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
      >
        [&lt; prev]
      </button>
      <span className="text-muted">
        page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="text-muted hover:text-fg transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
      >
        [next &gt;]
      </button>
    </div>
  );
}
