import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min'

export type { CountryCode } from 'libphonenumber-js/min'

/** Parse national input for the selected country; an explicit + country code always wins. */
export function normalizePhone(input: string, defaultCountry: CountryCode = 'US'): string | null {
  const value = input.trim().replace(/[\u2010-\u2015\u2212]/g, '-')
  if (value.length > 40 || !/^\+?[\d\s().-]+$/.test(value)) return null
  // Preserve the default US rule: don't reinterpret an unprefixed foreign number
  // or a local seven-digit number. Other selections use their own national plan.
  if (defaultCountry === 'US' && !value.startsWith('+') && !/^1?\d{10}$/.test(value.replace(/\D/g, ''))) return null
  const phone = parsePhoneNumberFromString(value, { defaultCountry, extract: false })
  return phone?.isValid() ? phone.number : null
}
