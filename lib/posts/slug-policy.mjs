export const MAX_POST_SLUG_LENGTH = 245

const publicPostSlugPattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

export function isValidPublicPostSlug(slug) {
    return (
        typeof slug === 'string' &&
        slug.length > 0 &&
        slug.length <= MAX_POST_SLUG_LENGTH &&
        publicPostSlugPattern.test(slug)
    )
}
