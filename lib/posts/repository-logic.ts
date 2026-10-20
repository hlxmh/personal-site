import { slugCandidate, slugifyTitle } from './slug.ts'

export type PostInput = {
    title: string
    bodyMarkdown: string
}

export type NormalizedPostInput = PostInput & {
    baseSlug: string
}

export class PostValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PostValidationError'
    }
}

export function normalizePostInput(input: PostInput): NormalizedPostInput {
    const title = input.title.trim()
    const bodyMarkdown = input.bodyMarkdown.trim()

    if (!title) {
        throw new PostValidationError('A post title is required.')
    }

    if (!bodyMarkdown) {
        throw new PostValidationError('Post Markdown is required.')
    }

    const baseSlug = slugifyTitle(title)
    if (!baseSlug) {
        throw new PostValidationError(
            'The title must contain at least one letter or number that can form a URL.'
        )
    }

    return { title, bodyMarkdown, baseSlug }
}

export const MAX_SLUG_ATTEMPTS = 100

type PostContentValues = {
    title: string
    slug: string
    bodyMarkdown: string
}
export function buildPostInsertMutation(
    content: PostContentValues,
    now = new Date()
) {
    return {
        ...content,
        publicationDate: now,
    }
}

export function buildPostUpdateMutation({
    content,
    now = new Date(),
}: {
    content: PostContentValues
    now?: Date
}) {
    return {
        ...content,
        updatedAt: now,
    }
}

export class SlugAllocationError extends Error {
    constructor() {
        super('Could not allocate a unique post URL. Try a different title.')
        this.name = 'SlugAllocationError'
    }
}

export function isSlugUniqueViolation(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false

    const candidate = error as {
        code?: string
        constraint?: string
        cause?: { code?: string; constraint?: string }
    }
    const code = candidate.code ?? candidate.cause?.code
    const constraint = candidate.constraint ?? candidate.cause?.constraint

    return (
        code === '23505' &&
        (constraint === undefined || constraint === 'posts_slug_unique')
    )
}

export async function allocateUniqueSlug<T>({
    baseSlug,
    write,
}: {
    baseSlug: string
    write: (slug: string) => Promise<T>
}): Promise<T> {
    for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt += 1) {
        const slug = slugCandidate(baseSlug, attempt)

        try {
            return await write(slug)
        } catch (error) {
            if (!isSlugUniqueViolation(error)) throw error
        }
    }

    throw new SlugAllocationError()
}
