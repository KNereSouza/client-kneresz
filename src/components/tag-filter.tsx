"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TagFilterProps {
  tags: string[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTags = searchParams.getAll("tag");

  if (tags.length === 0) return null;

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const current = params.getAll("tag");
    params.delete("tag");
    if (current.includes(tag)) {
      for (const t of current.filter((t) => t !== tag)) params.append("tag", t);
    } else {
      for (const t of current) params.append("tag", t);
      params.append("tag", tag);
    }
    const qs = params.toString();
    router.push(qs ? `/posts?${qs}` : "/posts");
  }

  function clearTags() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("tag");
    const qs = params.toString();
    router.push(qs ? `/posts?${qs}` : "/posts");
  }

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-xs">
      <button
        onClick={clearTags}
        className={`px-2 py-0.5 border transition-colors cursor-pointer ${
          activeTags.length === 0
            ? "border-fg text-fg"
            : "border-border text-muted hover:text-fg hover:border-fg"
        }`}
      >
        /all
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-2 py-0.5 border transition-colors cursor-pointer ${
            activeTags.includes(tag)
              ? "border-fg text-fg"
              : "border-border text-muted hover:text-fg hover:border-fg"
          }`}
        >
          /{tag}
        </button>
      ))}
    </div>
  );
}
