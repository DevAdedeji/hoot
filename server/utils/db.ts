import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@server/database/schema'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const globalDatabase = globalThis as typeof globalThis & {
  hootPostgres?: ReturnType<typeof postgres>
}

const client =
  globalDatabase.hootPostgres ??
  postgres(databaseUrl, {
    max: 10,
    prepare: false
  })

globalDatabase.hootPostgres = client

export const db = drizzle({ client, schema })
