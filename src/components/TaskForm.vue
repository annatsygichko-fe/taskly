<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  add: [title: string, dueDate: string | null]
}>()

const { t } = useI18n()
const title = ref('')
const dueDate = ref('')

function submit() {
  const value = title.value.trim()
  if (!value) return
  emit('add', value, dueDate.value || null)
  title.value = ''
  dueDate.value = ''
}
</script>

<template>
  <form class="add" @submit.prevent="submit">
    <label class="visually-hidden" for="new-task">{{ t('tasks.newTask') }}</label>
    <input
      id="new-task"
      v-model="title"
      class="add-title"
      type="text"
      :placeholder="t('tasks.placeholder')"
      autocomplete="off"
      maxlength="120"
    />

    <label class="visually-hidden" for="new-task-date">{{ t('tasks.dueDate') }}</label>
    <input
      id="new-task-date"
      v-model="dueDate"
      class="add-date"
      type="date"
      :title="t('tasks.dueDate')"
    />

    <button type="submit" class="primary" :disabled="!title.trim()">{{ t('tasks.add') }}</button>
  </form>
</template>
