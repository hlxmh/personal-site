'use client'

import { useActionState, useState } from 'react'

import {
    managePostAction,
    type PostEditorState,
} from 'app/actions/posts'
import styles from 'styles/admin.module.css'

type EditorPost = {
    id: string
    title: string
    bodyMarkdown: string
}

type PostEditorProps = {
    post?: EditorPost
}

export default function PostEditor({ post }: PostEditorProps) {
    const initialState: PostEditorState = {
        error: null,
        values: {
            title: post?.title ?? '',
            bodyMarkdown: post?.bodyMarkdown ?? '',
        },
    }
    const [state, formAction, pending] = useActionState(
        managePostAction,
        initialState
    )
    const [title, setTitle] = useState(initialState.values.title)
    const [bodyMarkdown, setBodyMarkdown] = useState(
        initialState.values.bodyMarkdown
    )

    return (
        <form action={formAction} className={styles.editorForm}>
            {post ? <input type="hidden" name="postId" value={post.id} /> : null}

            <div className={styles.field}>
                <label htmlFor="post-title">Title</label>
                <input
                    id="post-title"
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={pending}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="post-markdown">Markdown</label>
                <textarea
                    id="post-markdown"
                    name="bodyMarkdown"
                    required
                    rows={20}
                    value={bodyMarkdown}
                    onChange={(event) => setBodyMarkdown(event.target.value)}
                    disabled={pending}
                />
            </div>

            {state.error ? (
                <p className={styles.error} role="alert">
                    {state.error}
                </p>
            ) : null}

            <div className={styles.actions}>
                <button type="submit" name="intent" value="save" disabled={pending}>
                    {post ? 'Save changes' : 'Create post'}
                </button>
                {post ? (
                    <button
                        type="submit"
                        name="intent"
                        value="delete"
                        formNoValidate
                        className={styles.dangerButton}
                        disabled={pending}
                        onClick={(event) => {
                            if (
                                !window.confirm(
                                    'Permanently delete this post? This cannot be undone.'
                                )
                            ) {
                                event.preventDefault()
                            }
                        }}
                    >
                        Delete post
                    </button>
                ) : null}
            </div>

            <p className={styles.pending} aria-live="polite">
                {pending ? 'Working…' : ''}
            </p>
        </form>
    )
}
