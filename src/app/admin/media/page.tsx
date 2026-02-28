"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import { MediaBrowser } from "@/components/media-browser";
import { MediaUpload } from "@/components/media-upload";
import type { MediaOut, GCResponse } from "@/lib/types";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gcResult, setGcResult] = useState<GCResponse | null>(null);
  const [isGCing, setIsGCing] = useState(false);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<MediaOut[]>("/media");
      setMedia(data);
    } catch {
      // handled silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function handleGC() {
    setIsGCing(true);
    setGcResult(null);
    try {
      const result = await apiFetch<GCResponse>("/media/gc", {
        method: "POST",
      });
      setGcResult(result);
      fetchMedia();
    } catch {
      // handled silently
    } finally {
      setIsGCing(false);
    }
  }

  return (
    <div>
      <MediaUpload onUploaded={fetchMedia} />
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs text-muted">
          {media.length} file{media.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={handleGC}
          disabled={isGCing}
          className="text-xs text-muted hover:text-fg border border-border px-2 py-1 transition-colors cursor-pointer disabled:opacity-30"
        >
          {isGCing ? "[running gc...]" : "[garbage collect]"}
        </button>
        {gcResult && (
          <span className="text-xs text-muted">
            removed {gcResult.deleted_count} orphaned file
            {gcResult.deleted_count !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {isLoading ? (
        <p className="text-muted text-xs">&gt; loading...</p>
      ) : (
        <MediaBrowser media={media} onRefresh={fetchMedia} />
      )}
    </div>
  );
}
