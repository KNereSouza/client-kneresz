"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TagFilterProps {
  tags: string[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  if (tags.length === 0) return null;

  function selectTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6 text-xs">
      {activeTag && (
        <button
          onClick={() => selectTag(null)}
          className="text-fg border border-fg px-2 py-0.5 cursor-pointer"
        >
          [all]
        </button>
      )}
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => selectTag(tag === activeTag ? null : tag)}
          className={`px-2 py-0.5 border transition-colors cursor-pointer ${
            tag === activeTag
              ? "border-fg text-fg"
              : "border-border text-muted hover:text-fg hover:border-fg"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
