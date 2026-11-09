import { useI18n } from 'vue-i18n'

export function useDateFormat() {
  const { locale } = useI18n()

  function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeStyle: 'short' }).format(
      new Date(iso),
    )
  }

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(iso))
  }

  // "2026-11-20" -> localized date. Built from parts so the time zone cannot shift the day.
  function formatDay(ymd: string): string {
    const [year, month, day] = ymd.split('-').map(Number)
    return new Intl.DateTimeFormat(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1, day))
  }

  return { formatDateTime, formatDate, formatDay }
}
