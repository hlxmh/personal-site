import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import nextEnv from '@next/env'
import { neon } from '@neondatabase/serverless'
import matter from 'gray-matter'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const postsDirectory = path.join(process.cwd(), 'posts')
const calendarDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

function validateCalendarDate(value, fileName) {
    if (typeof value !== 'string') {
        throw new Error(`${fileName}: date must be a YYYY-MM-DD string.`)
    }

    const date = value.trim()
    const match = calendarDatePattern.exec(date)
    if (!match) throw new Error(`${fileName}: date must use YYYY-MM-DD.`)

    const parsed = new Date(0)
    parsed.setUTCHours(0, 0, 0, 0)
    parsed.setUTCFullYear(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
    )
    if (
        parsed.getUTCFullYear() !== Number(match[1]) ||
        parsed.getUTCMonth() !== Number(match[2]) - 1 ||
        parsed.getUTCDate() !== Number(match[3])
    ) {
        throw new Error(`${fileName}: date is not a valid calendar date.`)
    }

    return date
}

async function readLegacyPosts() {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true })
    const fileNames = entries
        .filter((entry) => entry.isFile() && path.extname(entry.name) === '.md')
        .map((entry) => entry.name)
        .sort()

    return Promise.all(
        fileNames.map(async (fileName) => {
            const slug = path.basename(fileName, '.md')

            const source = await fs.readFile(
                path.join(postsDirectory, fileName),
                'utf8'
            )
            const parsed = matter(source)
            const title =
                typeof parsed.data.title === 'string'
                    ? parsed.data.title.trim()
                    : ''
            const bodyMarkdown = parsed.content
            if (!title) throw new Error(`${fileName}: title is required.`)
            if (!bodyMarkdown.trim()) {
                throw new Error(`${fileName}: Markdown body is required.`)
            }

            return {
                fileName,
                slug,
                title,
                bodyMarkdown,
                publicationDate: `${validateCalendarDate(parsed.data.date, fileName)}T12:00:00.000Z`,
            }
        })
    )
}

async function main() {
    const connectionString = process.env.DATABASE_URL?.trim()
    if (!connectionString) throw new Error('DATABASE_URL is required.')

    const legacyPosts = await readLegacyPosts()
    if (legacyPosts.length === 0)
        throw new Error('No Markdown posts were found.')

    const sql = neon(connectionString)
    await sql.transaction(
        legacyPosts.map(
            (post) => sql`
        INSERT INTO posts (title, slug, body_markdown, publication_date)
        VALUES (
          ${post.title},
          ${post.slug},
          ${post.bodyMarkdown},
          ${post.publicationDate}
        )
      `
        )
    )

    console.log(
        `Imported ${legacyPosts.length} posts. Source files were not changed.`
    )
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
})
