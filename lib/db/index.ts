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
 *
 * The client is built lazily on first use (via a Proxy) so that importing this
 * module never reads `DATABASE_URL` — only an actual query does. That keeps
 * `next build`'s page-data collection working without the variable present
 * (every page is dynamic anyway), while a real request still requires it.
 */
function createDb() {
  return drizzle(neon(databaseUrl()), {
    schema,
    casing: "snake_case",
  })
}

type Db = ReturnType<typeof createDb>

let instance: Db | null = null

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    instance ??= createDb()
    const value = Reflect.get(instance, prop)
    return typeof value === "function" ? value.bind(instance) : value
  },
})
