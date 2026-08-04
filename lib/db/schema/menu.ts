import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core"

import { localized, timestamps } from "./_shared"
import { locations } from "./locations"

/** Copy around the menu board on `/[location]/menu`. */
export const menuContents = pgTable("menu_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  description: localized().notNull(),
  note: localized().notNull(),
  ...timestamps,
})

/** Menu tabs. Fully editable per location — add, rename, reorder or hide. */
export const menuCategories = pgTable("menu_category", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  isVisible: boolean().notNull().default(true),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

/** A dish or drink. `amount` is whole shekels; formatting happens on render. */
export const menuItems = pgTable("menu_item", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid()
    .notNull()
    .references(() => menuCategories.id, { onDelete: "cascade" }),
  name: localized().notNull(),
  description: localized(),
  amount: integer().notNull().default(0),
  isVisible: boolean().notNull().default(true),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})
