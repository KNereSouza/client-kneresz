"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import type { CommentOut } from "@/lib/types";
import { CommentList } from "@/components/comment-list";
import { CommentForm } from "@/components/comment-form";

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const data = await apiFetch<CommentOut[]>(`/posts/${slug}/comments`);
      setComments(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  function handleCommentAdded(comment: CommentOut) {
    setComments((prev) => [...prev, comment]);
  }

  function handleCommentDeleted(commentId: string) {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <section>
      <h2 className="text-xs sm:text-sm font-bold mb-4 sm:mb-6">
        comments ({comments.length})
      </h2>
      {isLoading ? (
        <p className="text-muted text-xs">&gt; loading...</p>
      ) : (
        <>
          <CommentList
            comments={comments}
            onDeleted={handleCommentDeleted}
          />
          <CommentForm slug={slug} onSubmitted={handleCommentAdded} />
        </>
      )}
    </section>
  );
}
