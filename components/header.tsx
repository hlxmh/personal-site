'use client'

import styles from '../styles/header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

const name = 'AAAAAAAAAAAAAAAAA';

export default function Header() {
    // necessary?
    const pathname = usePathname()
    console.log(pathname)
  return (
    <header className={styles.header}>
        <ul>
            <li>
                <Link href="/">index</Link>
            </li>
            <li>
                <Link href="/">projects</Link>
            </li>
            <li>
                <Link href="/">music</Link>
            </li>
            <li>
                <Link href="/">photography</Link>
            </li>
            <li>
                <Link href="/">thoughts</Link>
            </li>
        </ul>
    </header>
  );
}