import type { UserRole } from "@/lib/db/schema"

/**
 * Role-based permissions for the branch admin.
 *
 * A capability is one editable area of a branch. Every branch-scoped page and
 * server action declares the capability it needs, and `requireLocationAccess`
 * (server) plus the sidebar (client) both read this map — so there is a single
 * source of truth for "who can touch what".
 *
 * - `content`    — marketing content: home, pricing, menu, birthdays, media,
 *                  reviews, shop and terms pages.
 * - `settings`   — branch settings: contact details, opening hours, the pop-up
 *                  announcement, SEO and tracking.
 * - `leads`      — the customer inquiries inbox.
 * - `operations` — punch cards.
 *
 * The three roles form a strict hierarchy (owner ⊇ manager ⊇ staff), so this is
 * intentionally a plain lookup rather than a general-purpose ACL.
 */
export type AdminCapability = "content" | "settings" | "leads" | "operations"

const ROLE_CAPABILITIES: Record<UserRole, readonly AdminCapability[]> = {
  owner: ["content", "settings", "leads", "operations"],
  manager: ["settings", "leads", "operations"],
  staff: ["operations"],
}

/** Whether `role` may access the given capability. */
export function can(role: UserRole, capability: AdminCapability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability)
}

/**
 * The section a role lands on when opening a branch — its most privileged home.
 * Staff cannot reach branch settings, so they go straight to punch cards.
 */
export function branchHomeSection(role: UserRole): "general" | "punch-cards" {
  return can(role, "settings") ? "general" : "punch-cards"
}
