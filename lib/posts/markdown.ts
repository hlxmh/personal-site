import { remark } from 'remark'
import html from 'remark-html'

/**
 * The sanitizer drops raw HTML and strips unsafe link and image protocols.
 */
export async function renderPostMarkdown(markdown: string): Promise<string> {
    const rendered = await remark()
        .use(html, { sanitize: true })
        .process(markdown)

    return rendered.toString()
}
