"use client"

import { useTranslations } from "next-intl"
import { KeyRound, Pencil, Plus, Trash2, X } from "lucide-react"
import { useState, useTransition } from "react"

import { AdminDialog } from "@/components/admin/admin-dialog"
import { AdminModal } from "@/components/admin/admin-modal"
import { ConfirmModal } from "@/components/admin/confirm-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "@/components/admin/admin-table"
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-ui"
import { PillButton } from "@/components/brand/pill-button"
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/lib/actions/admin/locations"
import { authClient } from "@/lib/auth-client"
import type { UserRole } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

interface TeamLocation {
  id: string
  name: string
}

interface TeamRow {
  id: string
  name: string
  email: string
  role: UserRole
  locationIds: string[]
  isSelf: boolean
}

/**
 * ניהול צוות — who can sign in, and which branches they can edit.
 *
 * Owners see everything; managers only see the branches ticked here, which is
 * what `requireLocationAccess` enforces on every admin route and action.
 */
function TeamManager({
  members,
  locations,
}: {
  members: TeamRow[]
  locations: TeamLocation[]
}) {
  const t = useTranslations("admin.team")
  const common = useTranslations("admin.common")
  const [adding, setAdding] = useState(false)

  return (
    <div className="pb-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-[28px] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {t("description")}
          </p>
        </div>
        {!adding && (
          <PillButton type="button" size="sm" onClick={() => setAdding(true)}>
            <Plus className="size-4" />
            {t("addMember")}
          </PillButton>
        )}
      </header>

      {adding && (
        <NewMemberForm locations={locations} onDone={() => setAdding(false)} />
      )}

      <div className="mt-5">
        <AdminTable
          headers={[
            { label: t("name"), tooltip: t("nameTip") },
            { label: t("email"), tooltip: t("emailTip") },
            { label: t("role"), className: "w-36", tooltip: t("roleTip") },
            {
              label: t("assignedLocations"),
              className: "w-48",
              tooltip: t("assignedLocationsTip"),
            },
            { label: common("actions"), className: "w-px sr-only" },
          ]}
        >
          {members.length === 0 && (
            <AdminTableEmpty colSpan={5} label={common("empty")} />
          )}
          {members.map((member) => (
            <MemberRow key={member.id} member={member} locations={locations} />
          ))}
        </AdminTable>
      </div>
    </div>
  )
}

function RolePicker({
  value,
  onChange,
  className,
}: {
  value: UserRole
  onChange: (role: UserRole) => void
  className?: string
}) {
  const t = useTranslations("admin.team")
  return (
    <AdminSelect
      value={value}
      onChange={(event) => onChange(event.target.value as UserRole)}
      className={className}
    >
      <option value="owner">{t("owner")}</option>
      <option value="manager">{t("manager")}</option>
    </AdminSelect>
  )
}

function LocationPicker({
  locations,
  selected,
  onChange,
}: {
  locations: TeamLocation[]
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const t = useTranslations("admin.team")
  return (
    <AdminField label={t("assignedLocations")}>
      <div className="flex flex-wrap gap-2">
        {locations.map((location) => {
          const checked = selected.includes(location.id)
          return (
            <button
              key={location.id}
              type="button"
              aria-pressed={checked}
              onClick={() =>
                onChange(
                  checked
                    ? selected.filter((id) => id !== location.id)
                    : [...selected, location.id]
                )
              }
              className={cn(
                "h-9 rounded-full px-4 text-[14px] font-bold transition",
                checked
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:brightness-95"
              )}
            >
              {location.name}
            </button>
          )
        })}
      </div>
    </AdminField>
  )
}

function NewMemberForm({
  locations,
  onDone,
}: {
  locations: TeamLocation[]
  onDone: () => void
}) {
  const t = useTranslations("admin.team")
  const common = useTranslations("admin.common")
  const [role, setRole] = useState<UserRole>("manager")
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(null)
    start(async () => {
      const result = await createTeamMember({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        role,
        locationIds,
      })
      if (result.ok) onDone()
      else
        setError(
          result.error === "email-taken" ? t("emailTaken") : result.error
        )
    })
  }

  return (
    <AdminCard title={t("addMember")}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label={t("name")} tooltip={t("nameTip")}>
            <AdminInput name="name" required />
          </AdminField>
          <AdminField label={t("email")} tooltip={t("emailTip")}>
            <AdminInput
              name="email"
              type="email"
              required
              dir="ltr"
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("password")} tooltip={t("passwordTip")}>
            <AdminInput
              name="password"
              type="text"
              required
              minLength={8}
              dir="ltr"
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("role")} tooltip={t("roleTip")}>
            <RolePicker value={role} onChange={setRole} />
          </AdminField>
        </div>

        {role === "manager" && (
          <LocationPicker
            locations={locations}
            selected={locationIds}
            onChange={setLocationIds}
          />
        )}

        {error && (
          <p role="alert" className="text-[14px] font-bold text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <PillButton type="submit" size="sm" disabled={pending}>
            {t("create")}
          </PillButton>
          <button
            type="button"
            onClick={onDone}
            className="text-[14px] font-bold text-muted-foreground underline"
          >
            {common("cancel")}
          </button>
        </div>
      </form>
    </AdminCard>
  )
}

