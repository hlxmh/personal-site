import { MAX_POST_SLUG_LENGTH } from './slug.ts'

export const POSTS_LIST_CACHE_TAG = 'posts:list'
const POST_SLUG_CACHE_TAG_PREFIX = 'posts:slug:'

export function postSlugCacheTag(slug: string): string {
    return `${POST_SLUG_CACHE_TAG_PREFIX}${slug.slice(0, MAX_POST_SLUG_LENGTH)}`
}

export function postMutationCacheTags(
    ...slugs: Array<string | null | undefined>
): string[] {
    const tags = new Set<string>([POSTS_LIST_CACHE_TAG])

    for (const slug of slugs) {
        if (slug) tags.add(postSlugCacheTag(slug))
    }

    return [...tags]
}
