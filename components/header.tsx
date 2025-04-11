import Link from 'next/link'

export default function Header() {
    return (
        <header className="fixed z-10">
            <ul>
                <li>
                    <Link href="/">_index</Link>
                </li>
                <li>
                    <Link href="/project">_projects</Link>
                </li>
                <li>
                    <Link href="/sound">_music</Link>
                </li>
                <li>
                    <Link href="/img">_photography</Link>
                </li>
                <li>
                    <Link href="/txt">_thoughts</Link>
                </li>
            </ul>
        </header>
    )
}
