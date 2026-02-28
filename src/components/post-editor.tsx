"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { Markdown } from "@/components/markdown";
import { MediaModal } from "@/components/media-modal";
import type { PostOut } from "@/lib/types";

interface PostEditorProps {
  post?: PostOut;
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const [tagsInput, setTagsInput] = useState(post?.tags.join(", ") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [mediaModal, setMediaModal] = useState<"image" | "video" | null>(null);
  const pendingInsertRef = useRef<{ start: number; end: number; prefix: string } | null>(null);

  const parseTags = useCallback(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput],
  );

  const handleSave = useCallback(async () => {
    if (!title.trim() || isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      const tags = parseTags();
      if (post) {
        const updated = await apiFetch<PostOut>(`/posts/${post.slug}`, {
          method: "PUT",
          body: JSON.stringify({ title, body, tags }),
        });
        router.push(`/admin/edit/${updated.slug}`);
      } else {
        const created = await apiFetch<PostOut>("/posts", {
          method: "POST",
          body: JSON.stringify({ title, body, tags }),
        });
        router.push(`/admin/edit/${created.slug}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [title, body, parseTags, post, router, isSaving]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter") return;

    const ta = e.currentTarget;
    const pos = ta.selectionStart;
    const lineStart = body.lastIndexOf("\n", pos - 1) + 1;
    const currentLine = body.slice(lineStart, pos);

    const imageMatch = currentLine.match(/^!image$/);
    const videoMatch = currentLine.match(/^!video$/);

    if (imageMatch || videoMatch) {
      e.preventDefault();
      pendingInsertRef.current = {
        start: lineStart,
        end: pos,
        prefix: currentLine,
      };
      setMediaModal(imageMatch ? "image" : "video");
    }
  }

  function handleMediaSelect(url: string) {
    const pending = pendingInsertRef.current;
    if (!pending) {
      setMediaModal(null);
      return;
    }

    const isVideo = mediaModal === "video";
    const embed = isVideo
      ? `<video src="${url}" controls></video>`
      : `![image](${url})`;

    const before = body.slice(0, pending.start);
    const after = body.slice(pending.end);
    const newBody = before + embed + after;

    setBody(newBody);
    pendingInsertRef.current = null;
    setMediaModal(null);

    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        const cursorPos = pending.start + embed.length;
        ta.focus();
        ta.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted block mb-1">title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-fg transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">
            tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="rust, wasm, tutorial"
            className="w-full bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-fg transition-colors"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted">body (markdown)</label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-muted hover:text-fg transition-colors cursor-pointer"
            >
              [{showPreview ? "edit" : "preview"}]
            </button>
          </div>
          {showPreview ? (
            <div className="border border-border p-3 sm:p-4 min-h-[200px] sm:min-h-[300px]">
              <Markdown content={body} />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Write your post in markdown..."
              rows={15}
              className="w-full bg-transparent border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-fg transition-colors resize-y font-mono"
            />
          )}
        </div>
        {error && <p className="text-xs text-muted">&gt; {error}</p>}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="text-xs border border-border px-4 py-2 text-muted hover:text-fg hover:border-fg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          >
            {isSaving ? "[saving...]" : "[save]"}
          </button>
          <span className="text-xs text-muted">
            ctrl+s to save | type !image or !video + enter to embed media
          </span>
        </div>
      </div>

      {mediaModal && (
        <MediaModal
          type={mediaModal}
          onSelect={handleMediaSelect}
          onClose={() => {
            pendingInsertRef.current = null;
            setMediaModal(null);
          }}
        />
      )}
    </>
  );
}
