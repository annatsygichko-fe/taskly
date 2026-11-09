import { watchEffect } from 'vue'
import { i18n } from '../i18n'
import { useSettingsStore } from '../stores/settings'

/** Applies the chosen theme and language to the page. Call once, in App.vue. */
export function useAppearance() {
  const settings = useSettingsStore()

  watchEffect(() => {
    document.documentElement.dataset.theme = settings.resolvedTheme
  })

  watchEffect(() => {
    i18n.global.locale.value = settings.language
    document.documentElement.lang = settings.language
  })
}
