import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

/**
 * A ref that is loaded from localStorage and saved back on every change.
 * The key may be reactive: when it changes, the value is reloaded for the new key.
 * `fallback` is a function so each caller gets a fresh default value.
 */
export function useLocalStorage<T>(key: MaybeRefOrGetter<string>, fallback: () => T): Ref<T> {
  function read(): T {
    try {
      const raw = localStorage.getItem(toValue(key))
      if (raw !== null) return JSON.parse(raw) as T
    } catch {
      // Storage is unavailable or the data is corrupted: use the default.
    }
    return fallback()
  }

  const state = ref(read()) as Ref<T>

  watch(
    () => toValue(key),
    () => {
      state.value = read()
    },
  )

  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(toValue(key), JSON.stringify(value))
      } catch {
        // The app keeps working without persistence.
      }
    },
    { deep: true },
  )

  return state
}
