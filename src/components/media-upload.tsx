"use client";

import { useRef, useState } from "react";

interface MediaUploadProps {
  onUploaded: () => void;
}

export function MediaUpload({ onUploaded }: MediaUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

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
        const body = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(body.detail || "Upload failed");
      }

      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="border border-border p-4 mb-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        onChange={handleUpload}
        disabled={isUploading}
        className="text-xs text-muted file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:text-xs file:text-muted file:cursor-pointer hover:file:text-fg hover:file:border-fg"
      />
      {isUploading && (
        <p className="text-xs text-muted mt-2">&gt; uploading...</p>
      )}
      {error && (
        <p className="text-xs text-muted mt-2">&gt; {error}</p>
      )}
    </div>
  );
}
