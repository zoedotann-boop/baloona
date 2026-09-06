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
