<script setup lang="ts">
defineProps<{
  percent: number
  label: string
}>()
</script>

<template>
  <div class="progress">
    <div
      class="bar"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percent"
    >
      <span :style="{ width: percent + '%' }"></span>
    </div>
    <p class="progress-text">{{ label }}</p>
  </div>
</template>
