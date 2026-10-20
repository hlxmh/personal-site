import 'server-only'

import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export type Database = ReturnType<typeof createDatabase>

let database: Database | undefined

function createDatabase(connectionString: string) {
    return drizzle(connectionString, { schema })
}

export function getDatabase(): Database {
    const connectionString = process.env.DATABASE_URL?.trim()

    if (!connectionString) {
        throw new Error(
            'DATABASE_URL is required before accessing the posts database.'
        )
    }

    database ??= createDatabase(connectionString)
    return database
}
