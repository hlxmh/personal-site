import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core'

export const posts = pgTable(
    'posts',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        title: text('title').notNull(),
        slug: text('slug').notNull(),
        bodyMarkdown: text('body_markdown').notNull(),
        publicationDate: timestamp('publication_date', { withTimezone: true })
            .defaultNow()
            .notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        uniqueIndex('posts_slug_unique').on(table.slug),
        index('posts_publication_date_idx').on(table.publicationDate),
    ]
)

export type Post = typeof posts.$inferSelect
