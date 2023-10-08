// 'use client'

import utilStyles from 'styles/utils.module.css';
import { getSortedPostsData } from 'lib/posts';
import Link from 'next/link';
import Date from 'components/date';
// import { usePathname } from 'next/navigation'

export default function Home() {
    const allPostsData = getSortedPostsData();
  return (
    <section id="blog_list" className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
        {allPostsData?.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>{title}</Link>
            <br />
            <small className={utilStyles.lightText}>
                <Date dateString={date} />
            </small>
            </li>
        ))}
        </ul>
    </section>
  );
}


