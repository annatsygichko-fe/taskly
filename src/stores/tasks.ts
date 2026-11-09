import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '../composables/useLocalStorage'
import { i18n } from '../i18n'
import { useAuthStore } from './auth'
import type { Filter, Task } from '../types'

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function seedTasks(): Task[] {
  const { t } = i18n.global
  return [
    { id: makeId(), title: t('seed.edit'), done: false },
    { id: makeId(), title: t('seed.tick'), done: false },
    { id: makeId(), title: t('seed.first'), done: true },
  ]
}

export const useTasksStore = defineStore('tasks', () => {
  const auth = useAuthStore()

  // Every user has their own list, stored under their own key.
  const storageKey = computed(() => `todo-tasks:${auth.currentUser?.id ?? 'guest'}`)

  // State
  const tasks = useLocalStorage<Task[]>(storageKey, seedTasks)
  const filter = ref<Filter>('all')
  const query = ref('')

  // Getters
  const doneCount = computed(() => tasks.value.filter((t) => t.done).length)

  const percent = computed(() =>
    tasks.value.length === 0 ? 0 : Math.round((doneCount.value / tasks.value.length) * 100),
  )

  const counts = computed<Record<Filter, number>>(() => ({
    all: tasks.value.length,
    active: tasks.value.length - doneCount.value,
    done: doneCount.value,
  }))

  const visibleTasks = computed(() => {
    const text = query.value.trim().toLowerCase()
    return tasks.value.filter((task) => {
      if (filter.value === 'active' && task.done) return false
      if (filter.value === 'done' && !task.done) return false
      return !text || task.title.toLowerCase().includes(text)
    })
  })

  // Actions
  function addTask(title: string, dueDate: string | null = null) {
    const clean = title.trim()
    if (!clean) return
    tasks.value.unshift({ id: makeId(), title: clean, done: false, dueDate })
  }

  function toggleTask(id: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.done = !task.done
  }

  function updateTask(id: string, changes: { title?: string; dueDate?: string | null }) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    if (changes.title !== undefined) {
      const clean = changes.title.trim()
      if (clean) task.title = clean
    }
    if (changes.dueDate !== undefined) task.dueDate = changes.dueDate
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function clearDone() {
    tasks.value = tasks.value.filter((t) => !t.done)
  }

  return {
    tasks,
    filter,
    query,
    doneCount,
    percent,
    counts,
    visibleTasks,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    clearDone,
  }
})
