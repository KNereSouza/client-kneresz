"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { AsciiAvatar } from "@/components/ascii-avatar";
import { relativeTime } from "@/lib/time";
import { apiFetch } from "@/lib/client-api";
import type { CommentOut } from "@/lib/types";

interface CommentItemProps {
  comment: CommentOut;
  onDeleted: (id: string) => void;
}

export function CommentItem({ comment, onDeleted }: CommentItemProps) {
  const { user, isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    isAdmin || (user && user.id === comment.user_id);

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/comments/${comment.id}`, { method: "DELETE" });
      onDeleted(comment.id);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex gap-3">
      <AsciiAvatar id={comment.avatar_id} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 text-xs">
          <span className="text-fg font-bold">{comment.github_username}</span>
          <span className="text-muted">{relativeTime(comment.created_at)}</span>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-50"
            >
              [delete]
            </button>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">
          {comment.body}
        </p>
      </div>
    </div>
  );
}
