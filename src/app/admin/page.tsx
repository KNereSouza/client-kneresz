"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import { AdminPostList } from "@/components/admin-post-list";
import type { PostList } from "@/lib/types";

type Filter = "all" | "draft" | "published" | "deleted";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (filter === "deleted") {
        params.set("include_deleted", "true");
      } else if (filter !== "all") {
        params.set("status", filter);
      }
      const data = await apiFetch<PostList>(`/posts?${params.toString()}`);
      let items = data.items;
      if (filter === "deleted") {
        items = items.filter((p) => p.deleted_at !== null);
      }
      setPosts({ items, total: items.length });
    } catch {
      // handled silently
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filters: Filter[] = ["all", "draft", "published", "deleted"];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              filter === f
                ? "border-fg text-fg"
                : "border-border text-muted hover:text-fg hover:border-fg"
            }`}
          >
            [{f}]
          </button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-muted text-xs">&gt; loading...</p>
      ) : posts ? (
        <>
          <p className="text-xs text-muted mb-4">
            {posts.total} post{posts.total !== 1 ? "s" : ""}
          </p>
          <AdminPostList posts={posts.items} onRefresh={fetchPosts} />
        </>
      ) : (
        <p className="text-muted text-xs">failed to load posts</p>
      )}
    </div>
  );
}
