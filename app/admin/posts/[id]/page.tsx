import Link from 'next/link'
import { notFound } from 'next/navigation'

import SignOutButton from 'app/auth/access-denied/sign-out-button'
import PostEditor from 'components/admin/post-editor'
import { requireAdmin } from 'lib/auth/server'
import { getAdminPostById } from 'lib/posts/index'
import styles from 'styles/admin.module.css'

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireAdmin()
    const { id } = await params
    const post = await getAdminPostById(id)

    if (!post) notFound()

    return (
        <main className={styles.shell}>
            <p className={styles.backLink}>
                <Link href="/admin/posts">← All posts</Link>
            </p>
            <header className={styles.editorHeader}>
                <div>
                    <p className={styles.eyebrow}>Post editor</p>
                    <h1>Edit post</h1>
                </div>
                <SignOutButton />
            </header>
            <PostEditor post={post} />
        </main>
    )
}
