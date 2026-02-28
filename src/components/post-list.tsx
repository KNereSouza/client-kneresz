import Link from "next/link";
import type { PostOut } from "@/lib/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}

export function PostList({ posts }: { posts: PostOut[] }) {
  if (posts.length === 0) {
    return <p className="text-muted text-sm">no posts yet</p>;
  }

  return (
    <ul className="space-y-2">
      {posts.map((post) => (
        <li key={post.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
          <span className="text-muted text-xs sm:text-sm shrink-0">
            {formatDate(post.created_at)}
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <Link
              href={`/posts/${post.slug}`}
              className="text-fg text-sm sm:text-base hover:text-accent transition-colors"
            >
              {post.title}
            </Link>
            {post.tags.length > 0 && (
              <span className="text-muted text-xs">
                {post.tags.map((t) => `#${t}`).join(" ")}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