function MemberRow({
  member,
  locations,
}: {
  member: TeamRow
  locations: TeamLocation[]
}) {
  const t = useTranslations("admin.team")
  const common = useTranslations("admin.common")
  const [role, setRole] = useState(member.role)
  const [locationIds, setLocationIds] = useState(member.locationIds)
  const [editing, setEditing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const save = () =>
    start(async () => {
      setError(null)
      const result = await updateTeamMember({
        userId: member.id,
        role,
        locationIds,
      })
      if (!result.ok)
        setError(
          result.error === "cannot-demote-self"
            ? t("cannotDemoteSelf")
            : result.error
        )
    })

  // Owners reach every branch, so listing branches for them would be a lie.
  const branchNames =
    role === "owner"
      ? t("allLocations")
      : locations
          .filter((location) => locationIds.includes(location.id))
          .map((location) => location.name)
          .join(", ")

  return (
    <AdminTableRow>
      <td className={adminCell}>
        <span className="font-bold text-brand-plum">{member.name}</span>
        {member.isSelf && (
          <span className="ms-2 rounded-full bg-muted px-2 py-0.5 text-[12px] font-bold text-muted-foreground">
            {t("you")}
          </span>
        )}
      </td>
      <td className={adminCell}>
        <span dir="ltr" className="block text-start text-muted-foreground">
          {member.email}
        </span>
      </td>
      <td className={cn(adminCell, "w-36")}>
        {role === "owner" ? t("owner") : t("manager")}
      </td>
      <td className={cn(adminCell, "w-48")}>
        <span className="line-clamp-1 text-muted-foreground">
          {branchNames || "—"}
        </span>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={common("edit")}
            className="flex size-8 items-center justify-center rounded-lg text-brand-plum transition hover:bg-white"
          >
            <Pencil className="size-4" />
          </button>
          {member.isSelf && (
            <button
              type="button"
              onClick={() => setChangingPassword(true)}
              aria-label={t("changePassword")}
              className="flex size-8 items-center justify-center rounded-lg text-brand-plum transition hover:bg-white"
            >
              <KeyRound className="size-4" />
            </button>
          )}
          {!member.isSelf && (
            <button
              type="button"
              disabled={pending}
              onClick={() => setRemoving(true)}
              aria-label={t("delete")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>

        <ConfirmModal
          open={removing}
          onClose={() => setRemoving(false)}
          onConfirm={() =>
            start(async () => {
              setError(null)
              const result = await deleteTeamMember(member.id)
              if (!result.ok)
                setError(
                  result.error === "cannot-delete-self"
                    ? t("cannotDeleteSelf")
                    : result.error
                )
            })
          }
          title={member.name}
          message={common("removeNowMessage")}
          confirmLabel={t("delete")}
        />

        <AdminModal
          open={editing}
          onClose={() => setEditing(false)}
          title={member.name}
        >
          <RolePicker
            value={role}
            onChange={(next) => {
              setRole(next)
              setLocationIds(next === "owner" ? [] : locationIds)
            }}
          />

          {role === "manager" && (
            <LocationPicker
              locations={locations}
              selected={locationIds}
              onChange={setLocationIds}
            />
          )}

          {error && (
            <p role="alert" className="text-[14px] font-bold text-destructive">
              {error}
            </p>
          )}

          <PillButton
            type="button"
            size="sm"
            variant="outline"
            onClick={save}
            disabled={pending}
          >
            {pending ? common("saving") : t("update")}
          </PillButton>
        </AdminModal>

        {member.isSelf && (
          <ChangePasswordModal
            open={changingPassword}
            onClose={() => setChangingPassword(false)}
          />
        )}
      </td>
    </AdminTableRow>
  )
}

/**
 * Self-service password change for the signed-in user.
 *
 * Better Auth verifies the current password and revokes other sessions, so a
 * changed password logs the account out everywhere but the current tab.
 */
function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations("admin.team")
  const common = useTranslations("admin.common")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, start] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const currentPassword = String(data.get("currentPassword") ?? "")
    const newPassword = String(data.get("newPassword") ?? "")
    const confirmPassword = String(data.get("confirmPassword") ?? "")

    setError(null)
    setDone(false)

    if (newPassword !== confirmPassword) {
      setError(t("passwordsMismatch"))
      return
    }

    start(async () => {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (result.error) {
        setError(
          result.error.code === "INVALID_PASSWORD"
            ? t("currentPasswordWrong")
            : common("saveError")
        )
        return
      }
      form.reset()
      setDone(true)
    })
  }

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      className="w-[min(28rem,calc(100vw-2rem))]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="truncate font-heading text-[18px] font-black text-brand-plum">
          {t("changePassword")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={common("close")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
        >
          <X className="size-5" />
        </button>
      </div>

      <form onSubmit={submit}>
        <div className="space-y-4 px-5 py-4">
          <AdminField label={t("currentPassword")}>
            <AdminInput
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              dir="ltr"
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("newPassword")} tooltip={t("newPasswordTip")}>
            <AdminInput
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              dir="ltr"
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("confirmPassword")}>
            <AdminInput
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              dir="ltr"
              className="text-start"
            />
          </AdminField>

          {error && (
            <p role="alert" className="text-[14px] font-bold text-destructive">
              {error}
            </p>
          )}
          {done && (
            <p role="status" className="text-[14px] font-bold text-brand-green">
              {t("passwordChanged")}
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-border px-5 py-3">
          <PillButton type="submit" size="sm" disabled={pending}>
            {pending ? common("saving") : t("changePassword")}
          </PillButton>
        </div>
      </form>
    </AdminDialog>
  )
}

export { TeamManager }
