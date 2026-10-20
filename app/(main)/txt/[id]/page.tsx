import Date from '../../../../components/date'
import { getCachedPostBySlug } from '../../../../lib/posts/cache'
import { lookupValidPublicPost } from '../../../../lib/posts/public-post'
import { formatPublicationDate } from '../../../../lib/posts/publication-date'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type PostPageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { id } = await params
    const postData = await lookupValidPublicPost(
        id,
        getCachedPostBySlug
    )

    if (!postData) {
        notFound()
    }

    return {
        title: postData.title,
        description: `Published ${formatPublicationDate(postData.publicationDate)}.`,
    }
}

async function PostContent({ params }: PostPageProps) {
    const { id } = await params
    const postData = await lookupValidPublicPost(
        id,
        getCachedPostBySlug
    )

    if (!postData) {
        notFound()
    }

    return (
        <section className="relative mx-auto my-8 mr-5 w-[90%] bg-black bg-opacity-50 px-8 py-3 shadow-lg">
            <article>
                <h1>{postData.title}</h1>
                <Date dateString={postData.publicationDate} />
                <div
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </article>
        </section>
    )
}

export default function Post(props: PostPageProps) {
    return (
        <Suspense
            fallback={
                <section className="relative mx-auto my-8 mr-5 w-[90%] bg-black bg-opacity-50 px-8 py-3 shadow-lg">
                    <p className="text-gray-400">Loading post...</p>
                </section>
            }
        >
            <PostContent {...props} />
        </Suspense>
    )
}
