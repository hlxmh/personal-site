import { MAX_POST_SLUG_LENGTH } from './slug-policy.mjs'

const separatorPattern = /[^a-z0-9]+/g
const edgeHyphenPattern = /(^-+|-+$)/g

// Next.js cache tags are limited to 256 characters. The public post cache
// prefix consumes 11 of them, so generated slugs must fit in the remainder.
export { isValidPublicPostSlug, MAX_POST_SLUG_LENGTH } from './slug-policy.mjs'

export function slugifyTitle(title: string): string {
    return title
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(separatorPattern, '-')
        .replace(edgeHyphenPattern, '')
        .slice(0, MAX_POST_SLUG_LENGTH)
        .replace(/-+$/, '')
}

export function slugCandidate(baseSlug: string, attempt: number): string {
    if (!Number.isInteger(attempt) || attempt < 1) {
        throw new Error('Slug attempt must be a positive integer.')
    }

    if (attempt === 1) return baseSlug.slice(0, MAX_POST_SLUG_LENGTH)

    const suffix = `-${attempt}`
    const availableBaseLength = MAX_POST_SLUG_LENGTH - suffix.length
    const boundedBase = baseSlug
        .slice(0, availableBaseLength)
        .replace(/-+$/, '')

    return `${boundedBase}${suffix}`
}
