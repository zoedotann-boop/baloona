import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { databaseUrl } from "@/lib/env"

import * as schema from "./schema"

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
