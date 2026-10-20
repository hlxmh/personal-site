import Link from 'next/link'

import SignOutButton from 'app/auth/access-denied/sign-out-button'
import PostEditor from 'components/admin/post-editor'
import { requireAdmin } from 'lib/auth/server'
import styles from 'styles/admin.module.css'

export default async function NewPostPage() {
    await requireAdmin()

    return (
        <main className={styles.shell}>
            <p className={styles.backLink}>
                <Link href="/admin/posts">← All posts</Link>
            </p>
            <header className={styles.editorHeader}>
                <div>
                    <p className={styles.eyebrow}>New post</p>
                    <h1>Create post</h1>
                </div>
                <SignOutButton />
            </header>
            <PostEditor />
        </main>
    )
}
