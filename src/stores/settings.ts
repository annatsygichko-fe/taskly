import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '../composables/useLocalStorage'
import { isLanguage } from '../i18n/languages'
import type { Language, Theme } from '../types'

interface SettingsState {
  language: Language
  theme: Theme
}

function detectLanguage(): Language {
  const code = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2).toLowerCase() : 'en'
  return isLanguage(code) ? code : 'en'
}

export const useSettingsStore = defineStore('settings', () => {
  const state = useLocalStorage<SettingsState>('todo-settings', () => ({
    language: detectLanguage(),
    theme: 'system',
  }))

  const language = computed<Language>({
    get: () => state.value.language,
    set: (value) => {
      state.value.language = value
    },
  })

  const theme = computed<Theme>({
    get: () => state.value.theme,
    set: (value) => {
      state.value.theme = value
    },
  })

  // Follows the operating system while the theme is set to "system".
  const systemDark = ref(false)
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = media.matches
    media.addEventListener('change', (event) => {
      systemDark.value = event.matches
    })
  }

  const resolvedTheme = computed<'light' | 'dark'>(() => {
    if (theme.value === 'system') return systemDark.value ? 'dark' : 'light'
    return theme.value
  })

  return { language, theme, resolvedTheme }
})
