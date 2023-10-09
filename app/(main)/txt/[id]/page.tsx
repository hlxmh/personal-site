// make the 404
// and test true
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostIds();
}


import { getAllPostIds, getPostData } from '../../../../lib/posts';
import Date from '../../../../components/date';

// add head w/ post title
export default async function Post({ params }: { params: { id: string } } ) {
    // how to handle caching?
    const postData = await getPostData(params?.id as string);
  return (
      <article>
        <h1>{postData.title}</h1>
        <Date dateString={postData.date} />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
  );
}