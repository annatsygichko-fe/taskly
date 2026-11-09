import type { Language } from '../types'

// Language names are written in the language itself, so they never need translating.
export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
  { value: 'de', label: 'Deutsch' },
]

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language.value === value)
}
