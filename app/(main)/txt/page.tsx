import { getSortedPostsData } from 'lib/posts';
import Link from 'next/link';
import Date from 'components/date';

export default function Home() {
    const allPostsData = getSortedPostsData();
  return (
    <section id="blog_list" className="w-[50%] my-8 shadow-lg bg-black px-8 py-3 relative bg-opacity-40 ml-4">
        <h2>posts</h2>
        <ul>
        {allPostsData?.map(({ id, date, title }) => (
            <li className='mb-5' key={id}>
            <h3><Link href={`/txt/${id}`}>{title}</Link></h3>
            <Date dateString={date} />
            </li>
        ))}
        </ul>
    </section>
  );
}
