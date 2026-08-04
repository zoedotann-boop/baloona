import { jsonb, timestamp } from "drizzle-orm/pg-core"

import { type Locale } from "@/i18n/routing"

/**
 * A translatable value, stored as a single `jsonb` column keyed by locale.
 *
 * One column per translatable field (rather than a `translations` join table)
 * keeps a page read to a single row per table and lets the admin edit every
 * language of a field side by side. Hebrew is the source language and is always
 * present; other locales may be missing until an editor — or the "מלא עם AI"
 * button — fills them, so readers must go through `pickLocale`.
 */
export type Localized = Partial<Record<Locale, string>> & { he: string }

/** A translatable list of short lines (pop-up bullets, pricing rules, …). */
export type LocalizedList = Partial<Record<Locale, string[]>> & { he: string[] }

/** `jsonb` column holding a {@link Localized} value. */
export const localized = () => jsonb().$type<Localized>()

/** `jsonb` column holding a {@link LocalizedList} value. */
export const localizedList = () => jsonb().$type<LocalizedList>()

/** `created_at` / `updated_at` pair shared by every table. */
export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}
