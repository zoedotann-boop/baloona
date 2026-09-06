const TIME_ZONE = "Asia/Jerusalem"

export interface DayHours {
  weekday: number
  opensAt: string
  closesAt: string
  isClosed: boolean
}

export interface OpenState {
  isOpen: boolean
  time: string
  nextWeekday?: number
}

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

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
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  }
}

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
  weekdays: number[]
  opensAt: string
  closesAt: string
  isClosed: boolean
}

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

export function formatWeekdayRange(
  row: HoursSummaryRow,
  names: WeekdayNames
): string {
  if (row.weekdays.length === 1) return names.long[row.weekdays[0]] ?? ""
  const first = names.short[row.weekdays[0]] ?? ""
  const last = names.short[row.weekdays.at(-1) as number] ?? ""
  return `${first}–${last}`
}
