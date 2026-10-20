import { isValidPublicPostSlug } from './slug.ts'

export async function lookupValidPublicPost<T>(
    slug: string,
    lookup: (slug: string) => Promise<T>
): Promise<T | null> {
    if (!isValidPublicPostSlug(slug)) return null
    return lookup(slug)
}
