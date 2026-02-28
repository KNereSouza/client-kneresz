import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { backendFetch } from "@/lib/api";
import type { PostOut } from "@/lib/types";
import { Markdown } from "@/components/markdown";
import { CommentSection } from "@/components/comment-section";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PostOut | null> {
  const res = await backendFetch(`/posts/${slug}`);

  if (res.redirected) {
    const url = new URL(res.url);
    const newSlug = url.pathname.split("/").pop();
    if (newSlug) redirect(`/posts/${newSlug}`);
  }

  if (res.status === 301) {
    const location = res.headers.get("location");
    if (location) {
      const newSlug = location.split("/").pop();
      if (newSlug) redirect(`/posts/${newSlug}`);
    }
  }

  if (res.status === 404) return null;
  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  const description = post.body.slice(0, 160).replace(/[#*_`\n]/g, "");

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const dateStr = new Date(post.created_at).toISOString().split("T")[0];

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-lg sm:text-xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-muted">
          <time>{dateStr}</time>
          {post.tags.length > 0 && (
            <span>{post.tags.map((t) => `#${t}`).join(" ")}</span>
          )}
        </div>
      </header>
      <Markdown content={post.body} />
      <hr className="border-border my-12" />
      <CommentSection slug={slug} />
    </article>
  );
}
