import styles from 'styles/admin.module.css'

export default function AdminPostsLoading() {
    return (
        <main className={styles.shell}>
            <p aria-live="polite">Loading post editor…</p>
        </main>
    )
}
