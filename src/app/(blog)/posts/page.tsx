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
  searchParams: Promise<{ page?: string; tag?: string | string[] }>;
}

export default async function PostListPage({ searchParams }: Props) {
  const { page, tag } = await searchParams;
  const currentPage = Number(page || "1");
  const offset = (currentPage - 1) * LIMIT;
  const activeTags = tag ? (Array.isArray(tag) ? tag : [tag]) : [];

  const params = new URLSearchParams();
  params.set("status", "published");
  params.set("offset", String(offset));
  params.set("limit", String(LIMIT));
  for (const t of activeTags) params.append("tag", t);

  const allParams = new URLSearchParams();
  allParams.set("status", "published");
  allParams.set("limit", "100");

  const [res, allRes] = await Promise.all([
    backendFetch(`/posts?${params.toString()}`),
    activeTags.length > 0
      ? backendFetch(`/posts?${allParams.toString()}`)
      : null,
  ]);

  if (!res.ok) {
    return <p className="text-muted text-sm">failed to load posts</p>;
  }

  const data: PostListType = await res.json();
  const allData: PostListType | null = allRes?.ok ? await allRes.json() : null;

  const tagSource = allData ? allData.items : data.items;
  const allTags = [...new Set(tagSource.flatMap((p) => p.tags))].sort();

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
