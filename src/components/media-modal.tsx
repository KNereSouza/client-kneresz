"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaOut } from "@/lib/types";

interface MediaModalProps {
  type: "image" | "video";
  onSelect: (url: string) => void;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}

export function MediaModal({ type, onSelect, onClose }: MediaModalProps) {
  const [media, setMedia] = useState<MediaOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const accept =
    type === "image" ? "image/*" : "video/mp4,video/webm";

  const filterMedia = useCallback(
    (items: MediaOut[]) =>
      items.filter((m) =>
        type === "image"
          ? m.content_type.startsWith("image/")
          : m.content_type.startsWith("video/"),
      ),
    [type],
  );

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to load media");
      const data: MediaOut[] = await res.json();
      setMedia(filterMedia(data));
    } catch {
      setError("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  }, [filterMedia]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res
          .json()
          .catch(() => ({ detail: "Upload failed" }));
        throw new Error(body.detail || "Upload failed");
      }

      const uploaded: MediaOut = await res.json();
      onSelect(uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
    >
      <div className="border border-border bg-bg w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-bold">
            {type === "image" ? "insert image" : "insert video"}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-fg transition-colors cursor-pointer"
          >
            [close]
          </button>
        </div>

        <div className="border-b border-border px-4 py-3">
          <label className="text-xs text-muted block mb-2">
            upload new {type}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={isUploading}
            className="text-xs text-muted file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:text-xs file:text-muted file:cursor-pointer hover:file:text-fg hover:file:border-fg w-full"
          />
          {isUploading && (
            <p className="text-xs text-muted mt-2">&gt; uploading...</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <label className="text-xs text-muted block mb-2">
            or select existing
          </label>
          {error && (
            <p className="text-xs text-muted mb-2">&gt; {error}</p>
          )}
          {isLoading ? (
            <p className="text-xs text-muted">&gt; loading...</p>
          ) : media.length === 0 ? (
            <p className="text-xs text-muted">
              no {type === "image" ? "images" : "videos"} uploaded
            </p>
          ) : (
            <div className="space-y-1">
              {media.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  className="w-full text-left border border-border px-3 py-2 hover:border-fg transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="text-xs truncate flex-1 min-w-0">
                    {item.filename}
                  </span>
                  <span className="text-xs text-muted shrink-0">
                    {formatBytes(item.size_bytes)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
