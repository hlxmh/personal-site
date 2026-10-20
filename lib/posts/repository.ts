import 'server-only'

import { desc, eq } from 'drizzle-orm'
import { getDatabase } from '../db/client'
import { posts, type Post } from '../db/schema'
import {
    allocateUniqueSlug,
    buildPostInsertMutation,
    buildPostUpdateMutation,
    normalizePostInput,
    SlugAllocationError,
    type PostInput,
} from './repository-logic'

export type PostSummary = Pick<
    Post,
    'title' | 'slug' | 'publicationDate'
>

export type PostDetail = Pick<
    Post,
    'title' | 'bodyMarkdown' | 'publicationDate'
>

export type AdminPostSummary = Pick<Post, 'id' | 'title' | 'updatedAt'>

export type AdminPostDetail = Pick<
    Post,
    'id' | 'title' | 'slug' | 'bodyMarkdown'
>

export class PostNotFoundError extends Error {
    constructor() {
        super('Post not found.')
        this.name = 'PostNotFoundError'
    }
}

export function listPosts(): Promise<PostSummary[]> {
    return getDatabase()
        .select({
            title: posts.title,
            slug: posts.slug,
            publicationDate: posts.publicationDate,
        })
        .from(posts)
        .orderBy(desc(posts.publicationDate), desc(posts.createdAt))
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
    const [post] = await getDatabase()
        .select({
            title: posts.title,
            bodyMarkdown: posts.bodyMarkdown,
            publicationDate: posts.publicationDate,
        })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1)

    return post ?? null
}

export async function listAdminPosts(): Promise<AdminPostSummary[]> {
    return getDatabase()
        .select({
            id: posts.id,
            title: posts.title,
            updatedAt: posts.updatedAt,
        })
        .from(posts)
        .orderBy(desc(posts.updatedAt))
}

export async function getAdminPostById(
    id: string
): Promise<AdminPostDetail | null> {
    const database = getDatabase()
    const [post] = await database
        .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            bodyMarkdown: posts.bodyMarkdown,
        })
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1)

    return post ?? null
}

export async function createPost(input: PostInput): Promise<Post> {
    const database = getDatabase()
    const normalized = normalizePostInput(input)

    return allocateUniqueSlug({
        baseSlug: normalized.baseSlug,
        async write(slug) {
            const [post] = await database
                .insert(posts)
                .values(
                    buildPostInsertMutation({
                        title: normalized.title,
                        slug,
                        bodyMarkdown: normalized.bodyMarkdown,
                    })
                )
                .returning()

            return post
        },
    })
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
    const database = getDatabase()
    const normalized = normalizePostInput(input)

    return allocateUniqueSlug({
        baseSlug: normalized.baseSlug,
        async write(slug) {
            const [post] = await database
                .update(posts)
                .set(
                    buildPostUpdateMutation({
                        content: {
                            title: normalized.title,
                            slug,
                            bodyMarkdown: normalized.bodyMarkdown,
                        },
                    })
                )
                .where(eq(posts.id, id))
                .returning()

            if (!post) throw new PostNotFoundError()
            return post
        },
    })
}

export async function deletePost(id: string): Promise<string> {
    const database = getDatabase()
    const [deleted] = await database
        .delete(posts)
        .where(eq(posts.id, id))
        .returning({ slug: posts.slug })

    if (deleted) return deleted.slug
    throw new PostNotFoundError()
}

export { SlugAllocationError }
