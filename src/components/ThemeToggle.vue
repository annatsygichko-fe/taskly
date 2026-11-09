<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'

const { t } = useI18n()
const settings = useSettingsStore()

const isDark = computed(() => settings.resolvedTheme === 'dark')
const label = computed(() => (isDark.value ? t('header.themeToLight') : t('header.themeToDark')))

function toggle() {
  settings.theme = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button type="button" class="icon-btn" :aria-label="label" :title="label" @click="toggle">
    <svg v-if="isDark" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
