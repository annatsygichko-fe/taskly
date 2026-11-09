<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '../composables/useDateFormat'
import { todayYmd } from '../utils/date'
import type { Task } from '../types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [changes: { title: string; dueDate: string | null }]
}>()

const { t } = useI18n()
const { formatDay } = useDateFormat()

const editing = ref(false)
const draft = ref('')
const draftDate = ref('')
const input = ref<HTMLInputElement | null>(null)
const editor = ref<HTMLElement | null>(null)

async function startEdit() {
  draft.value = props.task.title
  draftDate.value = props.task.dueDate ?? ''
  editing.value = true
  await nextTick() // wait until the <input> is rendered
  input.value?.focus()
}

function save() {
  if (!editing.value) return // Enter and focusout can both call save
  editing.value = false
  const title = draft.value.trim() || props.task.title
  const dueDate = draftDate.value || null
  if (title !== props.task.title || dueDate !== (props.task.dueDate ?? null)) {
    emit('update', { title, dueDate })
  }
}

// Save when focus leaves both fields (not when it just moves from one to the other).
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (!editor.value?.contains(next)) save()
}

// "YYYY-MM-DD" strings compare correctly as plain text.
const overdue = computed(() => !!props.task.dueDate && !props.task.done && props.task.dueDate < todayYmd())

const dueText = computed(() => {
  if (!props.task.dueDate) return ''
  const date = formatDay(props.task.dueDate)
  return overdue.value ? t('tasks.overdue', { date }) : t('tasks.due', { date })
})

function cancel() {
  editing.value = false
}
</script>

<template>
  <li :class="{ done: task.done }">
    <label class="check">
      <input
        type="checkbox"
        :checked="task.done"
        :aria-label="t(task.done ? 'tasks.markUndone' : 'tasks.markDone', { title: task.title })"
        @change="emit('toggle')"
      />
      <span class="box" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12">
          <path
            d="M3 8.5l3.2 3L13 4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </label>

    <div class="body">
      <div v-if="editing" ref="editor" class="edit-row" @focusout="onFocusOut">
        <input
          ref="input"
          v-model="draft"
          class="edit"
          type="text"
          maxlength="120"
          :aria-label="t('tasks.edit')"
          @keyup.enter="save"
          @keyup.esc="cancel"
        />
        <input
          v-model="draftDate"
          class="edit edit-date"
          type="date"
          :aria-label="t('tasks.dueDate')"
          @keyup.enter="save"
          @keyup.esc="cancel"
        />
      </div>
      <template v-else>
        <span class="title" @dblclick="startEdit">{{ task.title }}</span>
        <span v-if="task.dueDate" class="due" :class="{ overdue }">{{ dueText }}</span>
      </template>
    </div>

    <div class="actions">
      <button type="button" class="icon" :aria-label="t('tasks.edit')" @click="startEdit">
        <svg viewBox="0 0 20 20" width="18" height="18">
          <path
            d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button type="button" class="icon danger" :aria-label="t('tasks.delete')" @click="emit('remove')">
        <svg viewBox="0 0 20 20" width="18" height="18">
          <path
            d="M4 6h12M8 6V4h4v2m-6 0l.7 10h6.6L14 6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </li>
</template>
