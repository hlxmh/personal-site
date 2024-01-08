import { getSortedPostsData } from "lib/posts";
import Link from "next/link";
import Date from "components/date";
import style from "styles/txt.module.css";

// TODO i think the highlight square pos is wrong
export default function Txt() {
  const allPostsData = getSortedPostsData();
  return (
    <section
      id="blog_list"
      className="w-[50%] my-8 shadow-lg bg-black px-8 py-3 bg-opacity-50 ml-4 absolute right-4"
    >
      <h2>posts</h2>
      <nav>
        {allPostsData?.map(({ id, date, title }) => (
          <Link
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
            ].join(" ")}
            href={`/txt/${id}`}
            key={id}
          >
            <h3>
              <span className={style.menu__item_name}>{title}</span>
            </h3>
            <Date dateString={date} />
          </Link>
        ))}
      </nav>
    </section>
  );
}
