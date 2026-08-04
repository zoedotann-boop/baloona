import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { databaseUrl } from "@/lib/env"

import * as schema from "./schema"

/**
 * Neon over HTTP: one round trip per statement, no connection pool to manage,
 * and it works in every Next.js runtime. Multi-statement writes go through
 * `db.batch(...)` since the HTTP driver has no interactive transactions.
 *
 * Column names are snake_cased from the camelCase schema keys, which keeps the
 * TypeScript surface idiomatic and the SQL readable.
 */
export const db = drizzle(neon(databaseUrl()), {
  schema,
  casing: "snake_case",
})
