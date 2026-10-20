import Link from 'next/link'

import SignOutButton from 'app/auth/access-denied/sign-out-button'
import { requireAdmin } from 'lib/auth/server'
import { listAdminPosts } from 'lib/posts/index'
import { PUBLICATION_TIME_ZONE } from 'lib/posts/publication-date'
import styles from 'styles/admin.module.css'

function formatUpdatedAt(value: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: PUBLICATION_TIME_ZONE,
    }).format(value)
}

export default async function AdminPostsPage() {
    await requireAdmin()
    const posts = await listAdminPosts()

    return (
        <main className={styles.shell}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Admin</p>
                    <h1>Posts</h1>
                </div>
                <div className={styles.headerActions}>
                    <Link className={styles.primaryLink} href="/admin/posts/new">
                        New post
                    </Link>
                    <SignOutButton />
                </div>
            </header>

            {posts.length ? (
                <ul className={styles.postList}>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/admin/posts/${post.id}`}>
                                <span>{post.title}</span>
                                <span className={styles.postMeta}>
                                    Updated {formatUpdatedAt(post.updatedAt)}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts yet. Create your first post.</p>
            )}

            <p className={styles.backLink}>
                <Link href="/txt">← Back to public posts</Link>
            </p>
        </main>
    )
}
