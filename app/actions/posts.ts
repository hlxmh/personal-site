'use server'

import 'server-only'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from 'lib/auth/server'
import { postMutationCacheTags } from 'lib/posts/cache-tags'
import {
    createPost,
    deletePost,
    getAdminPostById,
    PostNotFoundError,
    PostValidationError,
    SlugAllocationError,
    updatePost,
} from 'lib/posts/index'

export type PostEditorState = {
    error: string | null
    values: {
        title: string
        bodyMarkdown: string
    }
}

function fieldValue(formData: FormData, name: string): string {
    const value = formData.get(name)
    return typeof value === 'string' ? value : ''
}

function invalidatePostTags(...slugs: Array<string | null | undefined>) {
    for (const tag of postMutationCacheTags(...slugs)) updateTag(tag)
}

function expectedErrorMessage(error: unknown): string | null {
    if (
        error instanceof PostValidationError ||
        error instanceof SlugAllocationError ||
        error instanceof PostNotFoundError
    ) {
        return error.message
    }

    return null
}

export async function managePostAction(
    _previousState: PostEditorState,
    formData: FormData
): Promise<PostEditorState> {
    await requireAdmin()

    const intent = fieldValue(formData, 'intent')
    const postId = fieldValue(formData, 'postId') || null
    const values = {
        title: fieldValue(formData, 'title'),
        bodyMarkdown: fieldValue(formData, 'bodyMarkdown'),
    }
    let destination: string

    try {
        // Intent: create a new public post.
        if (!postId) {
            if (intent !== 'save') {
                return {
                    error: 'Unknown post action.',
                    values,
                }
            }

            const saved = await createPost(values)
            invalidatePostTags(saved.slug)
            destination = `/admin/posts/${saved.id}`
        } else {
            // Intent: permanently delete an existing post.
            if (intent === 'delete') {
                const deletedSlug = await deletePost(postId)
                invalidatePostTags(deletedSlug)
                destination = '/admin/posts'
            } else if (intent === 'save') {
                // Intent: save content changes to an existing public post.
                const existing = await getAdminPostById(postId)
                if (!existing) throw new PostNotFoundError()

                const updated = await updatePost(postId, values)
                invalidatePostTags(existing.slug, updated.slug)
                destination = `/admin/posts/${postId}`
            } else {
                return {
                    error: 'Unknown post action.',
                    values,
                }
            }
        }
    } catch (error) {
        const message = expectedErrorMessage(error)
        if (!message) throw error

        return {
            error: message,
            values,
        }
    }

    redirect(destination)
}
