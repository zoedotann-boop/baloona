import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/baloona",
  },
})
