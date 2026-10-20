import Link from "next/link";
import Date from "components/date";
import { getCachedPosts } from "lib/posts/cache";
import style from "styles/txt.module.css";

// TODO i think the highlight square pos is wrong
export default async function Txt() {
  const allPostsData = await getCachedPosts();

  return (
    <section
      id="blog_list"
      className="w-[50%] my-8 shadow-lg bg-black px-8 py-3 bg-opacity-50 ml-4 absolute right-4"
    >
      <h2>posts</h2>
      <nav>
        {allPostsData.map(({ slug, publicationDate, title }) => (
          <Link
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
            ].join(" ")}
            href={`/txt/${slug}`}
            key={slug}
          >
            <h3>
              <span className={style.menu__item_name}>{title}</span>
            </h3>
            <Date dateString={publicationDate} />
          </Link>
        ))}
      </nav>
      <Link
        className="mt-3 inline-block border border-gray-400 px-3 py-1 text-sm text-gray-300 hover:border-white hover:text-white"
        href="/auth/sign-in"
      >
        Sign in
      </Link>
    </section>
  );
}
