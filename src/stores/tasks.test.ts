import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTasksStore } from './tasks'

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a trimmed task to the top of the list', () => {
    const store = useTasksStore()
    store.addTask('  Write tests  ')
    expect(store.tasks[0].title).toBe('Write tests')
    expect(store.tasks[0].done).toBe(false)
  })

  it('saves the due date of a task', () => {
    const store = useTasksStore()
    store.addTask('Pay rent', '2026-12-01')
    expect(store.tasks[0].dueDate).toBe('2026-12-01')
    store.addTask('No deadline')
    expect(store.tasks[0].dueDate).toBeNull()
  })

  it('updates the title and the due date of a task', () => {
    const store = useTasksStore()
    store.addTask('Old title', '2026-12-01')
    const id = store.tasks[0].id

    store.updateTask(id, { title: '  New title ', dueDate: '2026-12-15' })
    expect(store.tasks[0].title).toBe('New title')
    expect(store.tasks[0].dueDate).toBe('2026-12-15')

    store.updateTask(id, { dueDate: null })
    expect(store.tasks[0].dueDate).toBeNull()
    expect(store.tasks[0].title).toBe('New title')
  })

  it('ignores empty titles', () => {
    const store = useTasksStore()
    const before = store.tasks.length
    store.addTask('   ')
    expect(store.tasks).toHaveLength(before)
  })

  it('toggles a task and updates counters', () => {
    const store = useTasksStore()
    store.tasks = []
    store.addTask('One')
    store.addTask('Two')
    store.toggleTask(store.tasks[0].id)
    expect(store.doneCount).toBe(1)
    expect(store.percent).toBe(50)
    expect(store.counts).toEqual({ all: 2, active: 1, done: 1 })
  })

  it('filters tasks', () => {
    const store = useTasksStore()
    store.tasks = []
    store.addTask('One')
    store.addTask('Two')
    store.toggleTask(store.tasks[0].id)
    store.filter = 'done'
    expect(store.visibleTasks).toHaveLength(1)
    store.filter = 'active'
    expect(store.visibleTasks).toHaveLength(1)
    store.filter = 'all'
    expect(store.visibleTasks).toHaveLength(2)
  })

  it('removes completed tasks', () => {
    const store = useTasksStore()
    store.tasks = []
    store.addTask('One')
    store.addTask('Two')
    store.toggleTask(store.tasks[0].id)
    store.clearDone()
    expect(store.tasks).toHaveLength(1)
  })
})
