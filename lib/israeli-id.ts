/**
 * Israeli ID (תעודת זהות) validation.
 *
 * A valid teudat zehut is exactly 9 digits — visitors are asked to pad shorter
 * numbers with leading zeros — and passes a Luhn-style check: each digit is
 * weighted 1, 2, 1, 2… from the left, digits of any two-digit product are
 * summed, and the grand total must divide by 10. The length rule rejects a
 * too-short entry; the checksum catches the common "one digit off" typo. The
 * same rule guards the field on the client and on the server.
 */
export function isValidIsraeliId(value: string): boolean {
  const digits = value.trim()
  if (!/^\d{9}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    const step = Number(digits[i]) * ((i % 2) + 1)
    sum += step > 9 ? step - 9 : step
  }
  return sum % 10 === 0
}
