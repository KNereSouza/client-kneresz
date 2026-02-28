"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/client-api";
import type { PostOut } from "@/lib/types";

interface AdminPostListProps {
  posts: PostOut[];
  onRefresh: () => void;
}

export function AdminPostList({ posts, onRefresh }: AdminPostListProps) {
  const [actionSlug, setActionSlug] = useState<string | null>(null);

  async function handleAction(
    slug: string,
    action: "publish" | "draft" | "delete" | "restore",
  ) {
    setActionSlug(slug);
    try {
      switch (action) {
        case "publish":
          await apiFetch(`/posts/${slug}`, {
            method: "PUT",
            body: JSON.stringify({ status: "published" }),
          });
          break;
        case "draft":
          await apiFetch(`/posts/${slug}`, {
            method: "PUT",
            body: JSON.stringify({ status: "draft" }),
          });
          break;
        case "delete":
          await apiFetch(`/posts/${slug}`, { method: "DELETE" });
          break;
        case "restore":
          await apiFetch(`/posts/${slug}/restore`, { method: "POST" });
          break;
      }
      onRefresh();
    } catch {
      // handled silently
    } finally {
      setActionSlug(null);
    }
  }

  async function handlePurge(slug: string) {
    const confirmed = prompt(`Type "${slug}" to permanently delete:`);
    if (confirmed !== slug) return;

    setActionSlug(slug);
    try {
      await apiFetch(`/posts/${slug}/purge`, {
        method: "DELETE",
        body: JSON.stringify({ confirm: slug }),
      });
      onRefresh();
    } catch {
      // handled silently
    } finally {
      setActionSlug(null);
    }
  }

  if (posts.length === 0) {
    return <p className="text-muted text-sm">no posts</p>;
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const isProcessing = actionSlug === post.slug;
        const isDeleted = post.deleted_at !== null;
        const date = new Date(post.created_at).toISOString().split("T")[0];

        return (
          <div
            key={post.id}
            className={`border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-2 ${
              isDeleted ? "opacity-50" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold truncate">{post.title}</span>
                <span className="text-xs text-muted border border-border px-1">
                  {isDeleted ? "deleted" : post.status}
                </span>
              </div>
              <div className="text-xs text-muted mt-1">
                {date} &middot; /{post.slug}
                {post.tags.length > 0 && (
                  <> &middot; {post.tags.map((t) => `#${t}`).join(" ")}</>
                )}
              </div>
            </div>
            <div className="flex gap-2 text-xs shrink-0 flex-wrap">
              {!isDeleted && (
                <>
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="text-muted hover:text-fg transition-colors"
                  >
                    [edit]
                  </Link>
                  {post.status === "draft" ? (
                    <button
                      onClick={() => handleAction(post.slug, "publish")}
                      disabled={isProcessing}
                      className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
                    >
                      [publish]
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(post.slug, "draft")}
                      disabled={isProcessing}
                      className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
                    >
                      [unpublish]
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(post.slug, "delete")}
                    disabled={isProcessing}
                    className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    [delete]
                  </button>
                </>
              )}
              {isDeleted && (
                <>
                  <button
                    onClick={() => handleAction(post.slug, "restore")}
                    disabled={isProcessing}
                    className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    [restore]
                  </button>
                  <button
                    onClick={() => handlePurge(post.slug)}
                    disabled={isProcessing}
                    className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    [purge]
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
