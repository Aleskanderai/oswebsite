import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EASE = [0.22, 1, 0.36, 1] as const

/** Publish legal links only after the approved HTTPS pages have been configured. */
function legalPage(value: string | undefined) {
  if (!value) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch { return '' }
}

export const LINKS = {
  discord: 'https://discord.gg/NRzxNZW5hH',
  x: 'https://x.com/openswarm',
  privacy: legalPage(import.meta.env.VITE_PRIVACY_URL),
  terms: legalPage(import.meta.env.VITE_TERMS_URL),
}

export const media = (name: string) => `${import.meta.env.BASE_URL}media/${name}`
