"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/client-api";
import type { CommentOut } from "@/lib/types";

interface CommentFormProps {
  slug: string;
  onSubmitted: (comment: CommentOut) => void;
}

export function CommentForm({ slug, onSubmitted }: CommentFormProps) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="border border-border p-4 text-center">
        <a
          href={`/api/auth/login?redirect=/posts/${slug}`}
          className="text-muted text-xs hover:text-fg transition-colors"
        >
          [login with github to comment]
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const comment = await apiFetch<CommentOut>(`/posts/${slug}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: body.trim() }),
      });
      setBody("");
      onSubmitted(comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="write a comment..."
        rows={3}
        className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted/50 mb-3"
      />
      {error && (
        <p className="text-xs text-muted mb-2">&gt; {error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">
          commenting as {user.github_username}
        </span>
        <button
          type="submit"
          disabled={!body.trim() || isSubmitting}
          className="text-xs text-muted hover:text-fg border border-border px-3 py-1 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          {isSubmitting ? "[posting...]" : "[post]"}
        </button>
      </div>
    </form>
  );
}
