"use client";

import styles from "../styles/header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const name = "AAAAAAAAAAAAAAAAA";

export default function Header() {
  // necessary?
  const pathname = usePathname();
  console.log(pathname);
  return (
    <header className="fixed">
      <ul>
        <li>
          <Link href="/">_index</Link>
        </li>
        <li>
          <Link href="/">_projects</Link>
        </li>
        <li>
          <Link href="/">_music</Link>
        </li>
        <li>
          <Link href="/">_photography</Link>
        </li>
        <li>
          <Link href="/">_thoughts</Link>
        </li>
      </ul>
    </header>
  );
}
