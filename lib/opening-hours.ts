/** The venue timezone — hours are entered and displayed as local wall-clock. */
const TIME_ZONE = "Asia/Jerusalem"

export interface DayHours {
  weekday: number
  opensAt: string
  closesAt: string
  isClosed: boolean
}

export interface OpenState {
  isOpen: boolean
  /** When open: today's closing time. When closed: the next opening time. */
  time: string
  /** Index into the weekday-name list for the next opening day, when closed. */
  nextWeekday?: number
}

/** Minutes since midnight for an `HH:mm` string, or `null` when unparseable. */
function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

/** Current weekday (0 = Sunday) and minutes since midnight, in venue time. */
function nowInVenue(now: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return {
    weekday: Math.max(0, weekdays.indexOf(get("weekday"))),
    // Intl renders midnight as "24" in some ICU versions.
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  }
}

/**
 * Whether the venue is open right now, and the time that matters next.
 *
 * Drives the header's "פתוח עכשיו · עד 19:00" badge from real opening hours
 * instead of a hard-coded string, so changing hours in the admin is enough.
 */
export function getOpenState(
  hours: DayHours[],
  now: Date = new Date()
): OpenState | null {
  if (hours.length === 0) return null
  const byWeekday = new Map(hours.map((h) => [h.weekday, h]))
  const { weekday, minutes } = nowInVenue(now)

  const today = byWeekday.get(weekday)
  if (today && !today.isClosed) {
    const opens = toMinutes(today.opensAt)
    const closes = toMinutes(today.closesAt)
    if (
      opens !== null &&
      closes !== null &&
      minutes >= opens &&
      minutes < closes
    )
      return { isOpen: true, time: today.closesAt }
  }

  // Closed: look ahead for the next day that opens, starting with later today.
  for (let offset = 0; offset < 7; offset++) {
    const day = byWeekday.get((weekday + offset) % 7)
    if (!day || day.isClosed) continue
    const opens = toMinutes(day.opensAt)
    if (opens === null) continue
    if (offset === 0 && minutes >= opens) continue
    return { isOpen: false, time: day.opensAt, nextWeekday: day.weekday }
  }

  return { isOpen: false, time: "" }
}

export interface HoursSummaryRow {
  /** Weekday indices this row covers, e.g. `[0,1,2,3,4]` for Sunday–Thursday. */
  weekdays: number[]
  opensAt: string
  closesAt: string
  isClosed: boolean
}

/**
 * Collapse seven rows into the ranges people actually read
 * ("א׳–ה׳ 09:00–19:00 · שישי 09:00–15:00"), merging consecutive days that
 * share the same hours.
 */
export function summarizeHours(hours: DayHours[]): HoursSummaryRow[] {
  const ordered = [...hours].sort((a, b) => a.weekday - b.weekday)
  const rows: HoursSummaryRow[] = []

  for (const day of ordered) {
    const previous = rows.at(-1)
    const sameAsPrevious =
      previous &&
      previous.isClosed === day.isClosed &&
      previous.opensAt === day.opensAt &&
      previous.closesAt === day.closesAt &&
      previous.weekdays.at(-1) === day.weekday - 1

    if (sameAsPrevious) previous.weekdays.push(day.weekday)
    else
      rows.push({
        weekdays: [day.weekday],
        opensAt: day.opensAt,
        closesAt: day.closesAt,
        isClosed: day.isClosed,
      })
  }

  return rows
}

export interface WeekdayNames {
  short: string[]
  long: string[]
}

/**
 * Label a summary row the way the printed hours read: a single day gets its
 * full name ("שישי"), a run of days gets an abbreviated range ("א׳–ה׳").
 */
export function formatWeekdayRange(
  row: HoursSummaryRow,
  names: WeekdayNames
): string {
  if (row.weekdays.length === 1) return names.long[row.weekdays[0]] ?? ""
  const first = names.short[row.weekdays[0]] ?? ""
  const last = names.short[row.weekdays.at(-1) as number] ?? ""
  return `${first}–${last}`
}
