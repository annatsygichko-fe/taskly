<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'
import ProgressBar from '../components/ProgressBar.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskFilters from '../components/TaskFilters.vue'
import TaskItem from '../components/TaskItem.vue'

const { t, locale } = useI18n()
const auth = useAuthStore()
const store = useTasksStore()

const today = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date()),
)

const progressLabel = computed(() =>
  t('tasks.progress', { done: store.doneCount, total: store.tasks.length }),
)

const emptyText = computed(() => {
  if (store.query.trim()) return t('tasks.empty.search')
  return t(`tasks.empty.${store.filter}`)
})
</script>

<template>
  <section>
    <header class="top">
      <p class="date">{{ today }} · {{ t('tasks.greeting', { name: auth.displayName }) }}</p>
      <h1>{{ t('tasks.title') }}</h1>
      <ProgressBar :percent="store.percent" :label="progressLabel" />
    </header>

    <TaskForm @add="store.addTask" />

    <TaskFilters v-model="store.filter" :counts="store.counts" />

    <div class="search">
      <label class="visually-hidden" for="search-tasks">{{ t('tasks.search') }}</label>
      <input
        id="search-tasks"
        v-model="store.query"
        type="search"
        :placeholder="t('tasks.search')"
        autocomplete="off"
      />
    </div>

    <TransitionGroup tag="ul" name="list" class="tasks">
      <TaskItem
        v-for="task in store.visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="store.toggleTask(task.id)"
        @remove="store.removeTask(task.id)"
        @update="(changes) => store.updateTask(task.id, changes)"
      />
    </TransitionGroup>

    <p v-if="!store.visibleTasks.length" class="empty">{{ emptyText }}</p>

    <footer v-if="store.doneCount" class="foot">
      <button type="button" class="link" @click="store.clearDone">
        {{ t('tasks.clearDone', { count: store.doneCount }) }}
      </button>
    </footer>
  </section>
</template>
