"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { PostEditor } from "@/components/post-editor";
import type { PostOut } from "@/lib/types";

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await apiFetch<PostOut>(`/posts/${params.slug}`);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return <p className="text-muted text-xs">&gt; loading...</p>;
  }

  if (error) {
    return <p className="text-muted text-xs">&gt; {error}</p>;
  }

  if (!post) {
    return <p className="text-muted text-xs">post not found</p>;
  }

  return <PostEditor post={post} />;
}
