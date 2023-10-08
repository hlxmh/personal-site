// make the 404
// and test true
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostIds();
}


import Layout from '../../../components/layout';
import { getAllPostIds, getPostData } from '../../../lib/posts';
import Date from '../../../components/date';
import utilStyles from '../../../styles/utils.module.css';

export default async function Post({ params }: { params: { id: string } } ) {
    // how to handle caching?
    const postData = await getPostData(params?.id as string);
  return (
    <Layout>
      {/* <Head>
        <title>{postData.title}</title>
      </Head> */}
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

