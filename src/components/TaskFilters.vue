<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Filter } from '../types'

defineProps<{
  counts: Record<Filter, number>
}>()

// v-model on the component: the parent passes the value in and gets changes back.
const filter = defineModel<Filter>({ required: true })

const { t } = useI18n()

const options = computed<{ value: Filter; label: string }[]>(() => [
  { value: 'all', label: t('tasks.filters.all') },
  { value: 'active', label: t('tasks.filters.active') },
  { value: 'done', label: t('tasks.filters.done') },
])
</script>

<template>
  <div class="toolbar" role="group" :aria-label="t('tasks.filterLabel')">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="chip"
      :class="{ active: filter === option.value }"
      :aria-pressed="filter === option.value"
      @click="filter = option.value"
    >
      {{ option.label }}
      <span class="count">{{ counts[option.value] }}</span>
    </button>
  </div>
</template>
