import type { UserRole } from "@/lib/db/schema"

export type AdminCapability = "content" | "settings" | "leads" | "operations"

const ROLE_CAPABILITIES: Record<UserRole, readonly AdminCapability[]> = {
  owner: ["content", "settings", "leads", "operations"],
  manager: ["settings", "leads", "operations"],
  staff: ["operations"],
}

export function can(role: UserRole, capability: AdminCapability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability)
}

export function branchHomeSection(role: UserRole): "general" | "punch-cards" {
  return can(role, "settings") ? "general" : "punch-cards"
}
