export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostIds();
}

import { getAllPostIds, getPostData } from "../../../../lib/posts";
import Date from "../../../../components/date";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PostPageProps = { params: { id: string } };

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const postData = await getPostData(params.id);

  if (!postData) {
    notFound();
  }

  return {
    title: postData.title,
    description: `Published ${postData.date}.`,
  };
}

export default async function Post({ params }: PostPageProps) {
  const postData = await getPostData(params.id);

  if (!postData) {
    notFound();
  }

  return (
    <section className="w-[90%] my-8 shadow-lg bg-black px-8 py-3 relative bg-opacity-50 mx-auto mr-5">
      <article>
        <h1>{postData.title}</h1>
        <Date dateString={postData.date} />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </section>
  );
}
