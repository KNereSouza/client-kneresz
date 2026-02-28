import { Suspense } from "react";
import { backendFetch } from "@/lib/api";
import type { PostList as PostListType } from "@/lib/types";
import { PostList } from "@/components/post-list";
import { Pagination } from "@/components/pagination";
import { TagFilter } from "@/components/tag-filter";

const LIMIT = 50;

const ASCII_HEADER = `
    ____             __
   / __ \\____  _____/ /______
  / /_/ / __ \\/ ___/ __/ ___/
 / ____/ /_/ (__  ) /_(__  )
/_/    \\____/____/\\__/____/
`;

interface Props {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function PostListPage({ searchParams }: Props) {
  const { page, tag } = await searchParams;
  const currentPage = Number(page || "1");
  const offset = (currentPage - 1) * LIMIT;

  const params = new URLSearchParams();
  params.set("status", "published");
  params.set("offset", String(offset));
  params.set("limit", String(LIMIT));
  if (tag) params.set("tag", tag);

  const res = await backendFetch(`/posts?${params.toString()}`);

  if (!res.ok) {
    return <p className="text-muted text-sm">failed to load posts</p>;
  }

  const data: PostListType = await res.json();

  const allTags = [...new Set(data.items.flatMap((p) => p.tags))].sort();

  return (
    <>
      <pre className="text-fg text-[10px] leading-[12px] sm:text-xs sm:leading-4 select-none mb-6 sm:mb-8">
        {ASCII_HEADER}
      </pre>
      <Suspense>
        <TagFilter tags={allTags} />
      </Suspense>
      <PostList posts={data.items} />
      <Suspense>
        <Pagination total={data.total} limit={LIMIT} />
      </Suspense>
    </>
  );
}
