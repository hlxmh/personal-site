import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getPostBySlug,
  listPosts,
} from "./repository";
import { renderPostMarkdown } from "./markdown";
import { POSTS_LIST_CACHE_TAG, postSlugCacheTag } from "./cache-tags";

export { POSTS_LIST_CACHE_TAG, postSlugCacheTag } from "./cache-tags";

export async function getCachedPosts() {
  "use cache";
  cacheLife("max");
  cacheTag(POSTS_LIST_CACHE_TAG);

  const posts = await listPosts();

  return posts.map((post) => ({
    ...post,
    publicationDate: post.publicationDate.toISOString(),
  }));
}

export async function getCachedPostBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(postSlugCacheTag(slug));

  const post = await getPostBySlug(slug);

  if (!post) return null;

  return {
    title: post.title,
    publicationDate: post.publicationDate.toISOString(),
    contentHtml: await renderPostMarkdown(post.bodyMarkdown),
  };
}
