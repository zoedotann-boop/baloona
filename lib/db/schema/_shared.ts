import { jsonb, timestamp } from "drizzle-orm/pg-core"

import { type Locale } from "@/i18n/routing"

export type Localized = Partial<Record<Locale, string>> & { he: string }

export type LocalizedList = Partial<Record<Locale, string[]>> & { he: string[] }

export const localized = () => jsonb().$type<Localized>()

export const localizedList = () => jsonb().$type<LocalizedList>()

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}
