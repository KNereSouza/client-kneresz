"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client-api";
import type { MediaOut } from "@/lib/types";

interface MediaBrowserProps {
  media: MediaOut[];
  onRefresh: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}

export function MediaBrowser({ media, onRefresh }: MediaBrowserProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCopy(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await apiFetch(`/media/${id}`, { method: "DELETE" });
      onRefresh();
    } catch {
      // handled silently
    } finally {
      setDeletingId(null);
    }
  }

  if (media.length === 0) {
    return <p className="text-muted text-xs">no media uploaded</p>;
  }

  return (
    <div className="space-y-2">
      {media.map((item) => (
        <div
          key={item.id}
          className="border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{item.filename}</p>
            <p className="text-xs text-muted">
              {item.content_type} &middot; {formatBytes(item.size_bytes)}
              &middot; {new Date(item.created_at).toISOString().split("T")[0]}
            </p>
          </div>
          <div className="flex gap-2 text-xs shrink-0">
            <button
              onClick={() => handleCopy(item.url, item.id)}
              className="text-muted hover:text-fg transition-colors cursor-pointer"
            >
              {copiedId === item.id ? "[copied]" : "[copy url]"}
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-30"
            >
              [delete]
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
