import { createI18n } from 'vue-i18n'
import en from './en'
import uk from './uk'
import de from './de'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, uk, de },
})
